import type { Category, Note } from "../utils/classes.js";
import type { NoteObject } from "./noteTypes.js";

type NoteArray = Array<Note>;
type CategoryArray = Array<Category>;
type DocumentMode = string;
type SavedNoteID = number;
type TempToDoValue = Partial<NoteObject> &
  Pick<NoteObject, "title" | "data"> & {
    dataCompleted: Array<string>;
  };

type TempNoteValue = Partial<NoteObject> & Pick<NoteObject, "title" | "data">;

export type {
  CategoryArray,
  DocumentMode,
  NoteArray,
  SavedNoteID,
  TempNoteValue,
  TempToDoValue,
};
