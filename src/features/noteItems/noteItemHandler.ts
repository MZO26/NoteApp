import { switchOverlayInterface } from "../../handlers/modalHandlers.js";
import {
  clearSavedItemId,
  setModalState,
  setSavedItemId,
} from "../../states/sharedStates.js";
import type { RenderedItem } from "../../types/featureTypes.js";
import { openOverlay } from "../../ui/renderModalUI.js";
import { type Note } from "../../utils/classes.js";
import { isActive } from "../../utils/events.js";
import { checkId } from "../../utils/helpers.js";
import {
  getValue,
  removeValue,
  StorageKeys,
  updateStorage,
} from "../../utils/storageService.js";

function noteItemHandler(noteItem: RenderedItem, note: Note): void {
  const noteItemBtn = noteItem.querySelector<HTMLButtonElement>("button");

  async function viewNote() {
    setModalState("note");
    const parsedId = checkId(noteItem);
    setSavedItemId(parsedId);
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
    const itemContainer =
      document.querySelector<HTMLDivElement>(".item-container");
    if (!itemContainer || !noteTitle || !noteTextArea) return;
    const tempNoteValue = getValue(StorageKeys.TEMP_NOTE);
    const savedItemId = parsedId;
    if (tempNoteValue && savedItemId) {
      noteTitle.value = tempNoteValue.title;
      noteTextArea.value = tempNoteValue.data.toString();
    } else {
      noteTitle.value = note.title;
      noteTextArea.value = note.data.toString();
    }
    isActive(noteItem, itemContainer);
  }

  function deleteNote(event: Event): void {
    event.stopPropagation();
    const parsedId = checkId(noteItem);
    if (parsedId === null) return;
    updateStorage(StorageKeys.ITEMS, (currentItems) =>
      currentItems.filter((item) => item.id !== parsedId),
    );
    clearSavedItemId();
    removeValue(StorageKeys.TEMP_NOTE);
    noteItem.remove();
  }
  noteItemBtn?.removeEventListener("click", deleteNote);
  noteItem.removeEventListener("click", viewNote);
  noteItem.addEventListener("click", viewNote);
  noteItemBtn?.addEventListener("click", deleteNote);
}

export { noteItemHandler };
