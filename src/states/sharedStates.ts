function getActiveCategory(): string {
  try {
    const raw = localStorage.getItem("activeCategoryState");
    const state = raw
      ? JSON.parse(raw)
      : { activeCategory: "Without Category" };
    return state.activeCategory;
  } catch {
    return "Without Category";
  }
}

function setActiveCategory(categoryName: string): void {
  try {
    const state = { activeCategory: categoryName };
    localStorage.setItem("activeCategoryState", JSON.stringify(state));
  } catch {
    return;
  }
}

function getSavedNoteId(): number | null {
  try {
    const idString = sessionStorage.getItem("savedNoteId");
    if (!idString) return null;
    const id = Number(idString);
    return Number.isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

function setSavedNoteId(id: number | null) {
  try {
    if (id === null) {
      clearSavedNoteId();
      return;
    }
    sessionStorage.setItem("savedNoteId", String(id));
  } catch {
    return;
  }
}

function clearSavedNoteId(): void {
  try {
    sessionStorage.removeItem("savedNoteId");
  } catch {
    return;
  }
}

function getModalState(): string {
  try {
    const raw = localStorage.getItem("modalState");
    return raw ? JSON.parse(raw).interface : "note";
  } catch {
    return "note";
  }
}

function setModalState(modalInterface: string): void {
  try {
    const state = { interface: modalInterface };
    localStorage.setItem("modalState", JSON.stringify(state));
  } catch {
    return;
  }
}

function getMode(): string {
  try {
    const mode = localStorage.getItem("mode");
    return mode ? mode : "dark";
  } catch {
    return "dark";
  }
}

function setMode(newMode: string): void {
  try {
    localStorage.setItem("mode", newMode);
  } catch {
    return;
  }
}

export {
  clearSavedNoteId,
  getActiveCategory,
  getModalState,
  getMode,
  getSavedNoteId,
  setActiveCategory,
  setModalState,
  setMode,
  setSavedNoteId,
};
