/**
 * APP ENTRY POINT (Separation of Concerns)
 */
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initPricing } from './pricing.js';
import { initWhatsAppModal } from './whatsapp-modal.js';
import { initLazyMedia } from './lazy-media.js';
import { initCookies } from './cookies.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initPricing();
  initWhatsAppModal();
  initLazyMedia();
  initCookies();
  
  console.log('⚡ Las Páginas de Dani - Sistema cargado exitosamente.');
});
