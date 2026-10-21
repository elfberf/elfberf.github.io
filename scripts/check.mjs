#!/usr/bin/env node
/**
 * Static site checks — no dependencies, no build step.
 *
 *   node scripts/check.mjs
 *
 * Verifies content shape, local link integrity, GitHub Pages subpath
 * safety and a few privacy rules. Exits non-zero on any failure.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);
const read = (rel) => readFileSync(join(root, rel), "utf8");

const content = await import(join(root, "assets/js/data.js"));
const { renderers } = await import(join(root, "assets/js/render.js"));
const { strings, LANGUAGES } = await import(join(root, "assets/js/i18n.js"));

/** A localized value is { en, tr } with every language filled in; a plain string is language-neutral. */
function checkText(value, where, { neutralOk = true } = {}) {
  if (typeof value === "string") {
    if (!value.trim()) fail(`${where}: empty text`);
    else if (!neutralOk) fail(`${where}: must be translated ({ ${LANGUAGES.join(", ")} })`);
    return;
  }
  if (!value || typeof value !== "object") return fail(`${where}: missing text`);
  for (const lang of LANGUAGES) {
    if (typeof value[lang] !== "string" || !value[lang].trim()) fail(`${where}: missing "${lang}" translation`);
  }
}

// ---- Content shape ----------------------------------------------------------
const KINDS = new Set(["professional", "academic", "personal"]);
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ids = new Set();

for (const [i, c] of content.caseStudies.entries()) {
  const where = `caseStudies[${i}]${c.id ? ` (${c.id})` : ""}`;
  for (const field of ["id", "period", "kind"]) {
    if (typeof c[field] !== "string" || !c[field].trim()) fail(`${where}: missing "${field}"`);
  }
  for (const field of ["title", "problem", "approach", "outcome"]) checkText(c[field], `${where}.${field}`, { neutralOk: false });
  checkText(c.context, `${where}.context`);
  if (c.note !== null) checkText(c.note, `${where}.note`, { neutralOk: false });
  (c.flow ?? []).forEach((step, j) => checkText(step, `${where}.flow[${j}]`));
  if (!ID.test(c.id ?? "")) fail(`${where}: id must be kebab-case`);
  if (ids.has(c.id)) fail(`${where}: duplicate id`);
  ids.add(c.id);
  if (!KINDS.has(c.kind)) fail(`${where}: kind must be one of ${[...KINDS].join(", ")}`);
  if (!Array.isArray(c.stack) || c.stack.length === 0) fail(`${where}: stack must be a non-empty array`);
  (c.stack ?? []).forEach((s, j) => checkText(s, `${where}.stack[${j}]`));
  if (c.repo !== null && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(c.repo ?? "")) {
    fail(`${where}: repo must be null or a public https://github.com/<owner>/<repo> URL`);
  }
  if (c.kind === "personal" && !c.repo) fail(`${where}: personal projects must link to their public source`);
}

for (const [i, m] of content.metrics.entries()) {
  checkText(m.value, `metrics[${i}].value`);
  checkText(m.label, `metrics[${i}].label`, { neutralOk: false });
  if (!ids.has(m.ref)) fail(`metrics[${i}]: ref "${m.ref}" is not a case study id`);
}

content.glance.forEach((g, i) => {
  checkText(g.label, `glance[${i}].label`, { neutralOk: false });
  checkText(g.value, `glance[${i}].value`);
});

for (const [i, r] of content.experience.entries()) {
  for (const field of ["role", "company"]) checkText(r[field], `experience[${i}].${field}`);
  checkText(r.period, `experience[${i}].period`);
  if (!Array.isArray(r.points) || r.points.length === 0) fail(`experience[${i}]: points must be non-empty`);
  (r.points ?? []).forEach((p, j) => checkText(p, `experience[${i}].points[${j}]`, { neutralOk: false }));
}

for (const [i, g] of content.skills.entries()) {
  checkText(g.group, `skills[${i}].group`);
  for (const item of g.items) {
    if (typeof item === "string") continue;
    if (item?.name === undefined || (item.level !== undefined && item.level !== "fundamentals")) {
      fail(`skills[${i}]: items must be strings or { name, level?: "fundamentals" }`);
    } else checkText(item.name, `skills[${i}].items`);
  }
}

content.principles.forEach((p, i) => {
  checkText(p.title, `principles[${i}].title`, { neutralOk: false });
  checkText(p.body, `principles[${i}].body`, { neutralOk: false });
});
content.education.forEach((e, i) => ["title", "place", "period", "detail"].forEach((f) => checkText(e[f], `education[${i}].${f}`)));
content.languages.forEach((l, i) => ["name", "level"].forEach((f) => checkText(l[f], `languages[${i}].${f}`)));

// ---- Interface strings ---------------------------------------------------------
const keys = new Set(Object.keys(strings.en));
for (const lang of LANGUAGES) {
  const own = new Set(Object.keys(strings[lang] ?? {}));
  for (const key of keys) if (!own.has(key)) fail(`i18n: "${key}" missing in "${lang}"`);
  for (const key of own) if (!keys.has(key)) fail(`i18n: "${key}" in "${lang}" but not in "en"`);
}

// ---- HTML: render slots, anchors, local links --------------------------------
const index = read("index.html");

