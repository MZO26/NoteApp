import {
  categoryToBeRendered,
  reloadCategoryList,
  reloadNoteList,
  activeCategoryState,
} from "./sidebar.js";
import {
  updateCategorySelect,
  toggleDarkMode,
  openOverlay,
} from "./buttons.js";

window.onload = () => {
  const modalStatus = localStorage.getItem("modal-status");
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
};
