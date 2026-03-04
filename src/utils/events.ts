import { savedNoteIdState } from "../states/sharedStates.js";
import type { NoteItem } from "../types/featureTypes.js";

const showToast = (value: string, duration = 1500): void => {
  const container = document.querySelector<HTMLDivElement>(".toast-container")!;
  const toast = document.createElement("div");
  toast.className = "toast";
  if (value.length > 50) {
    value = value.slice(0, 50) + "...";
  }
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

const inputListener = (input: HTMLInputElement): Promise<string> => {
  return new Promise((resolve) => {
    const clickOutside = (e: MouseEvent) => {
      if (!document.body.contains(input)) return;
      if (e.target !== input) {
        cleanup();
        input.value = "";
        resolve(input.value);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        cleanup();
        resolve(input.value);
      }
    };
    const cleanup = (): void => {
      document.removeEventListener("click", clickOutside);
      input.removeEventListener("keydown", onKeyDown);
    };
    input.focus();
    document.addEventListener("click", clickOutside);
    input.addEventListener("keydown", onKeyDown);
  });
};

function isActive(item: NoteItem, parentElement?: Element): void {
  item.classList.add("active");
  if (item._listener) document.removeEventListener("click", item._listener);
  item._listener = (e: Event) => {
    const target = e.target as Element | null;
    if (parentElement && parentElement.contains(target) && e.target != item) {
      item.classList.remove("active");
      if (item._listener) {
        document.removeEventListener("click", item._listener);
      }
      savedNoteIdState.savedNoteId = null;
      item._listener = null;
    }
  };
  if (item._listener) {
    setTimeout(
      () =>
        document.addEventListener(
          "click",
          item._listener as (event: Event) => void,
        ),
      0,
    );
  }
}

export { inputListener, isActive, showToast };
