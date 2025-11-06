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

export { CategoryItem, NoteItem };
