import { defaultCategory } from "./categories.js";
import { dateTemplate } from "./templates.js";

class CategoryItem {
  constructor(id, items, name, isDefault = false) {
    (this.id = id),
      (this.items = items),
      (this.name = name),
      (this.isDefault = isDefault);
  }
}

class NoteItem {
  constructor(id, type, category, data, title, formattedDate) {
    (this.id = id),
      (this.type = type),
      (this.category = category),
      (this.data = data),
      (this.title = title),
      (this.formattedDate = formattedDate);
  }
}

const createNewCategory = (categoryName, notesArr) => {
  const categoryItems =
    notesArr.filter((notes) => notes.category == categoryName) || [];
  return new CategoryItem(
    Date.now() + Math.random(),
    categoryItems,
    categoryName,
    false
  );
};

const createNewNote = (type, category = null, noteValue, noteTitle) => {
  const activeCategoryState = JSON.parse(
    localStorage.getItem("activeCategoryState")
  ) || { activeCategory: defaultCategory };
  return new NoteItem(
    Date.now() + Math.random(),
    type,
    category || activeCategoryState.activeCategory,
    noteValue,
    noteTitle,
    dateTemplate()
  );
};

export { CategoryItem, NoteItem, createNewCategory, createNewNote };
