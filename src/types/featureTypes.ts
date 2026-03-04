type CategoryItem = HTMLDivElement & {
  _listener?: ((event: Event) => void) | null;
};

type NoteItem = HTMLDivElement & {
  _listener?: ((event: Event) => void) | null;
};

type AddToDoButton = HTMLButtonElement & {
  _addHandlerRef?: any;
};

type ToDoInterfaceElements = {
  todoDiv: HTMLDivElement;
  input: HTMLInputElement;
  addBtn: HTMLButtonElement;
  taskList: HTMLUListElement;
  title: HTMLTextAreaElement;
};

type TaskItems = {
  li: HTMLLIElement;
  checkbox: HTMLInputElement;
  taskSpan: HTMLSpanElement;
  taskDeleteBtn: HTMLButtonElement;
};

export type {
  AddToDoButton,
  CategoryItem,
  NoteItem,
  TaskItems,
  ToDoInterfaceElements,
};
