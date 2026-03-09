import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleToDoSave } from "../features/todoItems/saveTodo.js";
import {
  createTaskItem,
  getToDoFormData,
  getToDoInterfaceElements,
} from "../features/todoItems/todoUtils.js";
import type { ItemArray } from "../types/storageTypes.js";
import { ToDo } from "../utils/classes.js";
import {
  getValue,
  removeValue,
  setValue,
  StorageKeys,
} from "../utils/storageService.js";

vi.mock("../handlers/modalHandlers.js", () => ({
  switchOverlayInterface: vi.fn(),
  updateCategorySelect: vi.fn(),
}));

vi.mock("../ui/itemRenderer.js", () => ({
  renderItem: vi.fn(),
  reloadItemList: vi.fn(),
}));

vi.mock("../utils/events.js", () => ({
  showToast: vi.fn(),
}));

vi.mock("../utils/classes.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/classes.js")>();
  return {
    ...actual,
    createNewToDo: (
      type: "toDo",
      category: string,
      title: string,
      data: { content: string; completed: boolean }[],
    ) => new actual.ToDo(12345, type, category, title, data, "09.03.2026"),
  };
});

vi.mock("../utils/stateUtils.js", () => ({
  syncItemState: vi.fn((id: number, updatedItem: ToDo, arr: ItemArray) =>
    arr.map((item) => (item.id === id ? updatedItem : item)),
  ),
}));

describe("getToDoFormData", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("returns title and tasks from the DOM", () => {
    document.body.innerHTML = `
      <textarea class="todo-title">Shopping List</textarea>
      <ul class="task-list">
        <li><span>Milk</span></li>
        <li><span>Eggs</span></li>
      </ul>
    `;
    const result = getToDoFormData();
    expect(result?.titleValue).toBe("Shopping List");
    expect(result?.data).toHaveLength(2);
    expect(result?.data[0]?.content).toBe("Milk");
  });

  it("marks completed tasks correctly", () => {
    document.body.innerHTML = `
      <textarea class="todo-title">Tasks</textarea>
      <ul class="task-list">
        <li><span class="task-completed">Completed</span></li>
        <li><span>Open</span></li>
      </ul>
    `;
    const result = getToDoFormData();
    expect(result?.data[0]?.completed).toBe(true);
    expect(result?.data[1]?.completed).toBe(false);
  });

  it("returns undefined when no tasks are present", () => {
    document.body.innerHTML = `
      <textarea class="todo-title">Empty</textarea>
      <ul class="task-list"></ul>
    `;
    const result = getToDoFormData();
    expect(result).toBeUndefined();
  });

  it("returns an empty title when textarea is missing", () => {
    document.body.innerHTML = `
      <ul class="task-list">
        <li><span>task</span></li>
      </ul>
    `;
    const result = getToDoFormData();
    expect(result?.titleValue).toBe("");
  });
});

describe("createTaskItem", () => {
  document.body.innerHTML = "";
  vi.clearAllMocks();
  vi.resetAllMocks();
  it("creates a li element with the correct text", () => {
    const { taskSpan } = createTaskItem("buy milk");
    expect(taskSpan.textContent).toBe("buy milk");
  });

  it("creates a checkbox", () => {
    const { checkbox } = createTaskItem("Task");
    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.className).toBe("task-checkbox");
  });

  it("creates a delete button", () => {
    const { taskDeleteBtn } = createTaskItem("Task");
    expect(taskDeleteBtn).toBeInstanceOf(HTMLButtonElement);
  });

  it("creates a li element", () => {
    const { li } = createTaskItem("Task");
    expect(li).toBeInstanceOf(HTMLLIElement);
  });
});

describe("getToDoInterfaceElements", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetAllMocks();
  });
  it("creates all needed dom elements", () => {
    const { todoDiv, input, addBtn, taskList, title } =
      getToDoInterfaceElements();
    expect(todoDiv.className).toBe("todo-container");
    expect(input.type).toBe("text");
    expect(input.className).toBe("todo-input");
    expect(addBtn.className).toBe("todo-btn");
    expect(taskList.className).toBe("task-list");
    expect(title.className).toBe("todo-title");
  });
});

describe("handleToDoSave", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useFakeTimers();
    removeValue(StorageKeys.ITEMS);
    removeValue(StorageKeys.TEMP_TODO);
    document.body.innerHTML = `
      <textarea class="todo-title">Shopping List</textarea>
      <ul class="task-list">
        <li><span>Milk</span></li>
        <li><span class="task-completed">Eggs</span></li>
      </ul>
    `;
    afterEach(() => {
      vi.useRealTimers();
    });
  });

  it(
    "creates a new ToDo when savedItemId is null",
    { repeats: 4 },
    async () => {
      const { renderItem } = await import("../ui/itemRenderer.js");

      handleToDoSave(null, [], "Work");

      expect(renderItem).toHaveBeenCalledOnce();
    },
  );

  it("removes TEMP_TODO after saving", () => {
    setValue(StorageKeys.TEMP_TODO, { id: 1, title: "Old", data: [] });
    vi.advanceTimersByTime(200);

    handleToDoSave(null, [], "Work");

    expect(getValue(StorageKeys.TEMP_TODO)).toBeNull();
  });

  it(
    "updates an existing ToDo when savedItemId exists",
    { repeats: 4 },
    async () => {
      const { reloadItemList } = await import("../ui/itemRenderer.js");
      const { showToast } = await import("../utils/events.js");

      const existingToDo = new ToDo(
        99,
        "toDo",
        "Work",
        "Old Title",
        [{ content: "Old Task", completed: false }],
        "01.01.2025",
      );
      const itemArr: ItemArray = [existingToDo];
      handleToDoSave(99, itemArr, "Work");

      expect(showToast).toHaveBeenCalledWith("ToDo-list was saved");
      expect(reloadItemList).toHaveBeenCalled();
    },
  );
});
