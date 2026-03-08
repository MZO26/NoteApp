import { getSavedItemId } from "../states/sharedStates.js";
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
    const savedItemId = getSavedItemId();
    console.log("autosaved for id: ", savedItemId);
    if (!noteTitle || !noteTextArea || savedItemId === null) return;
    setValue(
      StorageKeys.TEMP_NOTE,
      {
        id: savedItemId,
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
    const savedItemId = getSavedItemId();
    console.log("autosaved for id: ", savedItemId);
    if (!toDoTitle || !taskList || savedItemId === null) return;
    const spans = Array.from(
      taskList.querySelectorAll<HTMLSpanElement>(".task-list li span"),
    );
    const data = spans.map((span) => {
      return {
        content: span.textContent || "",
        completed: span.classList.contains("task-completed"),
      };
    });
    setValue(
      StorageKeys.TEMP_TODO,
      {
        id: savedItemId,
        title: toDoTitle.value,
        data,
      },
      0,
    );
  }, 500);
};

export { autoSaveTempNote, autoSaveTempToDo, cancelAutoSave };
