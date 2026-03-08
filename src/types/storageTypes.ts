import type { Category, Note, ToDo } from "../utils/classes.js";

type ItemArray = Array<Note | ToDo>;
type CategoryArray = Array<Category>;
type TempToDo = Partial<ToDo> & Pick<ToDo, "id" | "title" | "data">;
type TempNote = Partial<Note> & Pick<Note, "id" | "title" | "data">;

export type { CategoryArray, ItemArray, TempNote, TempToDo };
