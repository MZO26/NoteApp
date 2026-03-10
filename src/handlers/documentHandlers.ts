import { categoryToBeRendered } from "../features/categories.js";
import { filter } from "../features/filter.js";
import {
  clearSavedItemId,
  getMode,
  setModalState,
  setMode,
} from "../states/sharedStates.js";
import { openModal } from "../ui/renderModalUI.js";
import { inputListener } from "../utils/events.js";
import { getElement, getElementOrNull } from "../utils/helpers.js";
import { getValue, removeValue, StorageKeys } from "../utils/storageService.js";
import {
  switchOverlayInterface,
  updateCategorySelect,
} from "./modalHandlers.js";

const registerDocumentHandlers = (): void => {
  const filterInput = getElement<HTMLInputElement>(".search-input");
  const switchBtn = getElement<HTMLInputElement>(".switch-checkbox");
  const darkModeBtn = getElement<HTMLButtonElement>(".dark-mode-btn");
  const toggleBtn = getElement<HTMLButtonElement>(".toggle-btn");
  const categoryBtn = getElementOrNull<HTMLButtonElement>(".category-btn");
  const showBtn = getElement<HTMLButtonElement>(".showModal-btn");
  const openInfoBtn = getElementOrNull<HTMLButtonElement>(".info-btn");
  const sidebarOverlay = getElementOrNull<HTMLDivElement>(".sidebar-overlay");
  const switchBtnVisibility = getElement<HTMLLabelElement>(".switch");

  let searchTimeout: NodeJS.Timeout;
  filterInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filter, 200);
  });
  filterInput.addEventListener("click", filter);
  document.addEventListener("click", (e: Event): void => {
    const target = e.target as Element | null;
    const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
    if (target && dropdown && !target.closest(".input-wrapper"))
      dropdown.style.display = "none";
  });

  toggleBtn.addEventListener("click", collapseCategories);
  darkModeBtn.addEventListener("click", toggleDarkMode);
  showBtn.addEventListener("click", () =>
    addNewNote(switchBtn, switchBtnVisibility),
  );
  if (openInfoBtn) {
    openInfoBtn.addEventListener("click", (): void => {
      sidebarOverlay?.classList.toggle("visible");
      sidebarOverlay?.classList.toggle("hidden");
    });
  }
  if (categoryBtn) {
    categoryBtn.addEventListener("click", (event: MouseEvent) => {
      event.stopPropagation();
      categoryInputButton();
    });
  }
};

const addNewNote = async (
  switchBtn: HTMLInputElement,
  switchBtnVisibility: HTMLLabelElement,
) => {
  clearSavedItemId();
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
  setModalState("note");
  if (switchBtn) switchBtn.checked = false;
  await switchOverlayInterface(switchBtn);
  openModal(null);
  updateCategorySelect(getValue(StorageKeys.CATEGORIES));
  if (switchBtnVisibility) switchBtnVisibility.classList.remove("hidden");
};

const collapseCategories = (): void => {
  const categoryList = getElement<HTMLDivElement>(".category-list");
  categoryList.classList.toggle("collapsed");
  if (categoryList.hasChildNodes()) {
    for (const children of categoryList.children) {
      children.classList.toggle("collapsed");
    }
  }
};

const applyMode = (): void => {
  const mode = getMode();
  if (mode === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
};

const toggleDarkMode = (): void => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("light");
    setMode("dark");
  } else {
    document.body.classList.add("light");
    setMode("light");
  }
};

const categoryInputButton = async (): Promise<void> => {
  const categoryBtn = getElementOrNull<HTMLButtonElement>(".category-btn");
  if (!categoryBtn) return;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "category-input";
  input.placeholder = "Input category name";
  categoryBtn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(categoryBtn);
  if (value) categoryToBeRendered(value);
};

export { applyMode, registerDocumentHandlers };
