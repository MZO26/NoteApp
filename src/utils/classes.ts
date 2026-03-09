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
  type: "note";
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
}

export interface ToDoInterface {
  id: number;
  type: "toDo";
  category: string;
  data: Array<{ content: string; completed: boolean }>;
  title: string;
  formattedDate: string;
}

class Note implements NoteInterface {
  id: number;
  type: "note";
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
  constructor(
    id: number,
    type: "note",
    category: string,
    title: string,
    data: Array<string>,
    formattedDate: string,
  ) {
    this.id = id;
    this.type = type;
    this.category = category;
    this.title = title;
    this.data = data;
    this.formattedDate = formattedDate;
  }
}

class ToDo implements ToDoInterface {
  id: number;
  type: "toDo";
  category: string;
  data: Array<{ content: string; completed: boolean }>;
  title: string;
  formattedDate: string;
  constructor(
    id: number,
    type: "toDo",
    category: string,
    title: string,
    data: Array<{ content: string; completed: boolean }>,
    formattedDate: string,
  ) {
    this.id = id;
    this.type = type;
    this.category = category;
    this.title = title;
    this.data = data;
    this.formattedDate = formattedDate;
  }
}

export { Category, Note, ToDo };
