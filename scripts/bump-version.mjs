#!/usr/bin/env node
/**
 * Stamps every local stylesheet, script and module import with ?v=<version> so a
 * new deploy never mixes fresh HTML with a browser-cached old CSS/JS
 * (GitHub Pages lets browsers cache assets for 10 minutes).
 *
 *   node scripts/bump-version.mjs            # version = current UTC time, e.g. 20261021-1530
 *   node scripts/bump-version.mjs 2026.10.1  # explicit version
 *
 * Run before committing any change to CSS or JS. scripts/check.mjs fails if the
 * stamps are missing or inconsistent.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const now = new Date().toISOString();
const version = process.argv[2] ?? `${now.slice(0, 10).replace(/-/g, "")}-${now.slice(11, 16).replace(":", "")}`;
if (!/^[\w.-]+$/.test(version)) throw new Error(`Invalid version "${version}"`);

const files = ["index.html", "404.html", ...readdirSync(join(root, "assets/js")).map((f) => `assets/js/${f}`)];
// Relative .css/.js references in src/href attributes and in import statements.
const pattern = /((?:src|href)="(?!https?:|\/\/)[^"]+?\.(?:css|js)|from "\.\/[^"]+?\.js)(\?v=[\w.-]+)?"/g;

let changed = 0;
for (const file of files) {
  const path = join(root, file);
  const before = readFileSync(path, "utf8");
  const after = before.replace(pattern, (_, ref) => `${ref}?v=${version}"`);
  if (after !== before) {
    writeFileSync(path, after);
    changed++;
  }
}
console.log(`Stamped assets with ?v=${version} (${changed} file(s) updated).`);
