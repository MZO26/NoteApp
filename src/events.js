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

function isActive(item, classList, parentElement = null) {
  const targetParent = parentElement || document.body;
  if (localStorage.getItem("mode") == "light") {
    document
      .querySelectorAll(`${classList}.light-mode.active`)
      .forEach((el) => {
        el.classList.remove("active");
      });
  } else {
    document.querySelectorAll(`${classList}.active`).forEach((el) => {
      el.classList.remove("active");
    });
  }
  item.classList.add("active");
  if (item._listener) document.removeEventListener("click", item._listener);
  //no const declaration because own declaration of object property
  //dom objects also seen as objects / _ only for convention to see its declared internally
  item._listener = (e) => {
    if (targetParent.contains(e.target) && e.target != item) {
      item.classList.remove("active");
      localStorage.setItem("noteId", "null");
      document.removeEventListener("click", item._listener);
      item._listener = null;
    }
  };
  setTimeout(() => document.addEventListener("click", item._listener), 0);
}

const syncLightDarkMode = (item) => {
  if (
    !item.classList.contains("light-mode") &&
    document.body.classList.contains("light-mode")
  ) {
    item.classList.toggle("light-mode");
  }
};

export { showToast, inputListener, isActive, syncLightDarkMode };
