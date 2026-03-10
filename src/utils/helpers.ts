import { validate } from "uuid";
import type { RenderedItem } from "../types/featureTypes.js";

function truncate(str: string, max = 10): string {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  } else return str;
}

function checkId(item: RenderedItem): string | null {
  const rawId = item.getAttribute("data-id");
  if (!rawId) return null;
  if (!validate(rawId)) return null;
  return rawId;
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
