const form_1 = document.querySelector(".form-2");
const form_1_inputs = document.querySelectorAll(".form-2 input");

form_1_inputs.forEach((el) => {
  el.addEventListener("input", (e) => {
    fullValidation(el);
  });
  el.addEventListener("focusin", (e) => {
    fullValidation(el);
  });
  el.addEventListener("focusout", (e) => {
    if (el.nextElementSibling) {
      if (el.nextElementSibling.classList.contains("span--open")) {
        el.nextElementSibling.classList.remove("span--open");
      }
      el.nextElementSibling.innerText = "";
    }
  });
});

const fullValidation = (input) => {
  if (input.getAttribute("name") === "username") {
    validateUsername(input);
  } else if (input.getAttribute("name") === "password") {
    validatePassword(input);
  } else if (input.getAttribute("name") === "email") {
    validateEmail(input);
  }
};

const validateUsername = (input) => {
  const inputName = input.getAttribute("name");
  const inputMinLength = input.getAttribute("minLength");
  const inputMaxLength = input.getAttribute("maxLength");
  if (input.validity.tooShort) {
    input.nextElementSibling.classList.add("span--open");
    input.nextElementSibling.innerText = `The ${inputName} you have entered is too short. ${capitalise(
      inputName
    )}s must be between ${inputMinLength} to ${inputMaxLength} characters long`;
  } else {
    input.nextElementSibling.classList.remove("span--open");
    input.nextElementSibling.innerText = "";
  }
};

const validatePassword = (input) => {
  const inputName = input.getAttribute("name");
  const inputMinLength = input.getAttribute("minLength");
  const inputMaxLength = input.getAttribute("maxLength");
  if (input.validity.tooShort) {
    input.nextElementSibling.classList.add("span--open");
    input.nextElementSibling.innerText = `The ${inputName} you have entered is too short. ${capitalise(
      inputName
    )}s must be between ${inputMinLength} to ${inputMaxLength} characters long.`;
  } else if (input.validity.tooLong) {
    input.nextElementSibling.classList.add("span--open");
    input.nextElementSibling.innerText = `The ${inputName} you have entered is too long. ${capitalise(
      inputName
    )}s must be between ${inputMinLength} to ${inputMaxLength} characters long.`;
  } else {
    input.nextElementSibling.classList.remove("span--open");
    input.nextElementSibling.innerText = "";
  }
};

const validateEmail = (input) => {
  if (input.validity.patternMismatch) {
    const inputName = input.getAttribute("name");
    input.nextElementSibling.classList.add("span--open");
    input.nextElementSibling.innerText = `The ${inputName} you have entered does not match the pattern.`;
  } else {
    input.nextElementSibling.classList.remove("span--open");
    input.nextElementSibling.innerText = "";
  }
};

// Capitalises first letter of the word passed as a parameter
const capitalise = (word) => {
  const firstLetter = word.charAt(0).toUpperCase();
  const newWord = word.replace(word.charAt(0), firstLetter);
  return newWord;
};
