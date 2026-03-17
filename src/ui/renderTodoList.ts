import { createTaskItem } from "../features/todoItems/todoUtils.js";
import { autoSaveTempToDo } from "../utils/autoSave.js";
import type { ToDo } from "../utils/classes.js";

const addToDo = (
  taskList: HTMLUListElement,
  input: HTMLInputElement,
  title: HTMLTextAreaElement,
): void => {
  if (!input || !input.value) return;
  const taskText = input.value.trim();
  if (!taskText) return;
  const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(taskText);
  taskList.appendChild(li);
  input.value = "";
  title.removeEventListener("input", autoSaveTempToDo);
  title.addEventListener("input", autoSaveTempToDo);
  autoSaveTempToDo();
  addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
};

const reloadToDoList = (
  taskList: HTMLUListElement,
  tasks: ToDo["data"],
): void => {
  if (!taskList || !tasks) return;
  taskList.innerHTML = "";
  for (const task of tasks) {
    if (!task || !task.content) continue;
    const { li, checkbox, taskSpan, taskDeleteBtn } = createTaskItem(
      task.content,
    );
    if (task.completed) {
      taskSpan.classList.add("task-completed");
      checkbox.checked = true;
    }
    taskList.appendChild(li);
    addEventListeners(li, checkbox, taskSpan, taskDeleteBtn);
  }
};

const addEventListeners = (
  li: HTMLLIElement,
  checkbox: HTMLInputElement,
  taskSpan: HTMLSpanElement,
  taskDeleteBtn: HTMLButtonElement,
) => {
  const onChange = () => {
    taskSpan.classList.toggle("task-completed", checkbox.checked);
  };
  const onSpanClick = () => {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  };
  const onButtonClick = () => {
    li.remove();
    autoSaveTempToDo();
  };

  checkbox.addEventListener("change", onChange);
  taskSpan.addEventListener("click", onSpanClick);
  taskDeleteBtn.addEventListener("click", onButtonClick);

  return () => {
    checkbox.removeEventListener("change", onChange);
    taskSpan.removeEventListener("click", onSpanClick);
    taskDeleteBtn.removeEventListener("click", onButtonClick);
  };
};

export { addToDo, reloadToDoList };
