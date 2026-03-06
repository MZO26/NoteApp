import { switchOverlayInterface } from "../handlers/modalHandlers.js";
import { setModalState, setSavedNoteId } from "../states/sharedStates.js";
import type { AddToDoButton, RenderedItem } from "../types/featureTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import { openOverlay, reloadToDoList } from "../ui-components/renderModalUI.js";
import { createNewNote, Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import {
  clearTempToDo,
  getNotes,
  getTempToDo,
  saveNotes,
  updateNotes,
} from "../utils/storageService.js";
import { toDoItemTemplate } from "../utils/templates.js";
import { checkId } from "./notes.js";

const toDoToBeRendered = (
  type: string,
  category: string,
  toDoTitle: string,
  toDoList: Array<string>,
  completedTasks: Array<string>,
): void => {
  if (type !== "toDo") return;
  const notesArr: NoteArray = getNotes();
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const toDoItem = document.createElement("div");
  toDoItem.className = "toDoItem";
  const newToDo: Note = createNewNote(
    type,
    category,
    toDoTitle,
    toDoList,
    completedTasks,
  );
  toDoItem.setAttribute("data-id", String(newToDo.id));
  toDoItem.innerHTML = toDoItemTemplate(newToDo, completedTasks);
  notesArr.push(newToDo);
  saveNotes(notesArr);
  notesContainer.appendChild(toDoItem);
  toDoItemHandler(toDoItem, newToDo);
};

const toDoItemHandler = (toDoItem: RenderedItem, newToDo: Note): void => {
  const toDoItemBtn = toDoItem.querySelector<HTMLButtonElement>("button");

  async function viewToDo() {
    setModalState("toDo");
    const parsedId = checkId(toDoItem);
    setSavedNoteId(parsedId);
    console.log("toDoId: ", parsedId);
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = true;
    }
    openOverlay(parsedId);
    await switchOverlayInterface();
    const notesContainer =
      document.querySelector<HTMLDivElement>(".notes-container");
    const toDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const taskList = document.querySelector<HTMLUListElement>(".task-list");
    const tempToDoValue = getTempToDo();
    if (!notesContainer || !toDoTitle || !taskList) return;
    const savedNoteId = parsedId;
    if (tempToDoValue && tempToDoValue.id === savedNoteId) {
      toDoTitle.value = tempToDoValue.title || "";
      reloadToDoList(
        taskList,
        { data: tempToDoValue.data },
        tempToDoValue.dataCompleted,
      );
    } else {
      toDoTitle.value = newToDo.title;
      reloadToDoList(
        taskList,
        { data: newToDo.data },
        newToDo.dataCompleted || [],
      );
    }
    const taskCheckboxes =
      taskList.querySelectorAll<HTMLInputElement>(".task-checkbox");
    for (const checkbox of taskCheckboxes) {
      const element = checkbox as HTMLInputElement;
      const listContainer = element.closest("li");
      const span = listContainer?.querySelector<HTMLSpanElement>("span");
      const hasTaskCompletedClass = span?.classList.contains("task-completed");

      if (!element.checked && hasTaskCompletedClass) {
        element.checked = true;
      }
    }
    isActive(toDoItem, notesContainer);
  }

  function deleteToDo(event: Event): void {
    event.stopPropagation();
    const parsedId = checkId(toDoItem);
    console.log("todo id: ", parsedId);
    if (parsedId === null) return;
    updateNotes((prev) => prev.filter((note) => note.id !== parsedId));
    const container = document.querySelector<HTMLDivElement>(".todo-container");
    if (container) {
      const addBtn: AddToDoButton | null =
        container.querySelector<HTMLButtonElement>(".todo-btn");
      if (addBtn && addBtn._addHandlerRef) {
        addBtn.removeEventListener("click", addBtn._addHandlerRef);
        delete addBtn._addHandlerRef;
      }
    }
    toDoItemBtn?.removeEventListener("click", deleteToDo);
    toDoItem.removeEventListener("click", viewToDo);
    toDoItem.remove();
    clearTempToDo();
  }
  toDoItemBtn?.addEventListener("click", deleteToDo);
  toDoItem.addEventListener("click", viewToDo);
};

export { toDoItemHandler, toDoToBeRendered };
