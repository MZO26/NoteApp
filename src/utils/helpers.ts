import { validate } from "uuid";
import type { RenderedItem } from "../types/featureTypes.js";

const truncate = (str: string, max = 10): string => {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  } else return str;
};

const checkId = (item: RenderedItem): string | null => {
  const rawId = item.getAttribute("data-id");
  if (!rawId) return null;
  if (!validate(rawId)) return null;
  return rawId;
};

export { checkId, truncate };
