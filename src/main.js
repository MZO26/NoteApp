import {
  categoryToBeRendered,
  reloadCategoryList,
  reloadNoteList,
  state,
} from "./sidebar.js";
import {
  updateCategorySelect,
  optionHandler,
  toggleDarkMode,
} from "./buttons.js";

window.onload = () => {
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  reloadCategoryList();
  if (categoryArr.length) {
    updateCategorySelect(categoryArr);
  }
  const select = document.getElementById("category-select");
  if (select) {
    select.addEventListener("change", optionHandler);
  }
  reloadNoteList();
  if (categoryArr.length === 0) {
    categoryToBeRendered(state.active_category);
  }
  const mode = localStorage.getItem("mode");
  if (!document.body.classList.contains(`${mode}`)) {
    toggleDarkMode();
  }
};
