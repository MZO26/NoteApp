import {
  categoryToBeRendered,
  reloadCategoryList,
} from "./features/categories.js";
import { reloadNoteList } from "./features/notes.js";
import { applyMode } from "./handlers/documentHandlers.js";
import { updateCategorySelect } from "./handlers/modalHandlers.js";
import { activeCategoryState } from "./states/sharedStates.js";
import type { CategoryArray } from "./types/storageTypes.js";
import {
  changeOverlayInterface,
  openOverlay,
} from "./ui-components/renderModalUI.js";
import { showToast } from "./utils/events.js";
import { getCategories } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const status: string | null = localStorage.getItem("modal-status");
  if (status === "open") {
    requestAnimationFrame(() => {
      openOverlay();
      changeOverlayInterface();
    });
  }
  const categoryArr: CategoryArray = getCategories();
  reloadCategoryList();
  if (categoryArr.length) {
    updateCategorySelect(categoryArr);
  }
  if (categoryArr.length === 0) {
    categoryToBeRendered(activeCategoryState.activeCategory);
  }
  document.querySelectorAll("#categoryItem").forEach((item) => {
    item.classList.remove("active");
  });
  showToast("Switched to default Category");
  reloadNoteList();
  applyMode();
});
