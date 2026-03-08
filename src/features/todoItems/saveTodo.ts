import type { Item } from "../../types/featureTypes.js";
import type { ItemArray } from "../../types/storageTypes.js";
import { reloadItemList, renderItem } from "../../ui/itemRenderer.js";
import { createNewToDo } from "../../utils/classes.js";
import { showToast } from "../../utils/events.js";
import { syncItemState } from "../../utils/stateUtils.js";
import { removeValue, StorageKeys } from "../../utils/storageService.js";
import { getToDoFormData } from "./todoUtils.js";

const handleToDoSave = (
  savedItemId: number | null,
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
  } else {
    updateExistingToDo(savedItemId, itemArr, selectedCategory, formData);
  }
  removeValue(StorageKeys.TEMP_TODO);
};

const updateExistingToDo = (
  savedItemId: number,
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
    const updatedArray = syncItemState(savedItemId, updatedItem, itemArr);
    showToast("ToDo-list was saved");
    reloadItemList(updatedArray);
  }
};

export { handleToDoSave };
