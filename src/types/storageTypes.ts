import type { Category, Note } from "../utils/classes.js";

type NoteArray = Array<Note>;
type CategoryArray = Array<Category>;
type TempToDo = Partial<Note> &
  Pick<Note, "id" | "title" | "data"> & {
    dataCompleted: Array<string>;
  };

type TempNote = Partial<Note> & Pick<Note, "id" | "title" | "data">;

export type { CategoryArray, NoteArray, TempNote, TempToDo };
