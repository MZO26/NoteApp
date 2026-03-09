import type { Item } from "../../types/featureTypes.js";
import type { ItemArray } from "../../types/storageTypes.js";
import { reloadItemList, renderItem } from "../../ui/itemRenderer.js";
import { showToast } from "../../utils/events.js";
import { createNewNote } from "../../utils/models.js";
import { syncItemState } from "../../utils/stateUtils.js";
import { removeValue, StorageKeys } from "../../utils/storageService.js";
import { getNoteFormData } from "./noteUtils.js";

const handleNoteSave = (
  savedItemId: number | null,
  itemArr: ItemArray,
  selectedCategory: string,
): void => {
  const formData = getNoteFormData();
  if (!formData) return;
  if (savedItemId === null) {
    const newNote = createNewNote(
      "note",
      selectedCategory,
      formData.titleValue,
      formData.noteDataToArr,
    );
    renderItem(newNote);
  } else {
    updateExistingNote(savedItemId, itemArr, selectedCategory, formData);
  }
  removeValue(StorageKeys.TEMP_NOTE);
};

const updateExistingNote = (
  savedItemId: number,
  itemArr: ItemArray,
  selectedCategory: string,
  formData: ReturnType<typeof getNoteFormData>,
) => {
  if (!formData) return;
  const savedItem: Item | undefined = itemArr.find(
    (item) => item.id === savedItemId,
  );
  if (savedItem && savedItem.type === "note") {
    const updatedItem = {
      ...savedItem,
      title: formData.titleValue,
      data: formData.noteDataToArr,
      category: selectedCategory,
    };
    const updatedArray = syncItemState(savedItemId, updatedItem, itemArr);
    showToast("Note was saved");
    reloadItemList(updatedArray);
  }
};

export { handleNoteSave };
