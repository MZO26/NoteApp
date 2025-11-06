import { noteToBeRendered, reloadNoteList } from "./notes.js";
import { categoryToBeRendered, activeCategoryState } from "./categories.js";
import { inputListener, showToast, syncCategoriesWithNotes } from "./events.js";
import {
  changeOverlayInterface,
  toDoToBeRendered,
  saveTempNote,
} from "./toDo.js";
import { filter } from "./filter.js";

const darkModeBtn = document.querySelector(".dark-mode-btn");
const deleteBtn = document.querySelector(".delete-btn");
const saveBtn = document.querySelector(".add-btn");
const toggleBtn = document.querySelector(".toggle-btn");
const categoryBtn = document.querySelector(".category-btn");
const showBtn = document.querySelector(".showModal-btn");
const closeBtn = document.querySelector(".closeModal-btn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const switchBtn = document.querySelector(".switch-checkbox");
const switchBtnUI = document.querySelector(".switch");
const filterInput = document.querySelector(".search-input");

filterInput.addEventListener("click", filter);

const resetNoteInterface = () => {
  const noteTitle = document.querySelector(".title");
  const noteContent = document.querySelector(".note");
  if (noteTitle) noteTitle.value = "";
  if (noteContent) noteContent.value = "";
};

const resetToDoInterface = () => {
  const todoTitle = document.querySelector(".todo-title");
  const todoContent = document.querySelector(".task-list");
  if (todoTitle) todoTitle.value = "";
  if (todoContent) todoContent.innerHTML = "";
};

const addNewNote = () => {
  localStorage.setItem("modal-state", JSON.stringify({ interface: "note" }));
  if (switchBtn) switchBtn.checked = false;
  changeOverlayInterface();
  resetNoteInterface();
  openOverlay();
  if (switchBtnUI) switchBtnUI.classList.remove("hidden");
};

const openOverlay = () => {
  overlay.classList.add("show");
  modal.classList.add("show");
  localStorage.setItem("modal-status", "open");
  const notes = document.querySelector(".notes-container").children;
  const savedNoteId = JSON.parse(
    sessionStorage.getItem("savedNoteId") || "null"
  );
  if (savedNoteId && switchBtnUI && !switchBtnUI.classList.contains("hidden")) {
    switchBtnUI.classList.add("hidden");
  }
  Array.from(notes).forEach((element) => {
    if (element.classList.contains("active"))
      element.classList.remove("active");
  });
};
showBtn.addEventListener("click", addNewNote);

closeBtn.addEventListener("click", () => {
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  if (noteTitle) noteTitle.removeEventListener("input", saveTempNote);
  if (noteTextArea) noteTextArea.removeEventListener("input", saveTempNote);
  localStorage.removeItem("tempNoteValue");
  localStorage.removeItem("tempToDoValue");
  overlay.classList.remove("show");
  modal.classList.remove("show");
  sessionStorage.removeItem("savedNoteId");
  localStorage.setItem("modal-status", "closed");
  setTimeout(() => {
    if (switchBtnUI && switchBtnUI.classList.contains("hidden")) {
      switchBtnUI.classList.remove("hidden");
    }
  }, 300);
  if (modalState.interface === "toDo") {
    setTimeout(() => {
      switchBtn.click();
    }, 300);
    localStorage.setItem("modal-state", JSON.stringify({ interface: "note" }));
  }
});

switchBtn.addEventListener("change", () => {
  let modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const isToDo = switchBtn.checked;
  modalState = { interface: isToDo ? "toDo" : "note" };
  localStorage.setItem("modal-state", JSON.stringify(modalState));
  changeOverlayInterface();
  if (modalState.interface === "note") {
    resetNoteInterface();
  } else {
    resetToDoInterface();
  }
});

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
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const savedNoteId = JSON.parse(
    sessionStorage.getItem("savedNoteId") || "null"
  );
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const select = document.getElementById("category-select");
  const selectedCategory = select
    ? select.options[select.selectedIndex].textContent
    : activeCategoryState.activeCategory;
  const showEasterEggToast = () => showToast("General Kenobi");

  if (modalState.interface === "toDo") {
    const spans = document.querySelectorAll(".todo-container .task-list span");
    const allTasks = Array.from(spans).map((span) => span.textContent);
    const title = document.querySelector(".todo-title");
    if (!savedNoteId) {
      toDoToBeRendered(allTasks, title.value, selectedCategory, "toDo");
      title.value === "Hello there"
        ? showEasterEggToast()
        : showToast("Neue ToDo-Liste angelegt");
    } else {
      const savedItem = notesArr.find((note) => note.id == savedNoteId);
      if (savedItem && savedItem.type === "toDo") {
        savedItem.title = title.value.trim() || "Kein Titel";
        savedItem.data = allTasks;
        savedItem.category = selectedCategory;
        localStorage.setItem("notesArr", JSON.stringify(notesArr));
        syncCategoriesWithNotes();
        showToast("ToDo-Liste wurde gespeichert");
        reloadNoteList();
      }
    }
  } else if (modalState.interface === "note") {
    const title = document.querySelector(".title");
    const note = document.querySelector(".note");
    if (!savedNoteId) {
      noteToBeRendered(note.value, title.value, selectedCategory, "note");
      title.value === "Hello there"
        ? showEasterEggToast()
        : showToast("Neue Notiz angelegt");
    } else {
      const savedItem = notesArr.find((note) => note.id == savedNoteId);
      if (savedItem && savedItem.type === "note") {
        savedItem.title = title.value.trim() || "Kein Titel";
        savedItem.data = note.value;
        savedItem.category = selectedCategory;
        localStorage.setItem("notesArr", JSON.stringify(notesArr));
        syncCategoriesWithNotes();
        showToast("Notiz wurde gespeichert");
        reloadNoteList();
      }
    }
  }
  sessionStorage.removeItem("savedNoteId");
};

saveBtn.addEventListener("click", () => {
  saveButton();
  closeBtn.click();
});

const deleteButton = () => {
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  if (modalState.interface === "note") {
    const title = document.querySelector(".title");
    const content = document.querySelector(".note");
    if (title.value || content.value) {
      title.value = "";
      content.value = "";
    }
  } else if (modalState.interface === "toDo") {
    const title = document.querySelector(".todo-title");
    const content = document.querySelector(".task-list");
    if (title.value && content.innerHTML) {
      title.value = "";
      content.innerHTML = "";
    }
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
  openOverlay,
  toggleDarkMode,
  updateCategorySelect,
  saveButton,
  deleteButton,
  collapseCategories,
  categoryInputButton,
  showBtn,
  switchBtn,
};
