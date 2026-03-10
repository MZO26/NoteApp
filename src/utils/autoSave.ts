import { getSavedItemId } from "../states/sharedStates.js";
import { getElement } from "./helpers.js";
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
    const noteTitle = getElement<HTMLTextAreaElement>(".title");
    const noteTextArea = getElement<HTMLTextAreaElement>(".note");
    const savedItemId = getSavedItemId();
    if (savedItemId === null) return;
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
    const toDoTitle = getElement<HTMLTextAreaElement>(".todo-title");
    const taskList = getElement<HTMLDivElement>(".task-list");
    const savedItemId = getSavedItemId();
    if (savedItemId === null) return;
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
