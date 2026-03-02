import { noteToBeRendered, reloadNoteList } from "../features/notes.js";
import { toDoToBeRendered } from "../features/toDo.js";
import { defaultCategory } from "../states/sharedStates.js";
import type { ActiveCategoryState, ModalState } from "../types/stateTypes.js";
import type {
  CategoryArray,
  NoteArray,
  SavedNoteID,
} from "../types/storageTypes.js";
import { changeOverlayInterface } from "../ui-components/renderModalUI.js";
import { Note } from "../utils/classes.js";
import { showToast } from "../utils/events.js";
import {
  clearTempNote,
  clearTempToDo,
  getNotes,
  saveNotes,
  updateNotes,
} from "../utils/storageService.js";

const closeBtn = document.querySelector<HTMLButtonElement>(".closeModal-btn")!;
const saveBtn = document.querySelector<HTMLButtonElement>(".add-btn")!;
const deleteBtn = document.querySelector<HTMLButtonElement>(".delete-btn")!;
const switchBtn = document.querySelector<HTMLInputElement>(".switch-checkbox");
const overlay = document.querySelector<HTMLDivElement>(".overlay");
const modal = document.querySelector<HTMLDivElement>(".modal");
const switchBtnVisibility = document.querySelector<HTMLLabelElement>(".switch");

const resetNoteInterface = (): void => {
  requestAnimationFrame(() => {
    const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
    const noteContent = document.querySelector<HTMLTextAreaElement>(".note");
    if (noteTitle) noteTitle.value = "";
    if (noteContent) noteContent.value = "";
    clearTempNote();
  });
};

const resetToDoInterface = (): void => {
  requestAnimationFrame(() => {
    const todoTitle =
      document.querySelector<HTMLTextAreaElement>(".todo-title");
    const todoContent = document.querySelector<HTMLDivElement>(".task-list");
    if (todoTitle) todoTitle.value = "";
    if (todoContent) todoContent.innerHTML = "";
    clearTempToDo();
  });
};

