import { defaultCategory } from "../features/categories.js";
import { noteToBeRendered, reloadNoteList } from "../features/notes.js";
import { toDoToBeRendered } from "../features/toDo.js";
import { changeOverlayInterface } from "../ui-components/renderModalUI.js";
import { showToast } from "../utils/events.js";
import {
  saveTempNote,
  saveTempToDo,
  syncCategoriesWithNotes,
} from "../utils/storage.js";

const closeBtn = document.querySelector(".closeModal-btn");
const saveBtn = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".delete-btn");
const switchBtn = document.querySelector(".switch-checkbox");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const switchBtnVisibility = document.querySelector(".switch");
let reset = false;

const resetNoteInterface = () => {
  requestAnimationFrame(() => {
    const noteTitle = document.querySelector(".title");
    const noteContent = document.querySelector(".note");
    if (noteTitle) noteTitle.value = "";
    if (noteContent) noteContent.value = "";
  });
};

const resetToDoInterface = () => {
  requestAnimationFrame(() => {
    const todoTitle = document.querySelector(".todo-title");
    const todoContent = document.querySelector(".task-list");
    if (todoTitle) todoTitle.value = "";
    if (todoContent) todoContent.innerHTML = "";
  });
};

const updateCategorySelect = (categoryArr) => {
  const select = document.getElementById("category-select");
  const activeCategoryState = JSON.parse(
    localStorage.getItem("activeCategoryState")
  ) || { activeCategory: defaultCategory };
  if (!select) return;
  select.innerHTML = "";
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    if (option.textContent.length > 20) {
      option.textContent = option.textContent.slice(0, 20) + "...";
    }
    if (category.name == activeCategoryState.activeCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

const handleNoteSave = (savedNoteId, notesArr, selectedCategory) => {
  const title = document.querySelector(".title");
  const note = document.querySelector(".note");
  if (!savedNoteId) {
    noteToBeRendered(
      note.value,
      title.value || "Untitled",
      selectedCategory,
      "note"
    );
    title.value === "Hello there"
      ? showToast("General Kenobi")
      : showToast("New note added");
  } else {
    const savedItem = notesArr.find((note) => note.id == savedNoteId);
    if (savedItem && savedItem.type === "note") {
      savedItem.title = title.value.trim() || "";
      savedItem.data = note.value || "";
      savedItem.category = selectedCategory;
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
      syncCategoriesWithNotes();
      showToast("Note was saved");
      reloadNoteList();
    }
  }
};

const handleToDoSave = (savedNoteId, notesArr, selectedCategory) => {
  const tempToDoValue =
    JSON.parse(localStorage.getItem("tempToDoValue")) || "{}";
  const spans = document.querySelectorAll(".task-list li span");
  const completedTasks =
    Array.from(spans)
      .filter((elements) => elements.classList.contains("task-completed"))
      .map((element) => element.textContent) || tempToDoValue.dataCompleted;
  console.log(completedTasks);
  const allTasks = Array.from(spans).map((span) => span.textContent);
  const title = document.querySelector(".todo-title");
  if (!savedNoteId) {
    toDoToBeRendered(
      allTasks,
      title.value || "Untitled",
      selectedCategory,
      "toDo",
      completedTasks
    );
    title.value === "Hello there"
      ? showToast("General Kenobi")
      : showToast("New toDo-list added");
  } else {
    const savedItem = notesArr.find((note) => note.id == savedNoteId);
    if (savedItem && savedItem.type === "toDo") {
      savedItem.title = title.value.trim() || tempToDoValue.title || "Untitled";
      savedItem.data = allTasks;
      savedItem.category = selectedCategory;
      savedItem.completedTasks = completedTasks;
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
      saveTempToDo();
      syncCategoriesWithNotes();
      showToast("ToDo-list was saved");
      reloadNoteList();
    }
  }
};

const saveButton = () => {
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const savedNoteId = JSON.parse(
    sessionStorage.getItem("savedNoteId") || "null"
  );
  const activeCategoryState = JSON.parse(
    localStorage.getItem("activeCategoryState")
  ) || { activeCategory: defaultCategory };
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const select = document.getElementById("category-select");
  const selectedCategory = select
    ? select.options[select.selectedIndex].textContent
    : activeCategoryState.activeCategory;
  if (modalState.interface === "toDo") {
    handleToDoSave(savedNoteId, notesArr, selectedCategory);
  } else if (modalState.interface === "note") {
    handleNoteSave(savedNoteId, notesArr, selectedCategory);
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

const closeModal = () => {
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
  if (modalState.interface === "note") {
    resetNoteInterface();
  } else {
    resetToDoInterface();
  }
  sessionStorage.removeItem("savedNoteId");
  localStorage.setItem("modal-status", "closed");
  setTimeout(() => {
    if (
      switchBtnVisibility &&
      switchBtnVisibility.classList.contains("hidden")
    ) {
      switchBtnVisibility.classList.remove("hidden");
    }
  }, 300);
};
closeBtn.addEventListener("click", closeModal);

const switchOverlayInterface = () => {
  let modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const isToDo = switchBtn.checked;
  modalState = { interface: isToDo ? "toDo" : "note" };
  localStorage.setItem("modal-state", JSON.stringify(modalState));
  changeOverlayInterface();
  if (isToDo && !reset) {
    resetToDoInterface();
    reset = true;
  }
};
switchBtn.addEventListener("change", switchOverlayInterface);

export { resetNoteInterface, resetToDoInterface, updateCategorySelect };
