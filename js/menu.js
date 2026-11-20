/* =========================================================
   BREW & BLISS — Menu (menu.js)
   Handles: product data, rendering, category filters, search
   ========================================================= */

'use strict';

// ---- Product Data ----
const MENU_ITEMS = [
  // HOT COFFEE
  {
    id: 'hot-01',
    category: 'hot',
    name: 'Signature Espresso Blend',
    desc: 'Bold and smooth with notes of dark chocolate and roasted hazelnut. A pure coffee experience.',
    price: 180,
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=75&auto=format&fit=crop',
    badge: 'Best Seller'
  },
  {
    id: 'hot-02',
    category: 'hot',
    name: 'Classic Cappuccino',
    desc: 'Velvety steamed milk and dense foam layered over a rich double espresso shot.',
    price: 210,
    img: 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=600&q=75&auto=format&fit=crop',
    badge: null
  },
  {
    id: 'hot-03',
    category: 'hot',
    name: 'Oat Milk Latte',
    desc: 'Creamy organic oat milk steamed to perfection with our house espresso blend.',
    price: 240,
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=75&auto=format&fit=crop',
    badge: 'Staff Pick'
  },
  {
    id: 'hot-04',
    category: 'hot',
    name: 'Single-Origin Pour-Over',
    desc: 'Slow-brewed to highlight the unique terroir of this week\'s featured single-origin bean.',
    price: 280,
    img: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=600&q=75&auto=format&fit=crop',
    badge: 'Seasonal'
  },
  {
    id: 'hot-05',
    category: 'hot',
    name: 'Honey Cinnamon Flat White',
    desc: 'Silky microfoam with a drizzle of raw honey and a hint of Ceylon cinnamon.',
    price: 260,
    img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=75&auto=format&fit=crop',
    badge: null
  },
  // COLD COFFEE
  {
    id: 'cold-01',
    category: 'cold',
    name: 'Cold Brew Classic',
    desc: 'Steeped for 18 hours, our cold brew is smooth, low-acid and deeply satisfying.',
    price: 220,
    img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=75&auto=format&fit=crop',
    badge: 'Best Seller'
  },
  {
    id: 'cold-02',
    category: 'cold',
    name: 'Iced Oat Latte',
    desc: 'Double espresso over ice, topped with cold oat milk and a touch of vanilla.',
    price: 250,
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=75&auto=format&fit=crop',
    badge: null
  },
  {
    id: 'cold-03',
    category: 'cold',
    name: 'Coconut Cold Brew',
    desc: 'Our signature cold brew meets rich coconut cream for a tropical afternoon pick-me-up.',
    price: 270,
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=75&auto=format&fit=crop',
    badge: 'New'
  },
  {
    id: 'cold-04',
    category: 'cold',
    name: 'Iced Espresso Tonic',
    desc: 'A refreshing espresso tonic with sparkling water, zesty lemon peel and house syrup.',
    price: 230,
    img: 'https://images.unsplash.com/photo-1562547256-2c5ee93b60b7?w=600&q=75&auto=format&fit=crop',
    badge: null
  },
  // SPECIAL DRINKS
  {
    id: 'sp-01',
    category: 'special',
    name: 'Turmeric Golden Latte',
    desc: 'A warming blend of golden turmeric, ginger and oat milk with a hint of black pepper.',
    price: 290,
    img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=75&auto=format&fit=crop',
    badge: 'Wellness'
  },
  {
    id: 'sp-02',
    category: 'special',
    name: 'Rose Cardamom Latte',
    desc: 'Fragrant rosewater and aromatic cardamom meet velvety steamed milk. Floral and elegant.',
    price: 310,
    img: 'https://images.unsplash.com/photo-1587134160474-cd53ba4f7f6e?w=600&q=75&auto=format&fit=crop',
    badge: 'Signature'
  },
  {
    id: 'sp-03',
    category: 'special',
    name: 'Matcha Oat Latte',
    desc: 'Ceremonial-grade Japanese matcha whisked smooth with steamed organic oat milk.',
    price: 300,
    img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=75&auto=format&fit=crop',
    badge: 'Staff Pick'
  }
];

// ---- State ----
let activeFilter = 'all';
let searchQuery  = '';

// ---- Render ----
function renderMenu() {
  const grid  = document.getElementById('menuGrid');
  const empty = document.getElementById('menuEmpty');
  if (!grid) return;

  const q = searchQuery.toLowerCase().trim();

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = activeFilter === 'all' || item.category === activeFilter;
    const matchQ   = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.hidden    = true;
    if (empty) empty.hidden = false;
    return;
  }

  grid.hidden = false;
  if (empty) empty.hidden = true;

  filtered.forEach(item => {
    const card = createMenuCard(item);
    grid.appendChild(card);
  });
}

function createMenuCard(item) {
  const catLabels = { hot: 'Hot Coffee', cold: 'Cold Coffee', special: 'Special Drinks' };
  const el = document.createElement('article');
  el.className = 'menu-card';
  el.setAttribute('data-category', item.category);
  el.setAttribute('data-id', item.id);

  el.innerHTML = `
    <div class="menu-card-img-wrap">
      <img
        src="${item.img}"
        alt="${escHtml(item.name)}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=60'"
      />
      ${item.badge ? `<span class="menu-card-badge">${escHtml(item.badge)}</span>` : ''}
    </div>
    <div class="menu-card-body">
      <span class="menu-card-category">${catLabels[item.category] || ''}</span>
      <h3 class="menu-card-name">${escHtml(item.name)}</h3>
      <p class="menu-card-desc">${escHtml(item.desc)}</p>
    </div>
    <div class="menu-card-footer">
      <span class="menu-card-price">₹${item.price}</span>
      <button
        class="btn-add-cart"
        aria-label="Add ${escHtml(item.name)} to cart"
        data-id="${escHtml(item.id)}"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add to Cart
      </button>
    </div>`;

  // Add to Cart click
  el.querySelector('.btn-add-cart').addEventListener('click', function () {
    const btn = this;

    if (!window.BrewCart) return;

    window.BrewCart.addToCart({
      id:    item.id,
      name:  item.name,
      price: item.price,
      img:   item.img
    });

    // Visual feedback
    btn.classList.add('added');
    const original = btn.innerHTML;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Added!`;

    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = original;
    }, 1600);
  });

  return el;
}

// ---- Filters ----
function initFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.dataset.filter;
      renderMenu();
    });
  });
}

// ---- Search (menu section) ----
function initMenuSearch() {
  const input = document.getElementById('menuSearchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value;
    renderMenu();
  });
}

// ---- Global Search (navbar) ----
function initGlobalSearch() {
  const globalInput = document.getElementById('globalSearchInput');
  if (!globalInput) return;

  globalInput.addEventListener('input', () => {
    searchQuery = globalInput.value;

    // Also mirror into menu search if visible
    const menuInput = document.getElementById('menuSearchInput');
    if (menuInput) menuInput.value = globalInput.value;

    renderMenu();

    // Scroll to menu section
    if (globalInput.value.trim()) {
      const menuEl = document.getElementById('menu');
      if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ---- HTML Escape (kept self-contained) ----
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
  renderMenu();
  initFilters();
  initMenuSearch();
  initGlobalSearch();
});
