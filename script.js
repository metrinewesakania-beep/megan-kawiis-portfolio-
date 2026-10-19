
/* =====================================================
   MEGAN KAWIIS CREATIVE LAB
   Advanced portfolio interactions
   ===================================================== */

"use strict";

const CONTACT_EMAIL = "replace-with-your-email@example.com";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // Current year
  const year = $("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const navigation = $("#site-navigation");

  if (menuToggle && navigation) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    $$("#site-navigation a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scrolling for internal links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = $(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // Reveal elements as visitors scroll
  const revealTargets = $$(
    ".project-card, .section-heading, .about-content, " +
    ".hero-content, .contact-content, .manifesto"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(element => {
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach(element =>
      element.classList.add("is-visible")
    );
  }

  // Project card tilt effect on devices with a mouse
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (canHover) {
    $$(".project-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        card.style.setProperty("--pointer-x", `${x * 100}%`);
        card.style.setProperty("--pointer-y", `${y * 100}%`);
        card.style.transform =
          `perspective(900px) rotateX(${(0.5 - y) * 5}deg) ` +
          `rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Contact form: opens the visitor's email application
  const contactForm = $("#contact-form");
  const formNote = $("#form-note");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = $("#visitor-name")?.value.trim() || "";
      const email = $("#visitor-email")?.value.trim() || "";
      const message = $("#visitor-message")?.value.trim() || "";

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = "Please complete every field.";
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (formNote) {
          formNote.textContent = "Please enter a valid email address.";
        }
        return;
      }

      if (
        CONTACT_EMAIL === "replace-with-your-email@example.com" ||
        !CONTACT_EMAIL.includes("@")
      ) {
        if (formNote) {
          formNote.textContent =
            "Set your email address in script.js before using this form.";
        }
        return;
      }

      const subject = encodeURIComponent(
        `Portfolio enquiry from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nReply email: ${email}\n\nMessage:\n${message}`
      );

      if (formNote) {
        formNote.textContent =
          "Opening your email app. Send the message there to complete delivery.";
      }

      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // Image loading polish
  $$("img").forEach(img => {
    img.loading = img.closest(".hero") ? "eager" : "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    });
  });

  // Back-to-top button, if present in HTML
  const backToTop = $("#back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.hidden = window.scrollY < 500;
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateBackToTop();
  }

  // Friendly console signature for curious developers
  console.log(
    "%c MEGAN KAWIIS CREATIVE LAB ",
    "background:#8b5cf6;color:#fff;padding:8px;font-weight:bold;"
  );
  console.log("Create boldly. Build the future. 🚀");
});
