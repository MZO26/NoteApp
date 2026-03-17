import { setActiveCategory } from "../states/sharedStates.js";
import type { Item, RenderedItem } from "../types/featureTypes.js";
import type { ItemArray } from "../types/storageTypes.js";
import { reloadItemList } from "../ui/itemRenderer.js";
import type { Category } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { checkId, getElement } from "../utils/helpers.js";
import { getValue, StorageKeys } from "../utils/storageService.js";
import { reloadCategoryList } from "./categories.js";

type SearchResult = {
  cachedItems: ItemArray;
  result: Item | undefined;
};

let cachedItems: ItemArray = [];
let activeCategory: Category;

const getSearchInput = (): HTMLInputElement => {
  const searchInput = getElement<HTMLInputElement>(".search-input");
  return searchInput;
};

const findTargetItem = (): SearchResult => {
  const value: string = getSearchInput().value.toLowerCase();
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
  const categoryList = getElement<HTMLDivElement>(".category-list");
  const targetCategoryElement = Array.from(
    categoryList.querySelectorAll("div"),
  ).find((div) => div.textContent.trim() === category.name);
  if (targetCategoryElement) {
    document.querySelectorAll(".categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    isActive(targetCategoryElement);
    setActiveCategory(category.name);
    return category;
  } else return;
};

const scrollToTargetNote = (result: Item) => {
  const itemContainer = getElement<HTMLDivElement>(".item-container");
  const targetNote = itemContainer.querySelector<HTMLDivElement>(
    `div[data-id="${result.id}"]`,
  ) as RenderedItem | null;
  if (targetNote) {
    targetNote.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
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
  const dropdown = getElement<HTMLDivElement>(".dropdown");
  const searchInput = getSearchInput();
  if (!searchInput.value) {
    if (dropdown) dropdown.style.display = "none";
    return;
  }
  const start = performance.now();
  const { cachedItems, result } = findTargetItem();
  if (!result) {
    dropdown.textContent = "No matching title found";
    dropdown.style.display = "block";
    return;
  }
  const targetCategory = findTargetCategory(result);
  if (targetCategory && targetCategory !== activeCategory) {
    activeCategory = targetCategory;
    const categoryItems = cachedItems.filter(
      (item) => item.category === activeCategory.name,
    );
    reloadItemList(categoryItems, activeCategory.name);
  } else {
    removeActiveExceptResult(result);
  }
  const end = performance.now();
  const duration = (end - start).toFixed(3);
  dropdown.innerHTML = `<div>Found: ${result.title}<br>${duration}ms</div>`;
  dropdown.style.display = "block";
  scrollToTargetNote(result);
};

export { filter };
