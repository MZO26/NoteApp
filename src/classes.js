class Category {
  constructor(id, items, name, isDefault = false) {
    (this.id = id),
      (this.items = items),
      (this.name = name),
      (this.isDefault = isDefault);
  }
}

class Note {
  constructor(id, category, data, priority, title, formattedDate) {
    (this.id = id),
      (this.category = category),
      (this.data = data),
      (this.priority = priority),
      (this.title = title),
      (this.formattedDate = formattedDate);
  }
}

export { Category, Note };
