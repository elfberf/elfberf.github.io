#!/usr/bin/env node
/**
 * Static site checks — no dependencies, no build step.
 *
 *   node scripts/check.mjs
 *
 * Verifies content shape, local link integrity, GitHub Pages subpath
 * safety and a few privacy rules. Exits non-zero on any failure.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);
const read = (rel) => readFileSync(join(root, rel), "utf8");

const content = await import(join(root, "assets/js/data.js"));
const { renderers } = await import(join(root, "assets/js/render.js"));

// ---- Content shape ----------------------------------------------------------
const KINDS = new Set(["professional", "academic", "personal"]);
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ids = new Set();

for (const [i, c] of content.caseStudies.entries()) {
  const where = `caseStudies[${i}]${c.id ? ` (${c.id})` : ""}`;
  for (const field of ["id", "title", "context", "period", "kind", "problem", "approach", "outcome"]) {
    if (typeof c[field] !== "string" || !c[field].trim()) fail(`${where}: missing "${field}"`);
  }
  if (!ID.test(c.id ?? "")) fail(`${where}: id must be kebab-case`);
  if (ids.has(c.id)) fail(`${where}: duplicate id`);
  ids.add(c.id);
  if (!KINDS.has(c.kind)) fail(`${where}: kind must be one of ${[...KINDS].join(", ")}`);
  if (!Array.isArray(c.stack) || c.stack.length === 0) fail(`${where}: stack must be a non-empty array`);
  if (c.repo !== null && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(c.repo ?? "")) {
    fail(`${where}: repo must be null or a public https://github.com/<owner>/<repo> URL`);
  }
  if (c.kind === "personal" && !c.repo) fail(`${where}: personal projects must link to their public source`);
}

for (const [i, r] of content.experience.entries()) {
  for (const field of ["role", "company", "period"]) {
    if (typeof r[field] !== "string" || !r[field].trim()) fail(`experience[${i}]: missing "${field}"`);
  }
  if (!Array.isArray(r.points) || r.points.length === 0) fail(`experience[${i}]: points must be non-empty`);
}

for (const [i, g] of content.skills.entries()) {
  for (const item of g.items) {
    const ok = typeof item === "string" || (typeof item?.name === "string" && item.level === "fundamentals");
    if (!ok) fail(`skills[${i}]: items must be strings or { name, level: "fundamentals" }`);
  }
}

// ---- HTML: render slots, anchors, local links --------------------------------
const index = read("index.html");

for (const [, key] of index.matchAll(/data-render="([^"]+)"/g)) {
  if (!renderers[key]) fail(`index.html: no renderer for data-render="${key}"`);
  if (!content[key]) fail(`index.html: no export "${key}" in data.js`);
}

const staticIds = new Set([...index.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const allIds = new Set([...staticIds, ...ids]);
for (const [, frag] of index.matchAll(/href="#([^"]*)"/g)) {
  if (!allIds.has(frag)) fail(`index.html: anchor #${frag} has no target`);
}
if ((index.match(/<h1[\s>]/g) ?? []).length !== 1) fail("index.html: expected exactly one <h1>");
if (!/<html lang="en">/.test(index)) fail('index.html: <html lang="en"> missing');

function checkLocalRefs(file, html, base = "") {
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
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

// ---- Privacy -----------------------------------------------------------------
const published = [index, read("assets/js/data.js")].join("\n");
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
