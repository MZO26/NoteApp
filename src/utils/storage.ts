import type { CategoryArray, NoteArray } from "../types/storageTypes";

const syncCategoriesWithNotes = (): void => {
  let categoryArr: CategoryArray = JSON.parse(
    localStorage.getItem("categoryArr") || "[]"
  );
  let notesArr: NoteArray = JSON.parse(
    localStorage.getItem("notesArr") || "[]"
  );
  categoryArr = categoryArr.map((category) => {
    category.items = notesArr.filter((note) => note.category == category.name);
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

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
    })
  );
};

const saveTempNote = (): void => {
  const noteTitle = document.querySelector<HTMLTextAreaElement>(".title")!;
  const noteTextArea = document.querySelector<HTMLTextAreaElement>(".note")!;
  const noteDataToArr = noteTextArea.value ? [noteTextArea.value] : [];
  localStorage.setItem(
    "tempNoteValue",
    JSON.stringify({
      title: noteTitle.value || "",
      data: noteDataToArr,
    })
  );
};

export { saveTempNote, saveTempToDo, syncCategoriesWithNotes };
