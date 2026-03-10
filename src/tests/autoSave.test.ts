import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  autoSaveTempNote,
  autoSaveTempToDo,
  cancelAutoSave,
} from "../utils/autoSave.js";
import { StorageKeys, getValue, removeValue } from "../utils/storageService.js";

vi.mock("../states/sharedStates.js", () => ({
  getSavedItemId: () => "fake-test-uuid-1234",
}));

const createTextarea = (
  className: string,
  value: string,
): HTMLTextAreaElement => {
  const el = document.createElement("textarea");
  el.className = className;
  el.value = value;
  document.body.appendChild(el);
  return el;
};

const createDiv = (className: string): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = className;
  document.body.appendChild(el);
  return el;
};

describe("autoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    removeValue(StorageKeys.TEMP_NOTE);
    removeValue(StorageKeys.TEMP_TODO);
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("autoSaveTempNote", () => {
    it("saves the title and content to TEMP_NOTE after 500ms", () => {
      createTextarea("title", "titleValue");
      createTextarea("note", "note content");

      autoSaveTempNote();
      vi.advanceTimersByTime(600);

      const saved = getValue(StorageKeys.TEMP_NOTE);
      expect(saved).not.toBeNull();
      expect(saved!.id).toBe("fake-test-uuid-1234");
      expect(saved!.title).toBe("titleValue");
      expect(saved!.data).toEqual(["note content"]);
    });

    it("debounces: only the last call within 500ms is executed", () => {
      const titleEl = createTextarea("title", "First");
      createTextarea("note", "Content");

      autoSaveTempNote();
      titleEl.value = "Second";
      autoSaveTempNote();
      titleEl.value = "Third";
      autoSaveTempNote();

      vi.advanceTimersByTime(600);

      const saved = getValue(StorageKeys.TEMP_NOTE);
      expect(saved!.title).toBe("Third");
    });
  });

  describe("autoSaveTempToDo", () => {
    it("saves the title and task list to TEMP_TODO after 500ms", () => {
      createTextarea("todo-title", "Shopping List");
      const taskList = createDiv("task-list");
      taskList.innerHTML = `
        <li><span>Milk</span></li>
        <li><span class="task-completed">Eggs</span></li>
      `;

      autoSaveTempToDo();
      vi.advanceTimersByTime(600);

      const saved = getValue(StorageKeys.TEMP_TODO);
      expect(saved).not.toBeNull();
      expect(saved!.id).toBe("fake-test-uuid-1234");
      expect(saved!.title).toBe("Shopping List");
      expect(saved!.data).toHaveLength(2);
      expect(saved!.data[0]).toEqual({ content: "Milk", completed: false });
      expect(saved!.data[1]).toEqual({ content: "Eggs", completed: true });
    });

    it("saves an empty task list when the task-list div is empty", () => {
      createTextarea("todo-title", "Empty List");
      createDiv("task-list");

      autoSaveTempToDo();
      vi.advanceTimersByTime(600);

      const saved = getValue(StorageKeys.TEMP_TODO);
      expect(saved!.data).toEqual([]);
    });

    it("correctly marks completed tasks", () => {
      createTextarea("todo-title", "Tasks");
      const taskList = createDiv("task-list");
      taskList.innerHTML = `
        <li><span class="task-completed">Done</span></li>
        <li><span>Not done</span></li>
      `;

      autoSaveTempToDo();
      vi.advanceTimersByTime(600);

      const saved = getValue(StorageKeys.TEMP_TODO);
      expect(saved!.data[0]!.completed).toBe(true);
      expect(saved!.data[1]!.completed).toBe(false);
    });
  });

  describe("cancelAutoSave", () => {
    it("cancels a pending note autosave", () => {
      createTextarea("title", "Should Not Save");
      createTextarea("note", "Content");

      autoSaveTempNote();
      cancelAutoSave();
      vi.advanceTimersByTime(600);

      expect(getValue(StorageKeys.TEMP_NOTE)).toBeNull();
    });
  });
});
