import { setActiveCategory } from "../states/sharedStates.js";
import type { RenderedItem } from "../types/featureTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import { Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { getNotes } from "../utils/storageService.js";
import { checkId, reloadNoteList } from "./notes.js";

const searchInput = document.querySelector<HTMLInputElement>(".search-input")!;
let cachedNotes: NoteArray = [];
let searchTimeout: NodeJS.Timeout;
let activeCategory: string | null = null;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(filter, 200);
});

const findTargetNote = (): {
  cachedNotes: Note[];
  result: Note | undefined;
} => {
  const value: string = searchInput.value.toLowerCase();
  if (!cachedNotes.length) {
    cachedNotes = getNotes();
  }
  const result: Note | undefined = cachedNotes.find((item) =>
    item.title.toLowerCase().includes(value),
  );
  return { cachedNotes, result };
};

const findTargetCategory = (result: Note): string | null => {
  const categoryList = document.querySelector(".category-list");
  if (!categoryList) return null;
  const targetCategory = Array.from(categoryList.querySelectorAll("div")).find(
    (div) => div.textContent?.trim().includes(result.category),
  );
  if (targetCategory) {
    document.querySelectorAll(".categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    isActive(targetCategory);
    setActiveCategory(result.category);
    return result.category;
  } else return null;
};

const scrollToTargetNote = (result: Note) => {
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const targetNote = notesContainer.querySelector<HTMLDivElement>(
    `div[data-id="${result.id}"]`,
  ) as RenderedItem | null;
  if (targetNote) {
    targetNote.scrollIntoView({ behavior: "smooth" });
    isActive(targetNote);
  }
};

const removeActiveExceptResult = (result: Note) => {
  const activeItems = document.querySelectorAll(
    ".noteItem.active, .toDoItem.active",
  ) as NodeListOf<RenderedItem>;
  activeItems.forEach((item) => {
    if (checkId(item) !== result.id) {
      item.classList.remove("active");
    }
  });
};

const filter = (): void => {
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (!dropdown || !searchInput.value || searchInput.value.length < 2) return;
  const start = performance.now();
  const { cachedNotes, result } = findTargetNote();
  if (!result) {
    dropdown.innerHTML = "No matching title found";
    dropdown.style.display = "block";
    return;
  }
  const targetCategory = findTargetCategory(result);
  if (targetCategory !== activeCategory) {
    activeCategory = targetCategory;
    const categoryItems = cachedNotes.filter(
      (notes) => notes.category === activeCategory,
    );
    console.log(categoryItems, cachedNotes);
    reloadNoteList(categoryItems);
  } else {
    removeActiveExceptResult(result);
  }
  const end = performance.now();
  const duration = (end - start).toFixed(3);
  dropdown.innerHTML = `<div>Found: ${result.title}<br>${duration}ms</div>`;
  dropdown.style.display = "block";
  scrollToTargetNote(result);
};

searchInput.addEventListener("input", filter);

document.addEventListener("click", (e: Event): void => {
  const target = e.target as Element | null;
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (target && dropdown && !target.closest(".input-wrapper"))
    dropdown.style.display = "none";
});

export { filter };
