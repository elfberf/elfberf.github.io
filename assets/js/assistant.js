/**
 * Message assistant — a scripted, clearly automated chat panel.
 *
 * It does two things only:
 *  1. answers a few questions with text built from data.js (never invented);
 *  2. walks the visitor through writing an email, then opens it in the
 *     visitor's own mail app / Gmail / Outlook. Nothing is sent or stored by
 *     this site, and there is no AI model or third-party service behind it.
 */
import { t } from "./i18n.js";
import { OWNER, copyText, localTime, mailLinks, notify } from "./actions.js";
import { el, icon } from "./render.js";

const LIMITS = { name: 80, message: 1500, minMessage: 10 };
const FAQ = ["stack", "experience", "education", "languages", "location"];
const TOPICS = ["job", "project", "question", "other"];

/** First-token-prefix keywords per intent, in both languages. */
const KEYWORDS = {
  message: ["message", "mesaj", "contact", "iletişim", "email", "e-posta", "eposta", "mail", "hire", "offer", "teklif", "ulaş"],
  stack: ["stack", "tech", "teknoloji", "java", "spring", "docker", "kafka", "react", "sql", "postgres", "oracle", "database", "veritaban", "skill", "yetenek", "yetkinlik"],
  experience: ["experience", "deneyim", "tecrübe", "company", "şirket", "career", "kariyer", "bank", "banka", "job", "work"],
  education: ["education", "eğitim", "university", "üniversite", "degree", "lisans", "gazi", "certificate", "sertifika", "thesis", "tez"],
  languages: ["language", "dil", "english", "ingilizce", "german", "almanca", "turkish", "türkçe"],
  location: ["where", "nerede", "location", "konum", "ankara", "time", "saat", "timezone", "based", "city", "şehir"],
};

function intentOf(text) {
  const tokens = text.toLocaleLowerCase("tr").split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    if (tokens.some((token) => words.some((w) => token.startsWith(w)))) return intent;
  }
  return null;
}

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");

