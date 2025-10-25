import { add_priorities, formatDate } from "./data.js";
import { syncLightDarkMode } from "./events.js";
import { Category, Note } from "./classes.js";
import {
  sidebarItemTemplate,
  activeCategoryItemTemplate,
  categoryItemTemplate,
  defaultCategoryItemTemplate,
} from "./templates.js";
import { showToast, isActive } from "./events.js";
import { filter } from "./filter.js";
import { collapse_sidebar } from "./buttons.js";

const default_category = "Ohne Kategorie";
let active_category = default_category;

const filterInput = document.querySelector(".search-input");
filterInput.addEventListener("click", filter);

const syncCategoriesWithNotes = () => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  categoryArr = categoryArr.map((category) => {
    category.items = sidebarNotesArr.filter(
      (note) => note.category == category.name
    );
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

//NOTES

//note items to be added to sidebar with html rendering
const notesToSidebar = (note_value) => {
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const sidebar = document.querySelector(".notes-list");
  const sidebarItem = document.createElement("div");
  sidebarItem.id = "sidebarItem";
  const noteData = new Note(
    Date.now() + Math.random(),
    active_category,
    note_value || "",
    add_priorities() || "Ohne Priorität",
    note_value.length == 0
      ? "Kein Titel"
      : note_value.split("\n")[0].substring(0, 15),
    formatDate()
  );
  sidebarItem.setAttribute("data-id", noteData.id);
  sidebarItem.style.backgroundColor = `${noteData.priority}`;
  sidebarItem.innerHTML = sidebarItemTemplate(noteData);
  sidebarNotesArr.push(noteData);
  localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
  sidebar.appendChild(sidebarItem);
  syncLightDarkMode(sidebarItem);
  sidebarItem_handler(sidebarItem, noteData);
  syncCategoriesWithNotes();
};

//note items event handling
const sidebarItem_handler = (sidebarItem, notes) => {
  const sidebarItem_btn = sidebarItem.querySelector("button");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  sidebarItem_btn.onclick = function (event) {
    event.stopPropagation();
    const id = this.parentElement.getAttribute("data-id");
    const index = sidebarNotesArr.findIndex(
      (sidebarNote) => sidebarNote.id == id
    );
    if (index > -1) {
      sidebarNotesArr.splice(index, 1);
      localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
    }
    this.parentElement.remove();
    syncCategoriesWithNotes();
  };
  sidebarItem.onclick = () => {
    const notesSidebar = document.querySelector(".sidebar-notes");
    document.querySelector(".note").value = notes.data;
    isActive(sidebarItem, "#sidebarItem", notesSidebar);
    showToast("Notiz ausgewählt");
    localStorage.setItem(
      "noteId",
      JSON.stringify(sidebarItem.getAttribute("data-id"))
    );
  };
};

//notes sidebar reload
const reloadNotesSidebar = (arr) => {
  const sidebar = document.querySelector(".notes-list");
  const sidebarNotesArr = arr
    ? arr
    : JSON.parse(localStorage.getItem("sidebarNotesArr") || "[]");
  const savedNoteId = JSON.parse(localStorage.getItem("noteId") || "null");
  const active_categoryItems = sidebarNotesArr.filter(
    (items) => items.category == active_category
  );
  sidebar.innerHTML = "";
  if (active_categoryItems.length == 0) return;
  for (let i = 0; i < active_categoryItems.length; i++) {
    const sidebarItem = document.createElement("div");
    sidebarItem.id = "sidebarItem";
    sidebarItem.setAttribute("data-id", active_categoryItems[i].id);
    sidebarItem.style.backgroundColor = `${active_categoryItems[i].priority}`;
    sidebarItem.innerHTML = activeCategoryItemTemplate(active_categoryItems[i]);
    sidebar.appendChild(sidebarItem);
    syncLightDarkMode(sidebarItem);
    if (savedNoteId && savedNoteId == active_categoryItems[i].id) {
      const notesSidebar = document.querySelector(".sidebar-notes");
      isActive(sidebarItem, "#sidebarItem", notesSidebar);
    }
    sidebarItem_handler(sidebarItem, active_categoryItems[i]);
  }
  syncCategoriesWithNotes();
};

//CATEGORIES

//category items event handling
const categoryItem_handler = (category_item) => {
  if (!category_item.getAttribute("default-category-id")) {
    //default category cant be deleted
    const sidebarItem_btn = category_item.querySelector("button");
    sidebarItem_btn.onclick = function (event) {
      event.stopPropagation();
      let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
      const sidebarNotesArr = JSON.parse(
        localStorage.getItem("sidebarNotesArr") || "[]"
      );
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
            if (sidebarNotesArr.length > 0) {
              sidebarNotesArr.forEach((note) => {
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
      localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
      localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
      syncCategoriesWithNotes();
      reloadCategorySidebar();
      reloadNotesSidebar();
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
    active_category = category.name;
    const categorySidebar = document.querySelector(".sidebar-categories");
    showToast(`${active_category} wurde ausgewählt`);
    isActive(category_item, "#categoryItem", categorySidebar);
    const notesSidebar = document.querySelector(".sidebar-notes");
    if (notesSidebar.classList.contains("collapsed")) {
      collapse_sidebar();
    }
    syncCategoriesWithNotes();
    reloadNotesSidebar();
  };
};

//create new categories
const createNewCategory = (categoryName, sidebarNotesArr) => {
  const categoryItems =
    sidebarNotesArr.filter((notes) => notes.category == categoryName) || [];
  return new Category(
    Date.now() + Math.random(),
    categoryItems,
    categoryName,
    false
  );
};

//category items to be added to sidebar with html rendering
const categoriesToSidebar = (categoryName) => {
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  const newCategory = createNewCategory(categoryName, sidebarNotesArr);
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
  syncLightDarkMode(category_item);
  categoryArr.push(newCategory);
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
  if (newCategory.isDefault) {
    category_item.innerHTML = defaultCategoryItemTemplate(newCategory.name);
  } else {
    category_item.innerHTML = categoryItemTemplate(newCategory.name);
  }
  sidebar_categories.appendChild(category_item);
  categoryItem_handler(category_item);
  syncCategoriesWithNotes();
};

//category sidebar reload
const reloadCategorySidebar = () => {
  const category_sidebar = document.querySelector(".category-list");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  if (!categoryArr.length) {
    console.log("Keine Kategorie verfügbar");
    return;
  }
  category_sidebar.innerHTML = "";

  for (let i = 0; i < categoryArr.length; i++) {
    const category_item = document.createElement("div");
    syncLightDarkMode(category_item);
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
    categoryItem_handler(category_item);
  }
};

export {
  default_category,
  reloadNotesSidebar,
  reloadCategorySidebar,
  notesToSidebar,
  sidebarItem_handler,
  categoriesToSidebar,
  categoryItem_handler,
  syncCategoriesWithNotes,
};
