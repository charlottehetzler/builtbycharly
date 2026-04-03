// Scroll reveal — robust version
function initReveal() {
  const els = document.querySelectorAll('[data-r]');
  if (!els.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });
  
  els.forEach(el => observer.observe(el));
  
  // Fallback: reveal elements already in viewport on load
  requestAnimationFrame(() => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('v');
      }
    });
  });
}

// Run on DOM ready and after load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}
window.addEventListener('load', initReveal);

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 40));

// Mobile menu
const burg = document.getElementById('burg');
const mm = document.getElementById('mm');
if (burg && mm) {
  burg.addEventListener('click', () => {
    burg.classList.toggle('on');
    mm.classList.toggle('on');
  });
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burg.classList.remove('on');
    mm.classList.remove('on');
  }));
}

// Project row hover preview
const preview = document.getElementById('projPreview');
const previewImg = document.getElementById('projPreviewImg');
document.querySelectorAll('.proj-row').forEach(row => {
  row.addEventListener('mouseenter', () => { previewImg.src = row.dataset.img; preview.classList.add('show'); });
  row.addEventListener('mousemove', e => { preview.style.left = (e.clientX + 20) + 'px'; preview.style.top = (e.clientY - 110) + 'px'; });
  row.addEventListener('mouseleave', () => preview.classList.remove('show'));
});

// Drag scroll helper
function enableDrag(el) {
  if (!el) return;
  let d = 0, sx, sl;
  el.addEventListener('mousedown', e => { d = 1; el.style.cursor = 'grabbing'; sx = e.pageX - el.offsetLeft; sl = el.scrollLeft; });
  document.addEventListener('mouseup', () => { d = 0; if (el) el.style.cursor = 'grab'; });
  el.addEventListener('mousemove', e => { if (!d) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.5; });
}
enableDrag(document.getElementById('pst'));
enableDrag(document.getElementById('tstTrack'));

// Skills swiper drag on mobile
const skGrid = document.querySelector('.sk-grid');
if (skGrid) enableDrag(skGrid);

// Hero parallax — content moves slower than scroll
const heroIn = document.querySelector('.hero-in');
if (heroIn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      heroIn.style.transform = 'translateY(' + (y * 0.35) + 'px)';
      heroIn.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.8));
    }
  }, { passive: true });
}
