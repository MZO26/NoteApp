import { switchOverlayInterface } from "../handlers/modalHandlers.js";
import {
  clearSavedNoteId,
  getActiveCategory,
  setModalState,
  setSavedNoteId,
} from "../states/sharedStates.js";
import type { RenderedItem } from "../types/featureTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import { openOverlay } from "../ui-components/renderModalUI.js";
import { createNewNote, Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import {
  getValue,
  removeValue,
  setValue,
  StorageKeys,
  updateNotes,
} from "../utils/storageService.js";
import { noteItemTemplate, toDoItemTemplate } from "../utils/templates.js";
import { toDoItemHandler } from "./toDo.js";

const checkId = (item: RenderedItem): number | null => {
  const rawId = item.getAttribute("data-id");
  if (!rawId) return null;
  const parsedId = parseFloat(rawId);
  if (Number.isNaN(parsedId)) return null;
  return parsedId;
};

const noteToBeRendered = (
  type: string,
  category: string,
  title: string,
  data: Array<string>,
  dataCompleted?: Array<string>,
): void => {
  if (type !== "note") return;
  const notesArr: NoteArray = getValue(StorageKeys.NOTES);
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
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
  setValue(StorageKeys.NOTES, notesArr);
  notesContainer.appendChild(noteItem);
  noteItemHandler(noteItem, newNote);
};

const noteItemHandler = (noteItem: RenderedItem, note: Note): void => {
  const noteItemBtn = noteItem.querySelector<HTMLButtonElement>("button");

  async function viewNote() {
    setModalState("note");
    const parsedId = checkId(noteItem);
    setSavedNoteId(parsedId);
    console.log("noteId: ", parsedId);
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = false;
      switchBtn.dispatchEvent(new Event("change"));
    }
    openOverlay(parsedId);
    await switchOverlayInterface();
    const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
    const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
    if (!noteTitle || !noteTextArea) return;
    const tempNoteValue = getValue(StorageKeys.TEMP_NOTE);
    const savedNoteId = parsedId;
    if (tempNoteValue && savedNoteId) {
      noteTitle.value = tempNoteValue.title;
      noteTextArea.value = tempNoteValue.data.toString();
    } else {
      noteTitle.value = note.title;
      noteTextArea.value = note.data.toString();
    }
    isActive(noteItem);
  }

  function deleteNote(event: Event): void {
    event.stopPropagation();
    const parsedId = checkId(noteItem);
    if (parsedId === null) return;
    updateNotes((prev) => prev.filter((note) => note.id !== parsedId));
    clearSavedNoteId();
    removeValue(StorageKeys.TEMP_NOTE);
    noteItem.remove();
  }
  noteItemBtn?.removeEventListener("click", deleteNote);
  noteItem.removeEventListener("click", viewNote);
  noteItem.addEventListener("click", viewNote);
  noteItemBtn?.addEventListener("click", deleteNote);
};

const createNoteItem = (note: Note) => {
  const noteItem = document.createElement("div");
  noteItem.setAttribute("data-id", String(note.id));
  noteItem.className = `${note.type}Item`;
  if (note.type === "note") {
    noteItem.innerHTML = noteItemTemplate(note);
    noteItemHandler(noteItem, note);
  } else if (note.type === "toDo") {
    noteItem.innerHTML = toDoItemTemplate(note, note.dataCompleted || []);
    toDoItemHandler(noteItem, note);
  }
  return noteItem;
};

const reloadNoteList = (updatedArray?: NoteArray): void => {
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const notesArr: NoteArray = updatedArray || getValue(StorageKeys.NOTES);
  const activeCategory = getActiveCategory();
  const activeCategoryItems: NoteArray = notesArr.filter(
    (notes) => notes.category === activeCategory,
  );
  notesContainer.innerHTML = "";
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const note = activeCategoryItems[i];
    if (!note) continue;
    const noteItem = createNoteItem(note);
    notesContainer.appendChild(noteItem);
  }
};

export { checkId, noteItemHandler, noteToBeRendered, reloadNoteList };
