/**
 * HILL BUILT - SEAMLESS GUTTERS & LEAF PROTECTION
 * Complete Vanilla JavaScript Application
 * 100% Static & Standalone for GitHub Pages
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initEstimateCalculator();
  initColorVisualizer();
  initBeforeAfterSlider();
  initFAQAccordion();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when link is clicked
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE ESTIMATE CALCULATOR
   ========================================================================== */
function initEstimateCalculator() {
  const footageSlider = document.getElementById('calcFootage');
  const footageValueDisp = document.getElementById('calcFootageDisp');
  const storyButtons = document.querySelectorAll('[data-story]');
  const profileButtons = document.querySelectorAll('[data-profile]');
  const serviceCards = document.querySelectorAll('.check-card');

  // Outputs
  const outFootage = document.getElementById('outFootage');
  const outStory = document.getElementById('outStory');
  const outProfile = document.getElementById('outProfile');
  const outServices = document.getElementById('outServices');
  const outPriceRange = document.getElementById('outPriceRange');

  let state = {
    footage: 150,
    storyMultiplier: 1.0,
    storyLabel: '1-Story Home',
    profileBaseRate: 11, // per foot for 6" Seamless
    profileLabel: '6" Oversized K-Style',
    services: {
      seamlessGutters: true,
      leafProtection: true,
      cleaning: false,
      fasciaRepair: false
    }
  };

  function calculate() {
    // Base seamless rate per foot
    let ratePerFoot = 0;

    if (state.services.seamlessGutters) {
      ratePerFoot += state.profileBaseRate;
    }

    if (state.services.leafProtection) {
      ratePerFoot += 8.5; // Micro-mesh leaf protection rate
    }

    let subtotal = state.footage * ratePerFoot * state.storyMultiplier;

    // Flat add-ons
    if (state.services.cleaning) {
      subtotal += 175 * state.storyMultiplier;
    }

    if (state.services.fasciaRepair) {
      subtotal += 250; // Minor fascia spot restoration
    }

    // Min threshold
    if (subtotal < 350 && (state.services.seamlessGutters || state.services.leafProtection)) {
      subtotal = 350;
    }

    const lowEst = Math.round(subtotal * 0.92);
    const highEst = Math.round(subtotal * 1.12);

    // Update UI
    if (footageValueDisp) footageValueDisp.textContent = `${state.footage} ft`;
    if (outFootage) outFootage.textContent = `${state.footage} Linear Feet`;
    if (outStory) outStory.textContent = state.storyLabel;
    if (outProfile) outProfile.textContent = state.profileLabel;
    
    // Service count label
    const selectedCount = Object.values(state.services).filter(Boolean).length;
    if (outServices) outServices.textContent = `${selectedCount} Selected`;

    if (outPriceRange) {
      if (selectedCount === 0) {
        outPriceRange.textContent = '$0';
      } else {
        outPriceRange.textContent = `$${lowEst.toLocaleString()} - $${highEst.toLocaleString()}`;
      }
    }
  }

  // Slider event
  if (footageSlider) {
    footageSlider.addEventListener('input', (e) => {
      state.footage = parseInt(e.target.value, 10);
      calculate();
    });
  }

  // Story selector
  storyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      storyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.storyMultiplier = parseFloat(btn.dataset.story);
      state.storyLabel = btn.textContent.trim();
      calculate();
    });
  });

  // Profile selector
  profileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      profileButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.profileBaseRate = parseFloat(btn.dataset.rate);
      state.profileLabel = btn.textContent.trim();
      calculate();
    });
  });

  // Service check-cards
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.service;
      const isChecked = card.classList.toggle('checked');
      if (key && state.services.hasOwnProperty(key)) {
        state.services[key] = isChecked;
      }
      calculate();
    });
  });

  // Initial calc
  calculate();

  // "Lock In Estimate" Button hooks to Quote modal
  const lockBtn = document.getElementById('lockEstimateBtn');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      const modal = document.getElementById('quoteModal');
      const detailsField = document.getElementById('quotePrefill');
      if (detailsField) {
        detailsField.value = `Estimated ${state.footage} ft | ${state.storyLabel} | ${state.profileLabel} | Range: ${outPriceRange.textContent}`;
      }
      if (modal) {
        modal.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   3. GUTTER COLOR VISUALIZER
   ========================================================================== */
function initColorVisualizer() {
  const swatchButtons = document.querySelectorAll('.swatch-btn');
  const gutterElements = document.querySelectorAll('.gutter-color-target');
  const colorNameDisplay = document.getElementById('selectedColorName');

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const hex = btn.dataset.hex;
      const name = btn.dataset.name;

      if (colorNameDisplay) {
        colorNameDisplay.textContent = name;
      }

      gutterElements.forEach(el => {
        el.setAttribute('fill', hex);
        el.style.fill = hex;
      });
    });
  });
}

