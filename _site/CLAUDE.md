# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Gabriele Matini's personal/portfolio website — a static [Jekyll](https://jekyllrb.com/) 4.4 site (theme: `minima`, plugin: `jekyll-feed`) deployed to GitHub Pages at `kev187038.github.io`. Pure content + bespoke CSS/JS; no backend, no test suite, no build pipeline beyond Jekyll.

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

Each top-level page is a thin `*.markdown` stub whose front matter selects a custom layout in `_layouts/`; nearly all markup lives in the layout, not the markdown:

- `index.markdown` → `default.html` (home)
- `portfolio.markdown` → `portfolio.html`
- `products.markdown` → `products.html`
- `services.markdown` → `services.html`
- `GrassHopper-terms-and-conditions.markdown` → `legal-document.html`
- `about.markdown` uses minima's built-in `page` layout.

Layouts are standalone full HTML documents (each declares its own `<head>` and stylesheet set) rather than inheriting from a base — to change something site-wide (e.g. a meta tag or shared script), edit each layout. Content like portfolio entries, client cards, and product details (prices, descriptions, Gumroad links) is hardcoded directly in the layout HTML.

CSS and JS are per-page, loaded explicitly by each layout from `assets/` (e.g. `home.css`, `portfolio.css`, `products.css`, plus shared `effects.css`). JS in `assets/js/` is vanilla and progressive-enhancement only — scroll reveals/tilt/spotlight effects (`effects.js`), animated counters (`counters.js`), the contact dialog (`contact-dialog.js`), and easter eggs (`easter-eggs.js`, `the-truest-equality.js`, `languages-hello-world.js`). Markup opts into effects via `data-*` attributes (`data-reveal`, `data-page`, `class="spotlight tilt-card magnetic"`).

`_config.yml` `url` is set to `http://localhost:4000` for local dev — note this when reasoning about absolute URLs or the generated `feed.xml`.

## Note: nested `kev187038.github.io/` directory

There is an untracked nested clone of this repo at `./kev187038.github.io/` (its own `.git`). It is not part of this project's tree — ignore it; do not edit files there.
