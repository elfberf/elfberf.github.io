# elfberf.github.io

Personal portfolio of **Elif Berfin Gülbaş** — Software Engineer, Backend & Enterprise Systems.

Live: <https://elfberf.github.io/>

Plain HTML, CSS and vanilla JavaScript. No framework, no dependencies, no build step:
the repository root is the published site.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. (Opening `index.html` directly from disk does not
work because the page uses ES modules.)

## Check

```bash
node scripts/check.mjs
```

Validates content shape, local links and anchors, GitHub Pages subpath safety
and basic privacy rules. A GitHub Actions workflow runs the same check on every
push and pull request.

## Edit content

Repeating sections (case studies, experience, skills, education, languages) live
in [`assets/js/data.js`](assets/js/data.js). The hero, contact details and SEO
metadata are in [`index.html`](index.html). Every claim must trace to the CV —
see [`docs/CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md) and
[`AGENTS.md`](AGENTS.md).

## Deploy

GitHub Pages → *Deploy from a branch* → `main` / `(root)`. Changes merged into
`main` are published within a minute or two.
