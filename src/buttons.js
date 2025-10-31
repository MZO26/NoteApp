import {
  noteToBeRendered,
  categoryToBeRendered,
  reloadNoteList,
  state,
  savedNoteIdState,
} from "./sidebar.js";
import { inputListener, showToast } from "./events.js";

const dark_mode_btn = document.querySelector(".dark-mode-btn");
const delete_btn = document.querySelector(".delete-btn");
const add_btn = document.querySelector(".add-btn");
const toggle_btn = document.querySelector(".toggle-btn");
const category_btn = document.querySelector(".category-btn");
const showBtn = document.querySelector(".showModal-btn");
const closeBtn = document.querySelector(".closeModal-btn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

let tempSelectedCategory = null;

showBtn.addEventListener("click", () => {
  const title = document.querySelector(".title");
  const note = document.querySelector(".note");
  const notes = document.querySelector(".notes-container").children;
  Array.from(notes).forEach((element) => {
    if (element.classList.contains("active"))
      element.classList.remove("active");
  });
  if (!savedNoteIdState.savedNoteId) {
    title.value = "";
    note.value = "";
  }

  overlay.classList.add("show");
  modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  savedNoteIdState.savedNoteId = null;
});

const collapseCategories = () => {
  const sidebar_categories = document.querySelector(".category-list");
  const sidebar_notes = document.getElementById("sidebar2");
  sidebar_notes.classList.toggle("collapsed");
  sidebar_categories.classList.toggle("collapsed");
  if (sidebar_categories.hasChildNodes()) {
    [...sidebar_categories.children].forEach((child) =>
      child.classList.toggle("collapsed")
    );
  }
};
toggle_btn.addEventListener("click", collapseCategories);

const updateCategorySelect = (categoryArr, activeCategory = null) => {
  const select = document.getElementById("category-select");
  if (!select) return;
  select.innerHTML = "";
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    if (activeCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

const optionHandler = () => {
  const select = document.getElementById("category-select");
  if (!select) return;
  tempSelectedCategory = select.options[select.selectedIndex].textContent;
  return;
};

const saveButton = () => {
  const cleanup = () => {
    const title = document.querySelector(".title");
    const note = document.querySelector(".note");
    if (title) title.value = "";
    if (note) note.value = "";
  };
  const title = document.querySelector(".title");
  const note = document.querySelector(".note");
  const savedNoteId = savedNoteIdState.savedNoteId;
  state.active_category = tempSelectedCategory || state.active_category;
  if (!savedNoteId) {
    noteToBeRendered(note.value, title.value, state.active_category);
    cleanup();
    if (note.value == "Hello there") {
      showToast("General Kenobi");
    } else {
      showToast("Neue Notiz angelegt");
    }
  } else {
    let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const savedNote = notesArr.find((notes) => notes.id == savedNoteId);
    savedNote.title = title.value.length == 0 ? "Kein Titel" : title.value;
    savedNote.data = note.value;
    savedNote.category = state.active_category;
    localStorage.setItem("notesArr", JSON.stringify(notesArr));
    savedNoteIdState.savedNoteId = null;
    cleanup();
    showToast("Notiz wurde gespeichert");
    reloadNoteList();
  }
  tempSelectedCategory = null;
};

add_btn.addEventListener("click", () => {
  saveButton();
  closeBtn.click();
});

const deleteButton = () => {
  const note = document.querySelector(".note");
  if (note.value.length) {
    note.value = "";
    return;
  }
};
delete_btn.addEventListener("click", deleteButton);

function toggleDarkMode(className = "dark") {
  const savedMode = localStorage.getItem("mode") || "dark";
  if (savedMode === "dark") {
    document.body.classList.add(className);
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove(className);
    document.body.classList.add("light");
  }
}

dark_mode_btn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark"); // toggle 'dark' class
  if (isDark) {
    document.body.classList.remove("light");
    localStorage.setItem("mode", "dark");
  } else {
    document.body.classList.add("light");
    localStorage.setItem("mode", "light");
  }
});

const categoryInputButton = async () => {
  const category_btn = document.querySelector(".category-btn");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "category-input";
  input.placeholder = "Kategorie eingeben";
  category_btn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(category_btn);
  if (value) categoryToBeRendered(value);
};
category_btn.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryInputButton();
});

export {
  toggleDarkMode,
  updateCategorySelect,
  saveButton,
  deleteButton,
  collapseCategories,
  categoryInputButton,
  optionHandler,
  showBtn,
};
