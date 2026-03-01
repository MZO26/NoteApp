import { switchOverlayInterface } from "../handlers/modalHandlers.js";
import { savedNoteIdState } from "../states/sharedStates.js";
import type { NoteArray, TempToDoValue } from "../types/storageTypes.js";
import type { AddToDoButton } from "../types/toDoTypes.js";
import {
  addToDo,
  openOverlay,
  reloadToDoList,
} from "../ui-components/renderModalUI.js";
import { createNewNote, type Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { getNotes, saveNotes, updateNotes } from "../utils/storageService.js";
import { saveTempToDo } from "../utils/tempStorageService.js";
import { toDoItemTemplate } from "../utils/templates.js";

const toDoToBeRendered = (
  type: string,
  category: string,
  toDoTitle: string,
  toDoList: Array<string>,
  completedTasks: Array<string>,
): void => {
  if (type !== "toDo") return;
  const notesArr: NoteArray = getNotes();
  const storedTempToDoValue = localStorage.getItem("tempToDoValue");
  const tempToDoValue: TempToDoValue = storedTempToDoValue
    ? JSON.parse(storedTempToDoValue)
    : { title: "", toDoData: [], dataCompleted: [] };
  completedTasks ? completedTasks : tempToDoValue.dataCompleted;
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container")!;
  const toDoItem = document.createElement("div");
  toDoItem.className = "toDoItem";
  const newToDo: Note = createNewNote(type, category, toDoTitle, toDoList);
  toDoItem.setAttribute("data-id", String(newToDo.id));
  toDoItem.innerHTML = toDoItemTemplate(newToDo, completedTasks);
  notesArr.push(newToDo);
  saveNotes(notesArr);
  saveTempToDo();
  notesContainer.appendChild(toDoItem);
  toDoItemHandler(toDoItem, newToDo, completedTasks);
};

const toDoItemHandler = (
  toDoItem: HTMLDivElement,
  newToDo: Note,
  completedTasks: Array<string>,
): void => {
  const toDoItemBtn = toDoItem.querySelector<HTMLButtonElement>("button");
  function viewToDo() {
    localStorage.setItem("modalState", JSON.stringify({ interface: "toDo" }));
    savedNoteIdState.savedNoteId = Number(toDoItem.getAttribute("data-id"))!;
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId),
    );
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");

    if (switchBtn) {
      switchBtn.checked = true;
      switchBtn.dispatchEvent(new Event("change"));
    }
    requestAnimationFrame(() => {
      openOverlay();
      switchOverlayInterface();
      const storedTempToDoValue = localStorage.getItem("tempToDoValue");
      const tempToDoValue: TempToDoValue = storedTempToDoValue
        ? JSON.parse(storedTempToDoValue)
        : { title: "", toDoData: [], dataCompleted: [] };
      const notesContainer =
        document.querySelector<HTMLDivElement>(".notes-container")!;
      const toDoTitle =
        document.querySelector<HTMLTextAreaElement>(".todo-title");
      if (toDoTitle) {
        toDoTitle.value = newToDo.title || tempToDoValue.title;
      }
      localStorage.setItem(
        "tempToDoValue",
        JSON.stringify({
          title: newToDo.title || tempToDoValue.title,
          data: newToDo.data || tempToDoValue.data,
          dataCompleted: completedTasks || tempToDoValue.dataCompleted,
        }),
      );
      reloadToDoList({ data: newToDo.data }, completedTasks);
      saveTempToDo();
      isActive(toDoItem, notesContainer);
      const container =
        document.querySelector<HTMLDivElement>(".todo-container")!;
      const addBtn: AddToDoButton =
        container.querySelector<HTMLButtonElement>(".todo-btn")!;
      const taskList = container.querySelector<HTMLUListElement>(".task-list")!;
      const input = container.querySelector<HTMLInputElement>(".todo-input")!;
      const taskCheckboxes: NodeList =
        document.querySelectorAll<HTMLInputElement>(".task-checkbox");
      for (const checkbox of taskCheckboxes) {
        const element = checkbox as HTMLInputElement;
        const listContainer = element.closest("li");
        const span = listContainer?.querySelector<HTMLSpanElement>("span");
        const hasTaskCompletedClass =
          span?.classList.contains("task-completed");
        if (!element.checked && hasTaskCompletedClass) {
          element.checked = true;
        }
      }
      if (addBtn) {
        if (addBtn._addHandlerRef) {
          addBtn.removeEventListener("click", addBtn._addHandlerRef);
        }
        const addHandler = () => addToDo(taskList, input);
        addBtn._addHandlerRef = addHandler;
        addBtn.addEventListener("click", addHandler);
      }
    });
  }

  function deleteToDo(event: Event): void {
    event.stopPropagation();
    const id: number = Number(toDoItem.getAttribute("data-id"));
    updateNotes((prev) => prev.filter((note) => note.id !== id));
    const container = document.querySelector<HTMLDivElement>(".todo-container");
    if (container) {
      const addBtn: AddToDoButton =
        container?.querySelector<HTMLButtonElement>(".todo-btn")!;
      if (addBtn && addBtn._addHandlerRef) {
        addBtn.removeEventListener("click", addBtn._addHandlerRef);
        delete addBtn._addHandlerRef;
      }
    }
    toDoItemBtn?.removeEventListener("click", deleteToDo);
    toDoItem.removeEventListener("click", viewToDo);
    toDoItem.remove();
  }
  toDoItemBtn?.addEventListener("click", deleteToDo);
  toDoItem.addEventListener("click", viewToDo);
};

export { toDoItemHandler, toDoToBeRendered };
