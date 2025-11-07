import { savedNoteIdState } from "./notes.js";
import { createNewNote } from "../utils/classes.js";
import { toDoItemTemplate } from "../utils/templates.js";
import { syncCategoriesWithNotes, isActive, saveTempToDo } from "../events.js";
import { openOverlay } from "../buttons.js";
import { reloadToDoList, addToDo } from "../ui-components/renderModalUI.js";

const toDoToBeRendered = (
  toDoList,
  toDoTitle,
  category = null,
  type,
  completedTasks
) => {
  if (type !== "toDo") return;
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  const tempToDoValue =
    JSON.parse(localStorage.getItem("tempToDoValue")) || "{}";
  completedTasks ? completedTasks : tempToDoValue.dataCompleted;
  const notesContainer = document.querySelector(".notes-container");
  const toDoItem = document.createElement("div");
  toDoItem.className = "toDoItem";
  const newToDo = createNewNote(type, category, toDoList, toDoTitle);
  toDoItem.setAttribute("data-id", newToDo.id);
  toDoItem.innerHTML = toDoItemTemplate(newToDo, completedTasks);
  notesArr.push(newToDo);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  saveTempToDo();
  notesContainer.appendChild(toDoItem);
  toDoItemHandler(toDoItem, newToDo, completedTasks);
  syncCategoriesWithNotes();
};

const toDoItemHandler = (toDoItem, newToDo, completedTasks) => {
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
        toDoTitle.value = newToDo.title || tempToDo.title || "Kein Titel";
      } else {
        localStorage.setItem(
          "tempToDoValue",
          JSON.stringify({
            title: newToDo.title || tempToDo.title,
            data: newToDo.data || tempToDo.data,
            dataCompleted: completedTasks || [],
          })
        );
      }
      reloadToDoList(newToDo, completedTasks);
      saveTempToDo();
      isActive(toDoItem, notesContainer);
      const container = document.querySelector(".todo-container");
      const addBtn = container.querySelector(".todo-btn");
      const taskList = container.querySelector(".task-list");
      const input = container.querySelector(".todo-input");
      const taskCheckboxes = document.querySelectorAll(".task-checkbox");
      if (toDoTitle) toDoTitle.addEventListener("input", saveTempToDo);
      if (input) input.addEventListener("input", saveTempToDo);
      taskCheckboxes.forEach((checkbox) => {
        const container = checkbox.closest("li");
        const span = container.querySelector("span");
        const hasTaskCompletedClass = span.classList.contains("task-completed");
        if (!checkbox.checked && hasTaskCompletedClass) {
          checkbox.checked = true;
        }
      });
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

export { toDoToBeRendered, toDoItemHandler };
