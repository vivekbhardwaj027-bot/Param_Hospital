/* ============================================================
   PARAM HOSPITAL — script.js
   Interactions: slider, nav, counters, scroll reveal, etc.
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. NAVBAR: scroll class + mobile toggle
  ─────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    handleBackToTop();
    highlightNavOnScroll();
  }, { passive: true });

  // Mobile hamburger toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when link clicked
  navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────────
     2. ACTIVE NAV LINK on scroll
  ─────────────────────────────────────────────── */
  const navSections = ['home','about','services','doctors','facilities','tariff','icu','gallery','contact'];

  function highlightNavOnScroll() {
    let current = '';
    navSections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) {
        if (window.scrollY >= sec.offsetTop - 100) current = id;
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────────
     3. HERO SLIDER
  ─────────────────────────────────────────────── */
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  const prevBtn  = document.getElementById('heroPrev');
  const nextBtn  = document.getElementById('heroNext');
  let   current  = 0;
  let   autoplay;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoplay() {
    autoplay = setInterval(() => goToSlide(current + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  if (slides.length) {
    prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });
    startAutoplay();

    // Pause on hover
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => clearInterval(autoplay));
    hero.addEventListener('mouseleave', () => startAutoplay());

    // Touch / swipe support
    let touchStartX = 0;
    hero.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goToSlide(current + 1) : goToSlide(current - 1);
        resetAutoplay();
      }
    });
  }

  /* ─────────────────────────────────────────────
     4. ANIMATED COUNTERS
  ─────────────────────────────────────────────── */
  const statItems = document.querySelectorAll('.stat-item');
  let statsTriggered = false;

  function animateCounters() {
    if (statsTriggered) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsTriggered = true;
      statItems.forEach((item, idx) => {
        const target = parseInt(item.dataset.count, 10);
        const numEl  = item.querySelector('.stat-num');
        if (!numEl) return;
        let count = 0;
        const duration = 1600;
        const step     = Math.ceil(target / (duration / 30));
        const timer    = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          numEl.textContent = count.toLocaleString();
        }, 30);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // in case already in view

  /* ─────────────────────────────────────────────
     5. SCROLL REVEAL
  ─────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  function checkReveal() {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  // Initial check (elements already in viewport on load)
  window.addEventListener('load', checkReveal);
  checkReveal();

  /* ─────────────────────────────────────────────
     6. BACK TO TOP BUTTON
  ─────────────────────────────────────────────── */
  const backBtn = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     7. SMOOTH SCROLLING for anchor links
  ─────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     8. APPOINTMENT FORM HANDLER
  ─────────────────────────────────────────────── */
  window.handleAppointment = function () {
    const name    = (document.getElementById('apptName')    || {}).value || '';
    const phone   = (document.getElementById('apptPhone')   || {}).value || '';
    const service = (document.getElementById('apptService') || {}).value || '';

    if (!name.trim() || !phone.trim()) {
      showToast('Please enter your name and phone number.', 'error');
      return;
    }
    if (phone.trim().length < 10) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    // WhatsApp deep-link (opens app / web)
    const message = encodeURIComponent(
      `Hello Param Hospital,\n\nI would like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nService Required: ${service || 'General Consultation'}\n\nPlease confirm my appointment. Thank you.`
    );
    window.open(`https://wa.me/919416817408?text=${message}`, '_blank');
    showToast('Redirecting to WhatsApp…', 'success');

    // Clear form
    ['apptName','apptPhone','apptService'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };

  /* ─────────────────────────────────────────────
     9. TOAST NOTIFICATIONS
  ─────────────────────────────────────────────── */
  function showToast(msg, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.ph-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'ph-toast ph-toast--' + type;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;

    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '100px',
      left:         '50%',
      transform:    'translateX(-50%) translateY(20px)',
      background:   type === 'success' ? '#2e7d32' : '#c62828',
      color:        '#fff',
      padding:      '12px 24px',
      borderRadius: '40px',
      fontSize:     '.88rem',
      fontWeight:   '600',
      fontFamily:   'DM Sans, sans-serif',
      boxShadow:    '0 8px 28px rgba(0,0,0,.22)',
      display:      'flex',
      alignItems:   'center',
      gap:          '8px',
      zIndex:       '9999',
      opacity:      '0',
      transition:   'all .35s ease',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /* ─────────────────────────────────────────────
     10. GALLERY LIGHTBOX (simple)
  ─────────────────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img   = item.querySelector('img');
      const label = item.querySelector('.gallery-overlay span');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.className = 'gallery-lightbox';
      Object.assign(overlay.style, {
        position:       'fixed',
        inset:          '0',
        background:     'rgba(10,22,40,.92)',
        backdropFilter: 'blur(10px)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         '9999',
        padding:        '24px',
        cursor:         'zoom-out',
        animation:      'fadeIn .25s ease',
      });

      const picture = document.createElement('img');
      picture.src = img.src;
      Object.assign(picture.style, {
        maxWidth:     '90vw',
        maxHeight:    '80vh',
        objectFit:    'contain',
        borderRadius: '12px',
        boxShadow:    '0 20px 60px rgba(0,0,0,.4)',
      });

      const caption = document.createElement('p');
      caption.textContent = label ? label.textContent : '';
      Object.assign(caption.style, {
        color:      'rgba(255,255,255,.8)',
        marginTop:  '16px',
        fontSize:   '.9rem',
        fontFamily: 'DM Sans, sans-serif',
      });

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      Object.assign(closeBtn.style, {
        position:     'absolute',
        top:          '20px',
        right:        '24px',
        background:   'rgba(255,255,255,.12)',
        border:       'none',
        color:        '#fff',
        width:        '40px',
        height:       '40px',
        borderRadius: '50%',
        cursor:       'pointer',
        fontSize:     '1.1rem',
        display:      'grid',
        placeItems:   'center',
      });

      overlay.appendChild(picture);
      overlay.appendChild(caption);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.remove();
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', close);
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    });
  });

  // Inject fadeIn keyframe for lightbox
  const lfStyle = document.createElement('style');
  lfStyle.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
  document.head.appendChild(lfStyle);

  /* ─────────────────────────────────────────────
     11. ACCESSIBILITY: keyboard navigation for dots
  ─────────────────────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(i);
        resetAutoplay();
      }
    });
  });

  /* ─────────────────────────────────────────────
     12. LAZY-LOAD placeholder images
  ─────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[src]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  /* ─────────────────────────────────────────────
     13. CONSOLE BRANDING
  ─────────────────────────────────────────────── */
  console.log(
    '%c PARAM HOSPITAL %c paramhospital.com ',
    'background:#1565c0;color:#fff;padding:4px 10px;font-weight:700;border-radius:4px 0 0 4px',
    'background:#0a1628;color:#42a5f5;padding:4px 10px;border-radius:0 4px 4px 0'
  );
  console.log('%c24x7 Emergency | Hisar Road, Meham (Rohtak)', 'color:#1976d2;font-size:.85rem;');

})();
