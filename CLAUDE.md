# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Gabriele Matini's personal/portfolio website — a static [Jekyll](https://jekyllrb.com/) 4.4 site (theme: `minima`, plugin: `jekyll-feed`) deployed to GitHub Pages at `kev187038.github.io`. Styling is [Tailwind CSS](https://tailwindcss.com/) loaded via CDN and configured inline in `_layouts/base.html`, with a dark/light theme toggle. No backend, no test suite, no build pipeline beyond Jekyll. See `README.md` for the local-run variants and the list of easter eggs.

## Commands

```bash
bundle install                 # install gems (first time)
bundle exec jekyll serve       # local dev server at http://localhost:4000, watches + rebuilds on save
bundle exec jekyll build       # one-off build into _site/
```

There is no linter and no tests.

## Critical: `_site/` is committed

Unlike a normal Jekyll project, the build output in `_site/` is **checked into git** and is what GitHub Pages serves. A `jekyll serve --watch` process is typically running during sessions and mirrors source changes into `_site/` within seconds (including newly added `assets/` files).

- **Edit source files only** — `_layouts/`, `assets/`, `*.markdown`, `_config.yml`. Never hand-edit `_site/`; the watcher overwrites it.
- After a source edit, verify the watcher is live (`ls -la _site/<changed-file>`). If it isn't running, regenerate with `bundle exec jekyll build` so the committed output stays in sync — a stale `_site/` ships broken content to production.

## Architecture

Each top-level page is a thin `*.markdown` stub whose front matter selects a layout in `_layouts/`; nearly all markup lives in the layout, not the markdown:

- `index.markdown` → `default.html` (home)
- `portfolio.markdown` → `portfolio.html`
- `products.markdown` → `products.html`
- `services.markdown` → `services.html`
- `GrassHopper-terms-and-conditions.markdown` → `legal-document.html`
- `about.markdown` → `page.html` (the repo's own layout, not minima's built-in `page`)

**All of those page layouts inherit `_layouts/base.html`** (via `layout: base` in their own front matter). `base.html` is the shared shell: the single `<head>`, the dark-mode bootstrap script + Tailwind CDN (`cdn.tailwindcss.com`) with an inline `tailwind.config` (brand palette, `darkMode: "class"`), the global `effects.css` / `quirks.css` links, the `{% include site-nav.html %}` / `{% include site-footer.html %}` partials (in `_includes/`), and the global `effects.js` / `site.js` scripts. **To change something site-wide (a meta tag, the nav/footer, a shared script), edit `base.html` or the includes — not each layout.** Content like portfolio entries, client cards, and product details (prices, descriptions, Gumroad links) is hardcoded directly in the page-layout HTML.

Styling is Tailwind utility classes written inline in the layouts; brand colors and dark mode live in `base.html`'s `tailwind.config`. Hand-written CSS is limited to two files loaded globally by `base.html`: `assets/effects.css` (animations/scroll reveals) and `assets/quirks.css` (terminal/modal/easter-egg styling). The theme toggle persists to `localStorage` (`theme` key); the inline script in `base.html` applies it before paint and `site.js` wires the toggle button.

JS in `assets/js/` is vanilla and progressive-enhancement only. `effects.js` (scroll reveals / tilt / spotlight) and `site.js` (theme toggle, nav) load globally from `base.html`; `contact-dialog.js`, `easter-eggs.js`, `the-truest-equality.js`, `languages-hello-world.js`, and `portfolio.js` are loaded by the specific layouts/includes that need them. Markup opts into effects via `data-*` attributes (`data-reveal`, `data-page` from the `page_id` front matter, `class="spotlight tilt-card magnetic"`).

**Legacy / unreferenced files:** `assets/home.css`, `portfolio.css`, `products.css`, `services.css`, `legal.css`, and `assets/js/counters.js` exist but are not linked by any layout or include — they are leftovers from the pre-Tailwind site. Editing them has no effect; confirm a file is actually referenced (`grep -r <name> _layouts/ _includes/`) before touching it.

`_config.yml` `url` is set to `http://localhost:4000` for local dev — note this when reasoning about absolute URLs or the generated `feed.xml`.

## Note: nested `kev187038.github.io/` directory

There is an untracked nested clone of this repo at `./kev187038.github.io/` (its own `.git`). It is not part of this project's tree — ignore it; do not edit files there.
