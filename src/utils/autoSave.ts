import { saveTempNote, saveTempToDo } from "./storageService.js";

let noteTimeout: ReturnType<typeof setTimeout>;
let toDoTimeout: ReturnType<typeof setTimeout>;

const autoSaveTempNote = (): void => {
  clearTimeout(noteTimeout);
  noteTimeout = setTimeout(() => {
    const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
    const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
    if (!noteTitle || !noteTextArea) return;
    saveTempNote({
      title: noteTitle.value,
      data: noteTextArea.value ? [noteTextArea.value] : [],
    });
  }, 1000);
};

const autoSaveTempToDo = (): void => {
  clearTimeout(toDoTimeout);

  toDoTimeout = setTimeout(() => {
    const toDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const taskList = document.querySelector<HTMLDivElement>(".task-list");
    if (!toDoTitle || !taskList) return;

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
      title: titleValue,
      data: toDoData,
      dataCompleted: completedTasks,
    });
  }, 1000);
};

export { autoSaveTempNote, autoSaveTempToDo };
