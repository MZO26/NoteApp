import { validate } from "uuid";
import { defaultCategory } from "../features/categories";

function getActiveCategory(): string {
  try {
    const raw = localStorage.getItem("activeCategoryState");
    const state = raw ? JSON.parse(raw) : { activeCategory: defaultCategory };
    return state.activeCategory;
  } catch (err) {
    console.error("Error retrieving active category:", err);
    return defaultCategory;
  }
}

function setActiveCategory(categoryName: string): void {
  try {
    const state = { activeCategory: categoryName };
    localStorage.setItem("activeCategoryState", JSON.stringify(state));
  } catch (err) {
    console.error("Error setting active category:", err);
    return;
  }
}

function getSavedItemId(): string | null {
  try {
    const idString = sessionStorage.getItem("savedItemId");
    if (!idString) return null;
    return !validate(idString) ? null : idString;
  } catch (err) {
    console.error("Error retrieving saved item ID:", err);
    return null;
  }
}

function setSavedItemId(id: string | null) {
  try {
    if (id === null) {
      clearSavedItemId();
      return;
    }
    sessionStorage.setItem("savedItemId", id);
  } catch (err) {
    console.error("Error setting saved item ID:", err);
    return;
  }
}

function clearSavedItemId(): void {
  try {
    sessionStorage.removeItem("savedItemId");
  } catch (err) {
    console.error("Error clearing saved item ID:", err);
    return;
  }
}

function getModalState(): string {
  try {
    const raw = localStorage.getItem("modalState");
    return raw ? JSON.parse(raw).interface : "note";
  } catch (err) {
    console.error("Error retrieving modal state:", err);
    return "note";
  }
}

function setModalState(modalInterface: string): void {
  try {
    const state = { interface: modalInterface };
    localStorage.setItem("modalState", JSON.stringify(state));
  } catch (err) {
    console.error("Error setting modal state:", err);
    return;
  }
}

function getMode(): string {
  try {
    const mode = localStorage.getItem("mode");
    return mode ? mode : "dark";
  } catch (err) {
    console.error("Error retrieving document mode:", err);
    return "dark";
  }
}

function setMode(newMode: string): void {
  try {
    localStorage.setItem("mode", newMode);
  } catch (err) {
    console.error("Error setting document mode:", err);
    return;
  }
}

export {
  clearSavedItemId,
  getActiveCategory,
  getModalState,
  getMode,
  getSavedItemId,
  setActiveCategory,
  setModalState,
  setMode,
  setSavedItemId,
};
