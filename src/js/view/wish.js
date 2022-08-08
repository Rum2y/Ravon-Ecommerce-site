import { renderProducts } from '../load.js';
import { loadCartItems } from './view.js';

export function wish() {
  const cartItems = document.querySelector('.cart-items');
  const wishBody = document.querySelector('.wish-body');
  const heart = document.querySelector('.heart');

  heart.addEventListener('click', () => {
    location.href = 'wish-list.html';
  });

  if (wishBody) {
    const wNull = document.querySelector('.w-null');
    let cArr;
    let wishItem = JSON.parse(localStorage.getItem('wishItem'));
    let cartItem = JSON.parse(localStorage.getItem('cartItem'));
    let cartNumber = localStorage.getItem('cartNumber');
    let number = cartNumber ? cartNumber : 0;
    let k = JSON.parse(localStorage.getItem('allProd'));
    let itemsNum = document.querySelector('.num');
    if (cartItem) cArr = cartItem;
    else cArr = [];
    renderProducts(wishItem, 1, wishBody);

    if (wishItem.length === 0) wNull.classList.remove('hidden');

    document.addEventListener('click', e => {
      if (
        e.target.classList.contains('move') &&
        !e.target.classList.contains('c-prod')
      ) {
        let wProd = Array.from(document.querySelectorAll('.move'));
        number++;
        let i = wProd.indexOf(e.target);
        itemsNum.textContent = number;
        e.target.closest('.c-prod').classList.add('fade');
        e.target.closest('.c-prod').addEventListener('transitionend', () => {
          e.target.closest('.c-prod').remove();
        });
        cArr.push(wishItem[i]);
        loadCartItems(wishItem[i]);
        wishItem[i].added = true;
        k.forEach(g => {
          if (
            (wishItem[i].code === g.code && wishItem[i].code) ||
            (wishItem[i].id === g.id && wishItem[i].id)
          ) {
            g.wishList = false;
          }
        });
        wishItem[i] = '';
        wishItem = wishItem.filter(j => j !== '');
        localStorage.setItem('cartNumber', number);
        localStorage.setItem('wishItem', JSON.stringify(wishItem));
        localStorage.setItem('cartItem', JSON.stringify(cArr));

        if (cArr.length >= 3) {
          cartItems.style.height = '40vh';
          cartItems.style.overflowY = 'scroll';
        }
        if (wishItem.length === 0) {
          wNull.classList.remove('hidden');
        }
      }
    });
  }
}
