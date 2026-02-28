import { updateCategorySelect } from "../handlers/modalHandlers.js";
import type { CategoryItem } from "../types/categoryTypes.js";
import type { ActiveCategoryState } from "../types/stateTypes.js";
import type { CategoryArray, NoteArray } from "../types/storageTypes.js";
import type { Category } from "../utils/classes.js";
import { createNewCategory } from "../utils/classes.js";
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

let defaultCategory: string = "Without category";
let activeCategoryState: ActiveCategoryState = {
  activeCategory: defaultCategory,
};

const categoryToBeRendered = (categoryName: string): void => {
  const notesArr: NoteArray = getNotes();
  const categoryArr: CategoryArray = getCategories();
  if (categoryArr.find((category) => category.name === categoryName)) {
    showToast("Category already exists");
    return;
  }
  const newCategory = createNewCategory(categoryName, notesArr);
  const categoryList = document.querySelector<HTMLDivElement>(".category-list");
  const doesDefaultExist: Category | undefined = categoryArr.find(
    (category: Category) => category.name === defaultCategory,
  );
  let categoryItem: CategoryItem = document.createElement("div");
  categoryItem.id = "categoryItem";
  if (newCategory.name === defaultCategory && !doesDefaultExist) {
    newCategory.isDefault = true;
    categoryItem.setAttribute("default-category-id", String(newCategory.id));
  } else if (newCategory.name !== defaultCategory && doesDefaultExist) {
    categoryItem.setAttribute("category-id", String(newCategory.id));
  } else return;

  updateCategories((prevCategories) => [...prevCategories, newCategory]);
  const truncate = (str: string, max = 10): string =>
    str.length > max ? str.slice(0, max) + "..." : str;

  if (newCategory.isDefault) {
    categoryItem.innerHTML = defaultCategoryItemTemplate(newCategory.name);
  } else {
    categoryItem.innerHTML = categoryItemTemplate(truncate(newCategory.name));
  }
  if (!categoryList) return;
  categoryList.appendChild(categoryItem);
  if (newCategory.name !== defaultCategory) {
    showToast(`Added "${truncate(newCategory.name)}"`);
  }
  localStorage.setItem(
    "activeCategoryState",
    JSON.stringify({ activeCategory: truncate(newCategory.name) }),
  );
  updateCategorySelect(categoryArr);
  categoryItemHandler(categoryItem);
};

const categoryItemHandler = (categoryItem: CategoryItem): void => {
  const categoryItemBtn =
    categoryItem.querySelector<HTMLButtonElement>("button");
  function selectCategory(): void {
    sessionStorage.setItem("savedNoteId", "null");
    const categoryArr: CategoryArray = getCategories();
    let id: number;
    if (categoryItem.getAttribute("default-category-id")) {
      id = Number(categoryItem.getAttribute("default-category-id"));
    } else {
      id = Number(categoryItem.getAttribute("category-id"));
    }
    const category = categoryArr.find((c) => c.id == id);
    if (!category) activeCategoryState.activeCategory = defaultCategory;
    else activeCategoryState.activeCategory = category.name;
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: activeCategoryState.activeCategory }),
    );
    const categoryList =
      document.querySelector<HTMLDivElement>(".category-list")!;
    isActive(categoryItem, categoryList);
    reloadNoteList();
    updateCategorySelect(categoryArr);
  }

  function deleteCategory(event: Event): void {
    event.stopPropagation();
    const categoryArr: CategoryArray = getCategories();
    const notesArr: NoteArray = getNotes();
    const id: string | null = categoryItem.getAttribute("category-id");
    const index = categoryArr.findIndex(
      (category) => String(category.id) === id,
    );
    if (index > -1) {
      let toBeDeleted = categoryArr.find(
        (categories) => String(categories.id) === id,
      );
      if (toBeDeleted && toBeDeleted.items.length > 0) {
        toBeDeleted.items.forEach((item) => {
          const old_category = item.category;
          item.category = defaultCategory;
          if (notesArr.length > 0) {
            notesArr.forEach((note) => {
              if (note.category == old_category) {
                note.category = defaultCategory;
              }
            });
          }
        });
      }
      updateNotes((prev) => [...prev]);
      updateCategories((prev) =>
        prev.filter((category) => String(category.id) !== id),
      );
    }

    categoryItem.removeEventListener("click", selectCategory);
    categoryItemBtn?.removeEventListener("click", deleteCategory);
    categoryItem.remove();
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: defaultCategory }),
    );
    updateCategorySelect(getCategories());
    reloadCategoryList();
    reloadNoteList();
  }
  if (!categoryItem.getAttribute("default-category-id")) {
    categoryItemBtn?.addEventListener("click", deleteCategory);
  }
  categoryItem.addEventListener("click", selectCategory);
};

const reloadCategoryList = (): void => {
  const categoryList =
    document.querySelector<HTMLDivElement>(".category-list")!;
  const categoryArr: CategoryArray = getCategories();
  const storedState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedState
    ? JSON.parse(storedState)
    : { activeCategory: defaultCategory };
  if (!categoryArr.length) return;
  categoryList.innerHTML = "";
  for (let i = 0; i < categoryArr.length; i++) {
    const categoryItem = document.createElement("div");
    categoryItem.id = "categoryItem";
    if (categoryArr[i]!.isDefault) {
      categoryItem.setAttribute(
        "default-category-id",
        String(categoryArr[i]!.id),
      );
      categoryItem.innerHTML = defaultCategoryItemTemplate(
        categoryArr[i]!.name,
      );
    } else {
      categoryItem.setAttribute("category-id", String(categoryArr[i]!.id));
      categoryItem.innerHTML = categoryItemTemplate(categoryArr[i]!.name);
    }
    if (activeCategoryState.activeCategory == categoryArr[i]!.name) {
      isActive(categoryItem, categoryList);
    }
    categoryList.appendChild(categoryItem);
    categoryItemHandler(categoryItem);
  }
};

export {
  activeCategoryState,
  categoryItemHandler,
  categoryToBeRendered,
  defaultCategory,
  reloadCategoryList,
};
