import type { RenderedItem } from "../types/featureTypes.js";
import { getElement, truncate } from "./helpers.js";

const showToast = (value: string, duration = 2000): void => {
  const container = getElement<HTMLDivElement>(".toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  value = truncate(value, 50);
  toast.textContent = value;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 300);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
};

function isActive(item: RenderedItem, parentElement?: Element): void {
  item.classList.add("active");
  if (item._listener) document.removeEventListener("click", item._listener);
  item._listener = (e: Event) => {
    const target = e.target as HTMLDivElement | null;
    if (parentElement && parentElement.contains(target) && e.target !== item) {
      item.classList.remove("active");
      if (item._listener) {
        document.removeEventListener("click", item._listener);
      }
      item._listener = null;
    }
  };
  setTimeout(
    () =>
      document.addEventListener(
        "click",
        item._listener as (event: Event) => void,
      ),
    0,
  );
}

export { isActive, showToast };
