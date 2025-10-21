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

export { add_priorities, formatDate };
