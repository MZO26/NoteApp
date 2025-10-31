import { Category, Note } from "./classes.js";
import {
  noteItemTemplate,
  categoryItemTemplate,
  defaultCategoryItemTemplate,
  dateTemplate,
} from "./templates.js";
import { showToast, isActive } from "./events.js";
import { filter } from "./filter.js";
import { showBtn, updateCategorySelect } from "./buttons.js";

let defaultCategory = "Ohne Kategorie";
let activeCategoryState = { activeCategory: defaultCategory };
let savedNoteIdState = { savedNoteId: null };

const filterInput = document.querySelector(".search-input");
filterInput.addEventListener("click", filter);

//sync categories with notes in localStorage
const syncCategoriesWithNotes = () => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  categoryArr = categoryArr.map((category) => {
    category.items = notesArr.filter((note) => note.category == category.name);
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

//NOTES

//create new notes
const createNewNote = (noteValue, noteTitle, category = null) => {
  return new Note(
    Date.now() + Math.random(),
    category || activeCategoryState.activeCategory,
    noteValue,
    noteTitle,
    dateTemplate()
  );
};

//note items to be added to sidebar with html rendering
const noteToBeRendered = (noteValue, noteTitle, category = null) => {
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const notesContainer = document.querySelector(".notes-container");
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote = createNewNote(noteValue, noteTitle, category);
  noteItem.setAttribute("data-id", newNote.id);
  noteItem.innerHTML = noteItemTemplate(newNote);
  notesArr.push(newNote);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
  syncCategoriesWithNotes();
};

//note items event handling
const noteItemHandler = (noteItem, notes) => {
  const noteItem_btn = noteItem.querySelector("button");
  noteItem_btn.onclick = function (event) {
    event.stopPropagation();
    const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const id = this.parentElement.getAttribute("data-id");
    const index = notesArr.findIndex((sidebarNote) => sidebarNote.id == id);
    if (index > -1) {
      notesArr.splice(index, 1);
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
    }
    this.parentElement.remove();
    syncCategoriesWithNotes();
  };
  noteItem.onclick = () => {
    const notesContainer = document.querySelector(".notes-container");
    document.querySelector(".title").value = notes.title;
    document.querySelector(".note").value = notes.data;
    isActive(noteItem, notesContainer);
    savedNoteIdState.savedNoteId = noteItem.getAttribute("data-id");
    showBtn.click();
  };
};

//notes sidebar reload
const reloadNoteList = (arr) => {
  const notesContainer = document.querySelector(".notes-container");
  const notesArr = arr
    ? arr
    : JSON.parse(localStorage.getItem("notesArr") || "[]");

  const activeCategoryItems = notesArr.filter(
    (items) => items.category == activeCategoryState.activeCategory
  );
  notesContainer.innerHTML = "";
  if (notesArr.length === 0 || activeCategoryItems.length === 0) {
    noteToBeRendered(
      "Willkommen zu meiner Notiz App!",
      "Erste Notiz",
      activeCategoryState.activeCategory || defaultCategory
    );
    return;
  }
  if (activeCategoryItems.length == 0) return;
  const savedNoteId = savedNoteIdState.savedNoteId;
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const noteItem = document.createElement("div");
    noteItem.className = "noteItem";
    noteItem.setAttribute("data-id", activeCategoryItems[i].id);
    noteItem.innerHTML = noteItemTemplate(activeCategoryItems[i]);
    notesContainer.appendChild(noteItem);
    if (savedNoteId && savedNoteId == activeCategoryItems[i].id) {
      const notesContainer = document.querySelector(".notes-container");
      savedNoteIdState.savedNoteId = noteItem.getAttribute("data-id");
      isActive(noteItem, notesContainer);
    }
    noteItemHandler(noteItem, activeCategoryItems[i]);
  }
  syncCategoriesWithNotes();
};

//CATEGORIES

//category items event handling
const categoryItemHandler = (categoryItem) => {
  if (!categoryItem.getAttribute("default-category-id")) {
    //default category cant be deleted
    const noteItem_btn = categoryItem.querySelector("button");
    noteItem_btn.onclick = function (event) {
      event.stopPropagation();
      const categoryArr = JSON.parse(
        localStorage.getItem("categoryArr") || "[]"
      );
      const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
      const id = this.parentElement.getAttribute("category-id");
      const index = categoryArr.findIndex(
        (category) => String(category.id) == String(id)
      );
      if (index > -1) {
        //item exists if index > -1 / -1 if it doesnt exist
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
      this.parentElement.remove();
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
      localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
      updateCategorySelect(categoryArr);
      syncCategoriesWithNotes();
      reloadCategoryList();
      reloadNoteList();
    };
  }
  categoryItem.onclick = () => {
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
    console.log(activeCategoryState.activeCategory);
    const categoryList = document.querySelector(".category-list");
    isActive(categoryItem, categoryList);
    syncCategoriesWithNotes();
    reloadNoteList();
    updateCategorySelect(categoryArr, activeCategoryState.activeCategory);
  };
};

//create new categories
const createNewCategory = (categoryName, notesArr) => {
  const categoryItems =
    notesArr.filter((notes) => notes.category == categoryName) || [];
  return new Category(
    Date.now() + Math.random(),
    categoryItems,
    categoryName,
    false
  );
};

//category items to be added to sidebar with html rendering
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
  activeCategoryState.activeCategory = categoryName;
  updateCategorySelect(categoryArr);
  categoryItemHandler(categoryItem);
  syncCategoriesWithNotes();
};

//category reload
const reloadCategoryList = () => {
  console.log(activeCategoryState.activeCategory);
  const categoryList = document.querySelector(".category-list");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
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
  savedNoteIdState,
  activeCategoryState,
  reloadNoteList,
  reloadCategoryList,
  noteToBeRendered,
  noteItemHandler,
  categoryToBeRendered,
  categoryItemHandler,
  syncCategoriesWithNotes,
};
