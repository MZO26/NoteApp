import { getActiveCategory } from "../states/sharedStates.js";
import { dateTemplate } from "../ui/itemUI.js";
import { Category, Note, ToDo } from "./classes.js";

const createNewCategory: (categoryName: string) => Category = (
  categoryName,
) => {
  return new Category(Date.now() + Math.random(), categoryName, false);
};

const createNewToDo: (
  type: "toDo",
  category: string,
  title: string,
  data: Array<{ content: string; completed: boolean }>,
) => ToDo = (type, category, title, data) => {
  const activeCategory = getActiveCategory();
  return new ToDo(
    Date.now() + Math.random(),
    type,
    category || activeCategory,
    title,
    data,
    dateTemplate(),
  );
};

const createNewNote: (
  type: "note",
  category: string,
  title: string,
  data: Array<string>,
) => Note = (type, category, title, data) => {
  const activeCategory = getActiveCategory();
  return new Note(
    Date.now() + Math.random(),
    type,
    category || activeCategory,
    title,
    data,
    dateTemplate(),
  );
};

export { createNewCategory, createNewNote, createNewToDo };
