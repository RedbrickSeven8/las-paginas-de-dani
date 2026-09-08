/**
 * Las Páginas de Dani - UI, Scroll & Google Sheets Integration Controller
 * Separation of Concerns: Modular frontend logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMobileMenu();
  initFaqAccordion();
  initSmoothScroll();
  initScrollToTop();
});

// 1. Lazy Scroll Entrance Animations with IntersectionObserver
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    'section > div, .grid > div, .card-hover-effect, #inicio .lg\\:col-span-7, #inicio .lg\\:col-span-5'
  );

  animatedElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    const siblingIndex = Array.from(el.parentElement ? el.parentElement.children : []).indexOf(el);
    if (siblingIndex === 1) el.classList.add('reveal-delay-1');
    else if (siblingIndex === 2) el.classList.add('reveal-delay-2');
    else if (siblingIndex >= 3) el.classList.add('reveal-delay-3');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// 2. Mobile Menu toggle
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

// 3. FAQ Accordion handler
function initFaqAccordion() {
  window.toggleFaq = function(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.material-symbols-outlined');
    const isHidden = answer.classList.contains('hidden');

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

// 4. Scroll To Top Button (Bottom-Left)
function initScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
      btn.classList.add('opacity-100', 'translate-y-0');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
      btn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 5. Plan Selection & Lead Submission (WhatsApp + Google Sheet webhook connector)
// Webhook endpoint de Google Apps Script (Reemplazar con tu URL generada tras el despliegue)
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
      setTimeout(() => nameInput.focus(), 600);
    }
  };

  window.handleLeadSubmit = function(event) {
    event.preventDefault();
    const nombre = document.getElementById('clientName')?.value.trim() || '';
    const telefono = document.getElementById('clientPhone')?.value.trim() || '';
    const negocio = document.getElementById('businessName')?.value.trim() || '';
    const plan = document.getElementById('planSelected')?.value || '';

    // Enviar a Google Sheets de forma asíncrona si hay Webhook configurado
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      const payload = {
        nombre: nombre,
        whatsapp: telefono,
        negocio: negocio,
        plan: plan,
        fecha: new Date().toISOString()
      };

      try {
        fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.log('Sheet log:', err));
      } catch (e) {
        console.warn('Google sheet sync attempt:', e);
      }
    }

    // Redirección inmediata a WhatsApp
    const message = `Hola Dani, quiero empezar mi web.%0A%0A` +
      `*Nombre:* ${encodeURIComponent(nombre)}%0A` +
      `*Teléfono:* ${encodeURIComponent(telefono)}%0A` +
      `*Negocio:* ${encodeURIComponent(negocio)}%0A` +
      `*Plan:* ${encodeURIComponent(plan)}`;

    window.open(`https://wa.me/573058921629?text=${message}`, '_blank');
  };
}
