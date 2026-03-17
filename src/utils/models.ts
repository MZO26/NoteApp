import { v4 as uuidv4 } from "uuid";
import { dateTemplate } from "../ui/itemUI.js";
import { Category, Note } from "./classes.js";

const createNewCategory: (categoryName: string) => Category = (
  categoryName,
) => {
  return new Category(uuidv4(), categoryName, false);
};

const createNewNote: (
  type: "note",
  category: string,
  title: string,
  data: Array<string>,
) => Note = (type, category, title, data) => {
  return new Note(uuidv4(), type, category, title, data, dateTemplate());
};

export { createNewCategory, createNewNote };
