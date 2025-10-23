const showToast = (category, duration = 4000) => {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  if (category.length > 15) {
    category = category.slice(0, 15);
  }
  toast.textContent = `${category} wurde ausgewählt`;
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

export { showToast, inputListener };
