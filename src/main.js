import {
  reloadCategorySidebar,
  reloadNotesSidebar,
  categoriesToSidebar,
  default_category,
} from "./sidebar.js";
import { toggle_lightmode_handler, collapse_sidebar } from "./buttons.js";

window.onload = () => {
  reloadCategorySidebar();
  reloadNotesSidebar();
  categoriesToSidebar(default_category);
  const mode = localStorage.getItem("mode");
  if (mode == "light") {
    toggle_lightmode_handler();
  }
};
