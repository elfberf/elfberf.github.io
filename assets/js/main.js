/**
 * Entry point: renders every [data-render] slot from data.js in the active
 * language, translates static [data-i18n] text, and wires up the interface.
 */
import * as content from "./data.js";
import { strings, DEFAULT_LANGUAGE } from "./i18n.js";
import { renderers } from "./render.js";
import * as ui from "./ui.js";

let lang = ui.initialLanguage();
const label = (key) => strings[lang]?.[key] ?? strings[DEFAULT_LANGUAGE][key] ?? key;

function translateStatic() {
  root.lang = lang;
  document.title = label("meta.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", label("meta.description"));

  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = label(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of node.dataset.i18nAttr.split(";")) {
      const [attr, key] = pair.split(":");
      node.setAttribute(attr.trim(), label(key.trim()));
    }
  }
}

function renderSections() {
  for (const slot of document.querySelectorAll("[data-render]")) {
    const key = slot.dataset.render;
    const render = renderers[key];
    const data = content[key];
    if (!render || !data) {
      console.warn(`No renderer or data for "${key}"`);
      continue;
    }
    slot.replaceChildren(render(data, lang));
  }
}

const root = document.documentElement;
let syncTheme = () => {};

function apply() {
  translateStatic();
  renderSections();
  ui.reflectLanguage(lang);
  syncTheme();
  ui.observeReveals();
}

function setLanguage(next) {
  if (next === lang) return;
  lang = next;
  ui.save("lang", lang);
  apply();
  // The reader has already seen this content: show it at once instead of fading it in again.
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
}

syncTheme = ui.initTheme(label);
apply();
ui.bindLanguageSwitch(setLanguage);
ui.initMenu();
ui.initNavState();
ui.initScrollUi();
ui.initCopy(label);
ui.initPrint();
ui.initSpotlight();

for (const node of document.querySelectorAll("[data-year]")) {
  node.textContent = String(new Date().getFullYear());
}

// Re-apply a #fragment target once the rendered content exists.
if (location.hash) {
  document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}
