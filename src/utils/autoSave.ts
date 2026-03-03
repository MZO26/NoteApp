import { isInitializing } from "../ui-components/renderModalUI.js";
import { saveTempNote, saveTempToDo } from "./storageService.js";

let noteTimeout: ReturnType<typeof setTimeout>;
let toDoTimeout: ReturnType<typeof setTimeout>;

const autoSaveTempNote = (): void => {
  if (isInitializing) return;
  clearTimeout(noteTimeout);
  noteTimeout = setTimeout(() => {
    const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
    const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
    if (!noteTitle || !noteTextArea) return;
    const savedNoteId = Number(sessionStorage.getItem("savedNoteId"));
    saveTempNote({
      id: savedNoteId,
      title: noteTitle.value,
      data: noteTextArea.value ? [noteTextArea.value] : [],
    });
  }, 500);
  console.log("autosaved");
};

const autoSaveTempToDo = (): void => {
  if (isInitializing) return;
  clearTimeout(toDoTimeout);
  toDoTimeout = setTimeout(() => {
    const toDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const taskList = document.querySelector<HTMLDivElement>(".task-list");
    if (!toDoTitle || !taskList) return;
    const savedNoteId = Number(sessionStorage.getItem("savedNoteId"));
    const toDoList = taskList.querySelectorAll<HTMLSpanElement>("li span");
    const titleValue = toDoTitle.value || "";
    const toDoData: string[] = [];
    const completedTasks: string[] = [];
    for (const span of toDoList) {
      if (!span.textContent) continue;
      if (span.classList.contains("task-completed")) {
        completedTasks.push(span.textContent);
      }
      toDoData.push(span.textContent);
    }
    saveTempToDo({
      id: savedNoteId,
      title: titleValue,
      data: toDoData,
      dataCompleted: completedTasks,
    });
    console.log("autosaved", toDoData);
  }, 500);
};

export { autoSaveTempNote, autoSaveTempToDo };