export function createAssistant({ label, getLang, content, onToggle = () => {} }) {
  const panel = document.getElementById("assistant");
  const launcher = document.querySelector("[data-assistant-open]");
  const closeButton = panel?.querySelector("[data-assistant-close]");
  const log = panel?.querySelector("[data-assistant-log]");
  const chips = panel?.querySelector("[data-assistant-chips]");
  const form = panel?.querySelector("[data-assistant-form]");
  const input = panel?.querySelector("[data-assistant-input]");
  if (!panel || !launcher || !log || !chips || !form || !input) return null;

  const L = (key) => label(`assistant.${key}`);
  const lang = () => getLang();
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state = { step: "idle", topic: null, name: "" };
  let started = false;
  let queue = Promise.resolve();

  /* ---- Messages ------------------------------------------------------------- */
  const scrollDown = () => {
    log.scrollTop = log.scrollHeight;
  };

  function add(role, ...children) {
    const bubble = el("div", { class: `msg msg--${role}` }, ...children);
    log.append(bubble);
    scrollDown();
    return bubble;
  }

  /** Bot messages are queued with a short "typing" pause so the exchange reads naturally. */
  function bot(...children) {
    queue = queue.then(
      () =>
        new Promise((resolve) => {
          if (reducedMotion()) {
            add("bot", ...children);
            return resolve();
          }
          const typing = add("bot", el("span", { class: "typing", "aria-hidden": "true" }, el("i"), el("i"), el("i")));
          setTimeout(() => {
            typing.remove();
            add("bot", ...children);
            resolve();
          }, 420);
        }),
    );
    return queue;
  }

  const user = (text) => add("user", text);

  /* ---- Quick replies ---------------------------------------------------------- */
  function setChips(items) {
    chips.replaceChildren(
      ...items.map(({ text, onClick, primary }) =>
        el("button", { type: "button", class: `chip${primary ? " chip--primary" : ""}` }, text),
      ),
    );
    [...chips.children].forEach((button, i) => button.addEventListener("click", items[i].onClick));
  }

  function mainChips() {
    setChips([
      { text: L("chip.message"), primary: true, onClick: () => choose("message", L("chip.message")) },
      ...FAQ.map((id) => ({ text: L(`chip.${id}`), onClick: () => choose(id, L(`chip.${id}`)) })),
    ]);
  }

  function setInput(mode) {
    const placeholders = { idle: "placeholder", name: "m.namePh", body: "m.bodyPh" };
    input.placeholder = L(placeholders[mode] ?? "placeholder");
    input.maxLength = mode === "name" ? LIMITS.name : LIMITS.message;
    input.rows = mode === "body" ? 4 : 1;
    input.disabled = mode === "done";
    form.classList.toggle("is-disabled", mode === "done");
  }

  /* ---- Answers (built from data.js only) ------------------------------------ */
  const glance = (en) => t(content.glance.find((g) => t(g.label, "en") === en)?.value, lang());

  function answer(intent) {
    const l = lang();
    switch (intent) {
      case "stack":
        return fill(L("a.stack"), { stack: glance("Core stack"), db: glance("Databases"), delivery: glance("Delivery") });
      case "experience":
        return [
          L("a.experience"),
          ...content.experience.map((r) => `• ${r.role} · ${r.company} (${t(r.period, l)})`),
        ].join("\n");
      case "education": {
        const [degree, cert] = content.education;
        return fill(L("a.education"), {
          degree: `${t(degree.title, l)}, ${t(degree.place, l)} (${t(degree.period, l)})`,
          cert: `${t(cert.title, l)}, ${t(cert.place, l)} (${t(cert.period, l)})`,
        });
      }
      case "languages":
        return fill(L("a.languages"), {
          list: content.languages.map((x) => `${t(x.name, l)} (${t(x.level, l)})`).join(", "),
        });
      case "location":
        return fill(L("a.location"), { time: localTime(l) });
      default:
        return L("fallback");
    }
  }

  /* ---- Conversation flow ------------------------------------------------------ */
  function choose(intent, text) {
    if (text) user(text);
    if (intent === "message") return askTopic();
    bot(answer(intent)).then(() => {
      if (state.step === "idle") mainChips();
    });
  }

  function askTopic() {
    state = { step: "topic", topic: null, name: "" };
    setChips([]);
    setInput("idle");
    bot(L("m.topic")).then(() =>
      setChips(
        TOPICS.map((id) => ({
          text: L(`t.${id}`),
          onClick: () => {
            user(L(`t.${id}`));
            state.topic = id;
            askName();
          },
        })),
      ),
    );
  }

  function askName() {
    state.step = "name";
    setChips([]);
    setInput("name");
    bot(L("m.name")).then(() => input.focus());
  }

  function askBody() {
    state.step = "body";
    setInput("body");
    bot(fill(L("m.body"), { name: state.name })).then(() => input.focus());
  }

  function compose(message) {
    state.step = "done";
    setInput("done");
    const subject = `${L(`t.${state.topic}`)} — elfberf.github.io`;
    const body = fill(L("m.template"), { message, name: state.name });
    const links = mailLinks(subject, body);
    const external = { target: "_blank", rel: "noopener noreferrer" };

    const copyButton = el("button", { type: "button", class: "chip" }, icon("copy", "icon icon--small"), L("m.copy"));
    copyButton.addEventListener("click", async () => {
      const ok = await copyText(`${OWNER.email}\n${subject}\n\n${body}`);
      notify(ok ? L("m.copied") : L("m.copyFailed"));
    });

    bot(
      el("p", {}, L("m.ready")),
      el(
        "div",
        { class: "msg__actions" },
        el("a", { class: "chip chip--primary", href: links.app }, icon("mail", "icon icon--small"), L("m.mailApp")),
        el("a", { class: "chip", href: links.gmail, ...external }, "Gmail"),
        el("a", { class: "chip", href: links.outlook, ...external }, "Outlook"),
        copyButton,
      ),
    ).then(() =>
      setChips([
        { text: L("m.restart"), onClick: () => askTopic() },
        { text: L("m.other"), onClick: () => reset({ greet: false }) },
      ]),
    );
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    if (state.step === "name") {
      state.name = text.slice(0, LIMITS.name);
      input.value = "";
      user(state.name);
      return askBody();
    }
    if (state.step === "body") {
      if (text.length < LIMITS.minMessage) {
        bot(L("m.tooShort"));
        return;
      }
      input.value = "";
      user(text);
      return compose(text.slice(0, LIMITS.message));
    }
    if (state.step === "topic") {
      // Free text while topics are offered: treat it as "something else".
      state.topic = "other";
      input.value = "";
      user(text);
      return askName();
    }
    input.value = "";
    user(text);
    const intent = intentOf(text);
    if (intent === "message") return askTopic();
    bot(answer(intent)).then(mainChips);
  });

  // Enter sends; Shift+Enter makes a new line in the message step.
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      // requestSubmit() is missing on older iOS Safari; clicking the submit button is equivalent.
      if (form.requestSubmit) form.requestSubmit();
      else form.querySelector('[type="submit"]')?.click();
    }
  });

  /* ---- Open / close ------------------------------------------------------------ */
  function reset({ greet = true } = {}) {
    state = { step: "idle", topic: null, name: "" };
    queue = Promise.resolve();
    if (greet) log.replaceChildren();
    setInput("idle");
    setChips([]);
    bot(greet ? L("greeting") : L("anythingElse")).then(mainChips);
  }

  function open() {
    if (!started) {
      started = true;
      reset();
    }
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    launcher.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("assistant-open");
    onToggle(true);
    setTimeout(() => input.focus({ preventScroll: true }), 60);
  }

  function close({ restoreFocus = true } = {}) {
    panel.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("assistant-open");
    onToggle(false);
    setTimeout(() => {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
    }, 220);
    if (restoreFocus) launcher.focus();
  }

  const isOpen = () => panel.classList.contains("is-open");
  launcher.addEventListener("click", () => (isOpen() ? close() : open()));
  closeButton?.addEventListener("click", () => close());
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  });

  return {
    open,
    close,
    isOpen,
    /** Language changed: restart in the new language if a conversation exists. */
    relabel() {
      setInput(state.step === "name" || state.step === "body" ? state.step : "idle");
      if (started) reset();
    },
  };
}
