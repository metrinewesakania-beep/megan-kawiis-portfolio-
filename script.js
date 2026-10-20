
/* =====================================================
   MEGAN KAWIIS CREATIVE LAB
   File: script.js
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTOMATIC COPYRIGHT YEAR
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION MENU
  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("site-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 3. PROJECT CATEGORY FILTERS
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        card.hidden = !shouldShow;
      });
    });
  });

  // 4. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // 5. BACK-TO-TOP BUTTON
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    updateBackToTop();
  }

  // 6. CONTACT FORM
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  const contactEmail = "metrinewesakania@gmail.com";

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const name = document
        .getElementById("visitor-name")
        .value.trim();

      const email = document
        .getElementById("visitor-email")
        .value.trim();

      const message = document
        .getElementById("visitor-message")
        .value.trim();

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent =
            "Please complete all fields before continuing.";
        }
        return;
      }

      const subject = `Portfolio enquiry from ${name}`;

      const body = [
        `Hello Megan Kawiis Creative Lab,`,
        ``,
        message,
        ``,
        `From: ${name}`,
        `Reply to: ${email}`
      ].join("\n");

      const mailtoLink =
        `mailto:${contactEmail}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (formNote) {
        formNote.textContent =
          "Opening your email app. Review and send your message there.";
      }

      window.location.href = mailtoLink;
    });
  }

  // 7. FRIENDLY IMAGE FALLBACK
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.backgroundColor = "#1c1230";
      image.style.color = "#c084fc";
    });
  });

  // 8. PREVENT ACCIDENTAL EMPTY PROJECT LINKS
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  console.log("Megan Kawiis Creative Lab is ready ✨");
});
