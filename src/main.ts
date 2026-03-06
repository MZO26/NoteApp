import {
  categoryToBeRendered,
  reloadCategoryList,
} from "./features/categories.js";
import { applyMode } from "./handlers/documentHandlers.js";
import { updateCategorySelect } from "./handlers/modalHandlers.js";
import type { CategoryArray } from "./types/storageTypes.js";
import { getCategories } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryArr: CategoryArray = getCategories();
  reloadCategoryList(categoryArr);
  if (categoryArr.length === 0) {
    categoryToBeRendered("Without Category");
  }
  updateCategorySelect(categoryArr);
  applyMode();
});
