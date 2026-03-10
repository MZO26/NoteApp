import { updateCategorySelect } from "../handlers/modalHandlers.js";
import {
  clearSavedItemId,
  getActiveCategory,
  setActiveCategory,
} from "../states/sharedStates.js";
import type { RenderedItem } from "../types/featureTypes.js";
import type { CategoryArray } from "../types/storageTypes.js";
import { reloadItemList } from "../ui/itemRenderer.js";
import {
  categoryItemTemplate,
  defaultCategoryItemTemplate,
} from "../ui/itemUI.js";
import { Category } from "../utils/classes.js";
import { isActive, showToast } from "../utils/events.js";
import { getElement, truncate } from "../utils/helpers.js";
import { createNewCategory } from "../utils/models.js";
import {
  getValue,
  StorageKeys,
  updateStorage,
} from "../utils/storageService.js";

const defaultCategory = "Without Category";

const createCategoryItem = (category: Category): RenderedItem => {
  const categoryItem = document.createElement("div");
  categoryItem.className = "categoryItem";
  if (category.isDefault) {
    categoryItem.setAttribute("default-category-id", String(category.id));
    categoryItem.innerHTML = defaultCategoryItemTemplate(category.name);
  } else {
    categoryItem.setAttribute("category-id", String(category.id));
    categoryItem.innerHTML = categoryItemTemplate(category.name);
  }
  return categoryItem;
};

const getCategoryId = (categoryItem: RenderedItem): string | null => {
  let id: string | null = null;
  if (categoryItem.getAttribute("default-category-id")) {
    id = categoryItem.getAttribute("default-category-id");
  } else {
    id = categoryItem.getAttribute("category-id");
  }
  return id;
};

const categoryToBeRendered = (categoryName: string): void => {
  const categoryList = getElement<HTMLDivElement>(".category-list");
  const categoryArr: CategoryArray = getValue(StorageKeys.CATEGORIES);
  if (categoryArr.find((category) => category.name === categoryName)) {
    showToast("Category already exists. Please enter new name");
    return;
  }
  const newCategory = createNewCategory(categoryName);
  const doesDefaultExist: Category | undefined = categoryArr.find(
    (category: Category) => category.name === defaultCategory,
  );
  if (newCategory.name === defaultCategory && !doesDefaultExist)
    newCategory.isDefault = true;
  const categoryItem = createCategoryItem(newCategory);
  const updatedCategories = [...categoryArr, newCategory];
  updateStorage(StorageKeys.CATEGORIES, () => updatedCategories);
  categoryList.appendChild(categoryItem);
  if (!newCategory.isDefault) {
    const displayTitle = truncate(newCategory.name);
    showToast(`Added "${displayTitle}"`);
  }
  updateCategorySelect(updatedCategories);
  categoryItemHandler(categoryItem);
  if (newCategory.isDefault) {
    setActiveCategory(newCategory.name);
    isActive(categoryItem);
  }
};

const categoryItemHandler = (categoryItem: RenderedItem): void => {
  const categoryItemBtn =
    categoryItem.querySelector<HTMLButtonElement>("button");

  function selectCategory(): void {
    document.querySelectorAll(".categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    clearSavedItemId();
    const categoryArr: CategoryArray = getValue(StorageKeys.CATEGORIES);
    const id = getCategoryId(categoryItem);
    const category = categoryArr.find((c) => c.id === id);
    if (!category) {
      setActiveCategory(defaultCategory);
    } else {
      setActiveCategory(category.name);
    }
    isActive(categoryItem);
    reloadItemList();
    updateCategorySelect(categoryArr);
  }

  function deleteCategory(event: Event): void {
    event.stopPropagation();
    const categoryArr = getValue(StorageKeys.CATEGORIES);
    const id: string | null = categoryItem.getAttribute("category-id");
    const index = categoryArr.findIndex((c) => c.id === id);
    if (id === null || index === -1) return;
    const toBeDeleted = categoryArr[index];
    if (!toBeDeleted) return;
    updateStorage(StorageKeys.ITEMS, (currentItems) => {
      return currentItems.map((item) => {
        if (item.category === toBeDeleted.name) {
          return { ...item, category: defaultCategory };
        }
        return item;
      });
    });
    const newCategoryArr = categoryArr.filter((_, i) => i !== index);
    updateStorage(StorageKeys.CATEGORIES, () => newCategoryArr);
    categoryItem.removeEventListener("click", selectCategory);
    categoryItemBtn?.removeEventListener("click", deleteCategory);
    categoryItem.remove();
    setActiveCategory(defaultCategory);
    updateCategorySelect(newCategoryArr);
    reloadCategoryList(newCategoryArr);
  }

  if (!categoryItem.getAttribute("default-category-id") && categoryItemBtn) {
    categoryItemBtn.addEventListener("click", deleteCategory);
  }
  categoryItem.addEventListener("click", selectCategory);
};

const reloadCategoryList = (categories?: CategoryArray): void => {
  const categoryList = getElement<HTMLDivElement>(".category-list");
  const categoryArr: CategoryArray =
    categories || getValue(StorageKeys.CATEGORIES);
  const activeCategory = getActiveCategory();
  if (!categoryArr.length || !categoryList) return;
  categoryList.innerHTML = "";
  for (let i = 0; i < categoryArr.length; i++) {
    const category: Category | undefined = categoryArr[i];
    if (!category) continue;
    const categoryItem = createCategoryItem(category);
    if (activeCategory === category.name) {
      isActive(categoryItem);
      reloadItemList(undefined, activeCategory);
      console.log("Active category on reload:", activeCategory);
    }
    categoryList.appendChild(categoryItem);
    categoryItemHandler(categoryItem);
  }
};

export {
  categoryItemHandler,
  categoryToBeRendered,
  defaultCategory,
  reloadCategoryList,
};
