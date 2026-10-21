/**
 * Pure render helpers: each takes data from data.js plus the active language
 * and returns a DOM node. Text is always set through text nodes (never
 * innerHTML), so content cannot inject markup.
 */
import { strings, t } from "./i18n.js?v=20261021-1510";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Small element factory: el("p", { class: "x" }, "text", childNode) */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    node.setAttribute(key, value === true ? "" : String(value));
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Inline icon from the sprite in index.html. */
export function icon(id, className = "icon") {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#i-${id}`);
  svg.append(use);
  return svg;
}

const label = (key, lang) => strings[lang]?.[key] ?? strings.en[key] ?? key;

/** Number of experience bullet points visible before "Show more". */
const VISIBLE_POINTS = 3;

function glanceList(items, lang) {
  return el(
    "dl",
    { class: "glance__list" },
    items.map((row) => el("div", {}, el("dt", {}, t(row.label, lang)), el("dd", {}, t(row.value, lang)))),
  );
}

function metricList(items, lang) {
  return el(
    "ul",
    { class: "metrics__list" },
    items.map((m) =>
      el(
        "li",
        {},
        el(
          "a",
          { class: "metric", href: `#${m.ref}`, "aria-describedby": null },
          el("span", { class: "metric__value", "data-count": "" }, t(m.value, lang)),
          el("span", { class: "metric__label" }, t(m.label, lang)),
          el("span", { class: "metric__more" }, label("metrics.see", lang), icon("arrow", "icon icon--small")),
        ),
      ),
    ),
  );
}

function flowDiagram(steps, lang) {
  const items = [];
  steps.forEach((step, i) => {
    if (i > 0) items.push(el("li", { class: "flow__arrow", "aria-hidden": "true" }, "→"));
    items.push(el("li", { class: `flow__step${i === steps.length - 1 ? " flow__step--end" : ""}` }, t(step, lang)));
  });
  return el("ol", { class: "flow", "aria-label": label("case.flow", lang) }, items);
}

function caseStudy(item, index, lang) {
  const number = String(index + 1).padStart(2, "0");
  return el(
    "article",
    { class: "case reveal", id: item.id, "aria-labelledby": `${item.id}-title` },
    el(
      "header",
      { class: "case__head" },
      el(
        "p",
        { class: "case__meta" },
        el("span", { class: "case__number" }, number),
        el("span", {}, `${label(`kind.${item.kind}`, lang)} · ${item.period}`),
      ),
      el("h3", { class: "case__title", id: `${item.id}-title` }, t(item.title, lang)),
      el("p", { class: "case__context" }, t(item.context, lang)),
    ),
    item.flow ? flowDiagram(item.flow, lang) : null,
    el(
      "dl",
      { class: "case__facts" },
      el("div", {}, el("dt", {}, label("case.context", lang)), el("dd", {}, t(item.problem, lang))),
      el("div", {}, el("dt", {}, label("case.approach", lang)), el("dd", {}, t(item.approach, lang))),
      el(
        "div",
        { class: "case__outcome" },
        el("dt", {}, label("case.outcome", lang)),
        el("dd", {}, t(item.outcome, lang)),
      ),
    ),
    el(
      "footer",
      { class: "case__footer" },
      el(
        "ul",
        { class: "tags", "aria-label": label("case.stack", lang) },
        item.stack.map((s) => el("li", { class: "tag" }, t(s, lang))),
      ),
      item.repo
        ? el("a", { class: "case__link", href: item.repo }, label("case.source", lang), icon("arrow", "icon icon--small"))
        : null,
      item.note ? el("p", { class: "case__note" }, t(item.note, lang)) : null,
    ),
  );
}

function role(item, index, lang) {
  const listId = `role-${index}-points`;
  const extra = item.points.length > VISIBLE_POINTS;
  const points = el(
    "ul",
    { class: `role__points${extra ? " is-collapsed" : ""}`, id: listId },
    item.points.map((p, i) => el("li", { class: i >= VISIBLE_POINTS ? "is-extra" : null }, t(p, lang))),
  );

  let toggle = null;
  if (extra) {
    const text = el("span", {}, label("experience.more", lang));
    toggle = el(
      "button",
      { type: "button", class: "role__toggle", "aria-expanded": "false", "aria-controls": listId },
      text,
      icon("down", "icon icon--small"),
    );
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      points.classList.toggle("is-collapsed", expanded);
      text.textContent = label(expanded ? "experience.more" : "experience.less", lang);
    });
  }

  return el(
    "li",
    { class: "role reveal" },
    el("p", { class: "role__period" }, t(item.period, lang)),
    el(
      "div",
      { class: "role__body" },
      el(
        "h3",
        { class: "role__title" },
        item.role,
        el("span", { class: "role__company" }, item.company),
      ),
      points,
      toggle,
    ),
  );
}

function skillGroup(group, lang) {
  return el(
    "div",
    { class: "skill-card reveal" },
    el("h3", { class: "skill-card__title" }, t(group.group, lang)),
    el(
      "ul",
      { class: "tags" },
      group.items.map((item) => {
        if (typeof item === "string") return el("li", { class: "tag" }, item);
        if (item.level !== "fundamentals") return el("li", { class: "tag" }, t(item.name, lang));
        return el(
          "li",
          { class: "tag tag--fundamentals" },
          t(item.name, lang),
          el("span", { class: "visually-hidden" }, ` (${label("fundamentals", lang)})`),
        );
      }),
    ),
  );
}

function principle(item, lang) {
  return el(
    "li",
    { class: "principle reveal" },
    el("span", { class: "principle__icon" }, icon(item.icon)),
    el("h4", { class: "principle__title" }, t(item.title, lang)),
    el("p", { class: "principle__body" }, t(item.body, lang)),
  );
}

function educationItem(item, lang) {
  return el(
    "li",
    { class: "entry" },
    el("p", { class: "entry__meta" }, t(item.period, lang)),
    el("p", { class: "entry__title" }, t(item.title, lang)),
    el("p", { class: "entry__place" }, t(item.place, lang)),
    item.detail ? el("p", { class: "entry__detail" }, t(item.detail, lang)) : null,
  );
}

function languageList(items, lang) {
  return el(
    "dl",
    { class: "languages" },
    items.map((l) => el("div", {}, el("dt", {}, t(l.name, lang)), el("dd", {}, t(l.level, lang)))),
  );
}

/** Maps a data-render key in index.html to how its data is rendered. */
export const renderers = {
  glance: (data, lang) => glanceList(data, lang),
  metrics: (data, lang) => metricList(data, lang),
  caseStudies: (data, lang) => el("div", { class: "cases" }, data.map((c, i) => caseStudy(c, i, lang))),
  experience: (data, lang) => el("ol", { class: "timeline" }, data.map((r, i) => role(r, i, lang))),
  skills: (data, lang) => el("div", { class: "skills" }, data.map((g) => skillGroup(g, lang))),
  principles: (data, lang) => el("ul", { class: "principles" }, data.map((p) => principle(p, lang))),
  education: (data, lang) => el("ul", { class: "entries" }, data.map((e) => educationItem(e, lang))),
  languages: (data, lang) => languageList(data, lang),
};
