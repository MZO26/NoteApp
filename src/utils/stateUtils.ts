import type { Item } from "../types/featureTypes.js";
import { StorageKeys, updateStorage } from "./storageService.js";

const syncItemState = (savedItemId: string, updatedItem: Item): void => {
  updateStorage(StorageKeys.ITEMS, (currentItems) =>
    currentItems.map((item) => (item.id === savedItemId ? updatedItem : item)),
  );
};

export { syncItemState };
