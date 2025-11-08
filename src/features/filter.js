import { inputListener, isActive } from "../utils/events.js";

const filter = () => {
  const searchInput = document.querySelector(".search-input");
  const dropdown = document.querySelector(".dropdown");
  const notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
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
    let result = notesArr.find((item) => re.test(item.title));
    let category, id;
    if (result) {
      notesArr.find((item) => {
        if (item.title == result.title) {
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
            isActive(div, categoryList);
            break;
          }
        }
        const notesContainer = document.querySelector(".notes-container");
        const targetItem = notesContainer.querySelector(
          `div[data-id="${item.id}"]`
        );
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
    processInput();
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-wrapper")) dropdown.style.display = "none";
  });
  processInput();
};

export { filter };
