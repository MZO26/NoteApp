const getNoteFormData = () => {
  const titleElement = document.querySelector<HTMLTextAreaElement>(".title");
  const noteElement = document.querySelector<HTMLTextAreaElement>(".note");
  if (!titleElement || !noteElement) return;
  const titleValue = titleElement.value.trim();
  const noteValue = noteElement.value.trim();
  const noteDataToArr: string[] = noteValue ? [noteValue] : [];
  return { titleValue, noteDataToArr };
};

export { getNoteFormData };
