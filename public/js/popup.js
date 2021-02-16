const popups = document.querySelectorAll(".popup");
const popupBtns = document.querySelectorAll(".popupBtn");

popupBtns.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const index = Array.prototype.indexOf.call(popupBtns, el);
    popups[index].classList.add("popup--open");
  });
});

popups.forEach((el) => {
  el.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup--open")) {
      e.target.classList.remove("popup--open");
    }
  });
});

// For Delete Buttons
const cancelDeletion = document.querySelectorAll(".cancelDeletion");

cancelDeletion.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    popups.forEach((el) => {
      el.classList.remove("popup--open");
    });
  });
});
