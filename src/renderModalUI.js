import { saveTempNote, saveTempToDo } from "./events.js";
import { getToDoInterfaceElements, createTaskItem } from "./templates.js";

const modalState = { interface: "note" };

const changeOverlayInterface = () => {
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  const modalHeadingElement = document.querySelector(".modal-heading");
  const modalNoteElement = document.querySelector(".modal-note");
  if (modalState.interface === "note") {
    modalHeadingElement.textContent = "Neue Notiz";
    modalNoteElement.textContent = "Notiz hinzufügen";
  } else if (modalState.interface === "toDo") {
    modalHeadingElement.textContent = "Neue ToDo Liste";
    modalNoteElement.textContent = "ToDo's hinzufügen";
  }
  createFragmentElement(modalState.interface);
};

const addToDo = (taskList, input) => {
  const taskText = input.value.trim();
  if (!taskText) return;
  const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(taskText);
  taskList.appendChild(li);
  input.value = "";
  addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
};

const reloadToDoList = (toDo) => {
  const taskList = document.querySelector(".task-list");
  if (!toDo.data || toDo.data.length === 0) return;
  for (let i = 0; i < toDo.data.length; i++) {
    const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(
      toDo.data && toDo.data[i]
    );
    taskList.appendChild(li);
    addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
  }
};

const addEventListeners = (li, checkbox, taskSpan, taskDeleteBtn) => {
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

const renderNoteUI = () => {
  const currentToDoTitle = document.querySelector(".todo-title");
  const currentToDo = document.querySelector(".todo-container");
  if (!currentToDoTitle || !currentToDo) return;
  const tempNoteValue = JSON.parse(
    localStorage.getItem("tempNoteValue") || "{}"
  );
  saveTempToDo();
  const note = document.createElement("textarea");
  const title = document.createElement("textarea");
  note.className = "note";
  note.name = "note-textarea";
  title.className = "title";
  title.name = "title-textarea";
  const titleFragment = document.createDocumentFragment();
  const noteFragment = document.createDocumentFragment();
  title.value = tempNoteValue.title || "";
  note.value = tempNoteValue.note || "";
  titleFragment.appendChild(title);
  noteFragment.appendChild(note);
  currentToDoTitle.replaceWith(titleFragment);
  currentToDo.replaceWith(noteFragment);
};

const renderToDoUI = () => {
  const currentTitle = document.querySelector(".title");
  const currentNote = document.querySelector(".note");
  if (!currentTitle || !currentNote) return;
  const { todoDiv, addBtn, taskList, input, title } =
    getToDoInterfaceElements();
  const tempToDoValue = JSON.parse(
    localStorage.getItem("tempToDoValue") || "{}"
  );
  saveTempNote();
  title.value = tempToDoValue.title || "";
  const titleFragment = document.createDocumentFragment();
  const noteFragment = document.createDocumentFragment();
  titleFragment.appendChild(title);
  noteFragment.appendChild(todoDiv);
  currentTitle.replaceWith(titleFragment);
  currentNote.replaceWith(noteFragment);
  const toDoData = tempToDoValue.data || null;
  if (toDoData && toDoData.length) {
    reloadToDoList(tempToDoValue);
  }
  addBtn.addEventListener("click", () => addToDo(taskList, input));
};

const createFragmentElement = (modalState) => {
  if (modalState === "note") {
    renderNoteUI();
  } else if (modalState === "toDo") {
    renderToDoUI();
  }
};

export { changeOverlayInterface, addToDo, reloadToDoList, modalState };
