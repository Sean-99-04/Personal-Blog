const dropLabel = document.querySelectorAll(".dropLabel");
const dropList = document.querySelectorAll(".dropList");

// LABEL CLICK EVENT
// if (window.innerWidth < 720) {
dropLabel.forEach((el) => {
  el.addEventListener("click", (e) => {
    const index = Array.prototype.indexOf.call(dropLabel, el);

    if (dropList[index].classList.contains("list-open")) {
      dropList[index].classList.remove("list-open");
      dropList[index].style.maxHeight = "0px";
    } else {
      dropList[index].classList.add("list-open");
      dropList[index].style.maxHeight = `${dropList[index].scrollHeight + 5}px`;
    }
  });
});
// }

// LABEL HOVER EVENT
if (window.innerWidth >= 768) {
  dropLabel.forEach((el) => {
    el.addEventListener("mouseover", (e) => {
      const index = Array.prototype.indexOf.call(dropLabel, el);
      if (!dropList[index].classList.contains("list-open")) {
        dropList[index].classList.add("list-open");
        dropList[index].style.maxHeight = `${
          dropList[index].scrollHeight + 5
        }px`;
      }
    });
    el.addEventListener("mouseout", (e) => {
      const index = Array.prototype.indexOf.call(dropLabel, el);
      if (dropList[index].classList.contains("list-open")) {
        dropList[index].classList.remove("list-open");
        dropList[index].style.maxHeight = `0px`;
      }
    });
  });
  // LIST HOVER EVENT
  dropList.forEach((el) => {
    el.addEventListener("mouseover", (e) => {
      if (!el.classList.contains("list-open")) {
        el.classList.add("list-open");
        el.style.maxHeight = `${el.scrollHeight + 5}px`;
      }
    });
    el.addEventListener("mouseout", (e) => {
      if (el.classList.contains("list-open")) {
        el.classList.remove("list-open");
        el.style.maxHeight = `0px`;
      }
    });
  });
}

// We need this for something?
console.log(window.innerWidth);

// Continue here for "categories"
