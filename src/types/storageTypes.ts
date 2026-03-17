import type { Category, Note } from "../utils/classes.js";

type ItemArray = Array<Note>;
type CategoryArray = Array<Category>;
type TempNote = Partial<Note> & Pick<Note, "id" | "title" | "data">;

export type { CategoryArray, ItemArray, TempNote };
