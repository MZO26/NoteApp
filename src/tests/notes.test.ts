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

vi.mock("../ui/itemRenderer.js", () => ({
  renderItem: vi.fn(),
  reloadItemList: vi.fn(),
}));

vi.mock("../utils/events.js", () => ({
  showToast: vi.fn(),
  isActive: vi.fn(),
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
    ) => new actual.Note(12345, type, category, title, data, "09.03.2026"),
  };
});

vi.mock("../utils/stateUtils.js", () => ({
  syncItemState: vi.fn((id: number, updatedItem: Note, arr: ItemArray) =>
    arr.map((item) => (item.id === id ? updatedItem : item)),
  ),
}));

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
    afterEach(() => {
      vi.useRealTimers();
    });
  });

  it("creates a new Note when savedItemId is null", async () => {
    const { renderItem } = await import("../ui/itemRenderer.js");

    handleNoteSave(null, [], "Work");

    expect(renderItem).toHaveBeenCalledOnce();
  });

  it("removes TEMP_NOTE after saving", () => {
    setValue(StorageKeys.TEMP_NOTE, { id: 1, title: "Old", data: [] });
    vi.advanceTimersByTime(200);

    handleNoteSave(null, [], "Work");

    expect(getValue(StorageKeys.TEMP_NOTE)).toBeNull();
  });

  it("updates an existing Note when savedItemId exists", async () => {
    const { reloadItemList } = await import("../ui/itemRenderer.js");
    const { showToast } = await import("../utils/events.js");

    const existingNote = new Note(
      99,
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

    handleNoteSave(99, itemArr, "Work");

    expect(showToast).toHaveBeenCalledWith("Note was saved");
    expect(reloadItemList).toHaveBeenCalled();
  });
});
