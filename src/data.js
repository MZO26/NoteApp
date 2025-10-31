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

export { formatDate };
