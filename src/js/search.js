import * as load from './load.js';
import * as index from './index.js';

export const search = document.querySelector('.search-bar');
const product = document.querySelector('.products');
const noResult = document.querySelector('.no-result');
export const span = document.querySelector('.span');
export const resultDiv = document.querySelector('.result-div');

let filt;

export function loadSearchResults() {
  filt = [];
  index.main.forEach(el => {
    if (el.name.toLowerCase().includes(search.value.toLowerCase()))
      filt.push(el);
  });
  if (!span) {
    localStorage.setItem('cat', JSON.stringify(filt));
    localStorage.setItem('result', search.value);
    location.href = 'categories.html';
  } else if (span) {
    if (filt.length === 0) {
      product.innerHTML = '';
      noResult.classList.remove('hidden');
    } else {
      noResult.classList.add('hidden');
      product.innerHTML = '';
      resultDiv.classList.remove('hidden');
      span.textContent = `'${search.value}'`;
      load.renderProducts(filt, 1, product);
      history.pushState([1, filt], null, `${search.value}`);
    }
  }
}
