const showProduct = document.querySelector('.show');
const related = document.querySelector('.related');
const relImg = document.querySelector('.rel-img');
let noItems;
let cartBtn;
let cartItems;
let itemsNum;
let image;
let array;
let cartInfo;
let cArr;
let wArr;
let k;

export function viewProduct(cProd, x, data) {
  cProd.forEach((el, i) => {
    el.addEventListener('click', function (e) {
      if (!e.target.classList.contains('move')) {
        localStorage.setItem('prod', JSON.stringify(x));
        localStorage.setItem('allProd', JSON.stringify(data));
        localStorage.setItem('id', JSON.stringify(i));
        location.href = 'product-page.html';
      }
    });
  });
}

if (showProduct) {
  let p = JSON.parse(localStorage.getItem('prod'));
  let j = JSON.parse(localStorage.getItem('id'));
  k = JSON.parse(localStorage.getItem('allProd'));
  history.replaceState([p[j], k], null, `${p[j].name}`);
  renderShow(p[j], k);
  scroll(relImg, related);
}

function renderShow(arr, k) {
  let counter = 0;
  let rel;
  let img2;
  array = [];

  showProduct.innerHTML = '';

  if (arr?.images) {
    img2 = ` <img
      class="second me-2 mt-5"
      src="${arr.images[0].url}"
      alt=""
    />`;
  }

  const pHtml = `<div class="product-img">
    <img class="img-view mt-5 me-5" src="${
      arr.imageUrl || arr.defaultArticle.logoPicture[0].url
    }" alt="..." />
  </div>
  <div class="product-description">
    <h3 class="desc">${arr.name}</h3>
    <h2 class="mt-1">$${arr.price?.value || arr.price.current.value}</h2>
    <p class='mt-2'><i class="bi bi-star-fill"></i>
    <i class="bi bi-star-fill"></i>
    <i class="bi bi-star-fill"></i>
    <i class="bi bi-star-fill"></i>
    ${arr.reviews}</p>
    <p>For more information about the product, go to <a class='goto' href=${
      arr.url || arr.linkPdp
    }>${arr.url || arr.linkPdp}</a></p>
    <div class="cart-add mt-4 d-flex">
      <button class="add me-2">Add to cart</button>
      <button class="wish-add me-2"><i class="bi bi-suit-heart"></i><span class="tex"> Add to wishlist</span></button>
    </div>
  </div>`;
  showProduct.insertAdjacentHTML('beforeend', pHtml);

  const addCart = document.querySelector('.add');
  const wishAdd = document.querySelector('.wish-add');
  let tex = document.querySelector('.tex');
  if (arr.added) addCart.textContent = 'ADDED';
  if (arr.wishList) {
    tex.textContent = ' Added to wishlist';
    wishAdd.style.backgroundColor = `#ecb390`;
    wishAdd.style.border = `1px solid #ecb390`;
  }

  const pImg = document.querySelector('.product-img');
  if (img2 !== undefined) {
    pImg.insertAdjacentHTML('afterbegin', img2);
    const second = document.querySelector('.second');
    const imageView = document.querySelector('.img-view');
    let one = second.getAttribute('src');
    let two = imageView.getAttribute('src');
    let three;

    second.addEventListener('click', function () {
      imageView.setAttribute('src', one);
      second.setAttribute('src', two);
      three = two;
      two = one;
      one = three;
    });
  }

  relImg.innerHTML = '';
  k.forEach(el => {
    if (counter > 10) return;
    if (el.category.toLowerCase() === arr.category.toLowerCase()) {
      counter++;
      rel = `<div class="rel-prod mx-2" style="width: 700px">
      <img
        src="${el.imageUrl || el.images[0].url}"
        class="i"
        alt="..."
      />
      <div class="descriptipon">
        <p class="t">
          <p class="rel-title mb-0">${el.name}</p>
          <p class="mb-0"><strong>$${
            el.price?.value || el.price.current.value
          }</strong></p>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          ${el.reviews}
        </p>
      </div>
    </div>`;
      if (rel !== undefined) relImg.insertAdjacentHTML('beforeend', rel);
      array.push(el);
    }
  });
  image = document.querySelectorAll('.rel-prod');

  image.forEach((n, i) => {
    n.addEventListener('click', function () {
      renderShow(array[i], k);
      history.pushState([array[i], k], null, `${array[i].name}`);
    });
  });

  //Add to Cart
  itemsNum = document.querySelector('.num');
  let cartNumber = localStorage.getItem('cartNumber');
  let cartItem = JSON.parse(localStorage.getItem('cartItem'));
  let number = cartNumber ? cartNumber : 0;
  if (cartItem) cArr = cartItem;
  else cArr = [];
  if (addCart !== null) {
    addCart.addEventListener('click', function () {
      if (addCart.textContent !== 'ADDED') {
        number++;
        itemsNum.textContent = number;
        addCart.textContent = 'ADDED';
        cArr.push(arr);
        localStorage.setItem('cartNumber', number);
        localStorage.setItem('cartItem', JSON.stringify(cArr));

        if (cArr.length >= 3) {
          cartItems.style.height = '40vh';
          cartItems.style.overflowY = 'scroll';
        }
        loadCartItems(arr);
        arr.added = true;
      }
    });
    document.addEventListener('click', clickOnCart);
  }

  //Add to WishList
  let wishItem = JSON.parse(localStorage.getItem('wishItem'));
  if (wishItem) wArr = wishItem;
  else wArr = [];
  wishAdd.addEventListener('click', function () {
    if (tex.textContent !== ' Added to wishlist') {
      console.log('Hello');
      wishAdd.style.backgroundColor = `#ecb390`;
      wishAdd.style.border = `1px solid #ecb390`;
      tex.textContent = ' Added to wishlist';
      wArr.push(arr);
      localStorage.setItem('wishItem', JSON.stringify(wArr));
      arr.wishList = true;
    }
  });

  window.addEventListener('popstate', function (e) {
    renderShow(e.state[0], e.state[1]);
  });
}

