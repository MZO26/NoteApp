import { reload_sidebar } from "./sidebar.js";
import { toggle_lightmode_handler } from "./buttons.js";

window.onload = () => {
  reload_sidebar();
  const mode = localStorage.getItem("mode");
  if (mode == "light") {
    toggle_lightmode_handler();
  }
  const note = document.querySelector(".note");
  const savedData = localStorage.getItem("note_value") || "";
  note.value = savedData;
};
