import {
  reloadCategorySidebar,
  reloadNotesSidebar,
  categoriesToSidebar,
  default_category,
} from "./sidebar.js";
import { toggle_lightmode_handler } from "./buttons.js";

export const syncLightDarkMode = (item) => {
  if (
    !item.classList.contains("light-mode") &&
    document.body.classList.contains("light-mode")
  ) {
    item.classList.toggle("light-mode");
  }
};

window.onload = () => {
  reloadCategorySidebar();
  reloadNotesSidebar();
  categoriesToSidebar(default_category);
  const mode = localStorage.getItem("mode");
  if (mode == "light") {
    toggle_lightmode_handler();
  }
  const note = document.querySelector(".note");
  const savedData = localStorage.getItem("note_value") || "";
  if (note.value != "") note.value = savedData;
};
