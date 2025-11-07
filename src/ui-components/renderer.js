import {
  categoryToBeRendered,
  reloadCategoryList,
  activeCategoryState,
} from "../features/categories.js";
import {
  updateCategorySelect,
  toggleDarkMode,
  openOverlay,
  switchBtn,
} from "../buttons.js";
import { reloadNoteList } from "../features/notes.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalStatus = localStorage.getItem("modal-status");
  const modalState = JSON.parse(localStorage.getItem("modal-state")) || {
    interface: "note",
  };
  if (modalState.interface === "toDo") {
    switchBtn.click();
  }
  localStorage.setItem("modalState", JSON.stringify({ interface: "note" }));
  if (modalStatus == "open") {
    openOverlay();
  }
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  reloadCategoryList();
  if (categoryArr.length) {
    updateCategorySelect(categoryArr);
  }
  reloadNoteList();
  if (categoryArr.length === 0) {
    categoryToBeRendered(activeCategoryState.activeCategory);
  }
  const mode = localStorage.getItem("mode");
  if (!document.body.classList.contains(`${mode}`)) {
    toggleDarkMode();
  }
});
