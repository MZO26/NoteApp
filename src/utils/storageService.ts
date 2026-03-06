import type { TempNote, TempToDo } from "../types/storageTypes.js";
import { Category, Note } from "./classes.js";

type Listener<T> = (value: T) => void;

const KEYS = {
  NOTES: "notesArr",
  CATEGORIES: "categoryArr",
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

const cache: Record<Key, unknown> = {
  [KEYS.NOTES]: null,
  [KEYS.CATEGORIES]: null,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("storageService: parse error, using fallback", err);
    return fallback;
  }
}

function getValue<T>(key: Key, fallback: T): T {
  if (cache[key] === null) {
    cache[key] = safeParse(localStorage.getItem(key), fallback);
  }
  return cache[key] as T;
}

function setValue<T>(key: Key, value: T, delay = 100): void {
  cache[key] = value;

  const timers = ((window as any).___storage_timers ||= {} as Record<
    Key,
    number
  >);
  if (timers[key]) clearTimeout(timers[key]);

  timers[key] = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyListeners(key, value);
    } catch (err) {
      console.error(`storageService: failed to save key "${key}"`, err);
    }
    delete timers[key];
  }, delay);
}

function notifyListeners<T>(key: Key, value: T): void {
  const listeners = ((window as any).___storage_listeners ||= {} as Record<
    Key,
    Listener<any>[]
  >);
  const cbs = listeners[key] || [];
  cbs.forEach((cb: any) => {
    try {
      cb(value);
    } catch (e) {
      console.error("listener error", e);
    }
  });
}

function getNotes(): Note[] {
  return getValue(KEYS.NOTES, [] as Note[]);
}

function saveNotes(notes: Note[]): void {
  setValue(KEYS.NOTES, notes);
}

function updateNotes(updater: (prev: Note[]) => Note[]): Note[] {
  const prev = getNotes();
  const next = updater(prev);
  saveNotes(next);
  return next;
}

function getCategories(): Category[] {
  return getValue(KEYS.CATEGORIES, [] as Category[]);
}

function saveCategories(categories: Category[]): void {
  setValue(KEYS.CATEGORIES, categories);
}

function updateCategories(
  updater: (prev: Category[]) => Category[],
): Category[] {
  const prev = getCategories();
  const next = updater(prev);
  saveCategories(next);
  return next;
}

function getTempNote(): TempNote | null {
  try {
    const json = localStorage.getItem("tempNoteValue");
    if (json) {
      return JSON.parse(json) as TempNote;
    } else return null;
  } catch (error) {
    return null;
  }
}

function saveTempNote(data: TempNote): void {
  localStorage.setItem("tempNoteValue", JSON.stringify(data));
}

function clearTempNote(): void {
  localStorage.removeItem("tempNoteValue");
}

function getTempToDo(): TempToDo | null {
  try {
    const json = localStorage.getItem("tempToDoValue");
    if (json) {
      return JSON.parse(json) as TempToDo;
    } else return null;
  } catch {
    return null;
  }
}

function saveTempToDo(data: TempToDo): void {
  localStorage.setItem("tempToDoValue", JSON.stringify(data));
}

function clearTempToDo(): void {
  localStorage.removeItem("tempToDoValue");
}

export {
  clearTempNote,
  clearTempToDo,
  getCategories,
  getNotes,
  getTempNote,
  getTempToDo,
  saveCategories,
  saveNotes,
  saveTempNote,
  saveTempToDo,
  updateCategories,
  updateNotes,
};
