import { activeCategoryState } from "../states/sharedStates.js";
import type { NoteItem } from "../types/noteTypes.js";
import type { NoteArray } from "../types/storageTypes.js";
import type { Note } from "../utils/classes.js";
import { isActive } from "../utils/events.js";
import { getNotes } from "../utils/storageService.js";
import { reloadNoteList } from "./notes.js";

const searchInput = document.querySelector<HTMLInputElement>(".search-input")!;
let cachedNotes: NoteArray = [];
let searchTimeout: NodeJS.Timeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(filter, 200);
});

const filter = () => {
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (!dropdown || !searchInput.value || searchInput.value.length < 2) return;
  const start = performance.now();
  const value: string = searchInput.value.toLowerCase();
  if (!cachedNotes.length) {
    cachedNotes = getNotes();
  }
  const result: Note | undefined = cachedNotes.find((item) =>
    item.title.toLowerCase().includes(value.toLowerCase()),
  );
  if (!result) {
    dropdown.innerHTML = "No matching title found";
    dropdown.style.display = "block";
    return;
  }
  activeCategoryState.activeCategory = result.category;
  const categoryList = document.querySelector(".category-list");
  const targetCategory = Array.from(categoryList!.querySelectorAll("div")).find(
    (div) => div.textContent?.trim().includes(result.category),
  );
  if (targetCategory) {
    document.querySelectorAll("#categoryItem").forEach((item) => {
      item.classList.remove("active");
    });
    isActive(targetCategory);
  }
  reloadNoteList();
  const notesContainer =
    document.querySelector<HTMLDivElement>(".notes-container");
  if (!notesContainer) return;
  const targetNote = notesContainer.querySelector<HTMLDivElement>(
    `div[data-id="${result.id}"]`,
  ) as NoteItem | null;
  if (targetNote) {
    targetNote.scrollIntoView({ behavior: "smooth" });
    isActive(targetNote);
  }
  const end = performance.now();
  const duration = (end - start).toFixed(3);
  dropdown.innerHTML = `<div>Found: ${result.title}<br>${duration}ms</div>`;
  dropdown.style.display = "block";

  document.addEventListener("click", (e: Event): void => {
    const target = e.target as Element | null;
    const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
    if (target && !target.closest(".input-wrapper") && dropdown)
      dropdown.style.display = "none";
  });
};

searchInput.addEventListener("input", filter);

export { filter };
