/**
 * WHATSAPP MODAL & LEAD CAPTURE MODULE
 * Intercepts WhatsApp requests, captures customer data, and redirects with tailored message
 */
export function initWhatsAppModal() {
  const modalBackdrop = document.getElementById('leadModal');
  const modalBox = modalBackdrop?.querySelector('.modal-box');
  const closeBtn = document.getElementById('closeModalBtn');
  const leadForm = document.getElementById('leadCaptureForm');
  const selectedPlanInput = document.getElementById('leadSelectedPlan');
  const planModalTitle = document.getElementById('modalPlanTitle');

  // Trigger buttons that open the lead modal
  const openTriggers = document.querySelectorAll('[data-open-modal]');
  const floatingWhatsApp = document.querySelector('.floating-whatsapp');

  // Target WhatsApp phone number (Colombia)
  const WHATSAPP_PHONE = '573001234567'; // Configurable default WhatsApp Business link

  function openModal(planName = 'Información General') {
    if (!modalBackdrop) return;
    if (selectedPlanInput) selectedPlanInput.value = planName;
    if (planModalTitle) planModalTitle.textContent = planName;
    
    modalBackdrop.classList.add('is-active');
    if (modalBox) {
      modalBox.classList.remove('modal-exit');
      modalBox.classList.add('modal-enter');
    }
    document.body.style.overflow = 'hidden';

    // Autofocus first input
    const firstInput = document.getElementById('leadName');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }

  function closeModal() {
    if (!modalBackdrop) return;
    if (modalBox) {
      modalBox.classList.remove('modal-enter');
      modalBox.classList.add('modal-exit');
    }
    setTimeout(() => {
      modalBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }, 200);
  }

  // Attach click listeners to plan buttons
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Asesoría de Página Web';
      openModal(plan);
    });
  });

  // Floating WhatsApp button trigger
  if (floatingWhatsApp) {
    floatingWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('Consulta General / Asesoría Rápida');
    });
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp Redirect
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value.trim();
      const phone = document.getElementById('leadPhone')?.value.trim();
      const business = document.getElementById('leadBusiness')?.value.trim() || 'No especificado';
      const plan = selectedPlanInput?.value || 'Plan General';

      if (!name || !phone) {
        alert('Por favor completa tu nombre y número de teléfono.');
        return;
      }

      // Build structured WhatsApp message
      const message = `👋 ¡Hola Dani! Vengo de *laspaginasdedani.com* y quiero mi página web en 24 horas.%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(name)}%0A` +
        `📱 *Teléfono:* ${encodeURIComponent(phone)}%0A` +
        `🏢 *Negocio:* ${encodeURIComponent(business)}%0A` +
        `🚀 *Plan Seleccionado:* ${encodeURIComponent(plan)}%0A%0A` +
        `¿Podemos coordinar los detalles para iniciar?`;

      const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${message}`;

      // Reset & Close
      leadForm.reset();
      closeModal();

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
