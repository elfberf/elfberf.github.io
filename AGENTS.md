# AGENTS.md — working agreement for AI-assisted development

This repository is the personal portfolio of **Elif Berfin Gülbaş**, published with
GitHub Pages. Read this file completely before changing anything.

## 1. What this site is

- Positioning: **Software Engineer — Backend & Enterprise Systems**.
- Audience: recruiters and engineering leads. English only.
- Tone: minimal, precise, factual. No marketing superlatives, no emoji, no
  decorative animation.

## 2. Content policy (non-negotiable)

1. **Every claim must be traceable to the CV.** `docs/CONTENT_SOURCES.md` maps each
   published statement to its CV section. Update that map in the same change as
   any content edit.
2. **Never invent** employers, titles, dates, clients, production deployments,
   metrics, users, awards or performance results. If a number is not in the CV,
   it does not go on the site. Keep the CV's own qualifiers ("approximately",
   "fundamentals", "reported").
3. **New portfolio projects must exist before they are shown.** A `personal`
   case study is added only after its public repository has working code, tests
   and a README. `scripts/check.mjs` enforces that personal projects link to source.
4. **Confidentiality.** Client and employer work is described at the level of the
   CV only. Never publish client code, internal system names, architecture
   diagrams, screenshots, data, ticket numbers or colleague names. Professional
   case studies keep `repo: null` and a confidentiality `note`.
5. **Personal data.** Publish only the email, GitHub and LinkedIn. Never publish
   the phone number, home address, the CV PDF or references.
6. Changes to positioning, personal details or new claims require the owner's
   explicit approval.

## 3. Architecture

Plain HTML5, CSS3 and vanilla ES modules. **No frameworks, no Tailwind, no
package manager, no build step.** The repository root is the published site.

```
index.html            Static shell: <head>/SEO, hero, contact, section slots
404.html              GitHub Pages not-found page
assets/css/main.css   All styles: tokens → base → layout → components → utilities
assets/js/data.js     Content (single source of truth for repeating sections)
assets/js/render.js   Pure render functions, one per data collection
assets/js/main.js     Entry point: fills [data-render] slots, nav state
scripts/check.mjs     Dependency-free checks (content shape, links, privacy)
docs/                 Content source map and supporting docs
```

Rules:

- The hero, contact links and `<head>` metadata are static HTML so they are
  crawlable without JavaScript. Repeating collections live in `data.js`.
- Render with `el()` / `textContent` only. **Never use `innerHTML`** with content.
- **Paths in `index.html` are relative** (`assets/...`, never `/assets/...`) so the
  site works both at `https://<user>.github.io/` and at a project subpath.
  `404.html` is the one exception: it uses `<base href="/">` because GitHub
  Pages serves it at any depth.
- Absolute URLs (canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`,
  `404.html` base) assume `https://elfberf.github.io/`. If the site moves to a
  subpath or custom domain, update all of them together.
- Keep `.nojekyll` so GitHub Pages serves files as-is.
- Colors and spacing come from CSS custom properties in `:root`; dark mode
  overrides the tokens only. Do not hard-code colors in components.

## 4. Extending the site

**Add a case study** — append an object to `caseStudies` in `assets/js/data.js`
following the documented shape (`id`, `title`, `context`, `period`, `kind`,
`problem`, `approach`, `outcome`, `stack`, `repo`, `note`). No HTML changes needed.

**Add a section** —
1. add the data export to `data.js`;
2. add a renderer to the `renderers` map in `render.js`;
3. add `<section class="section container" id="…">` with a
   `<div data-render="<exportName>">` slot to `index.html`, and a nav link;
4. add styles under a new component heading in `main.css`;
5. extend `scripts/check.mjs` if the data has required fields.

## 5. Quality bar

Run before every commit:

```bash
node scripts/check.mjs
```

Then manually verify in a browser (`python3 -m http.server` from the repo root):

- 375 px, 768 px and desktop widths; no horizontal scroll.
- Light and dark color schemes; text contrast ≥ WCAG AA.
- Keyboard: skip link, visible focus, logical tab order; one `<h1>`, ordered headings.
- No console errors. All links resolve.
- Respects `prefers-reduced-motion`.

## 6. Git and GitHub

- Work on a feature branch; open a pull request into `main`. Pages publishes from `main`.
- Never force-push, rewrite published history or commit secrets, `.env` files or PDFs.
- This repository belongs to the `elfberf` account. Do not change global git
  config or other credentials on the machine; repository-local config only.
- Do not modify other repositories.
