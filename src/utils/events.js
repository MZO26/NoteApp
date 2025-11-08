import { savedNoteIdState } from "../features/notes.js";

const showToast = (value, duration = 4000) => {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  if (value.length > 15) {
    value.slice(0, 15);
  }
  toast.textContent = value;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 1000);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
};

const inputListener = (input) => {
  return new Promise((resolve) => {
    const clickOutside = (e) => {
      if (!document.body.contains(input)) return;
      if (e.target !== input) {
        cleanup();
        input.value = "";
        resolve(input.value);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        cleanup();
        resolve(input.value);
      }
    };
    const cleanup = () => {
      document.removeEventListener("click", clickOutside);
      input.removeEventListener("keydown", onKeyDown);
    };
    input.focus();
    document.addEventListener("click", clickOutside);
    input.addEventListener("keydown", onKeyDown);
  });
};

function isActive(item, parentElement = null) {
  const targetParent = parentElement || document.body;
  item.classList.add("active");
  if (item._listener) document.removeEventListener("click", item._listener);
  //no const declaration because own declaration of object property
  //dom objects also seen as objects
  item._listener = (e) => {
    if (targetParent.contains(e.target) && e.target != item) {
      item.classList.remove("active");
      document.removeEventListener("click", item._listener);
      savedNoteIdState.savedNoteId = null;
      item._listener = null;
    }
  };
  setTimeout(() => document.addEventListener("click", item._listener), 0);
}

export { inputListener, isActive, showToast };
