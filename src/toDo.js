import { createNewNote, savedNoteIdState } from "./notes.js";
import { toDoItemTemplate } from "./templates.js";
import { syncCategoriesWithNotes, isActive } from "./events.js";
import { openOverlay } from "./buttons.js";

const modalState = { interface: "note" };

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

const getToDoInterfaceElements = () => {
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo-container";

  const title = Object.assign(document.createElement("textarea"), {
    className: "todo-title",
    name: "todo-title-textarea",
  });

  const input = Object.assign(document.createElement("input"), {
    type: "text",
    className: "todo-input",
    name: "todo-input",
  });

  const addBtn = Object.assign(document.createElement("button"), {
    innerText: "Add Task",
    className: "todo-btn",
  });

  const taskList = Object.assign(document.createElement("ul"), {
    className: "task-list",
  });

  todoDiv.append(input, addBtn, taskList);
  return {
    todoDiv,
    input,
    addBtn,
    taskList,
    title,
  };
};

const createTaskItem = (taskText) => {
  const li = document.createElement("li");

  const checkbox = Object.assign(document.createElement("input"), {
    type: "checkbox",
    className: "task-checkbox",
    name: "task-checkbox",
  });

  const taskSpan = Object.assign(document.createElement("span"), {
    textContent: taskText,
  });

  const taskDeleteBtn = Object.assign(document.createElement("button"), {
    innerHTML: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg>`,
    className: "task-delete-btn",
    title: "Task löschen",
  });

  li.appendChild(checkbox);
  li.appendChild(taskSpan);
  li.appendChild(taskDeleteBtn);

  return { li, checkbox, taskSpan, taskDeleteBtn };
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

const addToDo = (taskList, input) => {
  const taskText = input.value.trim();
  if (!taskText) return;
  const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(taskText);
  taskList.appendChild(li);
  input.value = "";
  addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
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

const toDoToBeRendered = (toDoList, toDoTitle, category = null, type) => {
  if (type !== "toDo") return;
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const notesContainer = document.querySelector(".notes-container");
  const toDoItem = document.createElement("div");
  toDoItem.className = "toDoItem";
  const newToDo = createNewNote(type, category, toDoList, toDoTitle);
  toDoItem.setAttribute("data-id", newToDo.id);
  toDoItem.innerHTML = toDoItemTemplate(newToDo);
  notesArr.push(newToDo);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  notesContainer.appendChild(toDoItem);
  toDoItemHandler(toDoItem, newToDo);
  syncCategoriesWithNotes();
};

const saveTempToDo = () => {
  const toDoTitle = document.querySelector(".todo-title");
  const currentToDo = document.querySelector(".todo-container");
  const toDoList = currentToDo.querySelectorAll(".task-list li span");
  const titleValue = toDoTitle ? toDoTitle.value : "Kein Titel";
  const toDoData = [];
  if (toDoList.length) {
    toDoList.forEach((span) => {
      toDoData.push(span.textContent);
    });
  }
  localStorage.setItem(
    "tempToDoValue",
    JSON.stringify({ title: titleValue, data: toDoData })
  );
};

const saveTempNote = () => {
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  localStorage.setItem(
    "tempNoteValue",
    JSON.stringify({
      title: noteTitle.value || "Kein Titel",
      note: noteTextArea.value,
    })
  );
};

const toDoItemHandler = (toDoItem, newToDo) => {
  const toDoItemBtn = toDoItem.querySelector("button");
  function viewToDo() {
    localStorage.setItem("modal-state", JSON.stringify({ interface: "toDo" }));
    savedNoteIdState.savedNoteId = toDoItem.getAttribute("data-id");
    sessionStorage.setItem(
      "savedNoteId",
      JSON.stringify(savedNoteIdState.savedNoteId)
    );
    const switchBtn = document.querySelector(".switch-checkbox");

    if (switchBtn) {
      switchBtn.checked = true;
      switchBtn.dispatchEvent(new Event("change"));
    }
    requestAnimationFrame(() => {
      openOverlay();
      const tempToDo = JSON.parse(
        localStorage.getItem("tempToDoValue") || "{}"
      );
      const notesContainer = document.querySelector(".notes-container");
      const toDoTitle = document.querySelector(".todo-title");
      if (toDoTitle) {
        toDoTitle.value = newToDo.title || tempToDo.title;
      } else {
        localStorage.setItem(
          "tempToDoValue",
          JSON.stringify({
            title: newToDo.title || tempToDo.title,
            data: newToDo.data || tempToDo.data || [],
          })
        );
      }
      reloadToDoList(newToDo);
      saveTempToDo();
      isActive(toDoItem, notesContainer);
      const container = document.querySelector(".todo-container");
      const addBtn = container.querySelector(".todo-btn");
      const taskList = container.querySelector(".task-list");
      const input = container.querySelector(".todo-input");
      if (toDoTitle) toDoTitle.addEventListener("input", saveTempToDo);
      if (input) input.addEventListener("input", saveTempToDo);
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

  function deleteToDo(event) {
    event.stopPropagation();
    const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
    const id = toDoItem.getAttribute("data-id");
    const index = notesArr.findIndex((note) => note.id == id);
    if (index > -1) {
      notesArr.splice(index, 1);
      localStorage.setItem("notesArr", JSON.stringify(notesArr));
    }
    const container = document.querySelector(".todo-container");
    const addBtn = container?.querySelector(".todo-btn");
    if (addBtn && addBtn._addHandlerRef) {
      addBtn.removeEventListener("click", addBtn._addHandlerRef);
      delete addBtn._addHandlerRef;
    }
    toDoItemBtn.removeEventListener("click", deleteToDo);
    toDoItem.removeEventListener("click", viewToDo);
    toDoItem.remove();
    syncCategoriesWithNotes();
  }
  if (toDoItemBtn) toDoItemBtn.addEventListener("click", deleteToDo);
  if (toDoItem) toDoItem.addEventListener("click", viewToDo);
};

export {
  changeOverlayInterface,
  toDoToBeRendered,
  toDoItemHandler,
  saveTempToDo,
  saveTempNote,
  reloadToDoList,
  modalState,
};
