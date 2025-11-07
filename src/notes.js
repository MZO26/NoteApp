import { createNewNote } from "./classes.js";
import { noteItemTemplate, toDoItemTemplate } from "./templates.js";
import { isActive, syncCategoriesWithNotes, saveTempNote } from "./events.js";
import { defaultCategory } from "./categories.js";
import { toDoItemHandler } from "./toDo.js";
import { openOverlay } from "./buttons.js";

let savedNoteIdState = { savedNoteId: null };

const noteToBeRendered = (noteValue, noteTitle, category = null, type) => {
  if (type !== "note") return;
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const notesContainer = document.querySelector(".notes-container");
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote = createNewNote(type, category, noteValue, noteTitle);
  noteItem.setAttribute("data-id", newNote.id);
  noteItem.innerHTML = noteItemTemplate(newNote);
  notesArr.push(newNote);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
  syncCategoriesWithNotes();
};

const noteItemHandler = (noteItem, notes) => {
  const noteItemBtn = noteItem.querySelector("button");

  function viewNote() {
    localStorage.setItem("modal-state", JSON.stringify({ interface: "note" }));
    savedNoteIdState.savedNoteId = noteItem.getAttribute("data-id");
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId)
    );
    const switchBtn = document.querySelector(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = false;
      switchBtn.dispatchEvent(new Event("change"));
    }
    openOverlay();
    const tempNote = JSON.parse(localStorage.getItem("tempNoteValue") || "{}");
    const notesContainer = document.querySelector(".notes-container");
    const noteTitle = document.querySelector(".title");
    const noteTextArea = document.querySelector(".note");
    noteTitle.value = notes.title || tempNote.title;
    noteTextArea.value = notes.data || tempNote.note;
    saveTempNote();
    isActive(noteItem, notesContainer);

    if (noteTitle) noteTitle.addEventListener("input", saveTempNote);
    if (noteTextArea) noteTextArea.addEventListener("input", saveTempNote);
  }

  function deleteNote(event) {
    event.stopPropagation();
    const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const id = noteItem.getAttribute("data-id");
    const index = notesArr.findIndex((note) => note.id == id);
    if (index > -1) {
      notesArr.splice(index, 1);
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
    }
    noteItemBtn.removeEventListener("click", deleteNote);
    noteItem.removeEventListener("click", viewNote);
    noteItem.remove();
    syncCategoriesWithNotes();
  }
  noteItem.addEventListener("click", viewNote);
  noteItemBtn.addEventListener("click", deleteNote);
};

const reloadNoteList = (arr) => {
  const notesContainer = document.querySelector(".notes-container");
  const notesArr = arr
    ? arr
    : JSON.parse(localStorage.getItem("notesArr") || "[]");
  const activeCategoryState = JSON.parse(
    localStorage.getItem("activeCategoryState")
  ) || { activeCategory: defaultCategory };
  const activeCategoryItems = notesArr.filter(
    (items) => items.category == activeCategoryState.activeCategory
  );
  notesContainer.innerHTML = "";
  if (notesArr.length === 0 || activeCategoryItems.length === 0) {
    noteToBeRendered(
      "Willkommen zu meiner Notiz App!",
      "Erste Notiz",
      activeCategoryState.activeCategory,
      "note"
    );
    return;
  }
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const tempToDoValue =
      JSON.parse(localStorage.getItem("tempToDoValue")) || "{}";
    const noteItem = document.createElement("div");
    noteItem.setAttribute("data-id", activeCategoryItems[i].id);
    noteItem.className = `${activeCategoryItems[i].type}Item`;
    if (
      noteItem.classList.contains("noteItem") &&
      activeCategoryItems[i].type === "note"
    ) {
      noteItem.innerHTML = noteItemTemplate(activeCategoryItems[i]);
    } else if (
      noteItem.classList.contains("toDoItem") &&
      activeCategoryItems[i].type === "toDo"
    ) {
      noteItem.innerHTML = toDoItemTemplate(
        activeCategoryItems[i],
        tempToDoValue.dataCompleted || []
      );
    }
    notesContainer.appendChild(noteItem);
    if (
      noteItem.classList.contains("noteItem") &&
      activeCategoryItems[i].type === "note"
    ) {
      noteItemHandler(noteItem, activeCategoryItems[i]);
    } else if (
      noteItem.classList.contains("toDoItem") &&
      activeCategoryItems[i].type === "toDo"
    ) {
      toDoItemHandler(
        noteItem,
        activeCategoryItems[i],
        tempToDoValue.dataCompleted || []
      );
    }
  }
  syncCategoriesWithNotes();
};

export { savedNoteIdState, reloadNoteList, noteToBeRendered, noteItemHandler };
