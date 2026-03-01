import type {
  ActiveCategoryState,
  SavedNoteIdState,
} from "../types/stateTypes.js";

let defaultCategory: string = "Without category";
let activeCategoryState: ActiveCategoryState = {
  activeCategory: defaultCategory,
};
let savedNoteIdState: SavedNoteIdState = { savedNoteId: null };

export { activeCategoryState, defaultCategory, savedNoteIdState };
