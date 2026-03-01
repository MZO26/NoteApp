import type { NoteObject } from "../types/noteTypes.js";
import type { ModalState } from "../types/stateTypes.js";
import type { TempNoteValue, TempToDoValue } from "../types/storageTypes.js";
import { getNotes } from "../utils/storageService.js";
import { saveTempNote, saveTempToDo } from "../utils/tempStorageService.js";
import {
  createTaskItem,
  getToDoInterfaceElements,
} from "../utils/templates.js";

const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const openOverlay = (): void => {
  overlay?.classList.add("show");
  modal?.classList.add("show");
  localStorage.setItem("modal-status", "open");
  const notes: HTMLCollection =
    document.querySelector<HTMLDivElement>(".notes-container")!.children;
  const savedNoteIdStr: string | null = sessionStorage.getItem("savedNoteId");
  const savedNoteId: number | null =
    savedNoteIdStr && savedNoteIdStr !== "null"
      ? Number(JSON.parse(savedNoteIdStr))
      : null;
  if (
    savedNoteId &&
    switchBtnVisibility &&
    !switchBtnVisibility.classList.contains("hidden")
  ) {
    switchBtnVisibility.classList.add("hidden");
  }
  Array.from(notes).forEach((element) => {
    if (element.classList.contains("active"))
      element.classList.remove("active");
  });
};

const changeOverlayInterface = () => {
  const storedModalState = localStorage.getItem("modalState");
  const modalState: ModalState = storedModalState
    ? JSON.parse(storedModalState)
    : {
        interface: "note",
      };
  const modalHeadingElement =
    document.querySelector<HTMLHeadingElement>(".modal-heading")!;
  const modalNoteElement =
    document.querySelector<HTMLParagraphElement>(".modal-note")!;
  if (modalState.interface === "note") {
    modalHeadingElement.textContent = "New note";
    modalNoteElement.textContent = "Add note";
  } else if (modalState.interface === "toDo") {
    modalHeadingElement.textContent = "New toDo list";
    modalNoteElement.textContent = "Add toDo's";
  }
  createFragmentElement(modalState);
};

const addToDo = (taskList: HTMLUListElement, input: HTMLInputElement): void => {
  const taskText = input.value.trim();
  if (!taskText) return;
  const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(taskText);
  taskList.appendChild(li);
  input.value = "";
  addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
};

const reloadToDoList = (
  toDoData: Pick<NoteObject, "data">,
  completedTasks: Array<string>,
): void => {
  const taskList = document.querySelector<HTMLUListElement>(".task-list");
  if (toDoData.data) {
    for (let i = 0; i < toDoData.data.length; i++) {
      const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(
        toDoData.data && toDoData.data[i]!,
      );
      if (completedTasks && completedTasks.includes(toDoData.data[i]!)) {
        taskSpan.classList.add("task-completed");
      }
      taskList!.appendChild(li);
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
    const titleElem = document.createElement("textarea");
    const noteElem = document.createElement("textarea");
    titleElem.className = "title";
    titleElem.name = "title-textarea";
    noteElem.className = "note";
    noteElem.name = "note-textarea";
    saveTempToDo();
    const titleFrag = document.createDocumentFragment();
    const noteFrag = document.createDocumentFragment();
    titleFrag.appendChild(titleElem);
    noteFrag.appendChild(noteElem);
    currentToDoTitle.replaceWith(titleFrag);
    currentToDo.replaceWith(noteFrag);
    noteTitle = titleElem;
    noteContent = noteElem;
  }

  const storedTempNoteValue = localStorage.getItem("tempNoteValue");
  let tempNoteValue: TempNoteValue = storedTempNoteValue
    ? JSON.parse(storedTempNoteValue)
    : { title: "", data: [] };

  const savedId = sessionStorage.getItem("savedNoteId");
  if (savedId && savedId !== "null") {
    const notesArr: NoteObject[] = getNotes();
    const noteId: number = Number(JSON.parse(savedId));
    const existing = notesArr.find(
      (n: NoteObject) => n.id === noteId && n.type === "note",
    );
    if (existing) {
      tempNoteValue = {
        title: existing.title || "",
        data: existing.data || [],
      };
    }
  }
  requestAnimationFrame(() => {
    noteTitle!.value = tempNoteValue.title;
    noteContent!.value = tempNoteValue.data.length
      ? tempNoteValue.data.toString()
      : "";
  });
};

const renderToDoUI = () => {
  const currentTitle = document.querySelector<HTMLTextAreaElement>(".title");
  const currentNote = document.querySelector<HTMLTextAreaElement>(".note");
  if (!currentTitle || !currentNote) return;
  const { todoDiv, addBtn, taskList, input, title } =
    getToDoInterfaceElements();
  const storedTempToDoValue = localStorage.getItem("tempToDoValue");
  const tempToDoValue: TempToDoValue = storedTempToDoValue
    ? JSON.parse(storedTempToDoValue)
    : { title: "", data: [], dataCompleted: [] };
  saveTempNote();
  const titleFragment = document.createDocumentFragment();
  const noteFragment = document.createDocumentFragment();
  titleFragment.appendChild(title);
  noteFragment.appendChild(todoDiv);
  currentTitle.replaceWith(titleFragment);
  currentNote.replaceWith(noteFragment);
  const toDoData = tempToDoValue.data;
  requestAnimationFrame(() => {
    title.value = tempToDoValue.title;
    if (toDoData && toDoData.length) {
      reloadToDoList({ data: tempToDoValue.data }, tempToDoValue.dataCompleted);
    }
    addBtn.addEventListener("click", () => addToDo(taskList, input));
  });
};

const createFragmentElement = (modalState: ModalState): void => {
  if (modalState.interface === "note") {
    renderNoteUI();
  } else if (modalState.interface === "toDo") {
    renderToDoUI();
  }
};

export { addToDo, changeOverlayInterface, openOverlay, reloadToDoList };
