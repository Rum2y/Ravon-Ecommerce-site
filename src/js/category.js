import { renderProducts } from "./load.js";

const product = document.querySelector(".products");
const resultDiv = document.querySelector(".result-div");
const span = document.querySelector(".span");
const noResult = document.querySelector(".no-result");
const shopNow = document.querySelectorAll(".shop-now");
const group = document.querySelectorAll(".gro");

export function category(json) {
  const bottomNav = document.querySelector(".bottom-nav");
  bottomNav.addEventListener("click", function (e) {
    const filter = [];
    if (e.target.classList.contains("item")) {
      json.forEach((el) => {
        if (
          el.category.toLowerCase().includes(e.target.textContent.toLowerCase())
        ) {
          filter.push(el);
        } else if (
          el.name
            .toLowerCase()
            .includes(e.target.textContent.toLowerCase().slice(0, -1))
        ) {
          filter.push(el);
        }
      });
      localStorage.setItem("result", e.target.textContent);
      localStorage.setItem("cat", JSON.stringify(filter));
      if (!span) {
        location.href = "categories.html";
      } else {
        history.pushState(
          [e.target.textContent, filter],
          null,
          `${e.target.textContent}`
        );
        span.innerHTML = e.target.textContent;
        if (noResult) noResult.classList.add("hidden");
        product.innerHTML = "";
        renderProducts(filter, 1, product);
      }
    }
  });

  if (shopNow) {
    shopNow.forEach((k) => {
      k.addEventListener("click", function () {
        localStorage.setItem("result", "All");
        localStorage.setItem("cat", JSON.stringify(json));
        location.href = "categories.html";
      });
    });
  }

  if (group) {
    group.forEach((t) => {
      t.addEventListener("click", function (e) {
        const cBtn = e.target.closest(".gro").querySelector(".c-btn");
        const grup = [];
        json.forEach((el) => {
          if (
            el.category.toLowerCase().includes(cBtn.textContent.toLowerCase())
          ) {
            grup.push(el);
          } else if (
            el.name
              .toLowerCase()
              .includes(cBtn.textContent.toLowerCase().slice(0, -1))
          ) {
            grup.push(el);
          }
        });
        localStorage.setItem("result", cBtn.textContent.toLowerCase());
        localStorage.setItem("cat", JSON.stringify(grup));
        location.href = "categories.html";
      });
    });
  }
}

if (span && product) {
  window.addEventListener("popstate", function (e) {
    span.innerHTML = e.state[0];
    product.innerHTML = "";
    renderProducts(e.state[1], 1, product);
  });
}

if (product) {
  let opt = JSON.parse(localStorage.getItem("cat"));
  let show = localStorage.getItem("result");

  history.replaceState([show, opt], null, show);
  resultDiv.classList.remove("hidden");
  span.innerHTML = show;

  if (opt.length === 0) {
    product.innerHTML = "";
    noResult.classList.remove("hidden");
  } else {
    noResult.classList.add("hidden");
    renderProducts(opt, 1, product);
  }
}
