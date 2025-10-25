import {
  notesToSidebar,
  categoriesToSidebar,
  reloadNotesSidebar,
  sidebarItem_handler,
} from "./sidebar.js";
import { inputListener, showToast } from "./events.js";

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

const save_btn_handler = () => {
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const note = document.querySelector(".note");
  const notesList = document.querySelector(".notes-list");
  const savedNoteId = JSON.parse(localStorage.getItem("noteId"));
  if (!notesList.hasChildNodes() || !savedNoteId) {
    note.value ? notesToSidebar(note.value) : null;
  } else {
    let savedNote = sidebarNotesArr.find((notes) => notes.id == savedNoteId);
    savedNote.data = note.value;
    savedNote.title =
      note.value.length == 0
        ? "Kein Titel"
        : note.value.split("\n")[0].substring(0, 15);
    localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
    const sidebarItem = notesList.querySelector(`[data-id="${savedNoteId}"]`);
    showToast("Notiz wurde gespeichert");
    sidebarItem_handler(sidebarItem);
    reloadNotesSidebar();
  }
};

add_btn.addEventListener("click", save_btn_handler);

const delete_btn_handler = () => {
  const note = document.querySelector(".note");
  if (note.value.length > 0) {
    note.value = "";
    return;
  }
};
delete_btn.addEventListener("click", delete_btn_handler);

const toggle_lightmode_handler = () => {
  const notes_list = document.querySelector(".notes-list");
  const sidebar_notes = document.querySelector(".sidebar-notes");
  const category_list = document.querySelector(".category-list");
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
  save_btn_handler,
  delete_btn_handler,
  collapse_sidebar,
  categoryInput_btn,
};
