import { defaultCategory } from "../features/categories.js";
import type { CategoryObject } from "../types/categoryTypes.js";
import type { NoteObject } from "../types/noteTypes.js";
import type { ActiveCategoryState } from "../types/stateTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import { dateTemplate } from "./templates.js";

interface CategoryInterface extends CategoryObject {}

class Category implements CategoryInterface {
  id: number;
  items: Note[];
  name: string;
  isDefault?: boolean;
  constructor(id: number, items: Note[], name: string, isDefault?: boolean) {
    this.id = id;
    this.items = items;
    this.name = name;
    this.isDefault = isDefault || false;
  }
}

interface NoteInterface extends NoteObject {}

class Note implements NoteInterface {
  id: number;
  type: string;
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
  constructor(
    id: number,
    type: string,
    category: string,
    title: string,
    data: Array<string>,
    formattedDate: string
  ) {
    this.id = id;
    this.type = type;
    this.category = category;
    this.title = title;
    this.data = data;
    this.formattedDate = formattedDate;
  }
}

const createNewCategory: (
  categoryName: string,
  notesArr: NoteArray
) => Category = (categoryName, notesArr) => {
  const categoryItems =
    notesArr.filter((notes) => notes.category == categoryName) || [];
  return new Category(
    Date.now() + Math.random(),
    categoryItems,
    categoryName,
    false
  );
};

const createNewNote: (
  type: string,
  category: string | null,
  title: string,
  data: Array<string>
) => Note = (type, category, title, data) => {
  const storedState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedState
    ? JSON.parse(storedState)
    : { activeCategory: defaultCategory };
  return new Note(
    Date.now() + Math.random(),
    type,
    category || activeCategoryState.activeCategory,
    title,
    data,
    dateTemplate()
  );
};

export { createNewCategory, createNewNote, type Category, type Note };
