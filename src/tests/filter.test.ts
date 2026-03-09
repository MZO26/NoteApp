import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Note } from "../utils/classes.js";
import { removeValue, setValue, StorageKeys } from "../utils/storageService.js";

vi.mock("../ui/itemRenderer.js", () => ({
  reloadItemList: vi.fn(),
}));

vi.mock("../utils/events.js", () => ({
  isActive: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock("../features/categories.js", () => ({
  reloadCategoryList: vi.fn(),
}));

function setupFilterDOM() {
  document.body.innerHTML = `
    <div class="input-wrapper">
      <input class="search-input" type="text" />
    </div>
    <div class="dropdown" style="display:none"></div>
    <div class="category-list">
      <div class="categoryItem">Work</div>
    </div>
    <div class="item-container">
      <div class="noteItem" data-id="1">Note 1</div>
      <div class="noteItem active" data-id="2">Note 2</div>
    </div>
  `;
}

function findItemByTitle(
  items: { id: number; title: string; category: string }[],
  query: string,
) {
  return items.find((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );
}

function filterItemsByCategory(
  items: { id: number; title: string; category: string }[],
  categoryName: string,
) {
  return items.filter((item) => item.category === categoryName);
}

describe("Filter", () => {
  const items = [
    { id: 1, title: "Einkaufsliste", category: "Personal" },
    { id: 2, title: "Meeting Notes", category: "Work" },
    { id: 3, title: "Projekt Ideen", category: "Work" },
    { id: 4, title: "Tagebuch", category: "Personal" },
  ];

  it("finds an item by title", () => {
    const result = findItemByTitle(items, "meeting");
    expect(result?.id).toBe(2);
  });

  it("finds an item with uppercase letters", () => {
    const result = findItemByTitle(items, "TAGEBUCH");
    expect(result?.id).toBe(4);
  });

  it("finds an item by a substring", () => {
    const result = findItemByTitle(items, "ideen");
    expect(result?.id).toBe(3);
  });
});

describe("Category Filter", () => {
  const items = [
    { id: 1, title: "Note A", category: "Work" },
    { id: 2, title: "Note B", category: "Personal" },
    { id: 3, title: "Note C", category: "Work" },
  ];

  it("filters items by category", () => {
    const result = filterItemsByCategory(items, "Work");
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.category === "Work")).toBe(true);
  });

  it("returns an empty array when no items are in the category", () => {
    const result = filterItemsByCategory(items, "Ideas");
    expect(result).toHaveLength(0);
  });

  it("returns all items when all are in the same category", () => {
    const allWork = items.filter((i) => i.category === "Work");
    const result = filterItemsByCategory(allWork, "Work");
    expect(result).toHaveLength(2);
  });
});

describe("Dropdown and Search-Input", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    document.body.innerHTML = `
      <input class="search-input" />
      <div class="dropdown"></div>
    `;
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    removeValue(StorageKeys.ITEMS);
    removeValue(StorageKeys.CATEGORIES);
    setupFilterDOM();

    afterEach(() => {
      vi.useRealTimers();
    });

    const notes = [
      new Note(1, "note", "Work", "Meeting Notes", ["Content"], "09.03.2026"),
      new Note(2, "note", "Personal", "Diary", ["Content"], "09.03.2026"),
    ];
    const categories = [
      new Category(10, "Work", false),
      new Category(11, "Personal", false),
    ];
    setValue(StorageKeys.ITEMS, notes);
    setValue(StorageKeys.CATEGORIES, categories);
    vi.advanceTimersByTime(200);
  });

  it("shows 'No matching title found' when no results are found", async () => {
    const { filter } = await import("../features/filter.js");

    const searchInput =
      document.querySelector<HTMLInputElement>(".search-input")!;
    searchInput.value = "xxxxxx";
    filter();

    const dropdown = document.querySelector<HTMLDivElement>(".dropdown")!;
    expect(dropdown.textContent).toContain("No matching title found");
    expect(dropdown.style.display).toBe("block");
  });

  it("shows found item in the dropdown", async () => {
    const { filter } = await import("../features/filter.js");

    const searchInput =
      document.querySelector<HTMLInputElement>(".search-input")!;
    searchInput.value = "Meeting";
    filter();

    const dropdown = document.querySelector<HTMLDivElement>(".dropdown")!;
    expect(dropdown.textContent).toContain("Meeting Notes");
    expect(dropdown.style.display).toBe("block");
  });
});