for (const [, key] of index.matchAll(/data-render="([^"]+)"/g)) {
  if (!renderers[key]) fail(`index.html: no renderer for data-render="${key}"`);
  if (!content[key]) fail(`index.html: no export "${key}" in data.js`);
}

for (const [, key] of index.matchAll(/data-i18n="([^"]+)"/g)) {
  if (!keys.has(key)) fail(`index.html: data-i18n="${key}" has no string in i18n.js`);
}
for (const [, spec] of index.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  for (const pair of spec.split(";")) {
    const key = pair.split(":")[1]?.trim();
    if (!keys.has(key)) fail(`index.html: data-i18n-attr key "${key}" has no string in i18n.js`);
  }
}
const sprite = new Set([...index.matchAll(/<symbol id="i-([^"]+)"/g)].map((m) => m[1]));
for (const [, id] of index.matchAll(/href="#i-([^"]+)"/g)) if (!sprite.has(id)) fail(`index.html: icon #i-${id} missing`);
for (const p of content.principles) if (!sprite.has(p.icon)) fail(`principles: icon "${p.icon}" missing from sprite`);
for (const file of ["assets/js/main.js", "assets/js/assistant.js", "assets/js/render.js"]) {
  for (const [, id] of read(file).matchAll(/icon(?:\(|: )"([a-z-]+)"/g)) {
    if (!sprite.has(id)) fail(`${file}: icon "${id}" missing from sprite`);
  }
}
// Every assistant/command label used in code must exist in i18n.js.
for (const [, key] of read("assets/js/main.js").matchAll(/label\("([\w.]+)"\)/g)) {
  if (!keys.has(key)) fail(`main.js: label "${key}" missing in i18n.js`);
}
for (const [, key] of read("assets/js/assistant.js").matchAll(/L\(["`]([\w.]+)/g)) {
  if (!key.endsWith(".") && !keys.has(`assistant.${key}`)) fail(`assistant.js: "assistant.${key}" missing in i18n.js`);
}

const staticIds = new Set([...index.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const allIds = new Set([...staticIds, ...ids]);
for (const [, frag] of index.matchAll(/href="#([^"]*)"/g)) {
  if (frag.startsWith("i-")) continue;
  if (!allIds.has(frag)) fail(`index.html: anchor #${frag} has no target`);
}
if ((index.match(/<h1[\s>]/g) ?? []).length !== 1) fail("index.html: expected exactly one <h1>");
if (!/<html lang="en">/.test(index)) fail('index.html: <html lang="en"> missing');

function checkLocalRefs(file, html, base = "") {
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    if (attr === "href" && url.startsWith("#")) continue;
    if (file === "index.html" && url.startsWith("/")) {
      fail(`${file}: root-absolute ${attr}="${url}" breaks GitHub Pages project subpaths — use a relative path`);
      continue;
    }
    const path = join(root, base, url.replace(/^\//, "").split(/[?#]/)[0]);
    const target = url.endsWith("/") || url === "./" ? join(path, "index.html") : path;
    if (!existsSync(target)) fail(`${file}: ${attr}="${url}" does not resolve to a file`);
  }
}
checkLocalRefs("index.html", index);
checkLocalRefs("404.html", read("404.html"));

for (const [, url] of index.matchAll(/href="(https?:[^"]+)"/g)) {
  if (url.startsWith("http:")) fail(`index.html: insecure link ${url}`);
}

// ---- Cache-busting stamps (see scripts/bump-version.mjs) ----------------------
{
  const versions = new Set();
  const files = ["index.html", "404.html", ...readdirSync(join(root, "assets/js")).map((f) => `assets/js/${f}`)];
  for (const file of files) {
    const text = read(file);
    for (const [, ref, v] of text.matchAll(/((?:src|href)="(?!https?:|\/\/)[^"]+?\.(?:css|js)|from "\.\/[^"]+?\.js)(?:\?v=([\w.-]+))?"/g)) {
      if (!v) fail(`${file}: ${ref.replace(/^\w+="|^from "/, "")} has no ?v= stamp — run node scripts/bump-version.mjs`);
      else versions.add(v);
    }
  }
  if (versions.size > 1) fail(`Inconsistent ?v= stamps (${[...versions].join(", ")}) — run node scripts/bump-version.mjs`);
}

// ---- Privacy -----------------------------------------------------------------
// SVG path data is full of digit runs; it is not content, so leave it out of the scan.
const published = [
  index.replace(/<svg[\s\S]*?<\/svg>/g, ""),
  ...["data.js", "i18n.js", "actions.js", "assistant.js"].map((f) => read(`assets/js/${f}`)),
].join("\n");
if (/\+?\d[\d\s()-]{9,}\d/.test(published.replace(/\d{4}\s*[–-]\s*\d{4}/g, ""))) {
  fail("Possible phone number in published content — the CV phone number must not be published");
}
if (/(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_)/.test(published)) fail("Possible token in published content");

// ---- Result ------------------------------------------------------------------
if (failures.length) {
  console.error(`✗ ${failures.length} check(s) failed:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log(
  `✓ All checks passed (${content.caseStudies.length} case studies, ${content.experience.length} roles, ` +
    `${allIds.size} anchors, links resolved).`,
);
