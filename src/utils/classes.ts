export interface CategoryInterface {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface NoteInterface {
  id: string;
  type: "note";
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
}

class Category implements CategoryInterface {
  id: string;
  name: string;
  isDefault?: boolean;
  constructor(id: string, name: string, isDefault?: boolean) {
    this.id = id;
    this.name = name;
    this.isDefault = isDefault || false;
  }
}

class Note implements NoteInterface {
  id: string;
  type: "note";
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
  constructor(
    id: string,
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

export { Category, Note };
