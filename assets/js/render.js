/**
 * Pure render helpers: each takes data from data.js and returns a DOM node.
 * Text is always set through textContent (never innerHTML), so content
 * cannot inject markup.
 */

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

const KIND_LABEL = { professional: "Professional", academic: "Academic", personal: "Personal project" };

function caseStudy(item) {
  const facts = el(
    "dl",
    { class: "case__facts" },
    el("div", {}, el("dt", {}, "Context"), el("dd", {}, item.problem)),
    el("div", {}, el("dt", {}, "Approach"), el("dd", {}, item.approach)),
    el("div", {}, el("dt", {}, "Outcome"), el("dd", {}, item.outcome)),
  );

  const footer = el(
    "footer",
    { class: "case__footer" },
    el("ul", { class: "tags", "aria-label": "Technologies" }, item.stack.map((s) => el("li", { class: "tag" }, s))),
    item.repo ? el("a", { class: "case__link", href: item.repo }, "View source") : null,
  );

  return el(
    "article",
    { class: "case", id: item.id, "aria-labelledby": `${item.id}-title` },
    el(
      "header",
      { class: "case__head" },
      el("p", { class: "case__meta" }, `${KIND_LABEL[item.kind] ?? item.kind} · ${item.period}`),
      el("h3", { class: "case__title", id: `${item.id}-title` }, item.title),
      el("p", { class: "case__context" }, item.context),
    ),
    facts,
    item.note ? el("p", { class: "case__note" }, item.note) : null,
    footer,
  );
}

function role(item) {
  return el(
    "article",
    { class: "role" },
    el(
      "header",
      { class: "role__head" },
      el("h3", { class: "role__title" }, item.role, el("span", { class: "role__company" }, ` · ${item.company}`)),
      el("p", { class: "role__period" }, item.period),
    ),
    el("ul", { class: "role__points" }, item.points.map((p) => el("li", {}, p))),
  );
}

function skillGroup(group) {
  return el(
    "div",
    { class: "skill-group" },
    el("h3", { class: "skill-group__title" }, group.group),
    el(
      "ul",
      { class: "tags" },
      group.items.map((item) => {
        if (typeof item === "string") return el("li", { class: "tag" }, item);
        return el(
          "li",
          { class: "tag tag--fundamentals" },
          item.name,
          el("span", { class: "visually-hidden" }, ` (${item.level})`),
        );
      }),
    ),
  );
}

function educationItem(item) {
  return el(
    "div",
    { class: "entry" },
    el("p", { class: "entry__title" }, item.title, el("span", { class: "entry__place" }, ` · ${item.place}`)),
    el("p", { class: "entry__meta" }, item.period),
    item.detail ? el("p", { class: "entry__detail" }, item.detail) : null,
  );
}

function languageList(items) {
  return el(
    "dl",
    { class: "languages" },
    items.map((l) => el("div", {}, el("dt", {}, l.name), el("dd", {}, l.level))),
  );
}

/** Maps a data-render key in index.html to how its data is rendered. */
export const renderers = {
  caseStudies: (data) => el("div", { class: "cases" }, data.map(caseStudy)),
  experience: (data) => el("div", { class: "roles" }, data.map(role)),
  skills: (data) => el("div", { class: "skills" }, data.map(skillGroup)),
  education: (data) => el("div", { class: "entries" }, data.map(educationItem)),
  languages: (data) => languageList(data),
};
