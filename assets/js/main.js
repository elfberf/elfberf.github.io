/**
 * Entry point: renders every [data-render] slot from data.js in the active
 * language, translates static [data-i18n] text, and wires up the interface,
 * the command menu and the message assistant.
 */
import * as content from "./data.js";
import { strings, DEFAULT_LANGUAGE } from "./i18n.js";
import { renderers } from "./render.js";
import * as ui from "./ui.js";
import { OWNER, copyText, downloadVCard, notify, sharePage, startClock } from "./actions.js";
import { createAssistant } from "./assistant.js";
import { createPalette } from "./palette.js";
import { offerIntro, playIntro } from "./intro.js";

const root = document.documentElement;
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

let syncTheme = () => {};
let tickClock = () => {};
let assistant = null;

function apply() {
  translateStatic();
  renderSections();
  ui.reflectLanguage(lang);
  syncTheme();
  tickClock();
  ui.observeReveals();
}

function setLanguage(next) {
  if (next === lang) return;
  lang = next;
  ui.save("lang", lang);
  apply();
  // The reader has already seen this content: show it at once instead of fading it in again.
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
  assistant?.relabel();
}

/* ---- Actions shared by buttons and the command menu ------------------------- */
const goTo = (id) => {
  const target = document.getElementById(id);
  target?.scrollIntoView();
  target?.querySelector("h1, h2")?.setAttribute("tabindex", "-1");
  target?.querySelector("h1, h2")?.focus({ preventScroll: true });
};
const copyEmail = async () => notify(label((await copyText(OWNER.email)) ? "contact.copiedAnnounce" : "contact.shareFailed"));
const share = async () => {
  const result = await sharePage(label("meta.title"));
  if (result === "copied") notify(label("contact.linkCopied"));
  if (result === "failed") notify(label("contact.shareFailed"));
};
const vcard = () => {
  downloadVCard();
  notify(label("contact.vcardDone"));
};
const print = () => document.querySelector("[data-print]")?.click();
const toggleTheme = () => document.querySelector("[data-theme-toggle]")?.click();
const openExternal = (url) => window.open(url, "_blank", "noopener");

function commands() {
  return [
    { id: "message", icon: "chat", text: label("cmd.message"), keywords: "email mail contact iletişim", run: () => assistant?.open() },
    { id: "work", icon: "arrow", text: label("cmd.work"), keywords: "projects case", run: () => goTo("work") },
    { id: "experience", icon: "arrow", text: label("cmd.experience"), keywords: "jobs career kariyer", run: () => goTo("experience") },
    { id: "expertise", icon: "arrow", text: label("cmd.expertise"), keywords: "skills stack yetenek", run: () => goTo("expertise") },
    { id: "contact", icon: "arrow", text: label("cmd.contact"), keywords: "email iletişim", run: () => goTo("contact") },
    { id: "copy", icon: "copy", text: label("cmd.copy"), hint: OWNER.email, keywords: "email e-posta", run: copyEmail },
    { id: "theme", icon: "moon", text: label("cmd.theme"), keywords: "dark light tema karanlık aydınlık", run: toggleTheme },
    { id: "lang", icon: "globe", text: label("cmd.lang"), hint: lang === "en" ? "TR" : "EN", keywords: "language dil english türkçe", run: () => setLanguage(lang === "en" ? "tr" : "en") },
    { id: "github", icon: "github", text: label("cmd.github"), keywords: "code", run: () => openExternal(OWNER.github) },
    { id: "linkedin", icon: "linkedin", text: label("cmd.linkedin"), run: () => openExternal(OWNER.linkedin) },
    { id: "print", icon: "print", text: label("cmd.print"), keywords: "cv resume özgeçmiş pdf", run: print },
    { id: "vcard", icon: "user-plus", text: label("cmd.vcard"), keywords: "contact kişi rehber", run: vcard },
    { id: "share", icon: "share", text: label("cmd.share"), keywords: "link paylaş", run: share },
    { id: "top", icon: "up", text: label("cmd.top"), keywords: "top başa", run: () => goTo("top") },
  ];
}

/* ---- Start -------------------------------------------------------------------- */
syncTheme = ui.initTheme(label);
tickClock = startClock(() => lang);
apply();
playIntro();
offerIntro(label);
ui.bindLanguageSwitch(setLanguage);
ui.initMenu();
ui.initNavState();
ui.initScrollUi();
ui.initCopy(label);
ui.initPrint();
ui.initSpotlight();

assistant = createAssistant({
  label,
  getLang: () => lang,
  content,
  onToggle: (open) => document.querySelector("[data-to-top]")?.classList.toggle("is-hidden", open),
});
createPalette({ label, commands });

document.querySelector("[data-vcard]")?.addEventListener("click", vcard);
document.querySelector("[data-share]")?.addEventListener("click", share);

// Show the platform's shortcut on the command-menu button.
const isApple = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
document.querySelectorAll("[data-shortcut]").forEach((n) => (n.textContent = isApple ? "⌘K" : "Ctrl K"));

// Links such as …/#message open the assistant directly.
if (location.hash === "#message") assistant?.open();

for (const node of document.querySelectorAll("[data-year]")) {
  node.textContent = String(new Date().getFullYear());
}

// Re-apply a #fragment target once the rendered content exists.
if (location.hash && location.hash !== "#message") {
  document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}
