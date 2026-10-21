/**
 * Small shared actions used by buttons, the command menu and the message
 * assistant: notifications, clipboard, vCard, share, mail links and local time.
 * Nothing here sends data anywhere; mail is composed in the visitor's own client.
 */

export const OWNER = {
  name: "Elif Berfin Gülbaş",
  given: "Elif Berfin",
  family: "Gülbaş",
  title: "Software Engineer",
  email: "berfingulbas@gmail.com",
  site: "https://elfberf.github.io/",
  github: "https://github.com/elfberf",
  linkedin: "https://www.linkedin.com/in/berfingulbas/",
  city: "Ankara",
  country: "Türkiye",
  timeZone: "Europe/Istanbul",
};

/* ---- Notifications ---------------------------------------------------------- */
let toastTimer;

/** Shows a short toast and announces it to screen readers. */
export function notify(text) {
  const toast = document.querySelector("[data-toast]");
  const announcer = document.querySelector("[data-announcer]");
  if (announcer) announcer.textContent = text;
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    if (announcer) announcer.textContent = "";
  }, 2600);
}

/* ---- Clipboard -------------------------------------------------------------- */
export async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

/* ---- vCard ------------------------------------------------------------------ */
const vcardEscape = (s) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`);

export function downloadVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${vcardEscape(OWNER.family)};${vcardEscape(OWNER.given)};;;`,
    `FN:${vcardEscape(OWNER.name)}`,
    `TITLE:${vcardEscape(OWNER.title)}`,
    `EMAIL;TYPE=INTERNET:${OWNER.email}`,
    `URL:${OWNER.site}`,
    `URL;TYPE=GitHub:${OWNER.github}`,
    `URL;TYPE=LinkedIn:${OWNER.linkedin}`,
    `ADR;TYPE=WORK:;;;${vcardEscape(OWNER.city)};;;${vcardEscape(OWNER.country)}`,
    "END:VCARD",
  ];
  const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "elif-berfin-gulbas.vcf";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---- Share ------------------------------------------------------------------ */
/** Native share sheet where available, otherwise copies the page link. Returns "shared" | "copied" | "failed". */
export async function sharePage(title) {
  const url = OWNER.site + (location.search.includes("lang=tr") ? "?lang=tr" : "");
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "shared";
    }
  }
  return (await copyText(url)) ? "copied" : "failed";
}

/* ---- Mail composition ------------------------------------------------------- */
/** Links that open the visitor's own mail client or webmail with the message prefilled. */
export function mailLinks(subject, body) {
  const q = (s) => encodeURIComponent(s);
  return {
    app: `mailto:${OWNER.email}?subject=${q(subject)}&body=${q(body)}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(OWNER.email)}&su=${q(subject)}&body=${q(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${q(OWNER.email)}&subject=${q(subject)}&body=${q(body)}`,
  };
}

/* ---- Local time ------------------------------------------------------------- */
export function localTime(lang) {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-GB", {
    timeZone: OWNER.timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

/** Keeps every [data-local-time] element current, updating on the minute. */
export function startClock(getLang) {
  const tick = () => {
    for (const node of document.querySelectorAll("[data-local-time]")) node.textContent = localTime(getLang());
  };
  tick();
  const msToNextMinute = 60000 - (Date.now() % 60000);
  setTimeout(() => {
    tick();
    setInterval(tick, 60000);
  }, msToNextMinute);
  return tick;
}
