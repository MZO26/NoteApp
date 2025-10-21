import { add_priorities, formatDate } from "./data.js";
import { showToast } from "./buttons.js";
import { syncLightDarkMode } from "./main.js";

export let active_category = "Ohne Kategorie";

const syncCategoriesWithNotes = () => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  if (active_category == "Ohne Kategorie") return;
  categoryArr = categoryArr.map((category) => {
    category.items = sidebarNotesArr.filter(
      (note) => note.category === category.category
    );
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

const add_to_sidebar = (note_value) => {
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const sidebar = document.querySelector(".notes-list");
  const sidebarItem = document.createElement("div");
  sidebarItem.id = "sidebarItem";
  const itemData = {
    id: Date.now() + Math.random(),
    category: active_category,
    data: note_value ? note_value : "",
    priority: add_priorities() || "Ohne Priorität",
    title: note_value.length == 0 ? "Kein Titel" : note_value.slice(0, 15),
    formattedDate: formatDate(),
  };
  sidebarItem.setAttribute("data-id", itemData.id);
  sidebarItem.style.backgroundColor = `${itemData.priority}`;
  sidebarItem.innerHTML = `<button class="btn">       <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg></button><p>${itemData.title}</p><p>${itemData.formattedDate}</p>`;
  sidebarNotesArr.push(itemData);
  localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
  sidebar.appendChild(sidebarItem);
  syncLightDarkMode(sidebarItem);
  console.log(sidebarNotesArr);
  sidebarItem_handler(sidebarItem, itemData);
  syncCategoriesWithNotes();
};

const sidebarItem_handler = (sidebarItem, notes) => {
  const sidebarItem_btn = sidebarItem.querySelector("button");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  sidebarItem_btn.onclick = function (event) {
    event.stopPropagation();
    const id = this.parentElement.getAttribute("data-id");
    const index = sidebarNotesArr.findIndex(
      (sidebarNote) => sidebarNote.id == id
    );
    if (index > -1) {
      sidebarNotesArr.splice(index, 1);
      localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
    }
    this.parentElement.remove();
    console.log(sidebarNotesArr);
  };
  sidebarItem.onclick = () => {
    if (!confirm("Möchtest du deine aktuelle Notiz überschreiben?")) return;
    document.querySelector(".note").value = notes.data;
  };
  syncCategoriesWithNotes();
};

const reload_notes_sidebar = (arr) => {
  const sidebar = document.querySelector(".notes-list");
  const sidebarNotesArr = arr
    ? arr
    : JSON.parse(localStorage.getItem("sidebarNotesArr") || "[]");
  console.log(sidebarNotesArr);
  sidebar.innerHTML = "";
  for (let i = 0; i < sidebarNotesArr.length; i++) {
    const sidebarItem = document.createElement("div");
    sidebarItem.id = "sidebarItem";
    sidebarItem.setAttribute("data-id", sidebarNotesArr[i].id);
    sidebarItem.style.backgroundColor = `${sidebarNotesArr[i].priority}`;
    sidebarItem.innerHTML = `<button class="btn">       <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg></button><p>${sidebarNotesArr[i].title}</p><p>${sidebarNotesArr[i].formattedDate}</p>`;
    sidebar.appendChild(sidebarItem);
    syncLightDarkMode(sidebarItem);
    sidebarItem_handler(sidebarItem, sidebarNotesArr[i]);
  }
  syncCategoriesWithNotes();
};

const category_handler = (category_item) => {
  if (!category_item.classList.contains("default-category")) {
    const sidebarItem_btn = category_item.querySelector("button");
    sidebarItem_btn.onclick = function (event) {
      event.stopPropagation();
      let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
      const id = this.parentElement.getAttribute("category-id");
      const index = categoryArr.findIndex(
        (category) => String(category.id) == String(id)
      );
      if (index > -1) {
        categoryArr.splice(index, 1);
        localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
      }
      this.parentElement.remove();
    };
  }
  category_item.onclick = () => {
    syncCategoriesWithNotes();
    const defaultId = category_item.getAttribute("default-category-id");
    const id = category_item.classList.contains("default-category")
      ? defaultId
      : category_item.getAttribute("category-id");
    let sidebarNotesArr = JSON.parse(
      localStorage.getItem("sidebarNotesArr") || "[]"
    );
    const arr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
    let category;
    if (id == defaultId) {
      const category_name = "Ohne Kategorie";
      category = {
        id: defaultId,
        category: "Ohne Kategorie",
        items: sidebarNotesArr.filter((item) => item.category == category_name),
      };
    } else {
      category = arr.find((category) => String(category.id) == String(id));
    }
    active_category = category.category;
    showToast(active_category);
    reload_notes_sidebar(category.items);
    console.log(active_category);
  };
};

const categories = (category_value) => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const categoryData = {
    id: Date.now() + Math.random(),
    category: category_value,
    items:
      sidebarNotesArr.filter((notes) => notes.category === category_value) ||
      [],
  };
  let category_item;
  const sidebar_categories = document.querySelector(".category-list");
  if (category_value == "Ohne Kategorie") {
    category_item = document.querySelector(".default-category");
    category_item.setAttribute("default-category-id", categoryData.id);
    category_handler(category_item);
  } else {
    category_item = document.createElement("div");
    category_item.id = "categoryItem";
    category_item.setAttribute("category-id", categoryData.id);
  }
  syncLightDarkMode(category_item);
  if (category_item.classList.contains("default-category")) return;
  category_item.innerHTML = `<button class="btn">       <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg></button><p>${category_value}</p>`;
  sidebar_categories.appendChild(category_item);
  categoryArr.push(categoryData);
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
  category_handler(category_item);
  syncCategoriesWithNotes();
};

const reload_category_sidebar = () => {
  const category_sidebar = document.querySelector(".category-list");
  const categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  if (!categoryArr.length) {
    console.log("Keine Kategorie verfügbar");
    return;
  }
  console.log(categoryArr);
  category_sidebar.innerHTML = `<div class="default-category" id="categoryItem">Ohne Kategorie</div>`;
  for (let i = 0; i < categoryArr.length; i++) {
    const category_item = document.createElement("div");
    category_item.id = "categoryItem";
    category_item.setAttribute("category-id", categoryArr[i].id);
    category_item.innerHTML = `<button class="btn">       <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg></button><p>${categoryArr[i].category}</p>`;
    category_sidebar.appendChild(category_item);
    category_handler(category_item);
  }
};

export {
  reload_notes_sidebar,
  reload_category_sidebar,
  add_to_sidebar,
  sidebarItem_handler,
  categories,
  category_handler,
  syncCategoriesWithNotes,
};
