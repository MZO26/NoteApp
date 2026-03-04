import { noteToBeRendered, reloadNoteList } from "../features/notes.js";
import { toDoToBeRendered } from "../features/toDo.js";
import { defaultCategory } from "../states/sharedStates.js";
import type { ActiveCategoryState, ModalState } from "../types/stateTypes.js";
import type { CategoryArray, NoteArray } from "../types/storageTypes.js";
import { changeOverlayInterface } from "../ui-components/renderModalUI.js";
import { Note } from "../utils/classes.js";
import { showToast } from "../utils/events.js";
import {
  clearTempNote,
  clearTempToDo,
  getNotes,
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
  savedNoteId: number,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const titleElement = document.querySelector<HTMLTextAreaElement>(".title");
  const noteElement = document.querySelector<HTMLTextAreaElement>(".note");
  if (noteElement && titleElement) {
    const titleValue = titleElement.value.trim();
    const noteValue = noteElement.value.trim();
    const noteDataToArr: string[] = noteValue ? [noteValue] : [];
    if (!savedNoteId) {
      noteToBeRendered(
        "note",
        selectedCategory,
        titleValue,
        noteDataToArr,
        undefined,
      );
    } else {
      const savedItem: Note | undefined = notesArr.find(
        (n) => n.id === savedNoteId,
      );
      if (savedItem && savedItem.type === "note") {
        const updatedItem = {
          ...savedItem,
          title: titleValue,
          data: noteDataToArr,
          category: selectedCategory,
        };
        updateNotes((prev) =>
          prev.map((n) => (n.id === savedNoteId ? updatedItem : n)),
        );
        showToast("Note was saved");
        reloadNoteList();
      }
    }
  }
  clearTempNote();
};

const handleToDoSave = (
  savedNoteId: number,
  notesArr: NoteArray,
  selectedCategory: string,
): void => {
  const spans =
    document.querySelectorAll<HTMLSpanElement>(".task-list li span");
  const spanArray = Array.from(spans);
  const completedTasks: string[] = spanArray
    .filter((span) => span.classList.contains("task-completed"))
    .map((span) => span.textContent || "");
  const allTasks: string[] = spanArray.map((span) => {
    return span.textContent || "";
  });
  const title = document.querySelector<HTMLTextAreaElement>(".todo-title");
  const titleValue = title?.value.trim() || "";
  if (!savedNoteId) {
    toDoToBeRendered(
      "toDo",
      selectedCategory,
      titleValue,
      allTasks,
      completedTasks,
    );
  } else {
    const savedItem = notesArr.find((note) => note.id === savedNoteId);
    if (savedItem && savedItem.type === "toDo") {
      const updatedItem = {
        ...savedItem,
        title: titleValue,
        data: allTasks,
        dataCompleted: completedTasks,
        category: selectedCategory,
      };
      notesArr[notesArr.findIndex((note) => note.id === savedNoteId)] =
        savedItem;
      updateNotes((prev) =>
        prev.map((note) => (note.id === savedNoteId ? updatedItem : note)),
      );
      showToast("ToDo-list was saved");
      reloadNoteList();
    }
  }
  clearTempToDo();
};

const saveButton = (): void => {
  const notesArr: NoteArray = getNotes();
  const savedNoteId: number = JSON.parse(
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
  const isConfirmed = window.confirm("Clear all content?");
  if (!isConfirmed) return;
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
  clearTempNote();
  clearTempToDo();
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

export { switchOverlayInterface, updateCategorySelect };
