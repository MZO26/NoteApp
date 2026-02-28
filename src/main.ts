import {
  activeCategoryState,
  categoryToBeRendered,
  reloadCategoryList,
} from "./features/categories.js";
import { reloadNoteList } from "./features/notes.js";
import { applyMode } from "./handlers/documentHandlers.js";
import { updateCategorySelect } from "./handlers/modalHandlers.js";
import type { CategoryArray } from "./types/storageTypes.js";
import {
  changeOverlayInterface,
  openOverlay,
} from "./ui-components/renderModalUI.js";
import { getCategories } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const status: string | null = localStorage.getItem("modal-status");
  if (status === "open") {
    openOverlay();
    requestAnimationFrame(() => {
      changeOverlayInterface();
    });
  }
  const categoryArr: CategoryArray = getCategories();
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
