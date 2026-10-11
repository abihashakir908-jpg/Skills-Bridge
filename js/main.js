/* ============================================================
   SkillBridge – Main JavaScript
   ============================================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSearch();
  initScrollReveal();
  initCounters();
  initCourseFilter();
  initBackToTop();
  initWishlist();
  initNewsletterForm();
  setActiveNavLink();
});

/* ── Navbar: sticky + scroll class ─────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Close mobile menu on link click
  const navLinks = navbar.querySelectorAll('.nav-link');
  const bsCollapse = navbar.querySelector('#navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        const bsInst = bootstrap.Collapse.getOrCreateInstance(bsCollapse);
        bsInst.hide();
      }
    });
  });
}

/* ── Active nav link ────────────────────────────────────────── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ── Search ─────────────────────────────────────────────────── */
const SEARCH_DATA = [
  { title: 'Complete Web Development Bootcamp', category: 'Web Development', url: 'course-detail.html?id=1' },
  { title: 'UI/UX Design Masterclass – Figma', category: 'Graphic Design', url: 'course-detail.html?id=2' },
  { title: 'Digital Marketing Mastery', category: 'Digital Marketing', url: 'course-detail.html?id=3' },
  { title: 'Python & Data Science', category: 'Programming', url: 'course-detail.html?id=4' },
  { title: 'Business Strategy & Leadership', category: 'Business', url: 'course-detail.html?id=5' },
  { title: 'React & Next.js Development', category: 'Web Development', url: 'course-detail.html?id=6' },
  { title: 'Photography Masterclass', category: 'Photography', url: 'courses.html' },
  { title: 'Graphic Design Essentials', category: 'Graphic Design', url: 'courses.html' },
  { title: 'SEO & Content Strategy', category: 'Digital Marketing', url: 'courses.html' },
  { title: 'Java Programming', category: 'Programming', url: 'courses.html' },
  { title: 'Web Development', category: 'Category', url: 'categories.html?cat=web' },
  { title: 'Digital Marketing', category: 'Category', url: 'categories.html?cat=marketing' },
  { title: 'Graphic Design', category: 'Category', url: 'categories.html?cat=design' },
  { title: 'Business', category: 'Category', url: 'categories.html?cat=business' },
  { title: 'Photography', category: 'Category', url: 'categories.html?cat=photography' },
  { title: 'Programming', category: 'Category', url: 'categories.html?cat=programming' },
];

function initSearch() {
  const toggleBtn = document.getElementById('searchToggle');
  const dropdown  = document.getElementById('searchDropdown');
  const input     = document.getElementById('searchInput');
  const results   = document.getElementById('searchResults');

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
      setTimeout(() => input && input.focus(), 50);
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove('show');
    }
  });

  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { results.innerHTML = ''; return; }

    const matches = SEARCH_DATA.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 6);

    if (matches.length === 0) {
      results.innerHTML = `<div class="search-result-item" style="color:var(--mid);cursor:default">
        <i class="fa-solid fa-circle-info"></i> No results for "<strong>${escHtml(q)}</strong>"
      </div>`;
      return;
    }

    results.innerHTML = matches.map(item => `
      <a href="${item.url}" class="search-result-item text-decoration-none">
        <i class="fa-solid fa-magnifying-glass"></i>
        <div>
          <div style="font-weight:600">${highlight(item.title, q)}</div>
          <div style="font-size:.72rem;color:var(--mid)">${item.category}</div>
        </div>
      </a>
    `).join('');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = results.querySelector('a');
      if (first) first.click();
    }
    if (e.key === 'Escape') dropdown.classList.remove('show');
  });
}

function highlight(text, query) {
  const regex = new RegExp(`(${escRegex(query)})`, 'gi');
  return escHtml(text).replace(regex, '<mark style="background:var(--primary-pale);color:var(--primary);padding:0 1px;border-radius:2px">$1</mark>');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ── Scroll Reveal (Intersection Observer) ──────────────────── */
function initScrollReveal() {
  const options = { threshold: 0.12 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
    observer.observe(el);
  });
}

/* ── Counter Animation ──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const value = Math.floor(ease * target);
    el.textContent = value >= 1000
      ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'K'
      : value;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000
      ? (target / 1000).toFixed(0) + 'K'
      : target;
  };

  requestAnimationFrame(step);
}

/* ── Course Filter ──────────────────────────────────────────── */
function initCourseFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseItems = document.querySelectorAll('.course-item');

  if (!filterBtns.length || !courseItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      courseItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp .4s ease both';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ── Back To Top ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Wishlist (heart toggle) ────────────────────────────────── */
function initWishlist() {
  document.querySelectorAll('.course-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = btn.querySelector('i');
      if (icon.classList.contains('fa-regular')) {
        icon.classList.replace('fa-regular', 'fa-solid');
        btn.style.color = 'var(--danger)';
        showToast('Added to wishlist!', 'success');
      } else {
        icon.classList.replace('fa-solid', 'fa-regular');
        btn.style.color = '';
        showToast('Removed from wishlist', 'info');
      }
    });
  });
}

/* ── Newsletter ─────────────────────────────────────────────── */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const btn   = form.querySelector('button');
    const input = form.querySelector('input');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const email = input.value.trim();
      if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      showToast('Thanks for subscribing! 🎉', 'success');
      input.value = '';
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Toast Notification ─────────────────────────────────────── */
function showToast(message, type = 'success') {
  // Remove any existing toasts
  document.querySelectorAll('.sb-toast').forEach(t => t.remove());

  const colors = {
    success: { bg: '#10b981', icon: 'fa-circle-check' },
    error:   { bg: '#ef4444', icon: 'fa-circle-xmark' },
    info:    { bg: '#2563eb', icon: 'fa-circle-info' },
  };

  const c = colors[type] || colors.success;
  const toast = document.createElement('div');
  toast.className = 'sb-toast';
  toast.innerHTML = `<i class="fa-solid ${c.icon}"></i> ${message}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 5rem;
    right: 2rem;
    background: ${c.bg};
    color: white;
    padding: .75rem 1.25rem;
    border-radius: .75rem;
    font-size: .9rem;
    font-weight: 500;
    font-family: var(--font-sans, sans-serif);
    box-shadow: 0 8px 30px rgba(0,0,0,.2);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: .5rem;
    animation: slideDown .3s ease;
    max-width: 280px;
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── Course card image fallback ─────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    this.src = `https://via.placeholder.com/600x400/dbeafe/2563eb?text=SkillBridge`;
    this.onerror = null;
  });
});
