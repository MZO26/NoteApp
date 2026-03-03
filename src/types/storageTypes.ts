import type { Category, Note } from "../utils/classes.js";
import type { NoteObject } from "./noteTypes.js";

type NoteArray = Array<Note>;
type CategoryArray = Array<Category>;
type DocumentMode = string;
type SavedNoteID = number;
type TempToDo = Partial<NoteObject> &
  Pick<NoteObject, "id" | "title" | "data"> & {
    dataCompleted: Array<string>;
  };

type TempNote = Partial<NoteObject> & Pick<NoteObject, "id" | "title" | "data">;

export type {
  CategoryArray,
  DocumentMode,
  NoteArray,
  SavedNoteID,
  TempNote,
  TempToDo,
};
