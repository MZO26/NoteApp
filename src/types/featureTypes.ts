type RenderedItem = HTMLDivElement & {
  _listener?: EventListener | null;
};

type AddToDoButton = HTMLButtonElement & {
  _addHandlerRef?: EventListener | null;
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

export type { AddToDoButton, RenderedItem, TaskItems, ToDoInterfaceElements };
