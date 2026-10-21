/**
 * Entry point: fills every [data-render] placeholder in index.html
 * from data.js and keeps the navigation state in sync with scrolling.
 */
import * as content from "./data.js";
import { renderers } from "./render.js";

function renderSections() {
  for (const slot of document.querySelectorAll("[data-render]")) {
    const key = slot.dataset.render;
    const render = renderers[key];
    const data = content[key];
    if (!render || !data) {
      console.warn(`No renderer or data for "${key}"`);
      continue;
    }
    slot.replaceChildren(render(data));
  }
}

/** Marks the nav link of the section currently in view with aria-current. */
function trackCurrentSection() {
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
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

function setYear() {
  for (const node of document.querySelectorAll("[data-year]")) {
    node.textContent = String(new Date().getFullYear());
  }
}

renderSections();
trackCurrentSection();
setYear();

// Re-apply a #fragment target once the rendered content exists.
if (location.hash) {
  document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}
