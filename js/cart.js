/* =========================================================
   BREW & BLISS — Shopping Cart (cart.js)
   Handles: add, remove, qty change, localStorage, totals, drawer
   ========================================================= */

'use strict';

// ---- Data ----
const STORAGE_KEY = 'brewbliss_cart';

let cart = loadCart();

// ---- LocalStorage Helpers ----
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save cart to localStorage', e);
  }
}

// ---- Cart Operations ----
function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartBadge();
  showToast(`${item.name} added to your order!`);
}

function removeFromCart(id) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx !== -1) {
    const name = cart[idx].name;
    cart.splice(idx, 1);
    saveCart();
    renderCart();
    updateCartBadge();
    showToast(`${name} removed.`);
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ---- UI Rendering ----
function renderCart() {
  const body     = document.getElementById('cartBody');
  const footer   = document.getElementById('cartFooter');
  const subtotal = document.getElementById('cartSubtotal');
  const tax      = document.getElementById('cartTax');
  const total    = document.getElementById('cartTotal');

  if (!body) return;

  body.innerHTML = '';

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <strong>Your cart is empty</strong>
        <p>Add a coffee or two from the menu below and your order will appear here.</p>
      </div>`;
    if (footer) footer.hidden = true;
    return;
  }

  if (footer) footer.hidden = false;

  cart.forEach(item => {
    const lineTotal = (item.price * item.qty).toFixed(0);
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.setAttribute('data-id', item.id);
    el.innerHTML = `
      <img src="${escHtml(item.img)}" alt="${escHtml(item.name)}" class="cart-item-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&q=60'" />
      <div class="cart-item-info">
        <div class="cart-item-name">${escHtml(item.name)}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" aria-label="Decrease quantity" data-action="decrease" data-id="${escHtml(String(item.id))}">−</button>
          <span class="qty-display" aria-label="Quantity: ${item.qty}">${item.qty}</span>
          <button class="qty-btn" aria-label="Increase quantity" data-action="increase" data-id="${escHtml(String(item.id))}">+</button>
        </div>
        <div class="cart-item-line-total">Total: ₹${lineTotal}</div>
      </div>
      <button class="cart-item-remove" aria-label="Remove ${escHtml(item.name)} from cart" data-action="remove" data-id="${escHtml(String(item.id))}">✕ Remove</button>`;
    body.appendChild(el);
  });

  // Totals
  const sub = getSubtotal();
  const taxAmt = Math.round(sub * 0.05);
  const finalTotal = sub + taxAmt;

  if (subtotal) subtotal.textContent = `₹${sub}`;
  if (tax)      tax.textContent      = `₹${taxAmt}`;
  if (total)    total.textContent    = `₹${finalTotal}`;
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count > 99 ? '99+' : count;
  badge.classList.toggle('visible', count > 0);
  document.getElementById('cartToggleBtn')?.setAttribute('aria-label', `Open cart (${count} item${count !== 1 ? 's' : ''})`);
}

// ---- Drawer ----
function openCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const btn     = document.getElementById('cartToggleBtn');
  if (!drawer) return;
  drawer.classList.add('open');
  overlay?.classList.add('visible');
  drawer.setAttribute('aria-hidden', 'false');
  btn?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.getElementById('cartCloseBtn')?.focus();
}

function closeCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const btn     = document.getElementById('cartToggleBtn');
  if (!drawer) return;
  drawer.classList.remove('open');
  overlay?.classList.remove('visible');
  drawer.setAttribute('aria-hidden', 'true');
  btn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  btn?.focus();
}

// ---- Event Delegation ----
function initCartEvents() {
  // Open / close
  document.getElementById('cartToggleBtn')?.addEventListener('click', openCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // Cart body delegation (qty + remove)
  document.getElementById('cartBody')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id  = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'increase')  changeQty(id,  1);
    if (action === 'decrease')  changeQty(id, -1);
    if (action === 'remove')    removeFromCart(id);
  });

  // Checkout button (demo)
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    showToast('Checkout is a demo — no payment is processed.');
  });
}

// ---- Toast ----
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- HTML Escaping ----
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
  initCartEvents();
});

// Expose globally so menu.js can call addToCart
window.BrewCart = { addToCart, showToast };
