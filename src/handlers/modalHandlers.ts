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
import { getValue, removeValue, StorageKeys } from "../utils/storageService.js";

const closeBtn = document.querySelector<HTMLButtonElement>(".closeModal-btn")!;
const saveBtn = document.querySelector<HTMLButtonElement>(".add-btn")!;
const deleteBtn = document.querySelector<HTMLButtonElement>(".delete-btn")!;
const switchBtn = document.querySelector<HTMLInputElement>(".switch-checkbox");
const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const updateCategorySelect = (categoryArr: CategoryArray): void => {
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const activeCategory = getActiveCategory();
  if (!select) return;
  select.innerHTML = "";
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.name;
    if (option.textContent.length > 20) {
      option.textContent = option.textContent.slice(0, 20) + "...";
    }
    if (category.name === activeCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

const saveButton = (): void => {
  cancelAutoSave();
  const itemArr: ItemArray = getValue(StorageKeys.ITEMS);
  const savedItemId = getSavedItemId();
  const activeCategory = getActiveCategory();
  const modalState = getModalState();
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const selectedCategory: string | undefined = select
    ? select.options[select.selectedIndex]?.textContent
    : activeCategory;
  if (modalState === "toDo" && selectedCategory) {
    handleToDoSave(savedItemId, itemArr, selectedCategory);
  } else if (modalState === "note" && selectedCategory) {
    handleNoteSave(savedItemId, itemArr, selectedCategory);
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

saveBtn.addEventListener("click", () => {
  saveButton();
  closeBtn.click();
});

const deleteButton = (): void => {
  const isConfirmed = window.confirm("Clear all content?");
  if (!isConfirmed) return;
  const modalState = getModalState();
  if (modalState === "note") {
    const title = document.querySelector<HTMLTextAreaElement>(".title");
    const content = document.querySelector<HTMLTextAreaElement>(".note");
    if (title && content) {
      title.value = "";
      content.value = "";
    }
  } else if (modalState === "toDo") {
    const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
    const content = document.querySelector<HTMLDivElement>(".task-list");
    if (title && content) {
      title.value = "";
      content.innerHTML = "";
    }
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

deleteBtn.addEventListener("click", deleteButton);

const closeModal = (): void => {
  overlay?.classList.remove("show");
  modal?.classList.remove("show");
  setTimeout(() => {
    if (
      switchBtnVisibility &&
      switchBtnVisibility.classList.contains("hidden")
    ) {
      switchBtnVisibility.classList.remove("hidden");
    }
  }, 300);
  clearSavedItemId();
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

closeBtn.addEventListener("click", closeModal);

const switchOverlayInterface = (): Promise<void> => {
  return new Promise((resolve) => {
    const isToDo = switchBtn?.checked || false;
    const modalState = isToDo ? "toDo" : "note";
    setModalState(modalState);
    requestAnimationFrame(() => {
      const modalHeadingElement =
        document.querySelector<HTMLHeadingElement>(".modal-heading");
      const modalNoteElement =
        document.querySelector<HTMLParagraphElement>(".modal-note");
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

switchBtn?.addEventListener("click", () => {
  switchOverlayInterface();
});

export { switchOverlayInterface, updateCategorySelect };
