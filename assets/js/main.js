/* ==========================================
   NAVBAR SCROLL BEHAVIOR
   ========================================== */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ==========================================
   MOBILE NAV TOGGLE
   ========================================== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================
   ACTIVE NAV LINK ON SCROLL
   ========================================== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 90;

  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ==========================================
   INTERSECTION OBSERVER — FADE-IN
   ========================================== */
const animateEls = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

animateEls.forEach(el => observer.observe(el));

/* ==========================================
   COPY TO CLIPBOARD
   ========================================== */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg = '已复制到剪贴板') {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.copy-btn, [data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`已复制：${text}`);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`已复制：${text}`);
    }
  });
});

/* ==========================================
   PROJECT STAR MODAL
   ========================================== */
const modalOverlay = document.getElementById('modal-overlay');
const modalPanel   = document.getElementById('modal-panel');
const modalClose   = document.getElementById('modal-close');
const modalTitle   = document.getElementById('modal-title');
const modalBody    = document.getElementById('modal-body');
let modalTrigger   = null;

function openModal(btn) {
  const projectId = btn.dataset.modal;
  const dataEl    = document.getElementById(`star-${projectId}`);
  if (!dataEl) return;

  const card = btn.closest('.project-card');
  modalTitle.textContent = card?.querySelector('.project-title')?.textContent ?? '';

  modalBody.innerHTML = '';
  modalBody.appendChild(dataEl.cloneNode(true));

  modalTrigger = btn;
  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalTrigger?.focus();
}

document.querySelectorAll('.btn-detail').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn));
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* ==========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   (Enhances native scroll-behavior for offset)
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
