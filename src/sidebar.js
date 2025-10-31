import { formatDate } from "./data.js";
import { Category, Note } from "./classes.js";
import {
  noteItemTemplate,
  categoryItemTemplate,
  defaultCategoryItemTemplate,
} from "./templates.js";
import { showToast, isActive } from "./events.js";
import { filter } from "./filter.js";
import { showBtn, updateCategorySelect } from "./buttons.js";

let default_category = "Ohne Kategorie";
let state = { active_category: default_category };
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
const createNewNote = (note_value, note_title, category = null) => {
  return new Note(
    Date.now() + Math.random(),
    category || state.active_category,
    note_value,
    note_title,
    formatDate()
  );
};

//note items to be added to sidebar with html rendering
const noteToBeRendered = (note_value, note_title, category = null) => {
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const notesContainer = document.querySelector(".notes-container");
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote = createNewNote(note_value, note_title, category);
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
  let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  noteItem_btn.onclick = function (event) {
    event.stopPropagation();
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
    showToast("Notiz ausgewählt");
    showBtn.click();
  };
};

//notes sidebar reload
const reloadNoteList = (arr) => {
  const notesContainer = document.querySelector(".notes-container");
  const notesArr = arr
    ? arr
    : JSON.parse(localStorage.getItem("notesArr") || "[]");

  const active_categoryItems = notesArr.filter(
    (items) => items.category == state.active_category
  );
  notesContainer.innerHTML = "";
  if (notesArr.length === 0 || active_categoryItems.length === 0) {
    noteToBeRendered(
      "Willkommen zu meiner Notiz App!",
      "Erste Notiz",
      state.active_category || default_category
    );
    return;
  }
  if (active_categoryItems.length == 0) return;
  const savedNoteId = savedNoteIdState.savedNoteId;
  for (let i = 0; i < active_categoryItems.length; i++) {
    const noteItem = document.createElement("div");
    noteItem.className = "noteItem";
    noteItem.setAttribute("data-id", active_categoryItems[i].id);
    noteItem.innerHTML = noteItemTemplate(active_categoryItems[i]);
    notesContainer.appendChild(noteItem);
    if (savedNoteId && savedNoteId == active_categoryItems[i].id) {
      const notesContainer = document.querySelector(".notes-container");
      savedNoteIdState.savedNoteId = noteItem.getAttribute("data-id");
      isActive(noteItem, notesContainer);
    }
    noteItemHandler(noteItem, active_categoryItems[i]);
  }
  syncCategoriesWithNotes();
};

//CATEGORIES

//category items event handling
const categoryItemHandler = (category_item) => {
  if (!category_item.getAttribute("default-category-id")) {
    //default category cant be deleted
    const noteItem_btn = category_item.querySelector("button");
    noteItem_btn.onclick = function (event) {
      event.stopPropagation();
      let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
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
            item.category = default_category;
            if (notesArr.length > 0) {
              notesArr.forEach((note) => {
                if (note.category == old_category) {
                  note.category = default_category;
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
  category_item.onclick = () => {
    const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
    let id;
    if (category_item.getAttribute("default-category-id")) {
      id = category_item.getAttribute("default-category-id");
    } else {
      id = category_item.getAttribute("category-id");
    }
    const category = categoryArr.find((c) => c.id == id);
    if (!category) state.active_category = default_category;
    else state.active_category = category.name;
    const categoryList = document.querySelector(".category-list");
    isActive(category_item, categoryList);
    syncCategoriesWithNotes();
    reloadNoteList();
    updateCategorySelect(categoryArr, state.active_category);
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
  let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  const doesCategoryExist = categoryArr.find(
    (category) => category.name == categoryName
  );
  if (doesCategoryExist) {
    showToast("Kategorie existiert bereits");
    return;
  }
  const newCategory = createNewCategory(categoryName, notesArr);
  let category_item;
  const sidebar_categories = document.querySelector(".category-list");
  const doesDefaultExist = categoryArr.find((c) => c.name == default_category);
  category_item = document.createElement("div");
  category_item.id = "categoryItem";
  if (newCategory.name == default_category && doesDefaultExist == undefined) {
    newCategory.isDefault = true;
    category_item.setAttribute("default-category-id", newCategory.id);
  } else if (newCategory.name != default_category && doesDefaultExist) {
    category_item.setAttribute("category-id", newCategory.id);
  } else return;
  categoryArr.push(newCategory);
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
  if (newCategory.isDefault) {
    category_item.innerHTML = defaultCategoryItemTemplate(newCategory.name);
  } else {
    category_item.innerHTML = categoryItemTemplate(newCategory.name);
  }
  sidebar_categories.appendChild(category_item);
  showToast(`Kategorie "${categoryName}" hinzugefügt`);
  isActive(category_item, sidebar_categories);
  updateCategorySelect(categoryArr);
  categoryItemHandler(category_item);
  syncCategoriesWithNotes();
};

//category reload
const reloadCategoryList = () => {
  const category_sidebar = document.querySelector(".category-list");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  if (!categoryArr.length) return;
  category_sidebar.innerHTML = "";
  for (let i = 0; i < categoryArr.length; i++) {
    const category_item = document.createElement("div");
    category_item.id = "categoryItem";
    if (categoryArr[i].isDefault) {
      category_item.setAttribute("default-category-id", categoryArr[i].id);
      category_item.innerHTML = defaultCategoryItemTemplate(
        categoryArr[i].name
      );
    } else {
      category_item.setAttribute("category-id", categoryArr[i].id);
      category_item.innerHTML = categoryItemTemplate(categoryArr[i].name);
    }
    category_sidebar.appendChild(category_item);
    categoryItemHandler(category_item);
  }
};

export {
  savedNoteIdState,
  state,
  reloadNoteList,
  reloadCategoryList,
  noteToBeRendered,
  noteItemHandler,
  categoryToBeRendered,
  categoryItemHandler,
  syncCategoriesWithNotes,
};
