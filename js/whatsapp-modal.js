/**
 * WHATSAPP MODAL & MULTI-CHANNEL EMAIL INTEGRATION MODULE
 * - Captures: Name + Selected Plan (from dropdown / trigger)
 * - Auto-selects plan when clicked from portfolio or pricing
 * - Dispatches lead data to danicamarillo5215@gmail.com
 * - Shows loading state on button and seamlessly redirects to WhatsApp (+57 3058921629)
 */

export function initWhatsAppModal() {
  const modalBackdrop = document.getElementById('leadModal');
  const modalBox = modalBackdrop?.querySelector('.modal-box');
  const closeBtn = document.getElementById('closeModalBtn');
  const leadForm = document.getElementById('leadCaptureForm');
  const planSelect = document.getElementById('leadPlanSelect');
  const planModalTitle = document.getElementById('modalPlanTitle');
  const submitBtn = leadForm?.querySelector('button[type="submit"]');

  // Trigger buttons across page
  const openTriggers = document.querySelectorAll('[data-open-modal]');
  const floatingWhatsApp = document.querySelector('.floating-whatsapp');

  // Official WhatsApp number
  const WHATSAPP_PHONE = '573058921629';
  const NOTIFICATION_EMAIL = 'danicamarillo5215@gmail.com';

  function openModal(preselectedPlan = 'Nivel 2 - Landing Animada ($750k + $75k/mes)') {
    if (!modalBackdrop) return;
    
    // Auto-select corresponding option in dropdown if matches or contains text
    if (planSelect) {
      let matched = false;
      for (let option of planSelect.options) {
        if (option.value === preselectedPlan || preselectedPlan.includes(option.text) || option.text.includes(preselectedPlan)) {
          option.selected = true;
          matched = true;
          break;
        }
      }
      if (!matched && planSelect.options.length > 0) {
        planSelect.selectedIndex = 1; // Default to Landing Animada
      }
    }

    if (planModalTitle) {
      planModalTitle.textContent = 'Solicitar Mi Página Web';
    }

    modalBackdrop.classList.add('is-active');
    if (modalBox) {
      modalBox.classList.remove('modal-exit');
      modalBox.classList.add('modal-enter');
    }
    document.body.style.overflow = 'hidden';

    // Autofocus Name input
    const nameInput = document.getElementById('leadName');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
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

  // Attach click listeners to all data-open-modal buttons
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Nivel 2 - Landing Animada ($750k + $75k/mes)';
      openModal(plan);
    });
  });

  // Floating WhatsApp button trigger
  if (floatingWhatsApp) {
    floatingWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('Nivel 2 - Landing Animada ($750k + $75k/mes)');
    });
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Keyboard Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Handle Form Submission -> Email Dispatch + WhatsApp Redirect
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value.trim();
      const selectedPlan = planSelect?.value || 'Landing Animada ($750k + $75k/mes)';

      if (!name) {
        alert('Por favor ingresa tu nombre.');
        return;
      }

      // UI Feedback: Estado de envío
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="width:20px; height:20px; animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Conectando...</span>
        `;
      }

      const timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
      
      const emailPayload = {
        _replyto: NOTIFICATION_EMAIL,
        _subject: `⚡ Nuevo Lead en Las Páginas de Dani: ${name}`,
        nombre_cliente: name,
        plan_solicitado: selectedPlan,
        fecha_hora_colombia: timestamp,
        origen: window.location.href,
        _captcha: "false"
      };

      // Envío robusto de correo hacia danicamarillo5215@gmail.com
      const sendEmailPromise = fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      }).catch(err => console.log('Email notice:', err));

      // Esperar máximo 800ms para asegurar el despacho de red antes de abrir WhatsApp
      await Promise.race([
        sendEmailPromise,
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      // Construcción del mensaje de WhatsApp personalizado
      const waMessage = `👋 ¡Hola Dani! Mi nombre es *${encodeURIComponent(name)}* y estoy interesado en iniciar mi página web con ustedes.%0A%0A` +
        `🚀 *Plan de Interés:* ${encodeURIComponent(selectedPlan)}%0A%0A` +
        `¿Podemos revisar los detalles para comenzar hoy mismo?`;

      const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${waMessage}`;

      // Reset y Cierre
      leadForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
      closeModal();

      // Redirección fluida a WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
