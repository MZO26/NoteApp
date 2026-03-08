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

function getSavedItemId(): number | null {
  try {
    const idString = sessionStorage.getItem("savedItemId");
    if (!idString) return null;
    const id = Number(idString);
    return Number.isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

function setSavedItemId(id: number | null) {
  try {
    if (id === null) {
      clearSavedItemId();
      return;
    }
    sessionStorage.setItem("savedItemId", String(id));
  } catch {
    return;
  }
}

function clearSavedItemId(): void {
  try {
    sessionStorage.removeItem("savedItemId");
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
