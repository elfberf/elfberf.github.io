/**
 * Interface behaviour: theme, language preference, mobile menu, nav state,
 * copy-to-clipboard, print, reading progress, reveal-on-scroll and count-up.
 * Every enhancement is optional — the page is fully readable without it.
 */
import { LANGUAGES, DEFAULT_LANGUAGE } from "./i18n.js";
import { copyText, notify } from "./actions.js";

const root = document.documentElement;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Storage (can be unavailable in private mode or with blocked site data) -- */
export function load(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* preference simply isn't remembered */
  }
}

/* ---- Language --------------------------------------------------------------- */
/** ?lang= wins (shareable links), then the saved choice, then the browser language. */
export function initialLanguage() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGUAGES.includes(fromUrl)) return fromUrl;
  const saved = load("lang");
  if (LANGUAGES.includes(saved)) return saved;
  const browser = (navigator.languages ?? [navigator.language]).map((l) => String(l).slice(0, 2).toLowerCase());
  return browser.find((l) => LANGUAGES.includes(l)) ?? DEFAULT_LANGUAGE;
}

export function bindLanguageSwitch(onChange) {
  for (const button of document.querySelectorAll("[data-lang]")) {
    button.addEventListener("click", () => onChange(button.dataset.lang));
  }
}

export function reflectLanguage(lang) {
  for (const button of document.querySelectorAll("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  }
  const url = new URL(location.href);
  if (lang === DEFAULT_LANGUAGE) url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);
}

/* ---- Theme ------------------------------------------------------------------ */
function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function initTheme(getLabel) {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return () => {};
  const sync = () => {
    const theme = currentTheme();
    button.setAttribute("aria-label", getLabel(theme === "dark" ? "theme.toLight" : "theme.toDark"));
    button.dataset.current = theme;
    const meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach((m) => m.setAttribute("content", theme === "dark" ? "#0b0d0e" : "#fbfaf7"));
  };
  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    save("theme", next);
    sync();
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);
  sync();
  return sync;
}

/* ---- Mobile menu ------------------------------------------------------------ */
export function initMenu() {
  const button = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    root.classList.toggle("menu-open", open);
  };
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("menu-open")) {
      setOpen(false);
      button.focus();
    }
  });
  window.matchMedia("(min-width: 48rem)").addEventListener("change", (e) => e.matches && setOpen(false));
}

/* ---- Current section in nav ------------------------------------------------- */
export function initNavState() {
  const links = new Map(
    [...document.querySelectorAll(".nav a[href^='#']")].map((a) => [a.getAttribute("href").slice(1), a]),
  );
  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links.values()) link.removeAttribute("aria-current");
        links.get(entry.target.id)?.setAttribute("aria-current", "location");
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---- Reading progress + back-to-top ----------------------------------------- */
export function initScrollUi() {
  const bar = document.querySelector(".progress span");
  const toTop = document.querySelector("[data-to-top]");
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    const ratio = max > 0 ? Math.min(1, scrollY / max) : 0;
    if (bar) bar.style.transform = `scaleX(${ratio})`;
    root.classList.toggle("is-scrolled", scrollY > 8);
    toTop?.classList.toggle("is-visible", scrollY > innerHeight * 0.8);
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* ---- Copy & print ----------------------------------------------------------- */
export function initCopy(getLabel) {
  for (const button of document.querySelectorAll("[data-copy]")) {
    let timer;
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (!(await copyText(value))) {
        location.href = `mailto:${value}`;
        return;
      }
      const text = button.querySelector("[data-copy-label]");
      button.classList.add("is-copied");
      if (text) text.textContent = getLabel("contact.copied");
      notify(getLabel("contact.copiedAnnounce"));
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.classList.remove("is-copied");
        if (text) text.textContent = getLabel("contact.copy");
      }, 2000);
    });
  }
}

export function initPrint() {
  for (const button of document.querySelectorAll("[data-print]")) {
    button.addEventListener("click", () => {
      // Expand every collapsed list so the PDF contains the full résumé.
      document.querySelectorAll(".role__points.is-collapsed").forEach((l) => l.classList.remove("is-collapsed"));
      window.print();
    });
  }
}

/* ---- Reveal on scroll + count-up -------------------------------------------- */
let revealObserver = null;

/** Call after (re)rendering. Without IntersectionObserver or with reduced motion, nothing is hidden. */
export function observeReveals() {
  if (reducedMotion() || !("IntersectionObserver" in window)) return;
  root.classList.add("can-reveal");
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  for (const node of document.querySelectorAll(".reveal:not(.is-visible)")) revealObserver.observe(node);
}

/** Animates the first number inside a label ("~70%", "%92.3", "~2×") from 0, keeping its format. */
function countUp(node) {
  const original = node.textContent;
  const match = original.match(/\d+(?:\.\d+)?/);
  if (!match || original.includes("→")) return;
  const target = Number(match[0]);
  const decimals = (match[0].split(".")[1] ?? "").length;
  const duration = 900;
  const start = performance.now();
  const frame = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = original.replace(match[0], (target * eased).toFixed(decimals));
    if (p < 1) requestAnimationFrame(frame);
    else node.textContent = original;
  };
  requestAnimationFrame(frame);
}

/* ---- Pointer spotlight on cards (fine pointers only) ------------------------ */
export function initSpotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.addEventListener(
    "pointermove",
    (event) => {
      const card = event.target.closest?.(".case, .skill-card, .principle, .link-card, .glance");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}
