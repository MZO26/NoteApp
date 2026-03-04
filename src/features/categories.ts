import { updateCategorySelect } from "../handlers/modalHandlers.js";
import {
  activeCategoryState,
  defaultCategory,
} from "../states/sharedStates.js";
import type { CategoryItem } from "../types/featureTypes.js";
import type { ActiveCategoryState } from "../types/stateTypes.js";
import type { CategoryArray, NoteArray } from "../types/storageTypes.js";
import { Category, createNewCategory } from "../utils/classes.js";
import { isActive, showToast } from "../utils/events.js";
import {
  getCategories,
  getNotes,
  updateCategories,
  updateNotes,
} from "../utils/storageService.js";
import {
  categoryItemTemplate,
  defaultCategoryItemTemplate,
} from "../utils/templates.js";
import { reloadNoteList } from "./notes.js";

const truncate = (str: string, max = 10): string => {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  } else return str;
};

const categoryToBeRendered = (categoryName: string): void => {
  const categoryList = document.querySelector<HTMLDivElement>(".category-list");
  if (!categoryList) return;
  const notesArr: NoteArray = getNotes();
  const categoryArr: CategoryArray = getCategories();
  if (categoryArr.find((category) => category.name === categoryName)) {
    showToast("Category already exists");
    return;
  }
  const newCategory = createNewCategory(categoryName, notesArr);
  const doesDefaultExist: Category | undefined = categoryArr.find(
    (category: Category) => category.name === defaultCategory,
  );
  let categoryItem = document.createElement("div");
  categoryItem.className = "categoryItem";
  if (newCategory.name === defaultCategory && !doesDefaultExist) {
    newCategory.isDefault = true;
    categoryItem.setAttribute("default-category-id", String(newCategory.id));
  } else if (newCategory.name !== defaultCategory && doesDefaultExist) {
    categoryItem.setAttribute("category-id", String(newCategory.id));
  } else return;
  const updatedCategories = [...categoryArr, newCategory];
  updateCategories(() => updatedCategories);
  if (newCategory.isDefault) {
    categoryItem.innerHTML = defaultCategoryItemTemplate(newCategory.name);
  } else {
    categoryItem.innerHTML = categoryItemTemplate(truncate(newCategory.name));
  }
  categoryList.appendChild(categoryItem);
  const displayTitle = truncate(newCategory.name);
  if (!newCategory.isDefault) {
    showToast(`Added "${displayTitle}"`);
  }
  localStorage.setItem(
    "activeCategoryState",
    JSON.stringify({ activeCategory: newCategory.name }),
  );
  updateCategorySelect(categoryArr);
  categoryItemHandler(categoryItem);
};

const categoryItemHandler = (categoryItem: CategoryItem): void => {
  const categoryItemBtn =
    categoryItem.querySelector<HTMLButtonElement>("button");

  function selectCategory(): void {
    document.querySelectorAll(".categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    sessionStorage.setItem("savedNoteId", "null");
    const categoryArr: CategoryArray = getCategories();
    let id: number;
    if (categoryItem.getAttribute("default-category-id")) {
      id = Number(categoryItem.getAttribute("default-category-id"));
    } else {
      id = Number(categoryItem.getAttribute("category-id"));
    }
    const category = categoryArr.find((c) => c.id === id);
    if (!category) activeCategoryState.activeCategory = defaultCategory;
    else activeCategoryState.activeCategory = category.name;
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: activeCategoryState.activeCategory }),
    );
    isActive(categoryItem);
    showToast(`Switched to "${activeCategoryState.activeCategory}"`);
    reloadNoteList();
    updateCategorySelect(categoryArr);
  }
  function deleteCategory(event: Event): void {
    event.stopPropagation();
    const categoryArr = getCategories();
    const id: string | null = categoryItem.getAttribute("category-id");
    const index = categoryArr.findIndex((c) => String(c.id) === id);
    if (!id || index === -1) return;
    const toBeDeleted = categoryArr[index];
    if (!toBeDeleted) return;
    updateNotes((prev) => {
      return prev.map((note) => {
        if (String(note.category) === toBeDeleted.name) {
          return { ...note, category: defaultCategory };
        }
        return note;
      });
    });
    const newCategoryArr = categoryArr.filter((_, i) => i !== index);
    updateCategories(() => newCategoryArr);
    categoryItem.removeEventListener("click", selectCategory);
    categoryItemBtn?.removeEventListener("click", deleteCategory);
    console.log("delete triggered for categoryItem", categoryItem);
    categoryItem.remove();
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: defaultCategory }),
    );
    updateCategorySelect(newCategoryArr);
    reloadCategoryList(newCategoryArr);
  }
  if (!categoryItem.getAttribute("default-category-id")) {
    categoryItemBtn?.addEventListener("click", deleteCategory);
  }
  categoryItem.addEventListener("click", selectCategory);
};

const reloadCategoryList = (categories: CategoryArray): void => {
  const categoryList = document.querySelector<HTMLDivElement>(".category-list");
  const categoryArr: CategoryArray = categories || getCategories();
  console.log("categoryList reloading...", categoryArr);
  const storedState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedState
    ? JSON.parse(storedState)
    : { activeCategory: defaultCategory };
  if (!categoryArr.length || !categoryList) return;
  categoryList.innerHTML = "";
  for (let i = 0; i < categoryArr.length; i++) {
    const category: Category | undefined = categoryArr[i];
    if (!category) continue;
    const categoryItem = document.createElement("div");
    categoryItem.className = "categoryItem";
    if (category.isDefault) {
      categoryItem.setAttribute("default-category-id", String(category.id));
      categoryItem.innerHTML = defaultCategoryItemTemplate(category.name);
    } else {
      categoryItem.setAttribute("category-id", String(category.id));
      categoryItem.innerHTML = categoryItemTemplate(category.name);
    }
    if (activeCategoryState.activeCategory === category.name) {
      isActive(categoryItem);
      reloadNoteList();
    }
    categoryList.appendChild(categoryItem);
    categoryItemHandler(categoryItem);
  }
};

export { categoryItemHandler, categoryToBeRendered, reloadCategoryList };
