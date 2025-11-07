import { createNewCategory } from "./classes.js";
import {
  categoryItemTemplate,
  defaultCategoryItemTemplate,
} from "./templates.js";
import { showToast, isActive, syncCategoriesWithNotes } from "./events.js";
import { updateCategorySelect } from "./buttons.js";
import { reloadNoteList } from "./notes.js";

let defaultCategory = "Ohne Kategorie";
let activeCategoryState = { activeCategory: defaultCategory };

const categoryToBeRendered = (categoryName) => {
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  const doesCategoryExist = categoryArr.find(
    (category) => category.name == categoryName
  );
  if (doesCategoryExist) {
    showToast("Kategorie existiert bereits");
    return;
  }
  const newCategory = createNewCategory(categoryName, notesArr);
  let categoryItem;
  const categoryList = document.querySelector(".category-list");
  const doesDefaultExist = categoryArr.find((c) => c.name == defaultCategory);
  categoryItem = document.createElement("div");
  categoryItem.id = "categoryItem";
  if (newCategory.name == defaultCategory && doesDefaultExist == undefined) {
    newCategory.isDefault = true;
    categoryItem.setAttribute("default-category-id", newCategory.id);
  } else if (newCategory.name != defaultCategory && doesDefaultExist) {
    categoryItem.setAttribute("category-id", newCategory.id);
  } else return;
  categoryArr.push(newCategory);
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
  if (newCategory.isDefault) {
    categoryItem.innerHTML = defaultCategoryItemTemplate(newCategory.name);
  } else {
    categoryItem.innerHTML = categoryItemTemplate(newCategory.name);
  }
  categoryList.appendChild(categoryItem);
  showToast(`Kategorie "${categoryName}" hinzugefügt`);
  localStorage.setItem(
    "activeCategoryState",
    JSON.stringify({ activeCategory: categoryName })
  );
  updateCategorySelect(categoryArr, categoryName);
  categoryItemHandler(categoryItem);
  syncCategoriesWithNotes();
};

const categoryItemHandler = (categoryItem) => {
  const categoryItemBtn = categoryItem.querySelector("button");
  function selectCategory() {
    sessionStorage.setItem("savedNoteId", "null");
    const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
    let id;
    if (categoryItem.getAttribute("default-category-id")) {
      id = categoryItem.getAttribute("default-category-id");
    } else {
      id = categoryItem.getAttribute("category-id");
    }
    const category = categoryArr.find((c) => c.id == id);
    if (!category) activeCategoryState.activeCategory = defaultCategory;
    else activeCategoryState.activeCategory = category.name;
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: activeCategoryState.activeCategory })
    );
    const categoryList = document.querySelector(".category-list");
    isActive(categoryItem, categoryList);
    syncCategoriesWithNotes();
    reloadNoteList();
    updateCategorySelect(categoryArr, activeCategoryState.activeCategory);
  }

  function deleteCategory(event) {
    event.stopPropagation();
    const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
    const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const id = categoryItem.getAttribute("category-id");
    const index = categoryArr.findIndex(
      (category) => String(category.id) == String(id)
    );
    if (index > -1) {
      let toBeDeleted = categoryArr.find((categories) => categories.id == id);
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
      categoryArr.splice(index, 1);
    }
    categoryItem.removeEventListener("click", selectCategory);
    categoryItemBtn.removeEventListener("click", deleteCategory);
    categoryItem.remove();
    localStorage.setItem("notesArr", JSON.stringify(notesArr));
    localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
    localStorage.setItem(
      "activeCategoryState",
      JSON.stringify({ activeCategory: defaultCategory })
    );
    updateCategorySelect(categoryArr, defaultCategory);
    syncCategoriesWithNotes();
    reloadCategoryList();
    reloadNoteList();
  }
  if (!categoryItem.getAttribute("default-category-id")) {
    categoryItemBtn.addEventListener("click", deleteCategory);
  }
  categoryItem.addEventListener("click", selectCategory);
};

const reloadCategoryList = () => {
  const categoryList = document.querySelector(".category-list");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  const activeCategoryState = JSON.parse(
    localStorage.getItem("activeCategoryState")
  ) || { activeCategory: defaultCategory };
  if (!categoryArr.length) return;
  categoryList.innerHTML = "";
  for (let i = 0; i < categoryArr.length; i++) {
    const categoryItem = document.createElement("div");
    categoryItem.id = "categoryItem";
    if (categoryArr[i].isDefault) {
      categoryItem.setAttribute("default-category-id", categoryArr[i].id);
      categoryItem.innerHTML = defaultCategoryItemTemplate(categoryArr[i].name);
    } else {
      categoryItem.setAttribute("category-id", categoryArr[i].id);
      categoryItem.innerHTML = categoryItemTemplate(categoryArr[i].name);
    }
    if (activeCategoryState.activeCategory == categoryArr[i].name) {
      isActive(categoryItem, categoryList);
    }
    categoryList.appendChild(categoryItem);
    categoryItemHandler(categoryItem);
  }
};

export {
  defaultCategory,
  activeCategoryState,
  reloadCategoryList,
  categoryToBeRendered,
  categoryItemHandler,
  syncCategoriesWithNotes,
};