export function clickOnCart(e) {
  let itemsNum = document.querySelector('.num');
  let noItems = document.querySelector('.no-items');
  let cartBtn = document.querySelector('.cart-btn');
  let number = localStorage.getItem('cartNumber');
  let cartItem = JSON.parse(localStorage.getItem('cartItem'));
  let k = JSON.parse(localStorage.getItem('allProd'));

  if (e.target.classList.contains('trash-icon')) {
    let trashBtn = Array.from(document.querySelectorAll('.trash-icon'));
    number--;
    itemsNum.textContent = number;
    number = itemsNum.textContent;
    if (showProduct) {
      cArr = cArr;
      k = k;
    } else {
      cArr = cartItem;
    }
    let i = cArr.length - 1 - trashBtn.indexOf(e.target);
    k.forEach(g => {
      if (
        (cArr[i].code === g.code && cArr[i].code) ||
        (cArr[i].id === g.id && cArr[i].id)
      ) {
        g.added = false;
      }
    });
    cArr[i] = '';
    e.target.closest('.cart-info').remove();
    cArr = cArr.filter(j => j !== '');
    localStorage.setItem('cartItem', JSON.stringify(cArr));
    localStorage.setItem('cartNumber', number);
    if (cArr.length < 3) {
      cartItems.style.height = null;
      cartItems.style.overflowY = null;
    }
    if (cArr.length === 0) {
      noItems.classList.remove('hidden');
      cartBtn.classList.add('hidden');
    }
  }
  if (
    e.target.closest('.cart-info') &&
    !e.target.classList.contains('trash-icon')
  ) {
    cartInfo = Array.from(document.querySelectorAll('.cart-info'));
    if (showProduct) {
      cArr = cArr;
      k = k;
    } else {
      cArr = cartItem;
    }
    let n = cArr.length - 1 - cartInfo.indexOf(e.target.closest('.cart-info'));
    localStorage.setItem('prod', JSON.stringify(cArr));
    localStorage.setItem('allProd', JSON.stringify(k));
    localStorage.setItem('id', JSON.stringify(n));
    location.href = 'product-page.html';
  }
}

export function loadCartItems(arr) {
  noItems = document.querySelector('.no-items');
  cartBtn = document.querySelector('.cart-btn');
  cartItems = document.querySelector('.cart-items');

  if (arr.length === 0) {
    noItems.classList.remove('hidden');
    cartBtn.classList.add('hidden');
  } else {
    noItems.classList.add('hidden');
    cartBtn.classList.remove('hidden');
  }

  let cHtml = `<div class="cart-info my-1 border-bottom p-2">
  <div class="cart-img">
    <img
      class="size"
      src="${arr.imageUrl || arr.images[0].url}"
      alt=""
    />
  </div>
  <div class="cart-desc ms-2">
  <div class="des"><p>${arr.name}</p>
    <h6>$${arr.price?.value || arr.price.current.value}</h6></div>
                  <div class="trash">
                  <i class="bi bi-trash trash-icon"></i>
                  </div>
  </div>
</div>`;

  cartItems.insertAdjacentHTML('afterbegin', cHtml);
  if (arr.length >= 3) {
    cartItems.style.height = '40vh';
    cartItems.style.overflowY = 'scroll';
  }
}

export function scroll(con, main) {
  main.addEventListener('click', function (e) {
    if (e.target.closest('.right')) con.scrollLeft += 600;
    if (e.target.closest('.left')) con.scrollLeft -= 600;
  });
}
