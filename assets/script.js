/* ═══════════════════════════════════════
   BUILT BY CHARLY — Portfolio Experience
   Desktop: Horizontal Scroll
   Mobile: Vertical Snap + Magnetic Parallax
   GSAP + ScrollTrigger magic
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show everything immediately if reduced motion
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero-intro, .hero-name .char, .hero-tagline, .hero-portrait, .chapter, .project-card, .testimonial, .about-image, .about-text, .panel-contact h2, .contact-details, .contact-email, .contact-links, .copyright').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.philosophy-text .word').forEach(el => el.classList.add('active'));
    return;
  }

  // ═══ CUSTOM CURSOR ═══
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverables = document.querySelectorAll('a, button, .project-card, .testimonial');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Track dark sections for cursor color
    const darkPanels = document.querySelectorAll('.panel-hero, .panel-work, .panel-contact');
    const updateCursorColor = () => {
      let onDark = false;
      darkPanels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          onDark = true;
        }
      });
      cursor.classList.toggle('on-dark', onDark);
    };
    document.addEventListener('mousemove', updateCursorColor);
  }

  // ═══ NAV COLOR CHANGE ═══
  const nav = document.querySelector('.nav');
  const updateNavColor = () => {
    if (!nav) return;
    const darkPanels = document.querySelectorAll('.panel-hero, .panel-work, .panel-contact');
    let onDark = false;
    const isMobileNav = window.innerWidth <= 900;

    darkPanels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      if (isMobileNav) {
        // Mobile: Check vertical position (panel top is near viewport top)
        if (rect.top <= 100 && rect.bottom > 100) {
          onDark = true;
        }
      } else {
        // Desktop: Check horizontal position
        if (rect.left < 200 && rect.right > 0) {
          onDark = true;
        }
      }
    });

    nav.classList.toggle('on-dark', onDark);
  };

  // Initial nav color check
  updateNavColor();

  // ═══ HORIZONTAL SCROLL (Desktop only) ═══
  const wrapper = document.querySelector('.horizontal-wrapper');
  const track = document.querySelector('.horizontal-track');
  const panels = document.querySelectorAll('.panel');
  const isMobileView = window.innerWidth <= 900;

  if (!wrapper || !track || panels.length === 0) return;

  let horizontalScroll = null;

  if (!isMobileView) {
    // Desktop: Horizontal scroll
    const getTotalWidth = () => {
      let width = 0;
      panels.forEach(panel => width += panel.offsetWidth);
      return width;
    };

    horizontalScroll = gsap.to(track, {
      x: () => -(getTotalWidth() - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => '+=' + (getTotalWidth() - window.innerWidth),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: updateNavColor
      }
    });

    // Progress bar (desktop)
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => '+=' + (getTotalWidth() - window.innerWidth),
        onUpdate: (self) => {
          gsap.set(progressBar, { width: (self.progress * 100) + '%' });
        }
      });
    }
  } else {
    // Mobile: Vertical scroll with magnetic parallax

    // Progress bar (mobile - based on scroll position)
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        gsap.set(progressBar, { width: (progress * 100) + '%' });
      }, { passive: true });
    }

    // Update nav color on scroll for mobile
    window.addEventListener('scroll', updateNavColor, { passive: true });

    // ═══ MAGNETIC PARALLAX (Touch + Gyroscope) ═══
    let currentPanel = null;
    let tiltX = 0, tiltY = 0;
    let touchX = 0.5, touchY = 0.5; // Normalized 0-1

    // Find which panel is currently in view
    const updateCurrentPanel = () => {
      panels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          currentPanel = panel;
        }
      });
    };

    window.addEventListener('scroll', updateCurrentPanel, { passive: true });
    updateCurrentPanel();

    // Apply tilt effect to current panel
    const applyTilt = () => {
      if (!currentPanel) return;

      const content = currentPanel.querySelector('.panel-content');
      if (!content) return;

      // Combine touch and gyro inputs
      const maxTilt = 8; // degrees
      const rotateX = (touchY - 0.5) * maxTilt + tiltY;
      const rotateY = (touchX - 0.5) * -maxTilt + tiltX;

      gsap.to(content, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Move child elements at different depths
      const deepElements = currentPanel.querySelectorAll('h2, .hero-name, .philosophy-text');
      const midElements = currentPanel.querySelectorAll('p, .chapter, .testimonial');
      const frontElements = currentPanel.querySelectorAll('img, .project-card, .webflow-card, .contact-email');

      const moveAmount = 15;

      deepElements.forEach(el => {
        gsap.to(el, {
          x: (touchX - 0.5) * moveAmount * 0.5,
          y: (touchY - 0.5) * moveAmount * 0.5,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      midElements.forEach(el => {
        gsap.to(el, {
          x: (touchX - 0.5) * moveAmount,
          y: (touchY - 0.5) * moveAmount,
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      frontElements.forEach(el => {
        gsap.to(el, {
          x: (touchX - 0.5) * moveAmount * 1.8,
          y: (touchY - 0.5) * moveAmount * 1.8,
          duration: 0.25,
          ease: 'power2.out'
        });
      });
    };

    // Touch tracking
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      touchX = touch.clientX / window.innerWidth;
      touchY = touch.clientY / window.innerHeight;
      applyTilt();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      // Smoothly reset to center
      touchX = 0.5;
      touchY = 0.5;
      applyTilt();
    }, { passive: true });

    // Gyroscope/Device orientation (if available)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          // gamma: left-right tilt (-90 to 90)
          // beta: front-back tilt (-180 to 180)
          tiltX = Math.max(-15, Math.min(15, e.gamma)) / 15 * 5;
          tiltY = Math.max(-15, Math.min(15, e.beta - 45)) / 15 * 5; // -45 for natural holding angle
          applyTilt();
        }
      }, { passive: true });
    }
  }

  // ═══ HERO ANIMATIONS ═══
  const heroIntro = document.querySelector('.hero-intro');
  const heroChars = document.querySelectorAll('.hero-name .char');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroPortrait = document.querySelector('.hero-portrait');

  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to(heroIntro, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    .to(heroChars, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.4')
    .to(heroTagline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
    .to(heroPortrait, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.6');

  // ═══ SCROLL-TRIGGERED ANIMATIONS ═══

  // Helper function for creating triggers (adapts to mobile/desktop)
  const createTrigger = (element, animation) => {
    if (!element) return;

    if (isMobileView) {
      // Mobile: vertical scroll trigger
      ScrollTrigger.create({
        trigger: element,
        start: 'top 75%',
        onEnter: animation,
        once: true
      });
    } else {
      // Desktop: horizontal scroll trigger
      ScrollTrigger.create({
        trigger: element,
        containerAnimation: horizontalScroll,
        start: 'left 60%',
        onEnter: animation,
        once: true
      });
    }
  };

  // Philosophy word reveal
  const philosophyPanel = document.querySelector('.panel-philosophy');
  const words = document.querySelectorAll('.philosophy-text .word');

  if (philosophyPanel && words.length > 0) {
    if (isMobileView) {
      // Mobile: vertical scroll word reveal
      ScrollTrigger.create({
        trigger: philosophyPanel,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const progress = self.progress;
          const wordsToActivate = Math.floor(progress * words.length * 1.5);
          words.forEach((word, i) => {
            if (i < wordsToActivate) word.classList.add('active');
          });
        }
      });
    } else {
      // Desktop: horizontal scroll word reveal
      ScrollTrigger.create({
        trigger: philosophyPanel,
        containerAnimation: horizontalScroll,
        start: 'left 80%',
        end: 'right 20%',
        onUpdate: (self) => {
          const progress = self.progress;
          const wordsToActivate = Math.floor(progress * words.length * 1.5);
          words.forEach((word, i) => {
            if (i < wordsToActivate) word.classList.add('active');
          });
        }
      });
    }
  }

  // Journey chapters
  const journeyPanel = document.querySelector('.panel-journey');
  const chapters = document.querySelectorAll('.chapter');
  if (journeyPanel && chapters.length) {
    createTrigger(journeyPanel, () => {
      gsap.to(chapters, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
    });
  }

  // Brands
  const brandsPanel = document.querySelector('.panel-brands');
  const brandLogos = document.querySelectorAll('.brands-grid img');
  if (brandsPanel && brandLogos.length) {
    // Set initial state
    gsap.set(brandLogos, { opacity: 0, y: 20 });
    createTrigger(brandsPanel, () => {
      gsap.to(brandLogos, { opacity: 0.6, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    });
  }

  // Projects (Software Engineering)
  const workPanel = document.querySelector('.panel-work');
  const projectCards = document.querySelectorAll('.project-card');
  if (workPanel && projectCards.length) {
    createTrigger(workPanel, () => {
      gsap.to(projectCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    });
  }

  // Webflow Projects
  const webflowPanel = document.querySelector('.panel-webflow');
  const webflowCards = document.querySelectorAll('.webflow-card');
  if (webflowPanel && webflowCards.length) {
    // Set initial state
    gsap.set(webflowCards, { opacity: 0, y: 30 });
    createTrigger(webflowPanel, () => {
      gsap.to(webflowCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
    });
  }

  // Testimonials
  const testimonialsPanel = document.querySelector('.panel-testimonials');
  const testimonials = document.querySelectorAll('.testimonial');

  if (testimonialsPanel && testimonials.length) {
    if (isMobileView) {
      // Swipeable deck cards on mobile
      gsap.set(testimonials, { opacity: 1, y: 0 });

      let currentCard = 0;
      const totalCards = testimonials.length;

      const updateCardStack = () => {
        testimonials.forEach((card, i) => {
          const offset = (i - currentCard + totalCards) % totalCards;
          const rotation = [-1, 2, -2, 1][offset] || 0;
          const yOffset = offset * 8;
          const zIndex = totalCards - offset;

          gsap.to(card, {
            rotation: rotation,
            y: yOffset,
            zIndex: zIndex,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      };

      // Touch swipe handling
      testimonials.forEach((card, index) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        card.addEventListener('touchstart', (e) => {
          if (index !== currentCard) return;
          startX = e.touches[0].clientX;
          isDragging = true;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
          if (!isDragging || index !== currentCard) return;
          currentX = e.touches[0].clientX - startX;
          gsap.set(card, { x: currentX, rotation: currentX * 0.05 });
        }, { passive: true });

        card.addEventListener('touchend', () => {
          if (!isDragging || index !== currentCard) return;
          isDragging = false;

          if (Math.abs(currentX) > 80) {
            // Swipe out
            gsap.to(card, {
              x: currentX > 0 ? 400 : -400,
              rotation: currentX > 0 ? 20 : -20,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                gsap.set(card, { x: 0, rotation: 0, opacity: 1 });
                currentCard = (currentCard + 1) % totalCards;
                updateCardStack();
              }
            });
          } else {
            // Snap back
            gsap.to(card, { x: 0, rotation: -1, duration: 0.3 });
          }
          currentX = 0;
        });

        // Click to cycle on mobile
        card.addEventListener('click', () => {
          if (index !== currentCard) return;
          gsap.to(card, {
            x: -400,
            rotation: -20,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(card, { x: 0, rotation: 0, opacity: 1 });
              currentCard = (currentCard + 1) % totalCards;
              updateCardStack();
            }
          });
        });
      });

      updateCardStack();
    } else {
      // Desktop grid animation
      createTrigger(testimonialsPanel, () => {
        gsap.to(testimonials, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      });
    }
  }

  // About
  const aboutPanel = document.querySelector('.panel-about');
  const aboutImage = document.querySelector('.about-image');
  const aboutText = document.querySelector('.about-text');
  if (aboutPanel && aboutImage && aboutText) {
    createTrigger(aboutPanel, () => {
      gsap.to(aboutImage, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' });
      gsap.to(aboutText, { opacity: 1, x: 0, duration: 0.9, delay: 0.15, ease: 'power3.out' });
    });
  }

  // Contact
  const contactPanel = document.querySelector('.panel-contact');
  if (contactPanel) {
    const contactH2 = contactPanel.querySelector('h2');
    const contactDetails = contactPanel.querySelector('.contact-details');
    const contactEmail = contactPanel.querySelector('.contact-email');
    const contactLinks = contactPanel.querySelector('.contact-links');
    const copyright = contactPanel.querySelector('.copyright');

    createTrigger(contactPanel, () => {
      const tl = gsap.timeline();
      tl.to(contactH2, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to(contactDetails, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(contactEmail, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(contactLinks, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .to(copyright, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    });
  }

  // ═══ PARALLAX ═══ (desktop only)
  if (!isMobileView) {
    panels.forEach((panel) => {
      const content = panel.querySelector('.panel-content');
      if (!content) return;

      gsap.to(content, {
        x: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: horizontalScroll,
          start: 'left right',
          end: 'right left',
          scrub: true
        }
      });
    });
  }

  // ═══ KEYBOARD NAVIGATION ═══
  document.addEventListener('keydown', (e) => {
    const scrollAmount = window.innerWidth * 0.8;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
  });

  // ═══ RESIZE HANDLER ═══
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});

