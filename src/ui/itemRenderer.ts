import { noteItemHandler } from "../features/noteItems/noteItemHandler.js";
import { toDoItemHandler } from "../features/todoItems/todoItemHandler.js";
import { getActiveCategory } from "../states/sharedStates.js";
import type { Item, RenderedItem } from "../types/featureTypes.js";
import type { ItemArray } from "../types/storageTypes.js";
import { Note, ToDo } from "../utils/classes.js";
import { StorageKeys, getValue, setValue } from "../utils/storageService.js";
import { noteItemTemplate, toDoItemTemplate } from "./itemUI.js";

const renderItem = (item: Item): void => {
  const itemContainer =
    document.querySelector<HTMLDivElement>(".item-container");
  if (!itemContainer) return;
  const itemArr: ItemArray = getValue(StorageKeys.ITEMS);
  const itemDiv = document.createElement("div");
  switch (item.type) {
    case "note":
      createNewNoteItem(itemDiv, item, itemArr);
      break;
    case "toDo":
      createNewToDoItem(itemDiv, item, itemArr);
      break;
  }
  setValue(StorageKeys.ITEMS, itemArr);
  itemContainer.appendChild(itemDiv);
};

const createItemForReload = (item: Item): RenderedItem => {
  const renderedItem = document.createElement("div");
  renderedItem.setAttribute("data-id", item.id);
  renderedItem.className = `${item.type}Item`;
  switch (item.type) {
    case "note":
      renderedItem.innerHTML = noteItemTemplate(item);
      noteItemHandler(renderedItem, item);
      break;
    case "toDo":
      renderedItem.innerHTML = toDoItemTemplate(item);
      toDoItemHandler(renderedItem, item);
      break;
  }
  return renderedItem;
};

const createNewToDoItem = (
  itemDiv: HTMLDivElement,
  newToDo: ToDo,
  itemArr: ItemArray,
): void => {
  itemDiv.className = "toDoItem";
  itemDiv.setAttribute("data-id", newToDo.id);
  itemDiv.innerHTML = toDoItemTemplate(newToDo);
  itemArr.push(newToDo);
  toDoItemHandler(itemDiv, newToDo);
};

const createNewNoteItem = (
  itemDiv: HTMLDivElement,
  newNote: Note,
  itemArr: ItemArray,
): void => {
  itemDiv.className = "noteItem";
  itemDiv.setAttribute("data-id", newNote.id);
  itemDiv.innerHTML = noteItemTemplate(newNote);
  itemArr.push(newNote);
  noteItemHandler(itemDiv, newNote);
};

const reloadItemList = (
  updatedArray?: ItemArray,
  selectedCategory?: string,
): void => {
  const itemContainer =
    document.querySelector<HTMLDivElement>(".item-container");
  if (!itemContainer) return;
  const itemArr: ItemArray = updatedArray || getValue(StorageKeys.ITEMS);
  const activeCategory = selectedCategory || getActiveCategory();
  const activeCategoryItems: ItemArray = itemArr.filter(
    (items) => items.category === activeCategory,
  );
  itemContainer.innerHTML = "";
  for (let i = 0; i < activeCategoryItems.length; i++) {
    const item = activeCategoryItems[i];
    if (!item) continue;
    const renderedItem = createItemForReload(item);
    itemContainer.appendChild(renderedItem);
  }
};

export { createNewNoteItem, createNewToDoItem, reloadItemList, renderItem };
