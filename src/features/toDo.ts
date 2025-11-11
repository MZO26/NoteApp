import type { NoteArray, TempToDoValue } from "../types/storageTypes.js";
import type { AddToDoButton } from "../types/toDoTypes.js";
import {
  addToDo,
  openOverlay,
  reloadToDoList,
} from "../ui-components/renderModalUI.js";
import { createNewNote, type Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { saveTempToDo, syncCategoriesWithNotes } from "../utils/storage.js";
import { toDoItemTemplate } from "../utils/templates.js";
import { savedNoteIdState } from "./notes.js";

const toDoToBeRendered = (
  type: string,
  category: string,
  toDoTitle: string,
  toDoList: Array<string>,
  completedTasks: Array<string>
): void => {
  if (type !== "toDo") return;
  const notesArr: NoteArray = JSON.parse(
    localStorage.getItem("notesArr") || "[]"
  );
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
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  saveTempToDo();
  notesContainer.appendChild(toDoItem);
  toDoItemHandler(toDoItem, newToDo, completedTasks);
  syncCategoriesWithNotes();
};

const toDoItemHandler = (
  toDoItem: HTMLDivElement,
  newToDo: Note,
  completedTasks: Array<string>
): void => {
  const toDoItemBtn = toDoItem.querySelector("button");
  function viewToDo() {
    localStorage.setItem("modal-state", JSON.stringify({ interface: "toDo" }));
    savedNoteIdState.savedNoteId = toDoItem.getAttribute("data-id")!;
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId)
    );
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");

    if (switchBtn) {
      switchBtn.checked = true;
      switchBtn.dispatchEvent(new Event("change"));
    }
    requestAnimationFrame(() => {
      openOverlay();
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
      } else {
        localStorage.setItem(
          "tempToDoValue",
          JSON.stringify({
            title: newToDo.title || tempToDoValue.title,
            data: newToDo.data || tempToDoValue.data,
            dataCompleted: completedTasks || tempToDoValue.dataCompleted,
          })
        );
      }
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
      if (toDoTitle) toDoTitle.addEventListener("input", saveTempToDo);
      if (input) input.addEventListener("input", saveTempToDo);
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

  function deleteToDo(event: Event) {
    event.stopPropagation();
    const notesArr: NoteArray = JSON.parse(
      localStorage.getItem("notesArr") || "[]"
    );
    const id: number = Number(toDoItem.getAttribute("data-id"));
    const index = notesArr.findIndex((note) => note.id == id);
    if (index > -1) {
      notesArr.splice(index, 1);
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
    }
    const container = document.querySelector<HTMLDivElement>(".todo-container");
    if (!container) return;
    const addBtn: AddToDoButton =
      container?.querySelector<HTMLButtonElement>(".todo-btn")!;
    if (addBtn && addBtn._addHandlerRef) {
      addBtn.removeEventListener("click", addBtn._addHandlerRef);
      delete addBtn._addHandlerRef;
    }
    toDoItemBtn?.removeEventListener("click", deleteToDo);
    toDoItem.removeEventListener("click", viewToDo);
    toDoItem.remove();
    syncCategoriesWithNotes();
  }
  toDoItemBtn?.addEventListener("click", deleteToDo);
  toDoItem.addEventListener("click", viewToDo);
};

export { toDoItemHandler, toDoToBeRendered };
