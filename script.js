/**
 * PORTOFOLIO PPL NABILA JIHAN ATHIFAH - SCRIPT
 * Aurevo Style Interactive Behaviors & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarMorph();
  initDropdown();
  initMobileMenu();
  initAnimatedCounters();
  initFaqAccordion();
  initVideoModal();
  initContactForm();
  initSmoothScrollSpy();
});

/* ==========================================================================
   1. NAVBAR SCROLL MORPHING (TRANSPARENT -> FLOATING FROSTED PILL)
   ========================================================================== */
function initNavbarMorph() {
  const navbarWrapper = document.getElementById('navbarWrapper');
  if (!navbarWrapper) return;

  let ticking = false;

  const updateNavbarState = () => {
    // 70px threshold gives a natural, buttery response on scroll
    if (window.scrollY > 70) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarState);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNavbarState(); // Initial check
}

/* ==========================================================================
   2. INTERACTIVE NAVBAR DROPDOWN
   ========================================================================== */
function initDropdown() {
  const dropdown = document.getElementById('navDropdown');
  const dropdownBtn = document.getElementById('dropdownBtn');
  if (!dropdown || !dropdownBtn) return;

  // Click toggle (useful for touch & tablet)
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = dropdown.classList.toggle('active');
    dropdownBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (!mobileToggle || !mobileDrawer) return;

  mobileToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });

  // Close drawer when any drawer link is clicked
  const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   4. ANIMATED STAT COUNTERS (Runs when scrolled into view)
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const animateNumber = (el, target, duration = 1600) => {
    const startTime = performance.now();
    const startVal = 0;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(startVal + (target - startVal) * ease);

      el.textContent = currentVal.toLocaleString('id-ID');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            animateNumber(counter, target);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('profil');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items (Aurevo clean single-active style)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. VIDEO PLAYER MODAL (SIMULATION POPUP)
   ========================================================================== */
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalVideoTitle');
  const reelCards = document.querySelectorAll('.reel-card');

  if (!videoModal) return;

  const openModal = (title) => {
    if (modalTitle && title) {
      modalTitle.textContent = title;
    }
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  reelCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-video-title') || card.querySelector('.reel-title')?.textContent || 'Video Dokumentasi KBM';
      openModal(title);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION WITH TOAST ALERT
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');
  const btnSubmit = document.getElementById('btnSubmit');

  if (!contactForm || !formToast || !btnSubmit) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalBtnText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<span>Mengirimkan pesan...</span>';
    btnSubmit.disabled = true;

    // Simulate server submission delay
    setTimeout(() => {
      btnSubmit.innerHTML = originalBtnText;
      btnSubmit.disabled = false;

      formToast.className = 'form-toast success';
      formToast.innerHTML = '✓ Pesan Anda berhasil terkirim! Nabila Jihan akan segera merespons via email.';

      contactForm.reset();

      // Auto hide toast after 6 seconds
      setTimeout(() => {
        formToast.style.display = 'none';
      }, 6000);
    }, 900);
  });
}

/* ==========================================================================
   8. ACTIVE NAV LINK SPY ON SCROLL
   ========================================================================== */
function initSmoothScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.dropdown-toggle)');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}
