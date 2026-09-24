/**
 * APP ENTRY POINT
 * Initializes all modular subsystems
 */
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initPricing } from './pricing.js';
import { initWhatsAppModal } from './whatsapp-modal.js';
import { initLazyMedia } from './lazy-media.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initPricing();
  initWhatsAppModal();
  initLazyMedia();
  
  console.log('⚡ Las Páginas de Dani - Aplicación inicializada con éxito.');
});
