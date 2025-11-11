import type { NoteItem, NoteObject } from "../types/noteTypes.js";
import type {
  ActiveCategoryState,
  SavedNoteIdState,
} from "../types/stateTypes.js";
import type {
  NoteArray,
  TempNoteValue,
  TempToDoValue,
} from "../types/storageTypes.js";
import { openOverlay } from "../ui-components/renderModalUI.js";
import { createNewNote } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { saveTempNote, syncCategoriesWithNotes } from "../utils/storage.js";
import { noteItemTemplate, toDoItemTemplate } from "../utils/templates.js";
import { defaultCategory } from "./categories.js";
import { toDoItemHandler } from "./toDo.js";

let savedNoteIdState: SavedNoteIdState = { savedNoteId: null };

const noteToBeRendered = (
  type: string,
  category: string,
  title: string,
  data: Array<string>
): void => {
  if (type !== "note") return;
  const notesArr: NoteArray = JSON.parse(
    localStorage.getItem("notesArr") || "[]"
  );
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container")!;
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote: NoteObject = createNewNote(type, category, title, data);
  noteItem.setAttribute("data-id", String(newNote.id));
  noteItem.innerHTML = noteItemTemplate(newNote);
  notesArr.push(newNote);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
  syncCategoriesWithNotes();
};

const noteItemHandler = (noteItem: NoteItem, note: NoteObject) => {
  const noteItemBtn = noteItem.querySelector<HTMLButtonElement>("button");

  function viewNote(): void {
    localStorage.setItem("modal-state", JSON.stringify({ interface: "note" }));
    savedNoteIdState.savedNoteId = noteItem.getAttribute("data-id")!;
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId)
    );
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = false;
      switchBtn.dispatchEvent(new Event("change"));
    }
    requestAnimationFrame(() => {
      openOverlay();
      const storedTempNoteValue = localStorage.getItem("tempNoteValue");
      const tempNoteValue: TempNoteValue = storedTempNoteValue
        ? JSON.parse(storedTempNoteValue)
        : {
            data: [],
            title: "Untitled",
          };
      const notesContainer =
        document.querySelector<HTMLDivElement>(".notes-container")!;
      const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
      const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
      if (!noteTitle || !noteTextArea) return;
      noteTitle.value = note.title || tempNoteValue.title;
      noteTextArea.value =
        note.data.toString() || tempNoteValue.data.toString() || "";
      saveTempNote();
      isActive(noteItem, notesContainer);
      noteTitle.addEventListener("input", saveTempNote);
      noteTextArea.addEventListener("input", saveTempNote);
    });
  }
  function deleteNote(event: Event) {
    event.stopPropagation();
    const notesArr: NoteArray = JSON.parse(
      localStorage.getItem("notesArr") || "[]"
    );
    const id: number = Number(noteItem.getAttribute("data-id"))!;
    const index = notesArr.findIndex((note) => note.id === id);
    if (index > -1) {
      notesArr.splice(index, 1);
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
    }
    noteItemBtn!.removeEventListener("click", deleteNote);
    noteItem.removeEventListener("click", viewNote);
    noteItem.remove();
    syncCategoriesWithNotes();
  }
  noteItem.addEventListener("click", viewNote);
  noteItemBtn!.addEventListener("click", deleteNote);
};

const reloadNoteList = (args?: []) => {
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container")!;
  const notesArr: NoteArray | [] = args
    ? args
    : JSON.parse(localStorage.getItem("notesArr") || "[]");
  const storedState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedState
    ? JSON.parse(storedState)
    : { activeCategory: defaultCategory };
  const activeCategoryItems: Array<NoteObject> = notesArr.filter(
    (items) => items.category == activeCategoryState.activeCategory
  );
  notesContainer.innerHTML = "";
  if (notesArr.length === 0 || activeCategoryItems.length === 0) {
    noteToBeRendered("note", activeCategoryState.activeCategory, "First note", [
      "Welcome to my notes app!",
    ]);
    return;
  }
  if (!activeCategoryItems.length) return;
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const storedTempToDoValue = localStorage.getItem("tempToDoValue");
    const tempToDoValue: TempToDoValue = storedTempToDoValue
      ? JSON.parse(storedTempToDoValue)
      : { title: "", data: [], dataCompleted: [] };
    const noteItem = document.createElement("div");
    noteItem.setAttribute("data-id", String(activeCategoryItems[i]!.id));
    noteItem.className = `${activeCategoryItems[i]!.type}Item`;
    if (
      noteItem.classList.contains("noteItem") &&
      activeCategoryItems[i]!.type === "note"
    ) {
      noteItem.innerHTML = noteItemTemplate(activeCategoryItems[i]!);
    } else if (
      noteItem.classList.contains("toDoItem") &&
      activeCategoryItems[i]!.type === "toDo"
    ) {
      noteItem.innerHTML = toDoItemTemplate(
        activeCategoryItems[i]!,
        tempToDoValue.dataCompleted || []
      );
    }
    notesContainer.appendChild(noteItem);
    if (
      noteItem.classList.contains("noteItem") &&
      activeCategoryItems[i]!.type === "note"
    ) {
      noteItemHandler(noteItem, activeCategoryItems[i]!);
    } else if (
      noteItem.classList.contains("toDoItem") &&
      activeCategoryItems[i]!.type === "toDo"
    ) {
      toDoItemHandler(
        noteItem,
        activeCategoryItems[i]!,
        tempToDoValue.dataCompleted || []
      );
    }
  }
  syncCategoriesWithNotes();
};

export { noteItemHandler, noteToBeRendered, reloadNoteList, savedNoteIdState };
