let sidebarNotesArr = [];

const event_handlers = (sidebarItem, notes) => {
  const btn = sidebarItem.querySelector("button");
  btn.onclick = function (event) {
    event.stopPropagation();
    const id = this.parentElement.getAttribute("data-id");
    const index = sidebarNotesArr.findIndex(
      (sidebarNote) => sidebarNote.id == id
    );
    if (index > -1) {
      sidebarNotesArr.splice(index, 1);
      localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
    }
    this.parentElement.remove();
  };
  sidebarItem.onclick = () => {
    if (!confirm("Do you want to override your current note?")) return;
    document.querySelector(".note").value = notes.data;
  };
};

const add_to_sidebar = (note_value) => {
  const sidebar = document.querySelector(".sidebar-notes");
  const sidebarItem = document.createElement("div");
  sidebarItem.id = "sidebarItem";
  const itemData = {
    id: Date.now() + Math.random(),
    data: note_value ? note_value : "",
    priority: add_priorities(),
    title: addTitle(note_value),
    formattedDate: formatDate(),
  };
  sidebarItem.setAttribute("data-id", itemData.id);
  sidebarItem.style.borderRight = `10px solid ${itemData.priority}`;
  if (
    !sidebarItem.classList.contains("light-mode") &&
    sidebar.classList.contains("light-mode")
  ) {
    sidebarItem.classList.toggle("light-mode");
  }
  sidebarItem.innerHTML = `<button class="btn">delete</button><p>${itemData.title}</p><p>${itemData.formattedDate}</p>`;
  sidebarNotesArr.push(itemData);
  localStorage.setItem("sidebarNotesArr", JSON.stringify(sidebarNotesArr));
  sidebar.appendChild(sidebarItem);
  event_handlers(sidebarItem, itemData);
};

const add_btn = () => {
  const note = document.querySelector(".note");
  alert("Task saved");
  note ? add_to_sidebar(note.value) : null;
  localStorage.setItem("note_value", note.value);
};

const delete_btn = () => {
  const note = document.querySelector(".note");
  note.value = "";
  localStorage.removeItem("note_value");
  alert("Task deleted");
};

const addTitle = (note_value) => {
  let title = "";
  if (note_value.length === 0) return "No Title";
  else if (!note_value.includes("\n") && note_value.length > 20) {
    title = note_value.slice(0, 20) + "...";
  } else {
    title = note_value.split("\n")[0];
  }
  return title;
};

const add_priorities = () => {
  const priorities = document.querySelector(".priorities");
  let color;
  switch (priorities.value) {
    case "-":
      break;
    case "low":
      color = "rgb(0,255,0)";
      break;
    case "medium":
      color = "rgb(255,255,0)";
      break;
    case "high":
      color = "rgb(255,0,0)";
      break;
  }
  return color;
};

const formatDate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedDate =
    `${String(day).padStart(2, "0")}.${String(month).padStart(
      2,
      "0"
    )}.${year}, ` +
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  return formattedDate;
};

const reload_sidebar = () => {
  const sidebar = document.querySelector(".sidebar-notes");
  const saved = localStorage.getItem("sidebarNotesArr") || "[]";
  sidebarNotesArr = JSON.parse(saved);
  console.log(sidebarNotesArr);
  if (sidebarNotesArr == []) return;
  sidebar.innerHTML = "";
  for (let i = 0; i < sidebarNotesArr.length; i++) {
    const sidebarItem = document.createElement("div");
    sidebarItem.id = "sidebarItem";
    sidebarItem.setAttribute("data-id", sidebarNotesArr[i].id);
    sidebarItem.style.borderRight = `10px solid ${sidebarNotesArr[i].priority}`;
    sidebarItem.innerHTML = `<button class="btn">delete</button><p>${sidebarNotesArr[i].title}</p><p>${sidebarNotesArr[i].formattedDate}</p>`;
    sidebar.appendChild(sidebarItem);
    event_handlers(sidebarItem, sidebarNotesArr[i]);
  }
};

const toggle_lightmode = () => {
  const sidebar = document.querySelector(".sidebar-notes");
  const note = document.querySelector(".note");
  if (sidebar.hasChildNodes()) {
    [...sidebar.children].forEach((child) =>
      child.classList.toggle("light-mode")
    );
  }
  const arr = [sidebar, note, document.body];
  arr.forEach((entry) => entry.classList.toggle("light-mode"));
  const currentMode = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";
  localStorage.setItem("mode", currentMode);
};

const collapse_sidebar = () => {
  const note = document.querySelector(".note");
  const sidebar_notes = document.getElementById("sidebar2");
  sidebar_notes.classList.toggle("collapsed");
  note.classList.toggle("collapsed");
  if (sidebar_notes.hasChildNodes()) {
    [...sidebar_notes.children].forEach((child) =>
      child.classList.toggle("collapsed")
    );
  }
};

window.onload = () => {
  reload_sidebar();
  const mode = localStorage.getItem("mode");
  if (mode == "light") {
    toggle_lightmode();
  }
  const note = document.querySelector(".note");
  const savedData = localStorage.getItem("note_value") || "";
  note.value = savedData;
};
