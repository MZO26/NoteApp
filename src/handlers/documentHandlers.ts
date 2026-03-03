import { categoryToBeRendered } from "../features/categories.js";
import { filter } from "../features/filter.js";
import type { DocumentMode } from "../types/storageTypes.js";
import {
  changeOverlayInterface,
  openOverlay,
} from "../ui-components/renderModalUI.js";
import { inputListener } from "../utils/events.js";
import { clearTempNote, clearTempToDo } from "../utils/storageService.js";

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

const addNewNote = (): void => {
  clearTempNote();
  clearTempToDo();
  localStorage.setItem("modalState", JSON.stringify({ interface: "note" }));
  if (switchBtn) switchBtn.checked = false;
  requestAnimationFrame(() => {
    changeOverlayInterface();
    openOverlay();
    if (switchBtnVisibility) switchBtnVisibility.classList.remove("hidden");
  });
};
showBtn.addEventListener("click", addNewNote);

const collapseCategories = (): void => {
  const categoryList =
    document.querySelector<HTMLDivElement>(".category-list")!;
  categoryList.classList.toggle("collapsed");
  if (categoryList.hasChildNodes()) {
    for (const children of categoryList.children) {
      children.classList.toggle("collapsed");
    }
  }
};
toggleBtn.addEventListener("click", collapseCategories);

const applyMode = (): void => {
  const mode: DocumentMode = localStorage.getItem("mode") || "dark";
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
    localStorage.setItem("mode", "dark");
  } else {
    document.body.classList.add("light");
    localStorage.setItem("mode", "light");
  }
};
darkModeBtn.addEventListener("click", toggleDarkMode);

const categoryInputButton = async (): Promise<void> => {
  const categoryBtn =
    document.querySelector<HTMLButtonElement>(".category-btn")!;
  const input = document.createElement("input");
  input.type = "text";
  input.id = "category-input";
  input.placeholder = "Input category name";
  categoryBtn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(categoryBtn);
  if (value) categoryToBeRendered(value);
};
categoryBtn?.addEventListener("click", (e: MouseEvent) => {
  e.stopPropagation();
  categoryInputButton();
});

export { applyMode };
