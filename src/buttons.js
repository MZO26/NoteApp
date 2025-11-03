import {
  noteToBeRendered,
  categoryToBeRendered,
  reloadNoteList,
  syncCategoriesWithNotes,
  activeCategoryState,
} from "./sidebar.js";
import { inputListener, showToast } from "./events.js";
import { changeOverlayInterface } from "./toDo.js";

const darkModeBtn = document.querySelector(".dark-mode-btn");
const deleteBtn = document.querySelector(".delete-btn");
const addBtn = document.querySelector(".add-btn");
const toggleBtn = document.querySelector(".toggle-btn");
const categoryBtn = document.querySelector(".category-btn");
const showBtn = document.querySelector(".showModal-btn");
const closeBtn = document.querySelector(".closeModal-btn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const switchBtn = document.querySelector(".switch-btn");

const saveTempNote = () => {
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  localStorage.setItem(
    "tempNoteValue",
    JSON.stringify({ title: noteTitle.value, note: noteTextArea.value })
  );
};

const openOverlay = () => {
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  const notes = document.querySelector(".notes-container").children;
  const tempNote = JSON.parse(localStorage.getItem("tempNoteValue") || "{}");
  sessionStorage.setItem("savedNoteId", null);
  noteTitle.value = tempNote.title || "";
  noteTextArea.value = tempNote.note || "";
  Array.from(notes).forEach((element) => {
    if (element.classList.contains("active"))
      element.classList.remove("active");
  });
  overlay.classList.add("show");
  modal.classList.add("show");
  localStorage.setItem("modal-status", "open");
  noteTitle.addEventListener("input", saveTempNote);
  noteTextArea.addEventListener("input", saveTempNote);
};
showBtn.addEventListener("click", openOverlay);

closeBtn.addEventListener("click", () => {
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  noteTitle.removeEventListener("input", saveTempNote);
  noteTextArea.removeEventListener("input", saveTempNote);
  overlay.classList.remove("show");
  modal.classList.remove("show");
  localStorage.setItem("modal-status", "closed");
  localStorage.removeItem("tempNoteValue");
});

switchBtn.addEventListener("click", changeOverlayInterface);

const collapseCategories = () => {
  const categoryList = document.querySelector(".category-list");
  categoryList.classList.toggle("collapsed");
  if (categoryList.hasChildNodes()) {
    [...categoryList.children].forEach((child) =>
      child.classList.toggle("collapsed")
    );
  }
};
toggleBtn.addEventListener("click", collapseCategories);

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

const saveButton = () => {
  const cleanup = () => {
    const title = document.querySelector(".title");
    const note = document.querySelector(".note");
    if (title) title.value = "";
    if (note) note.value = "";
  };
  const title = document.querySelector(".title");
  const note = document.querySelector(".note");
  const modalState = JSON.parse(sessionStorage.getItem("modalState"));
  console.log(modalState);
  if (modalState.note == false) {
    setTimeout(() => {
      switchBtn.click();
    }, 0);
  }
  const savedNoteId = JSON.parse(
    sessionStorage.getItem("savedNoteId") || "null"
  );
  const select = document.getElementById("category-select");
  const selectedCategory = select
    ? select.options[select.selectedIndex].textContent
    : activeCategoryState.activeCategory;
  console.log(savedNoteId);
  if (!savedNoteId) {
    noteToBeRendered(note.value, title.value, selectedCategory);
    if (note.value == "Hello there" || title.value == "Hello there") {
      showToast("General Kenobi");
    } else {
      showToast("Neue Notiz angelegt");
    }
  } else {
    const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const savedNote = notesArr.find((notes) => notes.id == savedNoteId);
    savedNote.title = title.value.length == 0 ? "Kein Titel" : title.value;
    savedNote.data = note.value;
    savedNote.category = selectedCategory;
    localStorage.setItem("notesArr", JSON.stringify(notesArr));
    syncCategoriesWithNotes();
    showToast("Notiz wurde gespeichert");
  }
  cleanup();
  reloadNoteList();
};

addBtn.addEventListener("click", () => {
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
deleteBtn.addEventListener("click", deleteButton);

const toggleDarkMode = (className = "dark") => {
  const savedMode = localStorage.getItem("mode") || "dark";
  if (savedMode === "dark") {
    document.body.classList.add(className);
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove(className);
    document.body.classList.add("light");
  }
};

darkModeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  if (isDark) {
    document.body.classList.remove("light");
    localStorage.setItem("mode", "dark");
  } else {
    document.body.classList.add("light");
    localStorage.setItem("mode", "light");
  }
});

const categoryInputButton = async () => {
  const categoryBtn = document.querySelector(".category-btn");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "category-input";
  input.placeholder = "Kategorie eingeben";
  categoryBtn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(categoryBtn);
  if (value) categoryToBeRendered(value);
};
categoryBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryInputButton();
});

export {
  saveTempNote,
  openOverlay,
  toggleDarkMode,
  updateCategorySelect,
  saveButton,
  deleteButton,
  collapseCategories,
  categoryInputButton,
  showBtn,
};
