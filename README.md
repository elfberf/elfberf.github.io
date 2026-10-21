# elfberf.github.io

Personal portfolio of **Elif Berfin Gülbaş** — Software Engineer, Backend & Enterprise Systems.

Live: <https://elfberf.github.io/>

Plain HTML, CSS and vanilla JavaScript. No framework, no dependencies, no build step:
the repository root is the published site.

Features: English/Turkish, light/dark themes, a scripted message assistant that
answers from the CV and composes an email in the visitor's own mail client, a
command menu (⌘K / Ctrl+K), Ankara local time, vCard download, share button and a
print-ready résumé view.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. (Opening `index.html` directly from disk does not
work because the page uses ES modules.)

## Check

```bash
node scripts/bump-version.mjs   # after changing CSS/JS: refresh the ?v= cache-busting stamps
node scripts/check.mjs
```

Validates content shape, local links and anchors, GitHub Pages subpath safety
and basic privacy rules. A GitHub Actions workflow runs the same check on every
push and pull request.

## Edit content

Content lives in [`assets/js/data.js`](assets/js/data.js), written in both languages
as `{ en, tr }`. Interface labels are in [`assets/js/i18n.js`](assets/js/i18n.js). The
hero heading, contact details and SEO metadata are in [`index.html`](index.html).
Link to a specific language with `?lang=tr` or `?lang=en`. Every claim must trace to the CV —
see [`docs/CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md) and
[`AGENTS.md`](AGENTS.md).

## Social image

`assets/img/og.png` (1200×630) is rendered from `scripts/og.html`, and
`assets/img/apple-touch-icon.png` from `scripts/icon.html`, with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --virtual-time-budget=6000 --window-size=1200,630 --screenshot="$PWD/assets/img/og.png" "file://$PWD/scripts/og.html"
```

## Deploy

GitHub Pages → *Deploy from a branch* → `main` / `(root)`. Changes merged into
`main` are published within a minute or two.
