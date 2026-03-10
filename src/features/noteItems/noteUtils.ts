import { getElementOrNull } from "../../utils/helpers";

const getNoteFormData = () => {
  const titleElement = getElementOrNull<HTMLTextAreaElement>(".title");
  const noteElement = getElementOrNull<HTMLTextAreaElement>(".note");
  if (!titleElement || !noteElement) return;
  const titleValue = titleElement.value.trim();
  const noteValue = noteElement.value.trim();
  const noteDataToArr: string[] = noteValue ? [noteValue] : [];
  return { titleValue, noteDataToArr };
};

export { getNoteFormData };
