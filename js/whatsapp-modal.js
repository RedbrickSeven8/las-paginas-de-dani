/**
 * WHATSAPP MODAL & EMAIL INTEGRATION MODULE
 * - Captures: Name + Selected Plan (from dropdown / trigger)
 * - Auto-selects plan when clicked from portfolio or pricing
 * - Sends lead data via email to danicamarillo5215@gmail.com (Formspree background dispatch)
 * - Seamlessly redirects user to WhatsApp with phone +57 3058921629
 */

export function initWhatsAppModal() {
  const modalBackdrop = document.getElementById('leadModal');
  const modalBox = modalBackdrop?.querySelector('.modal-box');
  const closeBtn = document.getElementById('closeModalBtn');
  const leadForm = document.getElementById('leadCaptureForm');
  const planSelect = document.getElementById('leadPlanSelect');
  const planModalTitle = document.getElementById('modalPlanTitle');

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

  // Handle Form Submission -> Email Notification + WhatsApp Redirect
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value.trim();
      const selectedPlan = planSelect?.value || 'Landing Animada ($750k + $75k/mes)';

      if (!name) {
        alert('Por favor ingresa tu nombre.');
        return;
      }

      // 1. Envío asíncrono al correo danicamarillo5215@gmail.com
      const emailPayload = {
        _replyto: NOTIFICATION_EMAIL,
        _subject: `⚡ Nuevo Lead en Las Páginas de Dani: ${name} (${selectedPlan})`,
        nombre: name,
        plan_seleccionado: selectedPlan,
        fecha_hora: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
        origen: window.location.href
      };

      try {
        fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        }).catch(err => console.log('Email logging notice:', err));
      } catch (err) {
        console.log('Dispatch background notice:', err);
      }

      // 2. Construcción del mensaje de WhatsApp personalizado
      const waMessage = `👋 ¡Hola Dani! Mi nombre es *${encodeURIComponent(name)}* y estoy interesado en iniciar mi página web con ustedes.%0A%0A` +
        `🚀 *Plan de Interés:* ${encodeURIComponent(selectedPlan)}%0A%0A` +
        `¿Podemos revisar los detalles para comenzar hoy mismo?`;

      const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${waMessage}`;

      // 3. Reset y cierre
      leadForm.reset();
      closeModal();

      // 4. Redirección fluida a WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
