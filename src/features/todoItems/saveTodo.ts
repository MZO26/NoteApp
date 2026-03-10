import { setActiveCategory } from "../../states/sharedStates.js";
import type { Item } from "../../types/featureTypes.js";
import type { ItemArray } from "../../types/storageTypes.js";
import { renderItem } from "../../ui/itemRenderer.js";
import { showToast } from "../../utils/events.js";
import { createNewToDo } from "../../utils/models.js";
import { syncItemState } from "../../utils/stateUtils.js";
import { removeValue, StorageKeys } from "../../utils/storageService.js";
import { reloadCategoryList } from "../categories.js";
import { getToDoFormData } from "./todoUtils.js";

const handleToDoSave = (
  savedItemId: string | null,
  itemArr: ItemArray,
  selectedCategory: string,
): void => {
  const formData = getToDoFormData();
  if (!formData) return;
  if (savedItemId === null) {
    const newToDo = createNewToDo(
      "toDo",
      selectedCategory,
      formData.titleValue,
      formData.data,
    );
    renderItem(newToDo);
    showToast("New ToDo-list was created");
  } else {
    updateExistingToDo(savedItemId, itemArr, selectedCategory, formData);
  }
  setActiveCategory(selectedCategory);
  removeValue(StorageKeys.TEMP_TODO);
  setTimeout(() => {
    reloadCategoryList();
  }, 0);
};

const updateExistingToDo = (
  savedItemId: string,
  itemArr: ItemArray,
  selectedCategory: string,
  formData: ReturnType<typeof getToDoFormData>,
): void => {
  if (!formData) return;
  const savedItem: Item | undefined = itemArr.find(
    (item) => item.id === savedItemId,
  );
  if (savedItem && savedItem.type === "toDo") {
    const updatedItem = {
      ...savedItem,
      title: formData.titleValue,
      data: formData.data,
      category: selectedCategory,
    };
    syncItemState(savedItemId, updatedItem);
    showToast("ToDo-list was saved");
  }
};

export { handleToDoSave };
