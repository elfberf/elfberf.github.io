# AGENTS.md — working agreement for AI-assisted development

This repository is the personal portfolio of **Elif Berfin Gülbaş**, published with
GitHub Pages. Read this file completely before changing anything.

## 1. What this site is

- Positioning: **Software Engineer — Backend & Enterprise Systems**.
- Audience: recruiters and engineering leads. **Bilingual: English (default) and Turkish.**
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
5. **Both languages say the same thing.** Turkish text follows the Turkish CV
   wording; English is a faithful translation. Never add a claim in one
   language only.
6. **Personal data.** Publish only the email, GitHub and LinkedIn. Never publish
   the phone number, home address, the CV PDF or references.
7. Changes to positioning, personal details or new claims require the owner's
   explicit approval.

## 3. Architecture

Plain HTML5, CSS3 and vanilla ES modules. **No frameworks, no Tailwind, no
package manager, no build step.** The repository root is the published site.
The only external resource is Google Fonts (Geist, Geist Mono, Instrument Serif);
system fonts are the fallback.

```
index.html            Static shell: <head>/SEO, icon sprite, header, hero, section slots, contact
404.html              GitHub Pages not-found page
manifest.webmanifest  Name, colors and icons for "add to home screen"
assets/css/main.css   All styles: tokens → base → layout → header → hero → components → motion → print
assets/js/data.js     Content, bilingual ({ en, tr }) — single source of truth for rendered sections
assets/js/i18n.js     Interface strings per language + t() resolver
assets/js/render.js   Pure render functions, one per data collection (take data + language)
assets/js/ui.js       Theme, language preference, menu, nav state, copy, print, progress, reveal
assets/js/main.js     Entry point: translate static text, render slots, wire up ui.js
assets/img/           favicon.svg, apple-touch-icon.png, og.png (social preview)
scripts/check.mjs     Dependency-free checks (content shape, translations, links, privacy)
scripts/og.html       Source for og.png; scripts/icon.html → apple-touch-icon.png
docs/                 Content source map
```

Rules:

- The hero heading and `<head>` metadata are static HTML so they are crawlable
  without JavaScript. Static text carries `data-i18n="key"` (or
  `data-i18n-attr="attr:key"`); its English text in the HTML must match
  `strings.en[key]`.
- Localized content is `{ en, tr }`; plain strings are language-neutral
  (technology and company names). Every key/field needs both languages.
- Language order: `?lang=` → saved choice → browser language → English.
  Theme: saved choice → system preference. Storage access is always wrapped in
  `try/catch`; the site works without it.
- Render with `el()` / text nodes only. **Never use `innerHTML`** with content.
- Enhancements are optional: content must be readable with JavaScript failing
  after load. Reveal-on-scroll has a CSS fallback and is off for
  `prefers-reduced-motion`. No decorative animation beyond fades, count-up and
  hover states.
- **Paths in `index.html` are relative** (`assets/...`, never `/assets/...`) so the
  site works both at `https://<user>.github.io/` and at a project subpath.
  `404.html` is the one exception: it uses `<base href="/">` because GitHub
  Pages serves it at any depth.
- Absolute URLs (canonical, hreflang, Open Graph, JSON-LD, `robots.txt`,
  `sitemap.xml`, `404.html` base) assume `https://elfberf.github.io/`. If the site
  moves to a subpath or custom domain, update all of them together.
- Keep `.nojekyll` so GitHub Pages serves files as-is.
- Colors and spacing come from CSS custom properties in `:root`. Dark tokens are
  defined twice (system preference and `[data-theme="dark"]`) — keep them in sync.
  Do not hard-code colors in components.
- Icons live in the SVG sprite at the top of `index.html` (`#i-<name>`).

## 4. Extending the site

**Add a case study** — append an object to `caseStudies` in `assets/js/data.js`
following the documented shape (`id`, `title`, `context`, `period`, `kind`,
`problem`, `approach`, `outcome`, `flow`, `stack`, `repo`, `note`), in both
languages. No HTML changes needed. Add a `metrics` entry only for a number the
CV states.

**Add a section** —
1. add the data export to `data.js`;
2. add a renderer to the `renderers` map in `render.js`;
3. add `<section class="section" id="…">` with a `<div data-render="<exportName>">`
   slot to `index.html`, plus a nav link with a `data-i18n` key;
4. add the interface strings to **every** language in `i18n.js`;
5. add styles under a new component heading in `main.css`;
6. extend `scripts/check.mjs` if the data has required fields.

**Add a language** — add its code to `LANGUAGES`, a full `strings.<code>` block,
the field in every `{ en, tr }` value, and a button in `.lang-switch`.

## 5. Quality bar

Run before every commit:

```bash
node scripts/check.mjs
```

Then manually verify in a browser (`python3 -m http.server` from the repo root):

- 375 px, 768 px and desktop widths; no horizontal scroll; mobile menu opens,
  closes on link tap and Escape.
- English and Turkish; light and dark (system and toggle); text contrast ≥ WCAG AA.
- Print preview ("Save as PDF") gives a clean one-column résumé.
- Keyboard: skip link, visible focus, logical tab order; one `<h1>`, ordered headings.
- No console errors. All links resolve.
- Respects `prefers-reduced-motion`.

## 6. Git and GitHub

- Work on a feature branch; open a pull request into `main`. Pages publishes from `main`.
- Never force-push, rewrite published history or commit secrets, `.env` files or PDFs.
- This repository belongs to the `elfberf` account. Do not change global git
  config or other credentials on the machine; repository-local config only.
- Do not modify other repositories.
