let content = document.querySelectorAll(".card--block.content");

content.forEach((el) => {
  const newContent = el.textContent.replaceAll("&#10;", "<br>");
  el.innerHTML = newContent;
});

let content2 = document.querySelectorAll(".card--block.long");

content2.forEach((el) => {
  const newContent = el.textContent.replaceAll("&#10;", "<br>");
  el.innerHTML = newContent;
});
