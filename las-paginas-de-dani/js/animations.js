/**
 * ANIMATIONS MODULE
 * Lazy Scroll Reveals, Card Hovers, Micro-interactions and Keyframe triggers
 */
export function initAnimations() {
  const revealElements = document.querySelectorAll('.lazy-reveal, .reveal-left, .reveal-right, .reveal-zoom');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Interactive Button Click Ripple/Feedback
  const buttons = document.querySelectorAll('.btn, .interactive-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
