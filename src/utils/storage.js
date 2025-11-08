const syncCategoriesWithNotes = () => {
  let categoryArr = JSON.parse(localStorage.getItem("categoryArr") || "[]");
  let notesArr = JSON.parse(localStorage.getItem("notesArr") || "[]");
  categoryArr = categoryArr.map((category) => {
    category.items = notesArr.filter((note) => note.category == category.name);
    return category;
  });
  localStorage.setItem("categoryArr", JSON.stringify(categoryArr));
};

const saveTempToDo = () => {
  const toDoTitle = document.querySelector(".todo-title");
  const currentToDo = document.querySelector(".todo-container");
  const toDoList = currentToDo.querySelectorAll(".task-list li span");
  const titleValue = toDoTitle ? toDoTitle.value : "Untitled";
  const toDoData = [];
  const completedTasks = [];
  if (toDoList.length) {
    toDoList.forEach((span) => {
      toDoData.push(span.textContent);
      if (span.classList.contains("task-completed")) {
        completedTasks.push(span.textContent);
      }
    });
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

const saveTempNote = () => {
  const noteTitle = document.querySelector(".title");
  const noteTextArea = document.querySelector(".note");
  localStorage.setItem(
    "tempNoteValue",
    JSON.stringify({
      title: noteTitle.value || "",
      note: noteTextArea.value || "",
    })
  );
};

export { saveTempNote, saveTempToDo, syncCategoriesWithNotes };
