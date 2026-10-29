
"use strict";

/* Current copyright year */
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Animated star field */
(() => {
  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let animationId = null;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(110, Math.floor(width / 5));

    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.18 + 0.035,
      opacity: Math.random() * 0.65 + 0.2
    }));

    if (reducedMotion) drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(190,220,255,${star.opacity})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(190,220,255,${star.opacity})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      star.y -= star.speed;

      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  resize();

  if (!reducedMotion) animate();

  window.addEventListener("resize", () => {
    if (animationId) cancelAnimationFrame(animationId);
    resize();
    if (!reducedMotion) animate();
  }, { passive: true });
})();

/* Reveal cards as they enter the screen */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

/* Smooth in-page navigation */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href");
    const target = targetId && document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    }
  });
});
