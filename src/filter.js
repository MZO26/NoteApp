import { inputListener, isActive } from "./events.js";
import { collapse_sidebar } from "./buttons.js";

const filter = () => {
  const searchInput = document.querySelector(".search-input");
  const dropdown = document.querySelector(".dropdown");
  const sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  const processInput = async () => {
    if (document.activeElement !== searchInput) {
      dropdown.style.display = "none";
      return;
    }
    const value = await inputListener(searchInput);
    if (!value) return;
    dropdown.innerHTML = "";
    const div = document.createElement("div");
    const re = new RegExp(value, "i");
    const start = performance.now();
    let result = sidebarNotesArr.find((item) => re.test(item.data));
    let category, id;
    if (result) {
      sidebarNotesArr.find((item) => {
        if (item.data == result.data) {
          category = item.category;
          id = item.id;
        }
      });
      const match = categoryArr.find((c) => c.name == category);
      if (match.items) {
        let item = match.items.find((i) => i.id == id);
        const categoryList = document.querySelector(".category-list");
        const categoryDivs = categoryList.querySelectorAll("div");
        const trimmedName = match.name.trim();
        for (const div of categoryDivs) {
          if (div.textContent.trim() == trimmedName) {
            div.click();
            isActive(div, "#categoryItem");
            break;
          }
        }
        const notesList = document.querySelector(".notes-list");
        const targetItem = notesList.querySelector(`div[data-id="${item.id}"]`);
        isActive(targetItem);
        if (notesList.parentElement.classList.contains("collapsed")) {
          collapse_sidebar();
        }
        const end = performance.now();
        const duration = end - start;
        div.innerHTML = `Titel: ${result.data}<br>Dauer: ${duration.toFixed(
          3
        )} ms`;
      }
    } else {
      div.innerHTML = "Keine Notiz gefunden";
    }
    dropdown.appendChild(div);
    dropdown.style.display = "block";
    processInput();
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-wrapper")) dropdown.style.display = "none";
  });
  processInput();
};

export { filter };
