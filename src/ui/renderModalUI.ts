import { getToDoInterfaceElements } from "../features/todoItems/todoUtils.js";
import { autoSaveTempNote, autoSaveTempToDo } from "../utils/autoSave.js";
import { getValue, StorageKeys } from "../utils/storageService.js";
import { addToDo, reloadToDoList } from "./renderTodoList.js";

const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const openOverlay = (savedItemId: number | null): void => {
  overlay?.classList.add("show");
  modal?.classList.add("show");
  const notes: HTMLCollection | undefined =
    document.querySelector<HTMLDivElement>(".item-container")?.children;
  if (
    savedItemId &&
    switchBtnVisibility &&
    !switchBtnVisibility.classList.contains("hidden")
  ) {
    switchBtnVisibility.classList.add("hidden");
  }
  if (notes) {
    Array.from(notes).forEach((element) => {
      if (element.classList.contains("active"))
        element.classList.remove("active");
    });
  }
};

const renderNoteUI = (): void => {
  let noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
  let noteContent = document.querySelector<HTMLTextAreaElement>(".note");

  if (!noteTitle || !noteContent) {
    const currentToDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const currentToDo =
      document.querySelector<HTMLTextAreaElement>(".todo-container");
    if (!currentToDoTitle || !currentToDo) return;
    const titleElement = document.createElement("textarea");
    const noteElement = document.createElement("textarea");
    titleElement.className = "title";
    titleElement.name = "title-textarea";
    noteElement.className = "note";
    noteElement.name = "note-textarea";
    currentToDoTitle.replaceWith(titleElement);
    currentToDo.replaceWith(noteElement);
    noteTitle = titleElement;
    noteContent = noteElement;
  }
  const tempNoteValue = getValue(StorageKeys.TEMP_NOTE);
  if (tempNoteValue) {
    noteTitle.value = tempNoteValue.title;
    noteContent.value = tempNoteValue.data[0] || "";
  } else {
    noteTitle.value = "";
    noteContent.value = "";
  }

  noteTitle.removeEventListener("input", autoSaveTempNote);
  noteContent.removeEventListener("input", autoSaveTempNote);

  noteTitle.addEventListener("input", autoSaveTempNote);
  noteContent.addEventListener("input", autoSaveTempNote);
};

const renderToDoUI = () => {
  const currentTitle = document.querySelector<HTMLTextAreaElement>(".title");
  const currentNote = document.querySelector<HTMLTextAreaElement>(".note");
  const { todoDiv, addBtn, taskList, input, title } =
    getToDoInterfaceElements();
  if (currentTitle && currentNote) {
    currentTitle.replaceWith(title);
    currentNote.replaceWith(todoDiv);
  } else {
    const currentToDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const currentToDo =
      document.querySelector<HTMLTextAreaElement>(".todo-container");
    if (currentToDoTitle && currentToDo) {
      currentToDoTitle.replaceWith(title);
      currentToDo.replaceWith(todoDiv);
    }
  }
  const tempToDoValue = getValue(StorageKeys.TEMP_TODO);
  if (tempToDoValue) {
    title.value = tempToDoValue.title;
    reloadToDoList(taskList, tempToDoValue.data);
  } else {
    title.value = "";
    taskList.innerHTML = "";
    input.value = "";
  }

  addBtn.addEventListener("click", () => {
    addToDo(taskList, input, title);
  });

  title.removeEventListener("input", autoSaveTempToDo);
  title.addEventListener("input", autoSaveTempToDo);
};

const renderUI = (modalState: string): void => {
  if (modalState === "note") {
    renderNoteUI();
  } else if (modalState === "toDo") {
    renderToDoUI();
  }
};

export { openOverlay, renderUI };
