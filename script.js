// Smooth scroll reveal + minimal mobile menu.
(() => {
  // Ensure content is visible even if JS fails to load.
  // When JS runs, we enable reveal transitions by adding a `js` class.
  document.documentElement.classList.add("js");

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isHidden = mobileNav.getAttribute("aria-hidden") === "true";
      mobileNav.setAttribute("aria-hidden", String(!isHidden));
      mobileNav.style.display = isHidden ? "block" : "none";
    });
  }

  // Scroll reveal
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  // Apply per-element delay (ms) for better cinematic timing.
  reveals.forEach((el) => {
    const d = Number(el.getAttribute("data-delay") || 0);
    el.style.setProperty("--d", `${Number.isFinite(d) ? d : 0}ms`);
  });
  if (!("IntersectionObserver" in window) || prefersReduced || reveals.length === 0) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.06 }
  );

  reveals.forEach((el) => io.observe(el));

  // Portfolio glow follows cursor (gold highlight)
  const cards = document.querySelectorAll(".p-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });

  // Simple lightbox for portfolio images
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  document.body.appendChild(lightbox);
  const lbImg = document.createElement('img');
  lbImg.style.maxWidth = '92%';
  lbImg.style.maxHeight = '92%';
  lbImg.style.borderRadius = '8px';
  lbImg.style.boxShadow = '0 30px 90px rgba(0,0,0,0.6)';
  lightbox.appendChild(lbImg);

  document.querySelectorAll('.p-media img, .hero-visual img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      lbImg.src = img.src;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  });

  // Animate stats when visible
  const statEls = document.querySelectorAll('.stat-num');
  statEls.forEach(el => el.dataset.target = el.textContent);
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target.toString().replace(/[^0-9]/g,''), 10) || 0;
        let start = 0; const duration = 900; const startTime = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - startTime) / duration);
          el.textContent = Math.round(p * target) + (el.dataset.suffix || '');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  statEls.forEach(el => statObserver.observe(el));

  // Hero parallax subtle movement on mouse move and on scroll
  const hero = document.querySelector('.hero');
  const heroBgImg = document.querySelector('.hero-bg img');
  if (hero && heroBgImg) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroBgImg.style.transform = `translate3d(${px * -6}%, ${py * -4}%, 0) scale(1.04)`;
      const hv = document.querySelector('.hero-visual img');
      if (hv) hv.style.transform = `translate3d(${px * 4}%, ${py * 2}%, 0) scale(1.02)`;
    });
    window.addEventListener('scroll', () => {
      const st = window.scrollY; heroBgImg.style.transform = `translate3d(0, ${Math.min(40, st * 0.08)}px, 0) scale(1.03)`;
    }, { passive: true });
  }

  // Contact form (front-end only)
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        note.textContent = "من فضلك أكمل البيانات المطلوبة.";
        note.style.color = "rgba(255,180,170,.95)";
        return;
      }

      note.textContent = "تم استلام طلبك. سنعود لك قريبًا.";
      note.style.color = "rgba(246,227,163,.95)";
      form.reset();
    });
  }
})();

