import { noteToBeRendered, reloadNoteList } from "../features/notes.js";
import { toDoToBeRendered } from "../features/toDo.js";
import {
  clearSavedNoteId,
  getActiveCategory,
  getModalState,
  getSavedNoteId,
  setModalState,
} from "../states/sharedStates.js";
import type { CategoryArray, NoteArray } from "../types/storageTypes.js";
import { renderUI } from "../ui-components/renderModalUI.js";
import { cancelAutoSave } from "../utils/autoSave.js";
import { Note } from "../utils/classes.js";
import { showToast } from "../utils/events.js";
import {
  getValue,
  removeValue,
  StorageKeys,
  updateNotes,
} from "../utils/storageService.js";

const closeBtn = document.querySelector<HTMLButtonElement>(".closeModal-btn")!;
const saveBtn = document.querySelector<HTMLButtonElement>(".add-btn")!;
const deleteBtn = document.querySelector<HTMLButtonElement>(".delete-btn")!;
const switchBtn = document.querySelector<HTMLInputElement>(".switch-checkbox");
const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const updateCategorySelect = (categoryArr: CategoryArray): void => {
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const activeCategory = getActiveCategory();
  if (!select) return;
  select.innerHTML = "";
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.name;
    if (option.textContent.length > 20) {
      option.textContent = option.textContent.slice(0, 20) + "...";
    }
    if (category.name === activeCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

const getNoteFormData = () => {
  const titleElement = document.querySelector<HTMLTextAreaElement>(".title");
  const noteElement = document.querySelector<HTMLTextAreaElement>(".note");
  if (!titleElement || !noteElement) return;
  const titleValue = titleElement.value.trim();
  const noteValue = noteElement.value.trim();
  const noteDataToArr: string[] = noteValue ? [noteValue] : [];
  return { titleValue, noteDataToArr };
};

const getToDoFormData = () => {
  const spans = Array.from(
    document.querySelectorAll<HTMLSpanElement>(".task-list li span"),
  );
  if (!spans) return;
  const completedTasks: string[] = spans
    .filter((span) => span.classList.contains("task-completed"))
    .map((span) => span.textContent || "");
  const allTasks: string[] = spans.map((span) => {
    return span.textContent || "";
  });
  const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
  const titleValue = title?.value.trim() || "";
  return { completedTasks, allTasks, titleValue };
};

const syncNoteState = (
  savedNoteId: number,
  updatedItem: Note,
  notesArr: NoteArray,
): NoteArray => {
  updateNotes((prev) =>
    prev.map((note) => (note.id === savedNoteId ? updatedItem : note)),
  );
  const updatedNotesArray = notesArr.map((note) =>
    note.id === savedNoteId ? updatedItem : note,
  );
  return updatedNotesArray;
};

const updateExistingNote = (
  savedNoteId: number,
  notesArr: NoteArray,
  selectedCategory: string,
  formData: ReturnType<typeof getNoteFormData>,
) => {
  if (!formData) return;
  const savedItem: Note | undefined = notesArr.find(
    (n) => n.id === savedNoteId,
  );
  if (savedItem && savedItem.type === "note") {
    const updatedItem = {
      ...savedItem,
      title: formData.titleValue,
      data: formData.noteDataToArr,
      category: selectedCategory,
    };
    const updatedArray = syncNoteState(savedNoteId, updatedItem, notesArr);
    showToast("Note was saved");
    reloadNoteList(updatedArray);
  }
};

const updateExistingToDo = (
  savedNoteId: number,
  notesArr: NoteArray,
  selectedCategory: string,
  formData: ReturnType<typeof getToDoFormData>,
): void => {
  if (!formData) return;
  const savedItem = notesArr.find((note) => note.id === savedNoteId);
  if (savedItem && savedItem.type === "toDo") {
    const updatedItem = {
      ...savedItem,
      title: formData.titleValue,
      data: formData.allTasks,
      dataCompleted: formData.completedTasks,
      category: selectedCategory,
    };
    const updatedArray = syncNoteState(savedNoteId, updatedItem, notesArr);
    showToast("ToDo-list was saved");
    reloadNoteList(updatedArray);
  }
};

const handleNoteSave = (
  savedNoteId: number | null,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const formData = getNoteFormData();
  if (!formData) return;
  if (savedNoteId === null) {
    noteToBeRendered(
      "note",
      selectedCategory,
      formData.titleValue,
      formData.noteDataToArr,
      undefined,
    );
  } else {
    updateExistingNote(savedNoteId, notesArr, selectedCategory, formData);
  }
  removeValue(StorageKeys.TEMP_NOTE);
};

const handleToDoSave = (
  savedNoteId: number | null,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const formData = getToDoFormData();
  if (!formData) return;
  if (savedNoteId === null) {
    toDoToBeRendered(
      "toDo",
      selectedCategory,
      formData.titleValue,
      formData.allTasks,
      formData.completedTasks,
    );
  } else {
    updateExistingToDo(savedNoteId, notesArr, selectedCategory, formData);
  }
  removeValue(StorageKeys.TEMP_TODO);
};

const saveButton = (): void => {
  cancelAutoSave();
  const notesArr: NoteArray = getValue(StorageKeys.NOTES);
  const savedNoteId = getSavedNoteId();
  const activeCategory = getActiveCategory();
  const modalState = getModalState();
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const selectedCategory: string | undefined = select
    ? select.options[select.selectedIndex]?.textContent
    : activeCategory;
  if (modalState === "toDo" && selectedCategory) {
    console.log("savedNoteId: ", savedNoteId);
    handleToDoSave(savedNoteId, notesArr, selectedCategory);
  } else if (modalState === "note" && selectedCategory) {
    console.log("savedNoteId: ", savedNoteId);
    handleNoteSave(savedNoteId, notesArr, selectedCategory);
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};

saveBtn.addEventListener("click", () => {
  saveButton();
  closeBtn.click();
});

const deleteButton = (): void => {
  const isConfirmed = window.confirm("Clear all content?");
  if (!isConfirmed) return;
  const modalState = getModalState();
  if (modalState === "note") {
    const title = document.querySelector<HTMLTextAreaElement>(".title");
    const content = document.querySelector<HTMLTextAreaElement>(".note");
    if (title && content) {
      title.value = "";
      content.value = "";
    }
  } else if (modalState === "toDo") {
    const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
    const content = document.querySelector<HTMLDivElement>(".task-list");
    if (title && content) {
      title.value = "";
      content.innerHTML = "";
    }
  }
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};
deleteBtn.addEventListener("click", deleteButton);

const closeModal = (): void => {
  overlay?.classList.remove("show");
  modal?.classList.remove("show");
  setTimeout(() => {
    if (
      switchBtnVisibility &&
      switchBtnVisibility.classList.contains("hidden")
    ) {
      switchBtnVisibility.classList.remove("hidden");
    }
  }, 300);
  clearSavedNoteId();
  removeValue(StorageKeys.TEMP_NOTE);
  removeValue(StorageKeys.TEMP_TODO);
};
closeBtn.addEventListener("click", closeModal);

const switchOverlayInterface = (): Promise<void> => {
  return new Promise((resolve) => {
    const isToDo = switchBtn?.checked || false;
    const modalState = isToDo ? "toDo" : "note";
    setModalState(modalState);
    requestAnimationFrame(() => {
      const modalHeadingElement =
        document.querySelector<HTMLHeadingElement>(".modal-heading");
      const modalNoteElement =
        document.querySelector<HTMLParagraphElement>(".modal-note");
      if (modalHeadingElement && modalNoteElement) {
        if (modalState === "note") {
          modalHeadingElement.textContent = "New note";
          modalNoteElement.textContent = "Add note";
        } else if (modalState === "toDo") {
          modalHeadingElement.textContent = "New toDo list";
          modalNoteElement.textContent = "Add toDo's";
        }
      } else return;
      renderUI(modalState);
      resolve();
    });
  });
};
switchBtn?.addEventListener("click", () => {
  switchOverlayInterface();
});

export { switchOverlayInterface, updateCategorySelect };
