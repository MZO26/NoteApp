import {
  switchModalInterface,
  updateCategorySelect,
} from "../../handlers/modalHandlers.js";
import {
  clearSavedItemId,
  setModalState,
  setSavedItemId,
} from "../../states/sharedStates.js";
import type { AddToDoButton, RenderedItem } from "../../types/featureTypes.js";
import { openModal } from "../../ui/renderModalUI.js";
import { reloadToDoList } from "../../ui/renderTodoList.js";
import { ToDo } from "../../utils/classes.js";
import { isActive } from "../../utils/events.js";
import { checkId, getElement } from "../../utils/helpers.js";
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
    const switchBtn = getElement<HTMLInputElement>(".switch-checkbox");
    if (switchBtn) {
      switchBtn.checked = true;
      switchBtn.dispatchEvent(new Event("change"));
    }
    updateCategorySelect(getValue(StorageKeys.CATEGORIES));
    openModal(parsedId);
    await switchModalInterface(switchBtn);
    const itemContainer = getElement<HTMLDivElement>(".item-container");
    const toDoTitle = getElement<HTMLTextAreaElement>(".todo-title");
    const taskList = getElement<HTMLUListElement>(".task-list");
    const tempToDoValue = getValue(StorageKeys.TEMP_TODO);
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
    const container = getElement<HTMLDivElement>(".todo-container");
    const addBtn: AddToDoButton | null =
      container.querySelector<HTMLButtonElement>(".todo-btn");
    if (addBtn && addBtn._addHandlerRef) {
      addBtn.removeEventListener("click", addBtn._addHandlerRef);
      delete addBtn._addHandlerRef;
    }
    clearSavedItemId();
    removeValue(StorageKeys.TEMP_TODO);
    toDoItem.remove();
  }
  if (toDoItemBtn) {
    toDoItemBtn.removeEventListener("click", deleteToDo);
    toDoItemBtn.addEventListener("click", deleteToDo);
  }
  toDoItem.removeEventListener("click", viewToDo);
  toDoItem.addEventListener("click", viewToDo);
}

export { toDoItemHandler };
