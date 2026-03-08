import type { TempNote, TempToDo } from "../types/storageTypes.js";
import { Category, Note, ToDo } from "./classes.js";

const StorageKeys = {
  ITEMS: "itemArr",
  CATEGORIES: "categoryArr",
  TEMP_NOTE: "tempNoteValue",
  TEMP_TODO: "tempToDoValue",
} as const;

type StorageKey = keyof StorageData;

interface StorageData {
  [StorageKeys.ITEMS]: (Note | ToDo)[];
  [StorageKeys.CATEGORIES]: Category[];
  [StorageKeys.TEMP_NOTE]: TempNote | null;
  [StorageKeys.TEMP_TODO]: TempToDo | null;
}

const defaultValues: StorageData = {
  [StorageKeys.ITEMS]: [],
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

function updateStorage<K extends keyof StorageData>(
  key: K,
  updater: (currentData: StorageData[K]) => StorageData[K],
): StorageData[K] {
  const currentData = getValue(key);
  const newData = updater(currentData);
  setValue(key, newData);
  return newData;
}

export { getValue, removeValue, setValue, StorageKeys, updateStorage };
