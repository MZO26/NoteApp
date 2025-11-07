const noteItemTemplate = (noteData) => {
  return `<button class="btn" title="Notiz löschen">       <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash3-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                  />
                </svg></button><h3>${noteData.title}</h3><p class="noteItemTemplateDate">Erstellt: ${noteData.formattedDate}</p><p>${noteData.data}</p>`;
};

const toDoItemTemplate = (toDoData, completedTasks) => {
  const htmlString = toDoData.data
    .map((task) =>
      completedTasks && completedTasks.includes(task)
        ? `<li><span class="task-completed">${task}</span></li>`
        : `<li><span>${task}</span></li>`
    )
    .join("");
  return `<button class="btn" title="Notiz löschen">       <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash3-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                  />
                </svg></button><h3>${toDoData.title}</h3><p class="noteItemTemplateDate">Erstellt: ${toDoData.formattedDate}</p><ul class="toDoItemTemplateList">${htmlString}</ul>`;
};

const categoryItemTemplate = (value) => {
  return `<button class="btn" title="Kategorie löschen">       <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash3-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                />
              </svg></button><p>${value}</p>`;
};

const defaultCategoryItemTemplate = (value) => {
  return `<p>${value}</p>`;
};

const getToDoInterfaceElements = () => {
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo-container";

  const title = Object.assign(document.createElement("textarea"), {
    className: "todo-title",
    name: "todo-title-textarea",
  });

  const input = Object.assign(document.createElement("input"), {
    type: "text",
    className: "todo-input",
    name: "todo-input",
  });

  const addBtn = Object.assign(document.createElement("button"), {
    innerText: "ToDo hinzufügen",
    className: "todo-btn",
    title: "Fügt neuen Task zur Liste hinzu",
  });

  const taskList = Object.assign(document.createElement("ul"), {
    className: "task-list",
  });

  todoDiv.append(input, addBtn, taskList);
  return {
    todoDiv,
    input,
    addBtn,
    taskList,
    title,
  };
};

const createTaskItem = (taskText) => {
  const li = document.createElement("li");

  const checkbox = Object.assign(document.createElement("input"), {
    type: "checkbox",
    className: "task-checkbox",
    name: "task-checkbox",
    title: "Markiert Task als abgeschlossen",
  });

  const taskSpan = Object.assign(document.createElement("span"), {
    textContent: taskText,
  });

  const taskDeleteBtn = Object.assign(document.createElement("button"), {
    innerHTML: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg>`,
    className: "task-delete-btn",
    title: "Task löschen",
  });

  li.appendChild(checkbox);
  li.appendChild(taskSpan);
  li.appendChild(taskDeleteBtn);

  return { li, checkbox, taskSpan, taskDeleteBtn };
};

const dateTemplate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const formattedDate = `${String(day).padStart(2, "0")}.${String(
    month
  ).padStart(2, "0")}.${year}`;
  return formattedDate;
};

export {
  noteItemTemplate,
  toDoItemTemplate,
  categoryItemTemplate,
  defaultCategoryItemTemplate,
  getToDoInterfaceElements,
  createTaskItem,
  dateTemplate,
};
