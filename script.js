
const CONTACT_EMAIL = "replace-with-your-email@example.com";

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#site-navigation");

if (menuToggle && navigation) {
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
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const form = document.querySelector("#contact-form");
const note = document.querySelector("#form-note");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (CONTACT_EMAIL.includes("replace-with-your-email")) {
      if (note) {
        note.textContent =
          "Please configure CONTACT_EMAIL in script.js before using this form.";
        note.style.color = "#ff39e6";
      }
      return;
    }

    const name = document.querySelector("#visitor-name").value.trim();
    const email = document.querySelector("#visitor-email").value.trim();
    const message = document.querySelector("#visitor-message").value.trim();

    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\nReply email: " + email + "\n\n" + message
    );

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + subject + "&body=" + body;
  });
    }
