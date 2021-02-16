const searchInput = document.querySelectorAll(".search-input");
const searchList = document.querySelectorAll(".search-list");
const searchListItems = document.querySelectorAll(".search-list > li");

searchList.forEach((el) => {
  el.style.display = "none";
});
searchListItems.forEach((el) => {
  el.style.display = "none";
});

searchInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let searchValue = e.target.value;
    searchList.forEach((list) => {
      list.style.display = "block";
    });
    searchListItems.forEach((item) => {
      if (
        item.textContent.includes(searchValue.toLowerCase()) &&
        searchValue.length != 0
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

const body = document.querySelector("body");

searchInput.forEach((input) => {
  input.addEventListener("focusout", (e) => {
    body.addEventListener("click", (e) => {
      if (
        !(
          e.target.classList.contains("search-list") |
          e.target.classList.contains("search-input")
        )
      ) {
        searchList.forEach((list) => {
          list.style.display = "none";
        });
      }
    });
    // if (!e.target.classList.contains("search-list")) {
    //   searchList.forEach((list) => {
    //     list.style.display = "none";
    //   });
    // }
  });
});

searchInput.forEach((input) => {
  input.addEventListener("focusin", (e) => {
    let searchValue = input.value;
    if (searchValue.length != 0) {
      searchList.forEach((list) => {
        list.style.display = "block";
      });
    }
  });
});

// searchList.forEach((list) => {
//   list.addEventListener("focusout", (e) => {
//     console.log(list);
//     console.log(e.target);
//     e.target.style.display = "none";
//   });
// });

const searchForm = document.querySelectorAll(".search-form")[0];
// const searchForms = document.querySelectorAll(".search-form");

searchListItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    console.log(e.target.textContent);
    const tag = e.target.textContent;
    searchForm.action = `/search-articles/${tag}`;
    searchForm.submit();
  });
});

const categoriesList = document.querySelectorAll(".categories-list");
const categoriesListItems = document.querySelectorAll(".categories-list li");

categoriesListItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    console.log(e.target.textContent);
    const tag = e.target.textContent;
    searchForm.action = `/search-articles/${tag.toLowerCase()}`;
    searchForm.submit();
  });
});
