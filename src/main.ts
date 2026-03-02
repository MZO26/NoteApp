import {
  categoryToBeRendered,
  reloadCategoryList,
} from "./features/categories.js";
import { applyMode } from "./handlers/documentHandlers.js";
import { updateCategorySelect } from "./handlers/modalHandlers.js";
import { defaultCategory } from "./states/sharedStates.js";
import type { CategoryArray } from "./types/storageTypes.js";
import {
  changeOverlayInterface,
  openOverlay,
} from "./ui-components/renderModalUI.js";
import { getCategories } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const status: string | null = localStorage.getItem("modal-status");
  if (status === "open") {
    requestAnimationFrame(() => {
      openOverlay();
      changeOverlayInterface();
      document.querySelectorAll("#categoryItem").forEach((item) => {
        item.classList.remove("active");
      });
    });
  }
  const categoryArr: CategoryArray = getCategories();
  reloadCategoryList();
  if (categoryArr.length) {
    updateCategorySelect(categoryArr);
  }
  if (categoryArr.length === 0) {
    categoryToBeRendered(defaultCategory);
    updateCategorySelect(getCategories());
  }
  applyMode();
});
