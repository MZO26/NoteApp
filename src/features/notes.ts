import { switchOverlayInterface } from "../handlers/modalHandlers.js";
import {
  activeCategoryState,
  defaultCategory,
  savedNoteIdState,
} from "../states/sharedStates.js";
import type { NoteItem, NoteObject } from "../types/noteTypes.js";
import type {
  NoteArray,
  TempNoteValue,
  TempToDoValue,
} from "../types/storageTypes.js";
import { openOverlay } from "../ui-components/renderModalUI.js";
import { createNewNote } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { getNotes, updateNotes } from "../utils/storageService.js";
import { noteItemTemplate, toDoItemTemplate } from "../utils/templates.js";
import { saveTempNote } from "../utils/tempStorageService.js";
import { toDoItemHandler } from "./toDo.js";

const noteToBeRendered = (
  type: string,
  category: string,
  title: string,
  data: Array<string>,
): void => {
  if (type !== "note") return;
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container")!;
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote: NoteObject = createNewNote(type, category, title, data);
  noteItem.setAttribute("data-id", String(newNote.id));
  noteItem.innerHTML = noteItemTemplate(newNote);
  updateNotes((prev) => [...prev, newNote]);
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
};

const noteItemHandler = (noteItem: NoteItem, note: NoteObject): void => {
  const noteItemBtn = noteItem.querySelector<HTMLButtonElement>("button");

  function viewNote(): void {
    localStorage.setItem("modalState", JSON.stringify({ interface: "note" }));
    savedNoteIdState.savedNoteId = Number(noteItem.getAttribute("data-id"))!;
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId),
    );
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = false;
      switchBtn.dispatchEvent(new Event("change"));
    }
    requestAnimationFrame(() => {
      openOverlay();
      switchOverlayInterface();
      const storedTempNoteValue = localStorage.getItem("tempNoteValue");
      const tempNoteValue: TempNoteValue = storedTempNoteValue
        ? JSON.parse(storedTempNoteValue)
        : {
            data: [],
            title: "Untitled",
          };
      const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
      const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
      if (!noteTitle || !noteTextArea) return;
      noteTitle.value = note.title || tempNoteValue.title;
      noteTextArea.value =
        note.data.toString() || tempNoteValue.data.toString() || "";
      saveTempNote();
      isActive(noteItem);
    });
  }
  function deleteNote(event: Event): void {
    event.stopPropagation();
    const id: number = Number(noteItem.getAttribute("data-id"));
    if (!id) return;
    updateNotes((prev) => prev.filter((note) => note.id !== id));
    noteItem.remove();
  }
  noteItemBtn!.removeEventListener("click", deleteNote);
  noteItem.removeEventListener("click", viewNote);
  noteItem.addEventListener("click", viewNote);
  noteItemBtn!.addEventListener("click", deleteNote);
};

const reloadNoteList = (): void => {
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const notesArr: NoteArray = getNotes();
  const activeCategory: string =
    activeCategoryState.activeCategory || defaultCategory;
  const activeCategoryItems: NoteArray = notesArr.filter(
    (items) => items.category == activeCategory,
  );
  notesContainer!.innerHTML = "";
  if (activeCategoryItems.length === 0) {
    noteToBeRendered("note", activeCategory, "First note", [
      "This is your first note!",
    ]);
    return;
  }

  const storedTempToDoValue = localStorage.getItem("tempToDoValue");
  const tempToDoValue: TempToDoValue = storedTempToDoValue
    ? JSON.parse(storedTempToDoValue)
    : { title: "", data: [], dataCompleted: [] };

  for (let i = 0; i < activeCategoryItems.length; i++) {
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
        tempToDoValue.dataCompleted || [],
      );
    }
    notesContainer!.appendChild(noteItem);
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
        tempToDoValue.dataCompleted || [],
      );
    }
  }
};

export { noteItemHandler, noteToBeRendered, reloadNoteList };
