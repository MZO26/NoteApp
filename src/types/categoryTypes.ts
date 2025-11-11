import type { NoteObject } from "./noteTypes";

type CategoryObject = {
  id: number;
  items: Array<NoteObject>;
  name: string;
  isDefault?: boolean;
};

type CategoryItem = HTMLDivElement;

export type { CategoryItem, CategoryObject };