const updateCategorySelect = (categoryArr: CategoryArray): void => {
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const storedState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedState
    ? JSON.parse(storedState)
    : { activeCategory: defaultCategory };
  if (!select) return;
  select.innerHTML = "";
  categoryArr.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.name;
    if (option.textContent.length > 20) {
      option.textContent = option.textContent.slice(0, 20) + "...";
    }
    if (category.name == activeCategoryState.activeCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

const handleNoteSave = (
  savedNoteId: SavedNoteID,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const title = document.querySelector<HTMLTextAreaElement>(".title");
  const note = document.querySelector<HTMLTextAreaElement>(".note");
  if (note && title) {
    if (!savedNoteId) {
      noteToBeRendered(
        "note",
        selectedCategory,
        title.value || "",
        [note.value],
        undefined,
      );
    } else {
      const savedItem: Note | undefined = notesArr.find(
        (note) => note.id === savedNoteId,
      );
      if (savedItem && savedItem.type === "note") {
        savedItem.title = title.value.trim() || "";
        const noteDataToArr: Array<string> = note.value ? [note.value] : [];
        savedItem.data = noteDataToArr;
        savedItem.category = selectedCategory;
        updateNotes((prev) => [...prev, savedItem]);
        showToast("Note was saved");
        reloadNoteList();
      }
    }
  }
  console.log(notesArr);
  clearTempNote();
};

const handleToDoSave = (
  savedNoteId: SavedNoteID,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const spans: NodeList =
    document.querySelectorAll<HTMLSpanElement>(".task-list li span");
  const completedTasks: Array<string> = Array.from(spans)
    .filter((spans) => {
      const elements = spans as HTMLSpanElement;
      return elements.classList.contains("task-completed");
    })
    .map((element) => {
      return (element as HTMLSpanElement).textContent || "";
    });
  const allTasks: Array<string> = Array.from(spans).map((spans) => {
    return (spans as HTMLSpanElement).textContent || "";
  });
  const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
  if (!savedNoteId) {
    toDoToBeRendered(
      "toDo",
      selectedCategory,
      title?.value || "",
      allTasks,
      completedTasks,
    );
  } else {
    const savedItem = notesArr.find((note) => note.id === savedNoteId);
    if (savedItem && savedItem.type === "toDo") {
      savedItem.title = title?.value.trim() || "";
      savedItem.data = allTasks;
      savedItem.dataCompleted = completedTasks;
      savedItem.category = selectedCategory;
      notesArr[notesArr.findIndex((note) => note.id === savedNoteId)] =
        savedItem;

      showToast("ToDo-list was saved");
      reloadNoteList();
    }
  }
  saveNotes(notesArr);
  console.log(notesArr);
  clearTempToDo();
};

const saveButton = (): void => {
  const notesArr: NoteArray = getNotes();
  const savedNoteId: SavedNoteID = JSON.parse(
    sessionStorage.getItem("savedNoteId") || "null",
  );
  const storedCategoryState = localStorage.getItem("activeCategoryState");
  const activeCategoryState: ActiveCategoryState = storedCategoryState
    ? JSON.parse(storedCategoryState)
    : { activeCategory: defaultCategory };
  const storedModalState = localStorage.getItem("modalState");
  const modalState: ModalState = storedModalState
    ? JSON.parse(storedModalState)
    : {
        interface: "note",
      };
  const select = document.querySelector<HTMLSelectElement>(".category-select");
  const selectedCategory: string = select
    ? select.options[select.selectedIndex]!.textContent
    : activeCategoryState.activeCategory;
  if (modalState.interface === "toDo") {
    handleToDoSave(savedNoteId, notesArr, selectedCategory);
  } else if (modalState.interface === "note") {
    handleNoteSave(savedNoteId, notesArr, selectedCategory);
  }
  sessionStorage.removeItem("savedNoteId");
  clearTempNote();
  clearTempToDo();
};

saveBtn.addEventListener("click", () => {
  saveButton();
  closeBtn.click();
});

const deleteButton = (): void => {
  const storedModalState = localStorage.getItem("modalState");
  const modalState: ModalState = storedModalState
    ? JSON.parse(storedModalState)
    : {
        interface: "note",
      };
  if (modalState.interface === "note") {
    const title = document.querySelector<HTMLTextAreaElement>(".title");
    const content = document.querySelector<HTMLTextAreaElement>(".note");
    if (title && content) {
      title.value = "";
      content.value = "";
    }
  } else if (modalState.interface === "toDo") {
    const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
    const content = document.querySelector<HTMLDivElement>(".task-list");
    if (title && content) {
      title.value = "";
      content.innerHTML = "";
    }
  }
  clearTempNote();
  clearTempToDo();
};
deleteBtn.addEventListener("click", deleteButton);

const closeModal = (): void => {
  const storedModalState = localStorage.getItem("modalState");
  const modalState: ModalState = storedModalState
    ? JSON.parse(storedModalState)
    : {
        interface: "note",
      };
  overlay?.classList.remove("show");
  modal?.classList.remove("show");
  if (modalState.interface === "note") {
    resetNoteInterface();
  } else {
    resetToDoInterface();
  }
  localStorage.setItem("modal-status", "closed");
  setTimeout(() => {
    if (
      switchBtnVisibility &&
      switchBtnVisibility.classList.contains("hidden")
    ) {
      switchBtnVisibility.classList.remove("hidden");
    }
  }, 300);
};
closeBtn.addEventListener("click", closeModal);

const switchOverlayInterface = (): void => {
  const isToDo = switchBtn?.checked || false;
  const modalState: ModalState = {
    interface: isToDo ? "toDo" : "note",
  };
  localStorage.setItem("modalState", JSON.stringify(modalState));
  requestAnimationFrame(() => {
    changeOverlayInterface();
  });
};
switchBtn?.addEventListener("click", () => {
  switchOverlayInterface();
});

export {
  resetNoteInterface,
  resetToDoInterface,
  switchOverlayInterface,
  updateCategorySelect,
};
