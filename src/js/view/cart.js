export function viewCartItem(cartItem, cartNumber, allProd) {
  const cartBody = document.querySelector('.cart-body');
  const sub = document.querySelector('.sub');
  const subTotal = document.querySelector('.subtotal');
  const noItem = document.querySelector('.null');

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('cart-btn')) {
      this.location.href = 'cart-page.html';
    }
  });

  if (cartBody) {
    const bagDiv = document.querySelector('.bag-div');

    cartItem.forEach(el => {
      let cartHtml = `<div class="bag-items">
          <div class="px-5 py-3 b-item">
            <div class="cart-img">
              <img
                class="img-c"
                src="${el.imageUrl || el.images[0].url}"
                alt=""
              />
            </div>
            <div class="cart-item-name ms-3">
              <h4 class="c-price"><strong>$${
                el.price?.value || el.price.current.value
              }</strong></h4>
              <div class="c-name">${el.name}</div>
              <div class="quantity">
               Qty: <input class="quant mt-2" type="number" value="1" min="1" max="10"/>
              </div>
            </div>
            <div class="close-div">
              <i class="fa-solid fa-xmark close"></i>
            </div>
          </div>
          <hr class="part" />
        </div>`;

      bagDiv.insertAdjacentHTML('afterbegin', cartHtml);
    });
    const quantity = document.querySelectorAll('.quant');
    calculateTotal(cartItem);

    //Calculate initial SubTotal
    function calculateTotal(cartItem) {
      let total = 0;
      cartItem.forEach((n, i) => {
        total += quantity[i].value * (n.price?.value || n.price.current.value);
      });
      sub.textContent = `$${total.toFixed(2)}`;
    }

    quantity.forEach(k => {
      k.addEventListener('change', function () {
        calculateTotal(cartItem);
      });
    });

    //Delete Cart Items
    document.addEventListener('click', e => {
      if (e.target.classList.contains('close')) {
        let deleteItem = Array.from(document.querySelectorAll('.close'));
        cartNumber--;
        let i = cartItem.length - 1 - deleteItem.indexOf(e.target);
        allProd.forEach(g => {
          if (
            (cartItem[i].code === g.code && cartItem[i].code) ||
            (cartItem[i].id === g.id && cartItem[i].id)
          ) {
            g.added = false;
          }
        });
        cartItem[i] = '';
        e.target.closest('.bag-items').classList.add('fade');
        e.target.closest('.bag-items').addEventListener('transitionend', () => {
          e.target.closest('.bag-items').remove();
        });

        cartItem = cartItem.filter(j => j !== '');
        calculateTotal(cartItem);
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
        localStorage.setItem('cartNumber', cartNumber);

        noDisplay(cartItem);
      }
    });
  }

  //Buy Products

  const checkout = document.querySelector('.checkout');
  if (checkout) {
    const bagItems = document.querySelectorAll('.bag-items');
    checkout.addEventListener('click', () => {
      bagItems.forEach(el => {
        el.remove();
      });
      cartItem.splice(0, cartItem.length);
      localStorage.clear();
      noDisplay(cartItem);

      alert('Your items have been bought');
    });
  }

  //No itmes display
  function noDisplay(cartItem) {
    if (cartItem.length === 0) {
      noItem.classList.remove('hidden');
      subTotal.classList.add('hidden');
    }
  }
}
