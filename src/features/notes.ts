import { switchOverlayInterface } from "../handlers/modalHandlers.js";
import { savedNoteIdState } from "../states/sharedStates.js";
import type { NoteItem } from "../types/featureTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import { openOverlay } from "../ui-components/renderModalUI.js";
import { createNewNote, Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import {
  clearTempNote,
  getNotes,
  getTempNote,
  saveNotes,
  updateNotes,
} from "../utils/storageService.js";
import { noteItemTemplate, toDoItemTemplate } from "../utils/templates.js";
import { toDoItemHandler } from "./toDo.js";

const noteToBeRendered = (
  type: string,
  category: string,
  title: string,
  data: Array<string>,
  dataCompleted?: Array<string>,
): void => {
  if (type !== "note") return;
  const notesArr: NoteArray = getNotes();
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container")!;
  const noteItem = document.createElement("div");
  noteItem.className = "noteItem";
  const newNote: Note = createNewNote(
    type,
    category,
    title,
    data,
    dataCompleted,
  );
  noteItem.setAttribute("data-id", String(newNote.id));
  noteItem.innerHTML = noteItemTemplate(newNote);
  notesArr.push(newNote);
  saveNotes(notesArr);
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
};

const noteItemHandler = (noteItem: NoteItem, note: Note): void => {
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
    });
    setTimeout(() => {
      const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
      const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
      if (!noteTitle || !noteTextArea) return;
      const tempNoteValue = getTempNote();
      const savedNoteId = Number(sessionStorage.getItem("savedNoteId"));
      if (tempNoteValue && savedNoteId) {
        noteTitle.value = tempNoteValue.title;
        noteTextArea.value = tempNoteValue.data.toString();
      } else {
        noteTitle.value = note.title;
        noteTextArea.value = note.data.toString();
      }
      isActive(noteItem);
    }, 100);
  }
  function deleteNote(event: Event): void {
    event.stopPropagation();
    const id: number = Number(noteItem.getAttribute("data-id"));
    if (!id) return;
    updateNotes((prev) => prev.filter((note) => note.id !== id));
    clearTempNote();
    noteItem.remove();
  }
  noteItemBtn?.removeEventListener("click", deleteNote);
  noteItem.removeEventListener("click", viewNote);
  noteItem.addEventListener("click", viewNote);
  noteItemBtn?.addEventListener("click", deleteNote);
};

const reloadNoteList = (): void => {
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const notesArr: NoteArray = getNotes();
  console.log("notesArr in reloadNoteList:", notesArr);
  const activeCategory: string = JSON.parse(
    localStorage.getItem("activeCategoryState") ||
      '{"activeCategory": "defaultCategory"}',
  ).activeCategory;
  const activeCategoryItems: NoteArray = notesArr.filter(
    (items) => items.category === activeCategory,
  );
  notesContainer.innerHTML = "";
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const items = activeCategoryItems[i];
    if (!items) continue;
    const noteItem = document.createElement("div");
    noteItem.setAttribute("data-id", String(items.id));
    noteItem.className = `${items.type}Item`;
    if (items.type === "note") {
      noteItem.innerHTML = noteItemTemplate(items);
      noteItemHandler(noteItem, items);
    } else if (items.type === "toDo") {
      noteItem.innerHTML = toDoItemTemplate(items, items.dataCompleted || []);
      toDoItemHandler(noteItem, items);
    }
    notesContainer.appendChild(noteItem);
  }
};

export { noteItemHandler, noteToBeRendered, reloadNoteList };
