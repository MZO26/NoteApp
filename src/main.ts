import {
  categoryToBeRendered,
  reloadCategoryList,
} from "./features/categories.js";
import { applyMode } from "./handlers/documentHandlers.js";
import { updateCategorySelect } from "./handlers/modalHandlers.js";
import { defaultCategory } from "./states/sharedStates.js";
import type { CategoryArray } from "./types/storageTypes.js";
import { getCategories } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryArr: CategoryArray = getCategories();
  reloadCategoryList();
  if (categoryArr.length) {
    updateCategorySelect(categoryArr);
  }
  if (categoryArr.length === 0) {
    categoryToBeRendered(defaultCategory);
    updateCategorySelect(categoryArr);
  }
  applyMode();
});
