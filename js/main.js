/* =========================================================
   BREW & BLISS — Main (main.js)
   Handles: navbar scroll, hamburger, search toggle,
            active nav on scroll, smooth scroll polyfill
   ========================================================= */

'use strict';

// ---- Navbar Scroll ----
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init
}

// ---- Hamburger Menu ----
function initHamburger() {
  const btn     = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (!btn || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('mobile-open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('mobile-open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('mobile-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ---- Search Toggle ----
function initSearchToggle() {
  const toggleBtn    = document.getElementById('searchToggleBtn');
  const searchBar    = document.getElementById('navSearchBar');
  const closeBtn     = document.getElementById('closeSearchBtn');
  const globalInput  = document.getElementById('globalSearchInput');
  if (!toggleBtn || !searchBar) return;

  function openSearch() {
    searchBar.classList.add('open');
    searchBar.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => globalInput?.focus(), 60);
  }

  function closeSearch() {
    searchBar.classList.remove('open');
    searchBar.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (globalInput) {
      globalInput.value = '';
      // Reset menu search too
      const menuInput = document.getElementById('menuSearchInput');
      if (menuInput) {
        menuInput.value = '';
        menuInput.dispatchEvent(new Event('input'));
      }
    }
  }

  toggleBtn.addEventListener('click', () => {
    searchBar.classList.contains('open') ? closeSearch() : openSearch();
  });

  closeBtn?.addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && searchBar.classList.contains('open')) closeSearch();
  });
}

// ---- Active Nav on Scroll (IntersectionObserver) ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const sectionIds = Array.from(navLinks).map(l => l.dataset.section);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => {
    if (sectionIds.includes(section.id)) {
      observer.observe(section);
    }
  });
}

// ---- Smooth Scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without jumping
      history.pushState(null, '', href);
    });
  });
}

// ---- Scroll-reveal Animation (lightweight) ----
function initScrollReveal() {
  const revealEls = document.querySelectorAll([
    '.menu-card',
    '.why-card',
    '.testimonial-card',
    '.gallery-item',
    '.about-stat',
    '.visit-info-block',
    '.stat-item'
  ].join(','));

  if (!revealEls.length) return;

  // Respect reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal-hidden {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1);
    }
    .reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }`;
  document.head.appendChild(style);

  revealEls.forEach((el, i) => {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ---- Hero parallax (subtle) ----
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initHamburger();
  initSearchToggle();
  initActiveNav();
  initSmoothScroll();
  initScrollReveal();
  initHeroParallax();
});