/* ==========================================================================
   4. BEFORE & AFTER SPLIT COMPARISON SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterComp');
  const overlay = document.getElementById('compOverlay');
  const handle = document.getElementById('compHandle');

  if (!container || !overlay || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = (x - rect.left) / rect.width;
    
    // Bounds limit (5% to 95%)
    if (position < 0.05) position = 0.05;
    if (position > 0.95) position = 0.95;

    const percentage = position * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close others
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   6. CONTACT & ESTIMATE FORM DISPATCHER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('estimateForm');
  const modalForm = document.getElementById('modalEstimateForm');
  const quoteModal = document.getElementById('quoteModal');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');

  // Modal close handlers
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quoteModal) quoteModal.classList.remove('active');
    });
  });

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  }

  // Open modal triggers
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quoteModal) quoteModal.classList.add('active');
    });
  });

  // Generic form handler
  function handleFormSubmit(e) {
    e.preventDefault();
    const currentForm = e.target;
    const formData = new FormData(currentForm);

    const name = formData.get('name') || 'Valued Customer';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const address = formData.get('address') || '';
    const service = formData.get('service') || 'Seamless Gutter Service';
    const notes = formData.get('notes') || '';
    const prefill = formData.get('prefill') || '';

    // Create formatted email body
    const subject = encodeURIComponent(`Estimate Request: ${name} - ${service}`);
    const bodyContent = 
`Hello Hill Built Team,

I would like to request a Free Estimate / On-Site Inspection for:

• Name: ${name}
• Phone: ${phone}
• Email: ${email}
• Address / Area: ${address}
• Service Requested: ${service}
${prefill ? `• Calculator Details: ${prefill}\n` : ''}• Additional Notes: ${notes}

Please contact me at your earliest convenience to schedule.
Thank you!`;

    const mailtoUrl = `mailto:hillbuilt26@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // Show Confirmation Feedback
    alert(`Thank you, ${name}!\n\nYour estimate request has been prepared. Clicking OK will open your email client to dispatch this directly to hillbuilt26@gmail.com, or you can call us directly at 281-884-2613.`);

    // Trigger direct mail client
    window.location.href = mailtoUrl;

    currentForm.reset();
    if (quoteModal) quoteModal.classList.remove('active');
  }

  if (form) form.addEventListener('submit', handleFormSubmit);
  if (modalForm) modalForm.addEventListener('submit', handleFormSubmit);

  // Digital VCard (.vcf) Generator for One-Click Save to Phone
  const vcardBtns = document.querySelectorAll('[data-download-vcard]');
  vcardBtns.forEach(btn => {
    btn.addEventListener('click', downloadVCard);
  });
}

function downloadVCard() {
  const vcardContent = 
`BEGIN:VCARD
VERSION:3.0
FN:Hill Built - Seamless Gutters & Leaf Protection
ORG:Hill Built LLC
TITLE:Seamless Gutter Installation & Leaf Protection
TEL;TYPE=CELL,VOICE:281-884-2613
EMAIL;TYPE=PREF,INTERNET:hillbuilt26@gmail.com
NOTE:Built Strong. Built Right. Seamless Gutters, Leaf Protection & Cleaning in Greater Houston.
END:VCARD`;

  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'HillBuilt_Gutters.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   7. SMOOTH SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
