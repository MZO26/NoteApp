import type { TempNote, TempToDo } from "../types/storageTypes.js";
import { Category, Note } from "./classes.js";

export const StorageKeys = {
  NOTES: "notesArr",
  CATEGORIES: "categoryArr",
  TEMP_NOTE: "tempNoteValue",
  TEMP_TODO: "tempToDoValue",
} as const;

type StorageKey = keyof StorageData;

interface StorageData {
  [StorageKeys.NOTES]: Note[];
  [StorageKeys.CATEGORIES]: Category[];
  [StorageKeys.TEMP_NOTE]: TempNote | null;
  [StorageKeys.TEMP_TODO]: TempToDo | null;
}

const defaultValues: StorageData = {
  [StorageKeys.NOTES]: [],
  [StorageKeys.CATEGORIES]: [],
  [StorageKeys.TEMP_NOTE]: null,
  [StorageKeys.TEMP_TODO]: null,
};

const cache: Partial<StorageData> = {};
const timers: Record<string, ReturnType<typeof setTimeout>> = {};

function getValue<K extends StorageKey>(key: K): StorageData[K] {
  if (cache[key] !== undefined) {
    return cache[key] as StorageData[K];
  }
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValues[key];
  try {
    const parsed = JSON.parse(raw) as StorageData[K];
    cache[key] = parsed;
    return parsed;
  } catch {
    return defaultValues[key];
  }
}
function setValue<K extends StorageKey>(
  key: K,
  value: StorageData[K],
  delay = 100,
) {
  cache[key] = value;
  if (timers[key]) {
    clearTimeout(timers[key]);
  }
  timers[key] = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error while saving "${key}"`, err);
    }
    delete timers[key];
  }, delay);
}

function removeValue<K extends StorageKey>(key: K): void {
  delete cache[key];
  if (timers[key]) {
    clearTimeout(timers[key]);
    delete timers[key];
  }
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error while removing "${key}" from localStorage`, err);
  }
}

function updateNotes(updater: (currentNotes: Note[]) => Note[]): Note[] {
  const currentNotes = getValue(StorageKeys.NOTES);
  const newNotes = updater(currentNotes);
  setValue(StorageKeys.NOTES, newNotes);
  return newNotes;
}

function updateCategories(
  updater: (currentCategories: Category[]) => Category[],
): Category[] {
  const currentCategories = getValue(StorageKeys.CATEGORIES);
  const newCategories = updater(currentCategories);
  setValue(StorageKeys.CATEGORIES, newCategories);
  return newCategories;
}

export { getValue, removeValue, setValue, updateCategories, updateNotes };
