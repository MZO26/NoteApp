import { switchOverlayInterface } from "../../handlers/modalHandlers.js";
import { setModalState, setSavedItemId } from "../../states/sharedStates.js";
import type { AddToDoButton, RenderedItem } from "../../types/featureTypes.js";
import { openOverlay } from "../../ui/renderModalUI.js";
import { reloadToDoList } from "../../ui/renderTodoList.js";
import { ToDo } from "../../utils/classes.js";
import { isActive } from "../../utils/events.js";
import { checkId } from "../../utils/helpers.js";
import {
  getValue,
  removeValue,
  StorageKeys,
  updateStorage,
} from "../../utils/storageService.js";

const checkIfCompleted = (taskList: HTMLUListElement) => {
  const taskCheckboxes =
    taskList.querySelectorAll<HTMLInputElement>(".task-checkbox");
  for (const checkbox of taskCheckboxes) {
    const element = checkbox;
    const listContainer = element.closest("li");
    const span = listContainer?.querySelector<HTMLSpanElement>("span");
    const hasTaskCompletedClass = span?.classList.contains("task-completed");

    if (!element.checked && hasTaskCompletedClass) {
      element.checked = true;
    }
  }
};

function toDoItemHandler(toDoItem: RenderedItem, newToDo: ToDo): void {
  const toDoItemBtn = toDoItem.querySelector<HTMLButtonElement>("button");

  async function viewToDo() {
    setModalState("toDo");
    const parsedId = checkId(toDoItem);
    setSavedItemId(parsedId);
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = true;
    }
    openOverlay(parsedId);
    await switchOverlayInterface();
    const itemContainer =
      document.querySelector<HTMLDivElement>(".item-container");
    const toDoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const taskList = document.querySelector<HTMLUListElement>(".task-list");
    const tempToDoValue = getValue(StorageKeys.TEMP_TODO);
    if (!itemContainer || !toDoTitle || !taskList) return;
    const savedItemId = parsedId;
    if (tempToDoValue && tempToDoValue.id === savedItemId) {
      toDoTitle.value = tempToDoValue.title || "";
      reloadToDoList(taskList, tempToDoValue.data);
    } else {
      toDoTitle.value = newToDo.title;
      reloadToDoList(taskList, newToDo.data);
    }
    checkIfCompleted(taskList);

    isActive(toDoItem, itemContainer);
  }

  function deleteToDo(event: Event): void {
    event.stopPropagation();
    const parsedId = checkId(toDoItem);
    if (parsedId === null) return;
    updateStorage(StorageKeys.ITEMS, (currentItems) =>
      currentItems.filter((item) => item.id !== parsedId),
    );
    const container = document.querySelector<HTMLDivElement>(".todo-container");
    if (container) {
      const addBtn: AddToDoButton | null =
        container.querySelector<HTMLButtonElement>(".todo-btn");
      if (addBtn && addBtn._addHandlerRef) {
        addBtn.removeEventListener("click", addBtn._addHandlerRef);
        delete addBtn._addHandlerRef;
      }
    }
    toDoItemBtn?.removeEventListener("click", deleteToDo);
    toDoItem.removeEventListener("click", viewToDo);
    toDoItem.remove();
    removeValue(StorageKeys.TEMP_TODO);
  }
  toDoItemBtn?.addEventListener("click", deleteToDo);
  toDoItem.addEventListener("click", viewToDo);
}

export { toDoItemHandler };
