import {
  reload_category_sidebar,
  reload_notes_sidebar,
  categories,
} from "./sidebar.js";
import { toggle_lightmode_handler } from "./buttons.js";

const default_category = document.querySelector(".default-category");

export const syncLightDarkMode = (item) => {
  if (
    !item.classList.contains("light-mode") &&
    document.body.classList.contains("light-mode")
  ) {
    item.classList.toggle("light-mode");
  }
};

window.onload = () => {
  reload_category_sidebar();
  reload_notes_sidebar();
  categories(default_category.textContent);
  const mode = localStorage.getItem("mode");
  if (mode == "light") {
    toggle_lightmode_handler();
  }
  const note = document.querySelector(".note");
  const savedData = localStorage.getItem("note_value") || "";
  if (note.value == "") return;
  else note.value = savedData;
};
