import { setActiveCategory } from "../states/sharedStates.js";
import type { Item, RenderedItem } from "../types/featureTypes.js";
import type { ItemArray } from "../types/storageTypes.js";
import { reloadItemList } from "../ui/itemRenderer.js";
import type { Category } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { checkId } from "../utils/helpers.js";
import { getValue, StorageKeys } from "../utils/storageService.js";
import { reloadCategoryList } from "./categories.js";

type SearchResult = {
  cachedItems: ItemArray;
  result: Item | undefined;
};

const searchInput = document.querySelector<HTMLInputElement>(".search-input")!;
let cachedItems: ItemArray = [];
let searchTimeout: NodeJS.Timeout;
let activeCategory: Category;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(filter, 200);
});

const findTargetItem = (): SearchResult => {
  const value: string = searchInput.value.toLowerCase();
  if (!cachedItems.length) {
    reloadCategoryList();
    cachedItems = getValue(StorageKeys.ITEMS);
  }
  const result: Item | undefined = cachedItems.find((item) =>
    item.title.toLowerCase().includes(value),
  );
  return { cachedItems, result };
};

const findTargetCategory = (result: Item): Category | undefined => {
  const category: Category | undefined = getValue(StorageKeys.CATEGORIES).find(
    (c) => c.name === result.category,
  );
  if (!category) return;
  const categoryList = document.querySelector(".category-list");
  if (!categoryList) return;
  const targetCategoryElement = Array.from(
    categoryList.querySelectorAll("div"),
  ).find((div) => div.textContent.trim() === category.name);
  if (targetCategoryElement) {
    document.querySelectorAll(".categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    if (!category) return;
    isActive(targetCategoryElement);
    setActiveCategory(category.name);
    return category;
  } else return;
};

const scrollToTargetNote = (result: Item) => {
  const itemContainer =
    document.querySelector<HTMLDivElement>(".item-container");
  if (!itemContainer) return;
  const targetNote = itemContainer.querySelector<HTMLDivElement>(
    `div[data-id="${result.id}"]`,
  ) as RenderedItem | null;
  if (targetNote) {
    targetNote.scrollIntoView({ behavior: "smooth" });
    isActive(targetNote, itemContainer);
  }
};

const removeActiveExceptResult = (result: Item) => {
  const activeItems = document.querySelectorAll(
    ".noteItem.active, .toDoItem.active",
  ) as NodeListOf<RenderedItem>;
  activeItems.forEach((item) => {
    if (checkId(item) !== result.id) {
      item.classList.remove("active");
    }
  });
};

const filter = (): void => {
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (!dropdown || !searchInput.value || searchInput.value.length < 2) return;
  const start = performance.now();
  const { cachedItems, result } = findTargetItem();
  if (!result) {
    dropdown.innerHTML = "No matching title found";
    dropdown.style.display = "block";
    return;
  }
  const targetCategory = findTargetCategory(result);
  if (targetCategory && targetCategory !== activeCategory) {
    activeCategory = targetCategory;
    const categoryItems = cachedItems.filter(
      (item) => item.category === activeCategory.name,
    );
    reloadItemList(categoryItems);
  } else {
    removeActiveExceptResult(result);
  }
  const end = performance.now();
  const duration = (end - start).toFixed(3);
  dropdown.innerHTML = `<div>Found: ${result.title}<br>${duration}ms</div>`;
  dropdown.style.display = "block";
  scrollToTargetNote(result);
};

searchInput.addEventListener("input", filter);

document.addEventListener("click", (e: Event): void => {
  const target = e.target as Element | null;
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (target && dropdown && !target.closest(".input-wrapper"))
    dropdown.style.display = "none";
});

export { filter };
