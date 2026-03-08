import type { Item } from "../types/featureTypes.js";
import type { ItemArray } from "../types/storageTypes.js";
import { StorageKeys, updateStorage } from "./storageService.js";

const syncItemState = (
  savedItemId: number,
  updatedItem: Item,
  itemArr: ItemArray,
): ItemArray => {
  updateStorage(StorageKeys.ITEMS, (currentItems) =>
    currentItems.map((item) => (item.id === savedItemId ? updatedItem : item)),
  );
  const updatedItemArray = itemArr.map((item) =>
    item.id === savedItemId ? updatedItem : item,
  );
  return updatedItemArray;
};

export { syncItemState };
