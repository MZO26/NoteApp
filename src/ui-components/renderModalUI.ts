import { autoSaveTempNote, autoSaveTempToDo } from "../utils/autoSave.js";
import { Note } from "../utils/classes.js";
import { getValue, StorageKeys } from "../utils/storageService.js";
import {
  createTaskItem,
  getToDoInterfaceElements,
} from "../utils/templates.js";

const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const openOverlay = (savedNoteId: number | null): void => {
  overlay?.classList.add("show");
  modal?.classList.add("show");
  const notes: HTMLCollection | undefined =
    document.querySelector<HTMLDivElement>(".notes-container")?.children;
  if (
    savedNoteId &&
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

const addToDo = (
  taskList: HTMLUListElement,
  input: HTMLInputElement,
  title: HTMLTextAreaElement,
): void => {
  if (!input || !input.value) return;
  const taskText = input.value.trim();
  if (!taskText) return;
  const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(taskText);
  taskList.appendChild(li);
  input.value = "";
  title.removeEventListener("input", autoSaveTempToDo);
  input.removeEventListener("input", autoSaveTempToDo);

  title.addEventListener("input", autoSaveTempToDo);
  const addBtn = document.querySelector<HTMLButtonElement>(".todo-btn");
  addBtn?.addEventListener("input", autoSaveTempToDo);
  addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
};

const reloadToDoList = (
  taskList: HTMLUListElement,
  toDoData: Pick<Note, "data">,
  completedTasks: Array<string>,
): void => {
  if (!taskList) return;
  taskList.innerHTML = "";
  if (toDoData.data) {
    for (let i = 0; i < toDoData.data.length; i++) {
      const taskText: string | undefined = toDoData.data[i];
      if (!taskText) continue;
      const { li, checkbox, taskSpan, taskDeleteBtn } =
        createTaskItem(taskText);
      if (completedTasks && completedTasks.includes(taskText)) {
        taskSpan.classList.add("task-completed");
        checkbox.checked = true;
      }
      taskList.appendChild(li);
      addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
    }
  }
};

const addEventListeners = (
  li: HTMLLIElement,
  checkbox: HTMLInputElement,
  taskSpan: HTMLSpanElement,
  taskDeleteBtn: HTMLButtonElement,
) => {
  const onChange = () => {
    taskSpan.classList.toggle("task-completed", checkbox.checked);
  };
  const onSpanClick = () => {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  };
  const onButtonClick = () => {
    li.remove();
    autoSaveTempToDo();
  };

  checkbox.addEventListener("change", onChange);
  taskSpan.addEventListener("click", onSpanClick);
  taskDeleteBtn.addEventListener("click", onButtonClick);

  return () => {
    checkbox.removeEventListener("change", onChange);
    taskSpan.removeEventListener("click", onSpanClick);
    taskDeleteBtn.removeEventListener("click", onButtonClick);
  };
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
    reloadToDoList(
      taskList,
      { data: tempToDoValue.data },
      tempToDoValue.dataCompleted,
    );
  } else {
    title.value = "";
    taskList.innerHTML = "";
    input.value = "";
  }
  addBtn.addEventListener("click", () => addToDo(taskList, input, title));

  title.removeEventListener("input", autoSaveTempToDo);
  input.removeEventListener("input", autoSaveTempToDo);

  title.addEventListener("input", autoSaveTempToDo);
  addBtn.addEventListener("click", autoSaveTempToDo);
};

const renderUI = (modalState: string): void => {
  if (modalState === "note") {
    renderNoteUI();
  } else if (modalState === "toDo") {
    renderToDoUI();
  }
};

export { addToDo, openOverlay, reloadToDoList, renderUI };
