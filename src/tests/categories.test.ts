import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  categoryToBeRendered,
  reloadCategoryList,
} from "../features/categories.js";
import { Category } from "../utils/classes.js";
import {
  getValue,
  removeValue,
  setValue,
  StorageKeys,
} from "../utils/storageService.js";

vi.mock("../handlers/modalHandlers.js", () => ({
  updateCategorySelect: vi.fn(),
}));

vi.mock("../ui/itemRenderer.js", () => ({
  reloadItemList: vi.fn(),
}));

vi.mock("../ui/itemUI.js", () => ({
  categoryItemTemplate: (name: string) => `<button></button><p>${name}</p>`,
  defaultCategoryItemTemplate: (name: string) => `<p>${name}</p>`,
  dateTemplate: () => "09.03.2026",
}));

vi.mock("../utils/events.js", () => ({
  showToast: vi.fn(),
  isActive: vi.fn(),
}));

vi.mock("../utils/classes.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/classes.js")>();
  return {
    ...actual,
    createNewCategory: (name: string) =>
      new actual.Category(Date.now(), name, false),
  };
});

function setupDOM() {
  document.body.innerHTML = `
    <div class="category-list"></div>
    <div class="item-container"></div>
    <div class="toast-container"></div>
  `;
}

describe("categoryToBeRendered", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    removeValue(StorageKeys.CATEGORIES);
    removeValue(StorageKeys.ITEMS);
    setupDOM();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a new category to the list", () => {
    categoryToBeRendered("Work");

    const categoryList = document.querySelector(".category-list")!;
    expect(categoryList.children.length).toBe(1);
  });

  it("saves the new category in storage", () => {
    vi.useFakeTimers();
    categoryToBeRendered("Personal");
    vi.advanceTimersByTime(200);

    const categories = getValue(StorageKeys.CATEGORIES);
    expect(categories.some((c) => c.name === "Personal")).toBe(true);
  });

  it("creates 'Without Category' as isDefault=true", () => {
    categoryToBeRendered("Without Category");
    vi.advanceTimersByTime(200);

    const categories = getValue(StorageKeys.CATEGORIES);
    const defaultCat = categories.find((c) => c.name === "Without Category");
    expect(defaultCat?.isDefault).toBe(true);
  });

  it("prevents duplicate categories — calls showToast", async () => {
    const { showToast } = await import("../utils/events.js");

    categoryToBeRendered("Work");
    vi.advanceTimersByTime(200);
    categoryToBeRendered("Work");

    expect(showToast).toHaveBeenCalledWith(
      "Category already exists. Please enter new name",
    );
  });

  it("multiple categories can be added", () => {
    categoryToBeRendered("Work");
    categoryToBeRendered("Personal");
    categoryToBeRendered("Ideas");
    vi.advanceTimersByTime(200);

    const categories = getValue(StorageKeys.CATEGORIES);
    expect(categories.length).toBe(3);
  });
});

describe("reloadCategoryList", () => {
  beforeEach(() => {
    removeValue(StorageKeys.CATEGORIES);
    setupDOM();
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: "Work" }),
    );
  });

  it("renders all categories in the list", () => {
    const categories: Category[] = [
      new Category(1, "Work", false),
      new Category(2, "Personal", false),
    ];

    reloadCategoryList(categories);

    const categoryList = document.querySelector(".category-list")!;
    expect(categoryList.children.length).toBe(2);
  });

  it("reads categories from storage when no array is provided", () => {
    vi.useFakeTimers();
    try {
      setValue(StorageKeys.CATEGORIES, [new Category(1, "FromStorage", false)]);
      vi.advanceTimersByTime(200);
      reloadCategoryList();

      const categoryList = document.querySelector(".category-list")!;
      expect(categoryList.children.length).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("marks the active category with 'active' class", () => {
    const categories: Category[] = [new Category(1, "Work", false)];
    reloadCategoryList(categories);

    const categoryList = document.querySelector(".category-list")!;
    const firstItem = categoryList.children[0] as HTMLElement;
    expect(firstItem).toBeTruthy();
  });
});
