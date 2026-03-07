import { getSavedNoteId } from "../states/sharedStates.js";
import { setValue, StorageKeys } from "./storageService.js";

let noteTimeout: ReturnType<typeof setTimeout> | undefined;
let toDoTimeout: ReturnType<typeof setTimeout> | undefined;

const cancelAutoSave = (): void => {
  if (noteTimeout) {
    clearTimeout(noteTimeout);
    noteTimeout = undefined;
  } else if (toDoTimeout) {
    clearTimeout(toDoTimeout);
    toDoTimeout = undefined;
  }
};

const autoSaveTempNote = (): void => {
  clearTimeout(noteTimeout);
  noteTimeout = setTimeout(() => {
    const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
    const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
    const savedNoteId = getSavedNoteId();
    console.log("autosaved for id: ", savedNoteId);
    if (!noteTitle || !noteTextArea || savedNoteId === null) return;
    setValue(
      StorageKeys.TEMP_NOTE,
      {
        id: savedNoteId,
        title: noteTitle.value,
        data: noteTextArea.value ? [noteTextArea.value] : [],
      },
      0,
    );
  }, 500);
};

const autoSaveTempToDo = (): void => {
  clearTimeout(toDoTimeout);
  toDoTimeout = setTimeout(() => {
    const toDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const taskList = document.querySelector<HTMLDivElement>(".task-list");
    const savedNoteId = getSavedNoteId();
    console.log("autosaved for id: ", savedNoteId);
    if (!toDoTitle || !taskList || savedNoteId === null) return;
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
    setValue(
      StorageKeys.TEMP_TODO,
      {
        id: savedNoteId,
        title: titleValue,
        data: toDoData,
        dataCompleted: completedTasks,
      },
      0,
    );
  }, 500);
};

export { autoSaveTempNote, autoSaveTempToDo, cancelAutoSave };
