import {
  categoryToBeRendered,
  defaultCategory,
  reloadCategoryList,
} from "./features/categories.js";
import {
  applyMode,
  registerDocumentHandlers,
} from "./handlers/documentHandlers.js";
import { registerModalHandlers } from "./handlers/modalHandlers.js";
import type { CategoryArray } from "./types/storageTypes.js";
import { getValue, StorageKeys } from "./utils/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
  registerDocumentHandlers();
  registerModalHandlers();
  const categoryArr: CategoryArray = getValue(StorageKeys.CATEGORIES);
  reloadCategoryList(categoryArr);
  if (categoryArr.length === 0) {
    categoryToBeRendered(defaultCategory);
  }
  applyMode();
});
