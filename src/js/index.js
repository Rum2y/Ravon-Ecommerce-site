import * as search from './search.js';
import * as categories from './category.js';
import * as view from './view/view.js';
import { viewCartItem } from './view/cart.js';
import { ASOBJ } from './asos.js';
import { HOBJ } from './hennes.js';
import { wish } from './view/wish.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

let mainData;
let str;
let starArr = [4.0, 4.2, 4.5, 4.7, 5.0];
let rArr = [];
let arrivals;
const showProduct = document.querySelector('.show');
const spin = document.querySelector('.spin');
const carousel = document.querySelector('.img-car');
const arri = document.querySelector('.arrival');
const next = document.querySelectorAll('.next');
const itemsNum = document.querySelector('.num');
const cartDrop = document.querySelector('.cart-drop');
const cartBody = document.querySelector('.cart-body');
let cartNumber = localStorage.getItem('cartNumber');
let cartItem = JSON.parse(localStorage.getItem('cartItem'));
let wishItem = JSON.parse(localStorage.getItem('wishItem'));

//initial
export function cart(rArr) {
  const cartItems = document.querySelector('.cart-items');
  const noItems = document.querySelector('.no-items');
  const cartBtn = document.querySelector('.cart-btn');

  if (!cartBody) {
    if (cartItem === null || cartItem.length === 0) {
      noItems.classList.remove('hidden');
      cartBtn.classList.add('hidden');
    }
    if (cartNumber && cartItem) {
      if (cartItem.length >= 3) {
        cartItems.style.height = '40vh';
        cartItems.style.overflowY = 'scroll';
      }
      itemsNum.textContent = cartNumber;
      cartItem.forEach(el => {
        view.loadCartItems(el);
      });
    }
    const cartDiv = document.querySelector('.cart-cont');
    cartDiv.addEventListener('mouseover', function () {
      cartDrop.classList.remove('hidden');
    });
    cartDiv.addEventListener('mouseout', function () {
      cartDrop.classList.add('hidden');
    });
    if (cartItem && !showProduct)
      document.addEventListener('click', view.clickOnCart);
  }

  //View Cart Page
  viewCartItem(cartItem, cartNumber, rArr);
}

//Wish List
wish();

//Sticky Nav
const nav = document.querySelector('.top-nav');
const head = document.querySelector('.heading');
const bottomNav = document.querySelector('.bottom-nav');

export function stick(object) {
  function obsCallback(e) {
    [entry] = e;
    if (!entry.isIntersecting) {
      nav.classList.add('fixed-top');
      head.classList.add('sticky');
    } else {
      nav.classList.remove('fixed-top');
      head.classList.remove('sticky');
    }
  }
  const obsOptions = {
    root: null,
    threshold: 0,
  };
  const stickyNav = new IntersectionObserver(obsCallback, obsOptions);
  stickyNav.observe(object);
}

stick(bottomNav);

//Load Products from API
export function loadProduct() {
  const data2 = HOBJ;
  const data = ASOBJ;

  data.products.forEach(el => {
    el.category = 'Footwear';
    let u = el.imageUrl;
    el.imageUrl = 'https://' + u;
  });
  data2.results.forEach(n => {
    if (n.name.includes('Pants') || n.name.includes('Shorts'))
      n.category = 'Bottoms';
    if (n.name.includes('Hoodie') || n.name.includes('Blazer'))
      n.category = 'Jackets';
  });

  mainData = data.products.concat(data2.results);
  mainData.forEach(e => {
    if (cartItem !== null) {
      cartItem.forEach(n => {
        if ((n.code === e.code && e.code) || (n.id === e.id && e.id)) {
          e.added = true;
        }
      });
    } else e.added = false;
    if (wishItem) {
      wishItem.forEach(m => {
        if ((m.code === e.code && e.code) || (m.id === e.id && e.id)) {
          e.wishList = true;
        }
      });
    } else e.wishList = false;

    e.category += ' ' + 'All';
    str = Math.floor(Math.random() * starArr.length);
    let star = starArr[str];
    if (star < 5.0 && star > 4.2) e.reviews = `<i class="bi bi-star-half"></i>`;
    else if (star === 5.0) e.reviews = `<i class="bi bi-star-fill"></i>`;
    else if (star < 4.5) e.reviews = `<i class="bi bi-star"></i>`;
  });
  //Function Calls
  let arrLength = mainData.length;
  for (let i = 0; i < arrLength; i++) {
    let random = Math.floor(Math.random() * mainData.length);
    rArr.push(mainData[random]);
    mainData.splice(random, 1);
  }
  newArrivals(rArr);
  cart(rArr);

  categories.category(rArr);

  return rArr;
}
export const main = loadProduct();

//Loading New Arrivals
function newArrivals(array) {
  const nArr = [];
  array.forEach(el => {
    if (el.sellingAttributes && carousel) {
      arrivals = `<div class="a-card mx-3" style="width: 20rem">
    <div class="a-zoom">
    <img
      src="${el.defaultArticle.logoPicture[0].url}"
      class="a-img"
      alt="..."
    />
    </div>
    <div class="">
      <p class="">
        <h6 class="title">${el.name}</h6>
        <h4>$${el.price.value}</h4>
      </p>
    </div>
  </div>`;
      nArr.push(el);
      carousel.insertAdjacentHTML('beforeend', arrivals);
      spin.classList.add('hidden');
      next.forEach(e => e.classList.remove('hidden'));
      view.scroll(carousel, arri);
    }
  });
  const aCard = document.querySelectorAll('.a-card');
  if (nArr.length !== 0) view.viewProduct(aCard, nArr, array);
}

//Search
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && search.search.value.length !== 0)
    search.loadSearchResults();
});
