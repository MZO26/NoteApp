import { add_priorities, addTitle, formatDate } from "./data.js";

const add_to_sidebar = (note_value) => {
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  const sidebar = document.querySelector(".sidebar-notes");
  const sidebarItem = document.createElement("div");
  sidebarItem.id = "sidebarItem";
  const itemData = {
    id: Date.now() + Math.random(),
    category: "",
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
  sidebarItem_handler(sidebarItem, itemData);
};

const sidebarItem_handler = (sidebarItem, notes) => {
  const sidebarItem_btn = sidebarItem.querySelector("button");
  let sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  sidebarItem_btn.onclick = function (event) {
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

const reload_sidebar = () => {
  const sidebar = document.querySelector(".sidebar-notes");
  const sidebarNotesArr = JSON.parse(
    localStorage.getItem("sidebarNotesArr") || "[]"
  );
  if (!sidebarNotesArr.length) return;
  sidebar.innerHTML = "";
  for (let i = 0; i < sidebarNotesArr.length; i++) {
    const sidebarItem = document.createElement("div");
    sidebarItem.id = "sidebarItem";
    sidebarItem.setAttribute("data-id", sidebarNotesArr[i].id);
    sidebarItem.style.borderRight = `10px solid ${sidebarNotesArr[i].priority}`;
    sidebarItem.innerHTML = `<button class="btn">delete</button><p>${sidebarNotesArr[i].title}</p><p>${sidebarNotesArr[i].formattedDate}</p>`;
    sidebar.appendChild(sidebarItem);
    sidebarItem_handler(sidebarItem, sidebarNotesArr[i]);
  }
};

export { reload_sidebar, add_to_sidebar, sidebarItem_handler };
