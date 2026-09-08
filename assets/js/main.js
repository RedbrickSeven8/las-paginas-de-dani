/**
 * Las Páginas de Dani - Ultra Optimized UI, Animation & Webhook Controller
 * Separation of Concerns & Mobile/Desktop Adaptive Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMobileMenu();
  initFaqAccordion();
  initSmoothScroll();
  initScrollToTop();
});

// 1. Adaptive High-Performance Scroll Entrance Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    'section > div, .grid > div, .card-hover-effect, #inicio .lg\\:col-span-7, #inicio .lg\\:col-span-5'
  );

  animatedElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    const siblingIndex = Array.from(el.parentElement ? el.parentElement.children : []).indexOf(el);
    if (siblingIndex === 1) el.classList.add('reveal-delay-1');
    else if (siblingIndex === 2) el.classList.add('reveal-delay-2');
    else if (siblingIndex >= 3) el.classList.add('reveal-delay-3');
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Adjust rootMargin dynamically for fast mobile scrolling
  const isMobile = window.innerWidth <= 768;
  const rootMargin = isMobile ? '0px 0px -20px 0px' : '0px 0px -60px 0px';
  const threshold = isMobile ? 0.05 : 0.12;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Unobserve immediately to free memory and CPU
      }
    });
  }, {
    root: null,
    rootMargin: rootMargin,
    threshold: threshold
  });

  animatedElements.forEach(el => observer.observe(el));
}

// 2. Mobile Menu toggle with smooth ARIA handling
function initMobileMenu() {
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenuDropdown');

  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// 3. Smooth FAQ Accordion handler with micro-transitions
function initFaqAccordion() {
  window.toggleFaq = function(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.material-symbols-outlined');
    const isHidden = answer.classList.contains('hidden');

    // Close other FAQ items smoothly
    document.querySelectorAll('#faq .faq-answer').forEach(el => {
      if (el !== answer) {
        el.classList.add('hidden');
        const parentBtn = el.previousElementSibling;
        const parentIcon = parentBtn ? parentBtn.querySelector('.material-symbols-outlined') : null;
        if (parentIcon) parentIcon.style.transform = 'rotate(0deg)';
      }
    });

    if (isHidden) {
      answer.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      answer.classList.add('hidden');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };
}

// 4. Scroll To Top Button with Throttled RAF Scroll Listener
function initScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 350) {
          btn.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
          btn.classList.add('opacity-100', 'translate-y-0');
        } else {
          btn.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
          btn.classList.remove('opacity-100', 'translate-y-0');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 5. Plan Selection & Google Sheets Lead Submission Controller
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzGpZjGr9B1gjYzRKXnBF5jfua7Pe0gmZxBzav-4vjwYx1JOs7272FqTwKVCWoFvfqM/exec';

function initSmoothScroll() {
  window.seleccionarPlan = function(plan) {
    const select = document.getElementById('planSelected');
    if (select) {
      select.value = plan;
    }
    const target = document.getElementById('contacto-rapido') || document.getElementById('formulario');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    const nameInput = document.getElementById('clientName');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 500);
    }
  };

  window.handleLeadSubmit = function(event) {
    event.preventDefault();
    const nombre = document.getElementById('clientName')?.value.trim() || '';
    const telefono = document.getElementById('clientPhone')?.value.trim() || '';
    const negocio = document.getElementById('businessName')?.value.trim() || '';
    const plan = document.getElementById('planSelected')?.value || '';

    const payload = {
      nombre: nombre,
      whatsapp: telefono,
      paginaWeb: 'Las Páginas de Dani',
      negocio: negocio,
      plan: plan
    };

    // Envío en segundo plano de alto rendimiento con navigator.sendBeacon o fetch
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=UTF-8' });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(GOOGLE_SHEETS_WEBHOOK_URL, blob);
        } else {
          fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('Google Sheets sync:', e);
      }
    }

    // Redirección optimizada a WhatsApp
    const message = `Hola Dani, quiero empezar mi web.%0A%0A` +
      `*Nombre:* ${encodeURIComponent(nombre)}%0A` +
      `*Teléfono:* ${encodeURIComponent(telefono)}%0A` +
      `*Negocio:* ${encodeURIComponent(negocio)}%0A` +
      `*Plan:* ${encodeURIComponent(plan)}`;

    setTimeout(() => {
      window.open(`https://wa.me/573058921629?text=${message}`, '_blank');
    }, 100);
  };
}
