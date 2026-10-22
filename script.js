document.addEventListener("DOMContentLoaded", () => {

  // ===== Intro / Welcome animation =====
  const intro = document.getElementById("intro");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (intro) {
    document.body.classList.add("is-intro-active");

    const finishIntro = () => {
      intro.classList.add("is-done");
      intro.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-intro-active");
      // Remove from DOM after transition to keep things clean
      setTimeout(() => {
        if (intro.parentNode) intro.remove();
      }, 1000);
    };

    if (prefersReducedMotion) {
      // Almost instant for accessibility
      setTimeout(finishIntro, 400);
    } else {
      // Full sequence ~2.4s then exit
      setTimeout(finishIntro, 2400);
    }
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  const openMenu = () => {
    nav.classList.add("is-open");
    overlay.classList.add("is-visible");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Product filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      products.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // Scroll reveal
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    document.querySelectorAll(
      ".section-header, .category-item, .product-card, .about__visual, .about__content, .contact__card, .cta__content, .cta__visual"
    ).forEach((el) => el.classList.add("fade-up"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    document.querySelectorAll(".product-card").forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.05}s`;
    });
    document.querySelectorAll(".category-item").forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
    });
  } else {
    document.querySelectorAll(".fade-up").forEach((el) => el.classList.add("is-visible"));
  }
});
