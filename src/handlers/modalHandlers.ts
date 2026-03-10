import { handleNoteSave } from "../features/noteItems/saveNotes.js";
import { handleToDoSave } from "../features/todoItems/saveTodo.js";
import {
  clearSavedItemId,
  getActiveCategory,
  getModalState,
  getSavedItemId,
  setModalState,
} from "../states/sharedStates.js";
import type { CategoryArray, ItemArray } from "../types/storageTypes.js";
import { renderUI } from "../ui/renderModalUI.js";
import { cancelAutoSave } from "../utils/autoSave.js";
import { getElement, getElementOrNull, truncate } from "../utils/helpers.js";
import { getValue, removeValue, StorageKeys } from "../utils/storageService.js";

const registerModalHandlers = () => {
  const closeBtn = getElement<HTMLButtonElement>(".closeModal-btn");
  const saveBtn = getElement<HTMLButtonElement>(".add-btn");
  const deleteBtn = getElement<HTMLButtonElement>(".delete-btn");
  const switchBtn = getElement<HTMLInputElement>(".switch-checkbox");
  const overlay = getElement<HTMLDivElement>(".overlay");
  const modal = getElement<HTMLDivElement>(".modal");
  const switchBtnVisibility = getElement<HTMLLabelElement>(".switch");

  saveBtn.addEventListener("click", () => {
    saveButton();
    closeBtn.click();
  });
  deleteBtn.addEventListener("click", deleteButton);
  closeBtn.addEventListener("click", () => {
    closeModal(overlay, modal, switchBtnVisibility);
  });
  switchBtn.addEventListener("click", () => {
    switchOverlayInterface(switchBtn);
  });
};

const updateCategorySelect = (categoryArr: CategoryArray): void => {
  const select = getElement<HTMLSelectElement>(".category-select");
  const activeCategory = getActiveCategory();
  select.options.length = 0;
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = truncate(category.name, 20);
    select.appendChild(option);
    if (category.name === activeCategory) {
      option.selected = true;
    }
  });
};

const saveButton = (): void => {
  cancelAutoSave();
  const itemArr: ItemArray = getValue(StorageKeys.ITEMS);
  const savedItemId = getSavedItemId();
  const modalState = getModalState();
  const select = getElement<HTMLSelectElement>(".category-select");
  if (!select.value) return;
  const categoryArr: CategoryArray = getValue(StorageKeys.CATEGORIES);
  const matchingCategory = categoryArr.find(
    (category) => category.id === select.value,
  );
  if (!matchingCategory) return;
  const selectedCategory = matchingCategory.name;
  if (modalState === "toDo" && selectedCategory) {
    handleToDoSave(savedItemId, itemArr, selectedCategory);
  } else if (modalState === "note" && selectedCategory) {
    handleNoteSave(savedItemId, itemArr, selectedCategory);
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

const deleteButton = (): void => {
  const isConfirmed = window.confirm("Clear all content?");
  if (!isConfirmed) return;
  const modalState = getModalState();
  if (modalState === "note") {
    const title = getElementOrNull<HTMLTextAreaElement>(".title");
    const content = getElementOrNull<HTMLTextAreaElement>(".note");
    if (title && content) {
      title.value = "";
      content.value = "";
    }
  } else if (modalState === "toDo") {
    const title = getElementOrNull<HTMLTextAreaElement>(".todo-title");
    const content = getElementOrNull<HTMLDivElement>(".task-list");
    if (title && content) {
      title.value = "";
      content.innerHTML = "";
    }
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

const closeModal = (
  overlay: HTMLDivElement,
  modal: HTMLDivElement,
  switchBtnVisibility: HTMLLabelElement,
): void => {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  if (switchBtnVisibility.classList.contains("hidden")) {
    modal.addEventListener(
      "transitionend",
      () => {
        switchBtnVisibility.classList.remove("hidden");
      },
      { once: true },
    );
  }
  clearSavedItemId();
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

const switchOverlayInterface = (switchBtn: HTMLInputElement): Promise<void> => {
  return new Promise((resolve) => {
    const isToDo = switchBtn.checked || false;
    const modalState = isToDo ? "toDo" : "note";
    setModalState(modalState);
    requestAnimationFrame(() => {
      const modalHeadingElement =
        getElementOrNull<HTMLHeadingElement>(".modal-heading");
      const modalNoteElement =
        getElementOrNull<HTMLParagraphElement>(".modal-note");
      if (modalHeadingElement && modalNoteElement) {
        if (modalState === "note") {
          modalHeadingElement.textContent = "New note";
          modalNoteElement.textContent = "Add note";
        } else if (modalState === "toDo") {
          modalHeadingElement.textContent = "New toDo list";
          modalNoteElement.textContent = "Add toDo's";
        }
      } else return;
      renderUI(modalState);
      resolve();
    });
  });
};

export { registerModalHandlers, switchOverlayInterface, updateCategorySelect };
