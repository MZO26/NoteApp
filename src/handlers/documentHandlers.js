import { categoryToBeRendered } from "../features/categories.js";
import { filter } from "../features/filter.js";
import {
  changeOverlayInterface,
  openOverlay,
} from "../ui-components/renderModalUI.js";
import { inputListener } from "../utils/events.js";
import { resetNoteInterface } from "./modalHandlers.js";

const filterInput = document.querySelector(".search-input");
const switchBtn = document.querySelector(".switch-checkbox");
const darkModeBtn = document.querySelector(".dark-mode-btn");
const toggleBtn = document.querySelector(".toggle-btn");
const categoryBtn = document.querySelector(".category-btn");
const showBtn = document.querySelector(".showModal-btn");
const openInfoBtn = document.querySelector(".info-btn");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const switchBtnVisibility = document.querySelector(".switch");

filterInput.addEventListener("click", filter);

openInfoBtn.addEventListener("click", () => {
  sidebarOverlay.classList.toggle("visible");
  sidebarOverlay.classList.toggle("hidden");
});

const addNewNote = () => {
  localStorage.setItem("modal-state", JSON.stringify({ interface: "note" }));
  if (switchBtn) switchBtn.checked = false;
  changeOverlayInterface();
  resetNoteInterface();
  openOverlay();
  if (switchBtnVisibility) switchBtnVisibility.classList.remove("hidden");
};
showBtn.addEventListener("click", addNewNote);

const collapseCategories = () => {
  const categoryList = document.querySelector(".category-list");
  categoryList.classList.toggle("collapsed");
  if (categoryList.hasChildNodes()) {
    [...categoryList.children].forEach((child) =>
      child.classList.toggle("collapsed")
    );
  }
};
toggleBtn.addEventListener("click", collapseCategories);

const applyMode = () => {
  const mode = localStorage.getItem("mode") || "dark";
  if (mode === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
};

const toggleDarkMode = () => {
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

const categoryInputButton = async () => {
  const categoryBtn = document.querySelector(".category-btn");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "category-input";
  input.placeholder = "Input category name";
  categoryBtn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(categoryBtn);
  if (value) categoryToBeRendered(value);
};
categoryBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryInputButton();
});

export { applyMode };
