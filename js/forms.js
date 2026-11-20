/* =========================================================
   BREW & BLISS — Forms (forms.js)
   Handles: contact form validation & newsletter
   ========================================================= */

'use strict';

// ---- Validation Helpers ----
function isEmpty(val) {
  return !val || val.trim().length === 0;
}

function isValidEmail(val) {
  // RFC-5322 simplified pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
}

function setError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
  }
  if (error) error.textContent = msg;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
  }
  if (error) error.textContent = '';
}

function clearAllErrors(fields) {
  fields.forEach(([inputId, errorId]) => clearError(inputId, errorId));
}

// ---- Real-time input clearing ----
function attachLiveValidation(inputId, errorId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    if (input.value.trim()) clearError(inputId, errorId);
  });
}

// ---- Contact Form ----
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('contactSubmitBtn');
  const successDiv = document.getElementById('contactSuccess');
  if (!form) return;

  const fields = [
    ['contactName',    'nameError'],
    ['contactEmail',   'emailError'],
    ['contactSubject', 'subjectError'],
    ['contactMessage', 'messageError']
  ];

  fields.forEach(([inputId, errorId]) => attachLiveValidation(inputId, errorId));

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (successDiv) successDiv.hidden = true;
    clearAllErrors(fields);

    const name    = document.getElementById('contactName')?.value    ?? '';
    const email   = document.getElementById('contactEmail')?.value   ?? '';
    const subject = document.getElementById('contactSubject')?.value ?? '';
    const message = document.getElementById('contactMessage')?.value ?? '';

    let valid = true;

    if (isEmpty(name)) {
      setError('contactName', 'nameError', 'Please enter your full name.');
      valid = false;
    }

    if (isEmpty(email)) {
      setError('contactEmail', 'emailError', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('contactEmail', 'emailError', 'Please enter a valid email address (e.g. you@example.com).');
      valid = false;
    }

    if (isEmpty(subject)) {
      setError('contactSubject', 'subjectError', 'Please enter a subject.');
      valid = false;
    }

    if (isEmpty(message)) {
      setError('contactMessage', 'messageError', 'Please enter your message.');
      valid = false;
    } else if (message.trim().length < 10) {
      setError('contactMessage', 'messageError', 'Message must be at least 10 characters long.');
      valid = false;
    }

    if (!valid) {
      // Focus the first error
      const firstError = form.querySelector('.error');
      firstError?.focus();
      return;
    }

    // Simulate async submission
    if (submitBtn) {
      const btnText   = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      submitBtn.disabled = true;
      if (btnText)   btnText.hidden   = true;
      if (btnLoader) btnLoader.hidden = false;
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Success
    if (submitBtn) {
      const btnText   = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      submitBtn.disabled = false;
      if (btnText)   btnText.hidden   = false;
      if (btnLoader) btnLoader.hidden = true;
    }

    form.reset();
    clearAllErrors(fields);

    if (successDiv) {
      successDiv.hidden = false;
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// ---- Newsletter Form ----
function initNewsletterForm() {
  const form        = document.getElementById('newsletterForm');
  const errorEl     = document.getElementById('newsletterError');
  const successEl   = document.getElementById('newsletterSuccess');
  if (!form) return;

  const emailInput = document.getElementById('newsletterEmail');

  emailInput?.addEventListener('input', () => {
    if (errorEl) errorEl.textContent = '';
    emailInput.classList.remove('error');
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (errorEl)   errorEl.textContent = '';
    if (successEl) successEl.hidden    = true;

    const email = emailInput?.value ?? '';

    if (isEmpty(email)) {
      if (errorEl) errorEl.textContent = 'Please enter your email address.';
      emailInput?.classList.add('error');
      emailInput?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      emailInput?.classList.add('error');
      emailInput?.focus();
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Subscribing…';
    }

    await new Promise(resolve => setTimeout(resolve, 900));

    if (submitBtn) {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Subscribe';
    }

    form.reset();
    if (successEl) successEl.hidden = false;
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initNewsletterForm();
});
