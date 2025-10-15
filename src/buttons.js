import { add_to_sidebar } from "./sidebar.js";
const dark_mode_btn = document.querySelector(".dark-mode-btn");
const delete_btn = document.querySelector(".delete-btn");
const add_btn = document.querySelector(".add-btn");
const toggle_btn = document.querySelector(".toggle-btn");

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

const add_btn_handler = () => {
  const note = document.querySelector(".note");
  alert("Task saved");
  note ? add_to_sidebar(note.value) : null;
  localStorage.setItem("note_value", note.value);
};
add_btn.addEventListener("click", add_btn_handler);

const delete_btn_handler = () => {
  const note = document.querySelector(".note");
  note.value = "";
  localStorage.removeItem("note_value");
  alert("Task deleted");
};
delete_btn.addEventListener("click", delete_btn_handler);

const toggle_lightmode_handler = () => {
  const sidebar = document.querySelector(".sidebar-notes");
  const note = document.querySelector(".note");
  if (sidebar.hasChildNodes()) {
    [...sidebar.children].forEach((child) =>
      child.classList.toggle("light-mode")
    );
  }
  const arr = [sidebar, note, document.body];
  arr.forEach((entry) => entry.classList.toggle("light-mode"));
  const currentMode = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";
  localStorage.setItem("mode", currentMode);
};
dark_mode_btn.addEventListener("click", toggle_lightmode_handler);

export {
  toggle_lightmode_handler,
  add_btn_handler,
  delete_btn_handler,
  collapse_sidebar,
};
