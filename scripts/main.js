/* =====================================================
   AIGuideBook — Main Script (nav.js + main.js combined)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.site-nav') && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Footer year ── */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ── Generic accordion ── */
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        const body = item.querySelector('.accordion-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ── Checklist ── */
  document.querySelectorAll('.checklist-item').forEach((item, i) => {
    const cb = item.querySelector('input[type="checkbox"]');
    if (!cb) return;
    const key = 'chk_' + i;
    // restore state
    if (localStorage.getItem(key) === '1') {
      cb.checked = true;
      item.classList.add('checked');
    }
    cb.addEventListener('change', () => {
      item.classList.toggle('checked', cb.checked);
      localStorage.setItem(key, cb.checked ? '1' : '0');
    });
  });

  const resetBtn = document.querySelector('.checklist-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.checklist-item').forEach((item, i) => {
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = false;
        item.classList.remove('checked');
        localStorage.removeItem('chk_' + i);
      });
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });
});
