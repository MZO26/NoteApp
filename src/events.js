import { savedNoteIdState } from "./notes.js";

const showToast = (value, duration = 4000) => {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  if (value.length > 15) {
    value.slice(0, 15);
  }
  toast.textContent = value;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 1000);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
};

const inputListener = (input) => {
  return new Promise((resolve) => {
    const clickOutside = (e) => {
      if (!document.body.contains(input)) return;
      if (e.target !== input) {
        cleanup();
        input.value = "";
        resolve(input.value);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        cleanup();
        resolve(input.value);
      }
    };
    const cleanup = () => {
      document.removeEventListener("click", clickOutside);
      input.removeEventListener("keydown", onKeyDown);
    };
    input.focus();
    document.addEventListener("click", clickOutside);
    input.addEventListener("keydown", onKeyDown);
  });
};

function isActive(item, parentElement = null) {
  const targetParent = parentElement || document.body;
  item.classList.add("active");
  if (item._listener) document.removeEventListener("click", item._listener);
  //no const declaration because own declaration of object property
  //dom objects also seen as objects
  item._listener = (e) => {
    if (targetParent.contains(e.target) && e.target != item) {
      item.classList.remove("active");
      document.removeEventListener("click", item._listener);
      savedNoteIdState.savedNoteId = null;
      item._listener = null;
    }
  };
  setTimeout(() => document.addEventListener("click", item._listener), 0);
}

const syncCategoriesWithNotes = () => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  categoryArr = categoryArr.map((category) => {
    category.items = notesArr.filter((note) => note.category == category.name);
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

const saveTempToDo = () => {
  const toDoTitle = document.querySelector(".todo-title");
  const currentToDo = document.querySelector(".todo-container");
  const toDoList = currentToDo.querySelectorAll(".task-list li span");
  const titleValue = toDoTitle ? toDoTitle.value : "Kein Titel";
  const toDoData = [];
  const completedTasks = [];
  if (toDoList.length) {
    toDoList.forEach((span) => {
      toDoData.push(span.textContent);
      if (span.classList.contains("task-completed")) {
        completedTasks.push(span.textContent);
      }
    });
  }

  localStorage.setItem(
    "tempToDoValue",
    JSON.stringify({
      title: titleValue || "Kein Titel",
      data: toDoData || [],
      dataCompleted: completedTasks || [],
    })
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

export {
  showToast,
  inputListener,
  isActive,
  syncCategoriesWithNotes,
  saveTempToDo,
  saveTempNote,
};
