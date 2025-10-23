import {
  notesToSidebar,
  categoriesToSidebar,
  reloadNotesSidebar,
  sidebarItem_handler,
} from "./sidebar.js";
import { inputListener } from "./events.js";
import { globalId } from "./sidebar.js";

const dark_mode_btn = document.querySelector(".dark-mode-btn");
const delete_btn = document.querySelector(".delete-btn");
const add_btn = document.querySelector(".add-btn");
const toggle_btn = document.querySelector(".toggle-btn");
const category_btn = document.querySelector(".category-btn");

const collapse_sidebar = () => {
  const note = document.querySelector(".note");
  const sidebar_notes = document.getElementById("sidebar2");
  sidebar_notes.classList.toggle("collapsed");
  note.classList.toggle("collapsed");
  if (sidebar_notes.hasChildNodes()) {
    [...sidebar_notes.children].forEach((child) =>
      child.classList.toggle("collapsed")
    );
  }
};
toggle_btn.addEventListener("click", collapse_sidebar);

const add_btn_handler = function () {
  let sidebarNotesArr =
    JSON.parse(localStorage.getItem("sidebarNotesArr")) || "[]";
  const note = document.querySelector(".note");
  const note_list = document.querySelector(".notes-list");
  const confirmation = confirm(
    "Möchtest du deine aktuelle Notiz überschreiben?"
  );
  if (!note_list.hasChildNodes) {
    note ? notesToSidebar(note.value) : null;
    alert("Neue Notiz angelegt");
  }
  if (sidebarNotesArr.length > 0 && confirmation && globalId) {
    let item = sidebarNotesArr.find((notes) => notes.id == globalId);
    console.log(item);
    item.data = note.value;
    item.title =
      note.value.length == 0 ? "Kein Titel" : note.value.slice(0, 15);
    localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
    const sidebarItem = note_list.querySelector(`[data-id="${globalId}"]`);
    sidebarItem_handler(sidebarItem);
    reloadNotesSidebar();
  } else if (!confirmation) {
    note ? notesToSidebar(note.value) : null;
    alert("Neue Notiz angelegt");
  }
  localStorage.setItem("note_value", JSON.stringify(note.value));
};
add_btn.addEventListener("click", add_btn_handler);

const delete_btn_handler = () => {
  const note = document.querySelector(".note");
  if (note.value.length > 0) {
    note.value = "";
    localStorage.removeItem("note_value");
    alert("Task deleted");
    return;
  }
  alert("No task available");
};
delete_btn.addEventListener("click", delete_btn_handler);

const toggle_lightmode_handler = () => {
  const notes_list = document.querySelector(".notes-list");
  const sidebar_notes = document.querySelector(".sidebar-notes");
  const category_list = document.querySelector(".category-list");
  const default_category = document.querySelector(".default-category");
  const priorities = document.querySelector(".priorities");
  const singleElements = document.querySelectorAll("p, button, span");
  const note = document.querySelector(".note");
  const navbar = document.querySelector(".navbar");
  if (notes_list.hasChildNodes()) {
    [...notes_list.children].forEach((child) =>
      child.classList.toggle("light-mode")
    );
  }
  if (category_list.hasChildNodes()) {
    [...category_list.children].forEach((child) => {
      child.classList.toggle("light-mode");
    });
  }
  const allElements = [
    ...[
      default_category,
      priorities,
      notes_list,
      sidebar_notes,
      category_list,
      note,
      document.body,
      navbar,
    ],
    ...singleElements,
  ];
  allElements.forEach((entry) => entry.classList.toggle("light-mode"));
  const currentMode = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";
  localStorage.setItem("mode", currentMode);
};
dark_mode_btn.addEventListener("click", toggle_lightmode_handler);

const categoryInput_btn = async () => {
  const category_btn = document.querySelector(".category-btn");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "category-input";
  input.placeholder = "Kategorie eingeben";
  category_btn.replaceWith(input);
  const value = await inputListener(input);
  input.replaceWith(category_btn);
  if (value) categoriesToSidebar(value);
};

category_btn.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryInput_btn();
});

export {
  toggle_lightmode_handler,
  add_btn_handler,
  delete_btn_handler,
  collapse_sidebar,
  categoryInput_btn,
};
