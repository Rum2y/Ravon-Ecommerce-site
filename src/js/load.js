import { viewProduct } from "./view/view.js";

export const product = document.querySelector(".products");
export const footer = document.querySelector(".footer");
let loadMore;
let loadButton;

let pages;
export let itemPerPage = 20;
export let numberOfPages;

//Render Products
function render(re, cont, Data) {
  re.forEach((el, i) => {
    const wishBody = document.querySelector(".wish-body");
    let t;
    if (wishBody) t = `<button class="move">Move To Cart</button>`;
    const html = `<div class="card c-prod mx-3 my-3" style="width: 20rem">
          <div class="zoom">
          <img
            src="${el.imageUrl || el.defaultArticle.logoPicture[0].url}"
            class="card-img-top image"
            alt="..."
          />
          </div>
          <div class="card-body description">
            <p class="card-text">
              <h6 class="title">${el.name}</h6>
              <h4>$${el.price?.value || el.price.current.value}</h4>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              ${el.reviews}
            </p>
          </div>
        </div>
        `;
    cont.insertAdjacentHTML("beforeend", html);
    const cDesc = document.querySelectorAll(".description");
    if (t !== undefined) cDesc[i].insertAdjacentHTML("beforeend", t);
    pages.push(el);
  });

  let cProd = document.querySelectorAll(".c-prod");
  if (cProd || result) viewProduct(cProd, pages, Data);

  if (pages.length === Data.length && loadMore !== undefined)
    loadMore.classList.add("hidden");
}

export function renderProducts(Data, val, cont) {
  pages = [];
  let result;
  if (Data.length > 20) result = partition(Data, val);
  else result = Data;

  render(result, cont, Data);

  if (result.length < Data.length) {
    cont.insertAdjacentHTML(
      "afterend",
      `<div class="load-more mt-4">
    <button class="btn btn-lg load-btn">Load More</button>
  </div>`
    );
    loadMore = document.querySelector(".load-more");
    loadButton = document.querySelector(".load-btn");

    //Load button render
    loadButton.addEventListener("click", function () {
      val++;
      result = partition(Data, val);
      render(result, cont, Data);
    });
  }
}

//Patition Cut
export function partition(dataCut, page) {
  const start = page * 20 - 20;
  const end = page * 20;

  const part = dataCut?.slice(start, end);
  return part;
}
