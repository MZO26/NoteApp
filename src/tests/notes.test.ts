import { v4 } from "uuid";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNoteFormData } from "../features/noteItems/noteUtils.js";
import { handleNoteSave } from "../features/noteItems/saveNotes.js";
import type { ItemArray } from "../types/storageTypes.js";
import { Note } from "../utils/classes.js";
import {
  getValue,
  removeValue,
  setValue,
  StorageKeys,
} from "../utils/storageService.js";

vi.mock("uuid", () => {
  return {
    v4: vi.fn(() => "fake-test-uuid-1234"),
  };
});

vi.mock("../handlers/modalHandlers.js", () => ({
  switchOverlayInterface: vi.fn(),
  updateCategorySelect: vi.fn(),
}));

vi.mock("../ui/itemRenderer.js", () => ({
  renderItem: vi.fn(),
  reloadItemList: vi.fn(),
}));

vi.mock("../features/categories.js", () => ({
  reloadCategoryList: vi.fn(),
  defaultCategory: "Without Category",
  categoryItemHandler: vi.fn(),
  categoryToBeRendered: vi.fn(),
}));

vi.mock("../utils/events.js", () => ({
  showToast: vi.fn(),
}));

vi.mock("../states/sharedStates.js", () => ({
  setActiveCategory: vi.fn(),
  getActiveCategory: vi.fn(() => "Work"),
  getSavedItemId: vi.fn(() => null),
  getModalState: vi.fn(() => "toDo"),
  clearSavedItemId: vi.fn(),
  setSavedItemId: vi.fn(),
}));

vi.mock("../utils/classes.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/classes.js")>();
  return {
    ...actual,
    createNewNote: (
      type: "note",
      category: string,
      title: string,
      data: string[],
    ) => new actual.Note(v4(), type, category, title, data, "09.03.2026"),
  };
});

describe("getNoteFormData", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("returns title and note value from the DOM", () => {
    document.body.innerHTML = `
      <textarea class="title">titleValue</textarea>
      <textarea class="note">noteValue</textarea>
    `;
    const result = getNoteFormData();
    expect(result?.titleValue).toBe("titleValue");
    expect(result?.noteDataToArr).toEqual(["noteValue"]);
  });

  it("returns an empty array when the note textarea is empty", () => {
    document.body.innerHTML = `
      <textarea class="title">titleValue</textarea>
      <textarea class="note"></textarea>
    `;
    const result = getNoteFormData();
    expect(result?.noteDataToArr).toEqual([]);
  });

  it("trims whitespace from title and content", () => {
    document.body.innerHTML = `
      <textarea class="title">  title with whitespace  </textarea>
      <textarea class="note">  content  </textarea>
    `;
    const result = getNoteFormData();
    expect(result?.titleValue).toBe("title with whitespace");
    expect(result?.noteDataToArr).toEqual(["content"]);
  });
});

describe("handleNoteSave", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useFakeTimers();
    removeValue(StorageKeys.ITEMS);
    removeValue(StorageKeys.TEMP_NOTE);
    document.body.innerHTML = `
      <textarea class="title">Test Note</textarea>
      <textarea class="note">Test Content</textarea>
    `;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it(
    "creates a new Note when savedItemId is null",
    { repeats: 4 },
    async () => {
      const { renderItem } = await import("../ui/itemRenderer.js");
      const { reloadCategoryList } = await import("../features/categories.js");
      const { showToast } = await import("../utils/events.js");

      handleNoteSave(null, [], "Work");
      expect(renderItem).toHaveBeenCalledOnce();
      expect(showToast).toHaveBeenCalledWith("New note was created");
      vi.runAllTimers();
      expect(reloadCategoryList).toHaveBeenCalled();
    },
  );

  it("removes TEMP_NOTE after saving", () => {
    setValue(StorageKeys.TEMP_NOTE, {
      id: "fake-test-uuid-1234",
      title: "Old",
      data: [],
    });
    vi.advanceTimersByTime(200);

    handleNoteSave(null, [], "Work");

    expect(getValue(StorageKeys.TEMP_NOTE)).toBeNull();
  });

  it(
    "updates an existing Note when savedItemId exists",
    { repeats: 4 },
    async () => {
      const { reloadCategoryList } = await import("../features/categories.js");
      const { showToast } = await import("../utils/events.js");

      const existingNote = new Note(
        "fake-test-uuid-1234",
        "note",
        "Work",
        "Old Title",
        ["Old Content"],
        "01.01.2025",
      );
      const itemArr: ItemArray = [existingNote];

      document.body.innerHTML = `
      <textarea class="title">New Title</textarea>
      <textarea class="note">New Content</textarea>
    `;

      handleNoteSave("fake-test-uuid-1234", itemArr, "Work");
      expect(typeof existingNote.id).toBe("string");
      expect(showToast).toHaveBeenCalledWith("Note was saved");
      vi.runAllTimers();
      expect(reloadCategoryList).toHaveBeenCalled();
    },
  );
});
