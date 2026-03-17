// import { noteItemHandler } from "../features/noteItems/noteItemHandler.js";
// import type { RenderedItem } from "../types/featureTypes.js";
// import type { ItemArray } from "../types/storageTypes.js";
// import { Note } from "../utils/classes.js";
// import { getElement } from "../utils/helpers.js";
// import { noteItemTemplate } from "./itemUI.js";

// const renderItem = (item: Note): void => {
//   const itemContainer = getElement<HTMLDivElement>(".notes-container");
//   const itemArr: ItemArray = getValue(StorageKeys.ITEMS);
//   const itemDiv = document.createElement("div");
//   createNewNoteItem(itemDiv, item, itemArr);
//   setValue(StorageKeys.ITEMS, itemArr);
//   itemContainer.appendChild(itemDiv);
// };

// const createItemForReload = (item: Note): RenderedItem => {
//   const renderedItem = document.createElement("div");
//   renderedItem.setAttribute("data-id", item.id);
//   renderedItem.className = `${item.type}Item`;
//   renderedItem.innerHTML = noteItemTemplate(item);
//   noteItemHandler(renderedItem, item);
//   return renderedItem;
// };

// const createNewNoteItem = (
//   itemDiv: HTMLDivElement,
//   newNote: Note,
//   itemArr: ItemArray,
// ): void => {
//   itemDiv.className = "noteItem";
//   itemDiv.setAttribute("data-id", newNote.id);
//   itemDiv.innerHTML = noteItemTemplate(newNote);
//   itemArr.push(newNote);
//   noteItemHandler(itemDiv, newNote);
// };

// const reloadItemList = (
//   updatedArray?: ItemArray,
//   selectedCategory?: string,
// ): void => {
//   const itemContainer = getElement<HTMLDivElement>(".notes-container");
//   const itemArr: ItemArray = updatedArray || getValue(StorageKeys.ITEMS);
//   const activeCategory = selectedCategory || getActiveCategory();
//   const activeCategoryItems: ItemArray = itemArr.filter(
//     (items) => items.category === activeCategory,
//   );
//   itemContainer.innerHTML = "";
//   for (let i = 0; i < activeCategoryItems.length; i++) {
//     const item = activeCategoryItems[i];
//     if (!item) continue;
//     const renderedItem = createItemForReload(item);
//     itemContainer.appendChild(renderedItem);
//   }
// };

// export { createNewNoteItem, reloadItemList, renderItem };
