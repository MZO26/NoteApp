const saveTempToDo = (): void => {
  const toDoTitle = document.querySelector<HTMLTextAreaElement>(".todo-title")!;
  const currentToDo =
    document.querySelector<HTMLDivElement>(".todo-container")!;
  const toDoList: NodeList =
    currentToDo.querySelectorAll<HTMLSpanElement>(".task-list li span");
  const titleValue = toDoTitle ? toDoTitle.value : "Untitled";
  const toDoData: Array<string> = [];
  const completedTasks: Array<string> = [];
  if (toDoList.length) {
    for (const span of toDoList) {
      const element = span as HTMLSpanElement;
      if (!element.textContent) continue;
      else if (element.classList.contains("task-completed")) {
        completedTasks.push(element.textContent);
      }
      toDoData.push(element.textContent);
    }
  }
  localStorage.setItem(
    "tempToDoValue",
    JSON.stringify({
      title: titleValue || "",
      data: toDoData || [],
      dataCompleted: completedTasks || [],
    }),
  );
};

const saveTempNote = (): void => {
  const noteTitle = document.querySelector<HTMLTextAreaElement>(".title");
  const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note");
  if (!noteTitle || !noteTextArea) return;
  const data = noteTextArea.value ? [noteTextArea.value] : [];
  localStorage.setItem(
    "tempNoteValue",
    JSON.stringify({
      title: noteTitle.value,
      data,
    }),
  );
};

export { saveTempNote, saveTempToDo };
