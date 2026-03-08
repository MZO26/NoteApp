import type { RenderedItem } from "../types/featureTypes.js";

const truncate = (str: string, max = 10): string => {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  } else return str;
};

const checkId = (item: RenderedItem): number | null => {
  const rawId = item.getAttribute("data-id");
  if (!rawId) return null;
  const parsedId = parseFloat(rawId);
  if (Number.isNaN(parsedId)) return null;
  return parsedId;
};

export { checkId, truncate };
