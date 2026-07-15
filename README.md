# kev187038.github.io

Gabriele Matini's personal website, a static [Jekyll](https://jekyllrb.com/) site styled with [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN), with a dark/light theme toggle and a set of interactive easter eggs. Deployed to GitHub Pages.

## Run it locally

**Prerequisites:** Ruby + Bundler (Jekyll 4.4 is used).

```bash
# 1. Install dependencies (first time only)
bundle install

# 2. Start the dev server
bundle exec jekyll serve
```

Then open <http://localhost:4000/>.

`jekyll serve` watches the source files and rebuilds automatically on save, just refresh the browser. Stop the server with `Ctrl-C`.

Useful variants:

```bash
bundle exec jekyll serve --livereload   # auto-refresh the browser on change
bundle exec jekyll serve --port 4001    # use a different port
bundle exec jekyll build                # one-off build into _site/ (no server)
```

There is no test suite or linter.

## Project structure

```
_layouts/        Page templates (base.html is the shared shell; default.html is the home page)
_includes/       Shared nav + footer partials
_config.yml      Site settings (title, social usernames, email, exclude list)
assets/css       Hand-written CSS: effects.css (animations) + quirks.css (terminal/modal styling)
assets/js        Vanilla JS, theme toggle, contact dialog, and the easter eggs
*.markdown       Thin page stubs that select a layout (index, about, portfolio, services, products, legal)
_site/           Generated output (see note below)
```

The visual style comes from Tailwind utility classes written directly in the layouts, configured inline in `_layouts/base.html`. Page content (portfolio entries, testimonials, product details) is hardcoded in the layouts.

### Easter eggs

- Click the `Gabriele Matini ===` heading on the home page.
- Konami code on the home page: `↑ ↑ ↓ ↓ ← → ← → B A`.
- Click any language under "Languages I Code In" for a draggable hello-world terminal.
- Click the "My Passions" heading 7× within 5 seconds.

## Note: `_site/` is committed

Unlike a typical Jekyll project, the built output in `_site/` is checked into git and is what GitHub Pages serves. **Edit the source files only** (`_layouts/`, `assets/`, `*.markdown`, `_config.yml`), never hand-edit `_site/`. `jekyll serve`/`build` regenerates it; commit the regenerated `_site/` along with your source changes so the deployed site stays in sync.

> A separate clone may live in a nested `kev187038.github.io/` directory; it is excluded from the build via `_config.yml` and is not part of this site.
