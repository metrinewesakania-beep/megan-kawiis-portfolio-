
/* =========================================================
   MEGAN KAWIIS CREATIVE LAB — EXPERIENCE ENGINE
   Interactive portfolio • Mobile-first • No extra libraries
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* 01 — LIVE YEAR */
  const year = $("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* 02 — MOBILE NAVIGATION */
  const menuToggle = $("#menu-toggle");
  const navigation = $("#site-navigation");

  function closeMenu() {
    if (!menuToggle || !navigation) return;

    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const open = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = open ? "✕" : "☰";
    });

    $$("a", navigation).forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (
        navigation.classList.contains("open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* 03 — SMOOTH SECTION NAVIGATION */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  /* 04 — SCROLL REVEAL ANIMATIONS
     Injects its own styles, so no CSS replacement is required. */

  const motionStyle = document.createElement("style");

  motionStyle.textContent = `
    .mk-reveal-ready {
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity .7s ease,
        transform .7s cubic-bezier(.2,.7,.2,1);
    }

    .mk-reveal-ready.mk-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .mk-image-ready {
      opacity: 0;
      transition: opacity .45s ease;
    }

    .mk-image-ready.mk-image-loaded {
      opacity: 1;
    }

    .mk-project-filtered {
      display: none !important;
    }

    .mk-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 3px;
      z-index: 9999;
      pointer-events: none;
      background: linear-gradient(90deg, #a855f7, #fa62dc, #7be7ff);
      box-shadow: 0 0 12px #c45cff99;
    }

    .mk-card-glow {
      background-image:
        radial-gradient(
          circle at var(--mk-x, 50%) var(--mk-y, 50%),
          rgba(168,85,247,.13),
          transparent 48%
        );
    }

    @media (prefers-reduced-motion: reduce) {
      .mk-reveal-ready,
      .mk-image-ready {
        transition: none !important;
        transform: none !important;
      }
    }
  `;

  document.head.appendChild(motionStyle);

  const revealElements = $$(".reveal, .service-card, .project-card");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
      element.classList.add("mk-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mk-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.classList.add("mk-reveal-ready");
      element.style.transitionDelay =
        `${Math.min(index % 4, 3) * 70}ms`;

      revealObserver.observe(element);
    });
  }

  /* 05 — WORKING PROJECT FILTERS */
  const filterButtons = $$(".filter-btn");
  const projectCards = $$(".project-card");

  function filterProjects(category) {
    projectCards.forEach(card => {
      const categories = (card.dataset.category || "")
        .toLowerCase()
        .split(/\s+/);

      const matches =
        category === "all" || categories.includes(category);

      card.classList.toggle("mk-project-filtered", !matches);
      card.setAttribute("aria-hidden", String(!matches));

      if (!matches) {
        card.querySelectorAll("a, button").forEach(control => {
          control.setAttribute("tabindex", "-1");
        });
      } else {
        card.querySelectorAll("a, button").forEach(control => {
          control.removeAttribute("tabindex");
        });
      }
    });

    filterButtons.forEach(button => {
      const active = button.dataset.filter === category;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterProjects(button.dataset.filter || "all");
    });
  });

  // Ensure the initial filter state matches the HTML.
  filterProjects("all");

  /* 06 — CINEMATIC IMAGE LOADING */
  $$("img").forEach(img => {
    img.decoding = "async";

    if (!img.hasAttribute("fetchpriority")) {
      img.loading = "lazy";
    }

    img.addEventListener("load", () => {
      img.classList.add("mk-image-loaded");
    });

    img.addEventListener("error", () => {
      img.classList.remove("mk-image-ready");
      img.classList.add("mk-image-error");
      img.setAttribute("data-image-error", "true");
      // Keep the card layout intact if an image URL fails.
    });

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("mk-image-loaded");
    }
  });

  /* 07 — PREMIUM DESKTOP CARD LIGHTING */
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (finePointer && !reducedMotion) {
    $$(".project-card, .service-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--mk-x", `${x}%`);
        card.style.setProperty("--mk-y", `${y}%`);
        card.classList.add("mk-card-glow");
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--mk-x");
        card.style.removeProperty("--mk-y");
        card.classList.remove("mk-card-glow");
      });
    });
  }

  /* 08 — READING PROGRESS BAR */
  const progress = document.createElement("div");

  progress.className = "mk-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  let scrollScheduled = false;

  function updateScrollEffects() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percent = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progress.style.width = `${Math.min(100, percent)}%`;
    scrollScheduled = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollScheduled) {
      scrollScheduled = true;

      if ("requestAnimationFrame" in window) {
        window.requestAnimationFrame(updateScrollEffects);
      } else {
        updateScrollEffects();
      }
    }
  }, { passive: true });

  updateScrollEffects();

  /* 09 — CONTACT FORM VALIDATION */
  const form = $("#contact-form");
  const note = $("#form-note");

  // Change this to your real email address before using the form.
  const CONTACT_EMAIL = "replace-with-your-email@example.com";

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const name = $("#visitor-name")?.value.trim() || "";
      const email = $("#visitor-email")?.value.trim() || "";
      const message = $("#visitor-message")?.value.trim() || "";

      function showNote(text, success = false) {
        if (!note) return;

        note.textContent = text;
        note.style.color = success ? "#66f4bd" : "#fa62dc";
        note.setAttribute("role", "status");
      }

      if (!name || !email || !message) {
        showNote("Please complete all fields before continuing.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNote("Please enter a valid email address.");
        return;
      }

      if (
        CONTACT_EMAIL === "replace-with-your-email@example.com" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL)
      ) {
        showNote(
          "Almost ready! Add your real email address inside script.js."
        );
        return;
      }

      const subject = encodeURIComponent(
        `Creative Lab enquiry from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nReply email: ${email}\n\nMessage:\n${message}`
      );

      showNote(
        "Your email app should open. Review the message and tap Send.",
        true
      );

      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  /* 10 — BACK-TO-TOP LINK */
  const backToTop = $(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", event => {
      const home = $("#home");

      if (!home) return;

      event.preventDefault();

      home.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      if (history.replaceState) {
        history.replaceState(null, "", "#home");
      }
    });
  }

  /* 11 — KEYBOARD ACCESSIBILITY */
  document.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    document.documentElement.classList.add("keyboard-navigation");
  });

  document.addEventListener("pointerdown", () => {
    document.documentElement.classList.remove("keyboard-navigation");
  }, { passive: true });

  /* 12 — INITIALIZATION */
  console.info(
    "%c MEGAN KAWIIS CREATIVE LAB ",
    "background:#8035d9;color:#fff;padding:8px 12px;" +
    "font-weight:bold;border-radius:4px;"
  );

  console.info(
    "Experience engine ready. Create boldly. Build the future. ✦"
  );
});
