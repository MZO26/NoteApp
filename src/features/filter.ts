import type { CategoryArray, NoteArray } from "../types/storageTypes.js";
import type { Note } from "../utils/classes.js";
import { inputListener, isActive } from "../utils/events.js";

const searchInput = document.querySelector<HTMLInputElement>(".search-input")!;

const filter = async (): Promise<void> => {
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (!dropdown) return;
  const notesArr: NoteArray = JSON.parse(
    localStorage.getItem("notesArr") || "[]"
  );
  const categoryArr: CategoryArray = JSON.parse(
    localStorage.getItem("categoryArr") || "[]"
  );
  if (document.activeElement !== searchInput) {
    dropdown.style.display = "none";
    return;
  }
  const value: string = await inputListener(searchInput);
  if (!value) return;
  dropdown.innerHTML = "";
  const div = document.createElement("div");
  const re = new RegExp(value, "i");
  const start = performance.now();
  let result: Note | undefined = notesArr.find((item) => re.test(item.title));
  let category: string, id: number;
  if (result) {
    notesArr.find((item) => {
      if (item.title == result.title) {
        category = item.category;
        id = item.id;
      }
    });
    const match = categoryArr.find((c) => c.name == category);
    if (match && match.items) {
      let item: Note | undefined = match.items.find((i: Note) => i.id == id);
      const categoryList =
        document.querySelector<HTMLElement>(".category-list");
      if (!categoryList) return;
      const categoryDivs: NodeListOf<HTMLDivElement> =
        categoryList.querySelectorAll<HTMLDivElement>("div");
      const trimmedName = match.name.trim();
      for (const div of categoryDivs) {
        if (div.textContent.trim() == trimmedName) {
          div.click();
          isActive(div, categoryList);
          break;
        }
      }
      const notesContainer =
        document.querySelector<HTMLDivElement>(".notes-container");
      if (!notesContainer || !item) return;
      const targetItem = notesContainer.querySelector<HTMLDivElement>(
        `div[data-id="${item.id}"]`
      )!;
      isActive(targetItem, notesContainer);
      const end = performance.now();
      const duration = end - start;
      div.innerHTML = `title: ${result.title}<br>duration: ${duration.toFixed(
        3
      )} ms`;
    }
  } else {
    div.innerHTML = "No matching title found";
  }
  dropdown.appendChild(div);
  dropdown.style.display = "block";
};

document.addEventListener("click", (e: Event): void => {
  const target = e.target as Element | null;
  const dropdown = document.querySelector<HTMLDivElement>(".dropdown");
  if (target && !target.closest(".input-wrapper") && dropdown)
    dropdown.style.display = "none";
});

searchInput.addEventListener("input", filter);

export { filter };
