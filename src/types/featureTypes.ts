import type { Note, ToDo } from "../utils/classes.js";

type RenderedItem = HTMLDivElement & {
  _listener?: EventListener | null;
};

type AddToDoButton = HTMLButtonElement & {
  _addHandlerRef?: EventListener | null;
};

type Item = Note | ToDo;

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
  Item,
  RenderedItem,
  TaskItems,
  ToDoInterfaceElements,
};
