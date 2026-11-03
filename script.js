"use strict";
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var $ = function (id) { return document.getElementById(id); };
var intro = $("intro"), site = $("site");

/* Curtains */
function store(k, v) { try { if (v) sessionStorage.setItem(k, v); else return sessionStorage.getItem(k); } catch (e) {} }
function openWorld(skip) {
  intro.classList.add("open");
  site.classList.add("ready");
  document.body.classList.remove("locked");
  setTimeout(function () { intro.classList.add("gone"); if (!skip) $("home").focus({ preventScroll: true }); }, skip || reduced ? 30 : 2000);
  store("mkEntered", "yes");
}
$("enter").addEventListener("click", function () { openWorld(false); });
if (store("mkEntered") === "yes") { intro.classList.add("open", "gone"); site.classList.add("ready"); document.body.classList.remove("locked"); }
$("year").textContent = new Date().getFullYear();

/* Scroll: progress bar, parallax, palace scenes */
var bar = $("progress"), hint = $("hint"), hero = document.querySelector(".hero-c");
var bgs = Array.prototype.slice.call(document.querySelectorAll(".wbg"));
var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
var world = $("world"), ticking = false;
function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function update() {
  ticking = false;
  var max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  if (!reduced) {
    bgs.forEach(function (bg) {
      var r = bg.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      var p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
      bg.style.setProperty("--shift", (p * 60 - 30).toFixed(1) + "px");
    });
    hero.style.setProperty("--hs", (scrollY * -0.12).toFixed(1) + "px");
  }
  var r2 = world.getBoundingClientRect();
  var p2 = clamp(-r2.top / (world.offsetHeight - innerHeight), 0, 1);
  var n = scenes.length, x = p2 * n;
  hint.style.opacity = (p2 > 0.03 && p2 < 0.97) ? 0 : 1;
  scenes.forEach(function (s, i) {
    var d = Math.abs(x - (i + 0.5));
    if (i === 0 && x < 0.5) d = 0;
    if (i === n - 1 && x > n - 0.5) d = 0;
    var o = clamp(2 - d * 3, 0, 1);
    s.style.opacity = o;
    s.style.visibility = o > 0 ? "visible" : "hidden";
    s.style.setProperty("--z", (1 + clamp(x - i, 0, 1) * 0.35).toFixed(3));
  });
}
addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
addEventListener("resize", update);
update();

/* Reveal */
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

/* Gates: door swings open, then you walk in */
document.querySelectorAll(".card").forEach(function (c) {
  c.addEventListener("click", function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    c.classList.add("open");
    setTimeout(function () { location.href = c.href; }, reduced ? 50 : 900);
  });
});
addEventListener("pageshow", function () {
  document.querySelectorAll(".card.open").forEach(function (c) { c.classList.remove("open"); });
});

/* Back to top */
$("top").addEventListener("click", function () { scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });

/* Stars (light on phones, paused when the tab is hidden) */
var cv = $("stars"), cx = cv.getContext("2d"), stars = [], raf;
function sizeStars() {
  cv.width = innerWidth; cv.height = innerHeight;
  var count = Math.min(90, Math.round(innerWidth * innerHeight / 12000));
  stars = [];
  for (var i = 0; i < count; i++) stars.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.4 + 0.1, t: Math.random() * 6 });
  if (reduced) drawStars();
}
function drawStars() {
  cx.clearRect(0, 0, cv.width, cv.height);
  cx.fillStyle = "#eee8fa";
  stars.forEach(function (s) {
    s.t += 0.02; s.y += s.s * 0.15; if (s.y > cv.height) s.y = 0;
    cx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.t));
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill();
  });
  if (!reduced && !document.hidden) raf = requestAnimationFrame(drawStars);
}
sizeStars(); drawStars();
addEventListener("resize", sizeStars);
document.addEventListener("visibilitychange", function () { if (!document.hidden && !reduced) { cancelAnimationFrame(raf); drawStars(); } });

/* Sound: soft ambient hum, off by default */
var sb = $("sound"), ac, gain, on = false;
sb.addEventListener("click", function () {
  try {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      gain = ac.createGain(); gain.gain.value = 0; gain.connect(ac.destination);
      [110, 164.8, 220].forEach(function (f) { var o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(gain); o.start(); });
    }
    on = !on; ac.resume();
    gain.gain.setTargetAtTime(on ? 0.05 : 0, ac.currentTime, 0.4);
    sb.textContent = "SOUND: " + (on ? "ON" : "OFF");
  } catch (e) { sb.textContent = "SOUND: N/A"; }
});
