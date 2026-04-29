/* ═══════════════════════════════════════
   CHARLOTTE HETZLER — Portfolio
   Vertical scroll · IntersectionObserver
   No external dependencies
   ═══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  // ═══ REDUCED MOTION FALLBACK ═══
  if (prefersReducedMotion) {
    document
      .querySelectorAll(
        "[data-reveal], [data-reveal-stagger], .hero-intro, .hero-name .name-line, .hero-tagline, .hero-credential, .hero-portrait",
      )
      .forEach((el) => el.classList.add("is-revealed"));
    initCurrently();
    initNavScrollState();
    return;
  }

  // ═══ CUSTOM CURSOR ═══
  const cursor = document.querySelector(".cursor");
  const cursorDot = cursor?.querySelector(".cursor-dot");
  const cursorRing = cursor?.querySelector(".cursor-ring");

  if (cursor && isFinePointer) {
    let mouseX = 0,
      mouseY = 0;
    let dotX = 0,
      dotY = 0;
    let ringX = 0,
      ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.22;
      dotY += (mouseY - dotY) * 0.22;
      cursorDot.style.left = dotX + "px";
      cursorDot.style.top = dotY + "px";

      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll(
      "a, button, .project-card, .webflow-card, .testimonial",
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("hovering"),
      );
    });
  }

  // ═══ NAV: dark/light state + scrolled state ═══
  const nav = document.querySelector(".nav");
  const currentlyEl = document.querySelector(".currently");
  const darkPanels = document.querySelectorAll(
    ".panel-philosophy, .panel-work, .panel-contact",
  );

  const updateNavOnDark = () => {
    if (!nav) return;
    let onDark = false;
    darkPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom > 80) onDark = true;
    });
    nav.classList.toggle("on-dark", onDark);

    if (currentlyEl) {
      let currentlyOnDark = false;
      darkPanels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const widgetY = window.innerHeight - 40;
        if (rect.top <= widgetY && rect.bottom >= widgetY)
          currentlyOnDark = true;
      });
      currentlyEl.classList.toggle("on-dark", currentlyOnDark);
    }
  };

  function initNavScrollState() {
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 30);
      updateNavOnDark();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  initNavScrollState();

  // ═══ PROGRESS BAR ═══
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    const updateProgress = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      progressBar.style.width = progress * 100 + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ═══ HERO ENTRANCE ═══
  setTimeout(() => {
    document.querySelector(".hero-intro")?.classList.add("is-revealed");
  }, 250);

  const heroLines = document.querySelectorAll(".hero-name .name-line");
  heroLines.forEach((line, i) => {
    setTimeout(() => line.classList.add("is-revealed"), 450 + i * 130);
  });

  setTimeout(() => {
    document.querySelector(".hero-portrait")?.classList.add("is-revealed");
  }, 600);

  setTimeout(() => {
    document.querySelector(".hero-tagline")?.classList.add("is-revealed");
  }, 850);

  setTimeout(() => {
    document.querySelector(".hero-credential")?.classList.add("is-revealed");
  }, 1000);

  // ═══ SCROLL-TRIGGERED REVEALS ═══
  const reveals = document.querySelectorAll("[data-reveal]");
  const groups = document.querySelectorAll("[data-reveal-group]");

  if ("IntersectionObserver" in window) {
    if (reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              io.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px",
        },
      );
      reveals.forEach((el) => io.observe(el));
    }

    if (groups.length) {
      const groupIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const children = entry.target.querySelectorAll(
                "[data-reveal-stagger]",
              );
              children.forEach((child, i) => {
                setTimeout(() => child.classList.add("is-revealed"), i * 110);
              });
              groupIo.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px",
        },
      );
      groups.forEach((el) => groupIo.observe(el));
    }
  } else {
    // Fallback: show everything
    reveals.forEach((el) => el.classList.add("is-revealed"));
    document
      .querySelectorAll("[data-reveal-stagger]")
      .forEach((el) => el.classList.add("is-revealed"));
  }

  // ═══ "CURRENTLY" WIDGET ═══
  initCurrently();

  function initCurrently() {
    const widget = document.querySelector(".currently");
    if (!widget) return;

    const btn = widget.querySelector(".currently-btn");
    const textEl = widget.querySelector(".currently-text");
    const detail = widget.querySelector(".currently-detail");

    const schedule = [
      { from: 5, to: 7, text: "surfing or pretending to" },
      { from: 7, to: 9, text: "on the second coffee" },
      { from: 9, to: 13, text: "working on something cool" },
      { from: 13, to: 14, text: "lunch and a walk" },
      { from: 14, to: 18, text: "shipping things" },
      { from: 18, to: 22, text: "mentoring or Berlin overlap" },
      { from: 22, to: 29, text: "asleep, mostly" },
    ];

    function getCurrentText() {
      let sydneyHour;
      try {
        const fmt = new Intl.DateTimeFormat("en-AU", {
          timeZone: "Australia/Sydney",
          hour: "numeric",
          hour12: false,
        });
        sydneyHour = parseInt(fmt.format(new Date()), 10);
        if (Number.isNaN(sydneyHour)) sydneyHour = new Date().getHours();
      } catch (e) {
        sydneyHour = new Date().getHours();
      }

      const checkHour = sydneyHour < 5 ? sydneyHour + 24 : sydneyHour;
      const slot = schedule.find(
        (s) => checkHour >= s.from && checkHour < s.to,
      );
      return slot ? slot.text : "building something";
    }

    function update() {
      if (textEl) textEl.textContent = getCurrentText();
    }

    update();
    setInterval(update, 60 * 1000);

    if (!btn) return;

    let open = false;
    const setOpen = (val) => {
      open = val;
      btn.setAttribute("aria-expanded", String(val));
      if (detail) {
        if (val) {
          detail.hidden = false;
          requestAnimationFrame(() => detail.setAttribute("data-open", "true"));
        } else {
          detail.setAttribute("data-open", "false");
          setTimeout(() => {
            if (!open) detail.hidden = true;
          }, 300);
        }
      }
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!open);
    });

    document.addEventListener("click", (e) => {
      if (open && !widget.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });
  }
});
