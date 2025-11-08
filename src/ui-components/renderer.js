import {
  activeCategoryState,
  categoryToBeRendered,
  reloadCategoryList,
} from "../features/categories.js";
import { reloadNoteList } from "../features/notes.js";
import { applyMode } from "../handlers/documentHandlers.js";
import { updateCategorySelect } from "../handlers/modalHandlers.js";
import { openOverlay } from "./renderModalUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalStatus = localStorage.getItem("modal-status");
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
  applyMode();
});
