// cart.js - manages localStorage cart
const CART_KEY = 'lavessa_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) removeFromCart(id);
  else saveCart(cart);
}

function calculateTotal() {
  const cart = getCart();
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const cart = getCart();
  container.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>₹${item.price} x ${item.qty}</p>
        <button onclick="changeQty('${item.id}',1)">+</button>
        <button onclick="changeQty('${item.id}',-1)">-</button>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById('cart-total').textContent = '₹' + calculateTotal();
}

// expose functions globally for inline onclicks
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;

// utility to navigate to cart page
function openCart() { window.location.href='cart.html'; }
window.openCart = openCart;

// initialize page
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('cart-items')) renderCart();

  // bind add-to-cart buttons (used on product pages)
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price, image } = btn.dataset;
      addToCart({ id, name, price: parseFloat(price), image });
    });
  });
});
