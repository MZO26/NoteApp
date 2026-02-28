import type { CategoryObject } from "../types/categoryTypes";
import type { NoteObject } from "../types/noteTypes";

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

function getNotes(): NoteObject[] {
  return getValue(KEYS.NOTES, [] as NoteObject[]);
}

function saveNotes(notes: NoteObject[]): void {
  setValue(KEYS.NOTES, notes);
}

function updateNotes(
  updater: (prev: NoteObject[]) => NoteObject[],
): NoteObject[] {
  const prev = getNotes();
  const next = updater(prev);
  saveNotes(next);
  return next;
}

function getCategories(): CategoryObject[] {
  return getValue(KEYS.CATEGORIES, [] as CategoryObject[]);
}

function saveCategories(categories: CategoryObject[]): void {
  setValue(KEYS.CATEGORIES, categories);
}

function updateCategories(
  updater: (prev: CategoryObject[]) => CategoryObject[],
): CategoryObject[] {
  const prev = getCategories();
  const next = updater(prev);
  saveCategories(next);
  return next;
}

export {
  getCategories,
  getNotes,
  saveCategories,
  saveNotes,
  updateCategories,
  updateNotes,
};
