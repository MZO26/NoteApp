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
import { getValue, removeValue, StorageKeys } from "../utils/storageService.js";
import {
  switchOverlayInterface,
  updateCategorySelect,
} from "./modalHandlers.js";

const filterInput = document.querySelector<HTMLInputElement>(".search-input")!;
const switchBtn = document.querySelector<HTMLInputElement>(".switch-checkbox");
const darkModeBtn =
  document.querySelector<HTMLButtonElement>(".dark-mode-btn")!;
const toggleBtn = document.querySelector<HTMLButtonElement>(".toggle-btn")!;
const categoryBtn = document.querySelector<HTMLButtonElement>(".category-btn");
const showBtn = document.querySelector<HTMLButtonElement>(".showModal-btn")!;
const openInfoBtn = document.querySelector<HTMLButtonElement>(".info-btn");
const sidebarOverlay =
  document.querySelector<HTMLDivElement>(".sidebar-overlay");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

filterInput.addEventListener("click", filter);

openInfoBtn?.addEventListener("click", (): void => {
  sidebarOverlay?.classList.toggle("visible");
  sidebarOverlay?.classList.toggle("hidden");
});

const addNewNote = async () => {
  clearSavedItemId();
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
  setModalState("note");
  if (switchBtn) switchBtn.checked = false;
  await switchOverlayInterface();
  openModal(null);
  updateCategorySelect(getValue(StorageKeys.CATEGORIES));
  if (switchBtnVisibility) switchBtnVisibility.classList.remove("hidden");
};

showBtn.addEventListener("click", addNewNote);

const collapseCategories = (): void => {
  const categoryList = document.querySelector<HTMLDivElement>(".category-list");
  if (!categoryList) return;
  categoryList.classList.toggle("collapsed");
  if (categoryList.hasChildNodes()) {
    for (const children of categoryList.children) {
      children.classList.toggle("collapsed");
    }
  }
};

toggleBtn.addEventListener("click", collapseCategories);

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

darkModeBtn.addEventListener("click", toggleDarkMode);

const categoryInputButton = async (): Promise<void> => {
  const categoryBtn =
    document.querySelector<HTMLButtonElement>(".category-btn");
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

categoryBtn?.addEventListener("click", (event: MouseEvent) => {
  event.stopPropagation();
  categoryInputButton();
});

export { applyMode };
