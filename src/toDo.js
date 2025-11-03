const modalState = { note: true };

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

  const input = Object.assign(document.createElement("input"), {
    type: "text",
    className: "todo-input",
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
  };
};

const createTaskItem = (taskText) => {
  const li = document.createElement("li");

  const checkbox = Object.assign(document.createElement("input"), {
    type: "checkbox",
    className: "task-checkbox",
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
  });

  li.appendChild(checkbox);
  li.appendChild(taskSpan);
  li.appendChild(taskDeleteBtn);

  return { li, checkbox, taskSpan, taskDeleteBtn };
};

const createFragmentElement = () => {
  const currentNote = document.querySelector(".note");
  const currentToDo = document.querySelector(".todo-container");
  const fragment = document.createDocumentFragment();

  if (currentNote) {
    const toDoArr = JSON.parse(localStorage.getItem("toDoArr") || "[]");
    if (toDoArr.length) reloadToDoList();
    else {
      const { todoDiv } = getToDoInterfaceElements();
      fragment.appendChild(todoDiv);
      currentNote.replaceWith(fragment);
      sessionStorage.setItem(
        "modalState",
        JSON.stringify((modalState.note = false))
      );
    }

    addBtn.onclick = () => {
      const taskText = input.value.trim();
      if (!taskText) return;
      const { li, checkbox, taskSpan, taskDeleteBtn } =
        createTaskItem(taskText);
      taskList.appendChild(li);
      input.value = "";
      addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
    };
  } else if (currentToDo) {
    const textarea = document.createElement("textarea");
    textarea.className = "note";
    const allTasks = currentToDo.querySelectorAll(".task-list li span");
    let taskArr = [];
    allTasks.forEach((span) => {
      taskArr.push(span.textContent);
    });
    console.log(taskArr);
    localStorage.setItem("toDoArr", JSON.stringify(taskArr));
    const savedNoteValue = JSON.parse(localStorage.getItem("savedNoteValue"));
    if (savedNoteValue.note) {
      textarea.value = "";
      textarea.value += savedNoteValue;
    }
    if (savedNoteValue.title) {
      title.value = "";
      title.value = savedNoteValue;
    }
    fragment.appendChild(textarea);
    currentToDo.replaceWith(fragment);
    sessionStorage.setItem(
      "modalState",
      JSON.stringify((modalState.note = true))
    );
  }
};

const changeOverlayInterface = () => {
  const modalHeadingElement = document.querySelector(".modal-heading");
  const modalNoteElement = document.querySelector(".modal-note");
  let modalHeading = modalHeadingElement.textContent;
  let modalNote = modalNoteElement.textContent;
  switch (modalHeading) {
    case "Neue Notiz":
      modalHeading = "Neue ToDo Liste";
      break;
    default:
      modalHeading = "Neue Notiz";
  }
  switch (modalNote) {
    case "Notiz hinzufügen":
      modalNote = "ToDo's hinzufügen";
      break;
    default:
      modalNote = "Notiz hinzufügen";
  }
  createFragmentElement();
  modalHeadingElement.textContent = modalHeading;
  modalNoteElement.textContent = modalNote;
};

const reloadToDoList = () => {
  const { todoDiv } = getToDoInterfaceElements();
  const toDoArr = JSON.parse(localStorage.getItem("toDoArr") || "[]");
  console.log({ array: toDoArr });
  if (!toDoArr.length) return;

  for (let i = 0; i < toDoArr.length; i++) {
    const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(
      toDoArr[i]
    );
    taskList.appendChild(li);
    addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
  }
};

export { changeOverlayInterface };
