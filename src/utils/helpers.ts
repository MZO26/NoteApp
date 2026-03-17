import { validate } from "uuid";
import type { RenderedItem } from "../types/featureTypes.js";

function truncate(str: string, max = 10): string {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  } else return str;
}

function checkId(item: RenderedItem): string | null {
  const id = item.getAttribute("data-id");
  if (!id) return null;
  if (!validate(id)) return null;
  return id;
}

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found: "${selector}"`);
  }
  return element;
}

function getElementOrNull<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

export { checkId, getElement, getElementOrNull, truncate };
