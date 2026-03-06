import { getActiveCategory } from "../states/sharedStates.js";
import { dateTemplate } from "./templates.js";

export interface CategoryInterface {
  id: number;
  name: string;
  isDefault?: boolean;
}

class Category implements CategoryInterface {
  id: number;
  name: string;
  isDefault?: boolean;
  constructor(id: number, name: string, isDefault?: boolean) {
    this.id = id;
    this.name = name;
    this.isDefault = isDefault || false;
  }
}

export interface NoteInterface {
  id: number;
  type: string;
  category: string;
  data: Array<string>;
  dataCompleted?: Array<string>;
  title: string;
  formattedDate: string;
}

class Note implements NoteInterface {
  id: number;
  type: string;
  category: string;
  data: Array<string>;
  dataCompleted?: Array<string>;
  title: string;
  formattedDate: string;
  constructor(
    id: number,
    type: string,
    category: string,
    title: string,
    data: Array<string>,
    dataCompleted: Array<string> | undefined,
    formattedDate: string,
  ) {
    this.id = id;
    this.type = type;
    this.category = category;
    this.title = title;
    this.data = data;
    if (dataCompleted) {
      this.dataCompleted = dataCompleted;
    }
    this.formattedDate = formattedDate;
  }
}

const createNewCategory: (categoryName: string) => Category = (
  categoryName,
) => {
  return new Category(Date.now() + Math.random(), categoryName, false);
};

const createNewNote: (
  type: string,
  category: string | null,
  title: string,
  data: Array<string>,
  dataCompleted?: Array<string>,
) => Note = (type, category, title, data, dataCompleted) => {
  const activeCategory = getActiveCategory();
  return new Note(
    Date.now() + Math.random(),
    type,
    category || activeCategory,
    title,
    data,
    dataCompleted,
    dateTemplate(),
  );
};

export { Category, createNewCategory, createNewNote, Note };
