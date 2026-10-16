/**
 * COOKIE CONSENT MODULE (Non-invasive popup)
 */
export function initCookies() {
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');

  if (!cookieBanner || !acceptBtn) return;

  const hasAccepted = localStorage.getItem('dani_cookies_accepted');

  if (!hasAccepted) {
    // Show after slight delay to prevent visual jump
    setTimeout(() => {
      cookieBanner.classList.add('is-visible');
    }, 1200);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('dani_cookies_accepted', 'true');
    cookieBanner.classList.remove('is-visible');
  });
}
