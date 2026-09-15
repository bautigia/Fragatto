---
name: run-fragatto
description: Build, run, and drive the Fragatto Next.js site. Use when asked to start the site, take a screenshot of it, see how a page looks, check a UI change, or interact with it as a real visitor would (scroll, click, fill the cart).
---

Fragatto is a Next.js (App Router) site with no test suite of its own -
"does it work" means "does it render correctly in a browser." Drive it
via `.claude/skills/run-fragatto/driver.mjs`, a headless-Chromium REPL
(Playwright) with its own local `node_modules`, separate from the
site's own dependencies. All paths below are relative to the repo root
(`fragatto/`).

## Prerequisites

None beyond Node - this host already has a Playwright Chromium cached
(`~/Library/Caches/ms-playwright`). If a fresh host has none, the first
`npm install` below pulls Playwright and it auto-downloads Chromium.

## Setup (one-time)

```bash
cd .claude/skills/run-fragatto && npm install
```

Installs Playwright into `.claude/skills/run-fragatto/node_modules` -
it never touches the site's own `package.json`.

## Run (agent path)

1. Start the dev server from the repo root and wait for it to actually
   serve (macOS has no `timeout` builtin - poll instead):

   ```bash
   lsof -ti:3000 -sTCP:LISTEN | xargs -r kill   # free the port if a stale server is running
   nohup npm run dev > /tmp/fragatto-dev.log 2>&1 & disown
   bash -c 'until curl -sf http://localhost:3000 >/dev/null 2>&1; do sleep 1; done'
   ```

2. Drive it by piping commands to the REPL over stdin (tmux is not
   installed on this host, so this heredoc path is the verified one -
   the driver queues piped lines and runs them strictly in order, even
   though they all arrive before `launch` resolves):

   ```bash
   node .claude/skills/run-fragatto/driver.mjs <<'EOF'
   launch
   all
   errors
   quit
   EOF
   ```

   `all` is the one-shot "see the site like a client" command: it
   visits every public route (`/`, `/catalogo`, `/nosotros`,
   `/contacto`) and full-page-screenshots each one, handling the
   scroll-reveal gotcha below automatically.

3. Stop the dev server when done:

   ```bash
   lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
   ```

Screenshots land in `.claude/skills/run-fragatto/screenshots/`
(override with `SCREENSHOT_DIR`). Base URL defaults to
`http://localhost:3000` (override with `BASE_URL`).

### Commands

| command | what it does |
|---|---|
| `launch` | start headless Chromium, open a page, start collecting console/page errors |
| `nav <path>` | go to `BASE_URL + path` (e.g. `nav /catalogo`), wait for network idle |
| `scroll <y>` | scroll to a pixel offset, wait for the `ScrubHero` rAF/lerp to settle |
| `ss [name]` | screenshot of exactly what's in the viewport right now |
| `shot-full [name]` | walk the page down in viewport-sized steps (triggers every `RevealOnScroll` element), scroll back to top, then full-page screenshot - use this instead of a naive `screenshot({fullPage:true})` |
| `all` | `nav` + `shot-full` for every public route: home, catálogo, nosotros, contacto |
| `click <css-sel>` | click via Playwright's normal click |
| `click-text <text>` | click the first element containing this text |
| `fill <css-sel> <text...>` | fill a form field |
| `type <text>` / `press <key>` | keyboard input |
| `wait <css-sel>` | wait up to 10s for a selector |
| `eval <js>` | evaluate an expression in the page, print JSON |
| `text [css-sel]` | print `innerText` (whole `body` if no selector) |
| `errors` | print collected console/page errors so far |
| `quit` | close the browser, exit |

For interactive step-by-step driving (not a fixed script), run
`node .claude/skills/run-fragatto/driver.mjs` directly in a foreground
terminal and type commands one at a time - the prompt is `driver> `.

## Run (human path)

```bash
npm run dev   # opens on http://localhost:3000, Ctrl-C to stop
```

## Gotchas

- **Content below the first screen renders at `opacity:0` until you
  scroll.** Every content section past the hero (pilares, "¿Qué es un
  decant?", catálogo cards past the first row, etc.) uses
  `RevealOnScroll`, a fade-in gated by `IntersectionObserver`. A plain
  `page.screenshot({ fullPage: true })` taken right after `goto()`
  captures those elements before they've ever entered the (real,
  900px-tall) viewport, so they're invisible - not a site bug, just an
  un-scrolled page. `shot-full`/`all` fix this by scrolling down in
  700px steps first, same as a real visitor, then capturing.
- **The home page's hero is ~2600px tall on purpose.** `ScrubHero.js`
  implements scroll-scrubbing (crossfade + zoom + text bands driven by
  scroll position) over a `260vh` spacer. In a full-page screenshot
  this shows as a large area below the initial hero frame with no
  visible content until the next section starts - that's the scroll
  "track" for the effect, not a rendering failure. Use `scroll <y>` +
  `ss` to inspect specific bands of the hero if you need to verify the
  crossfade itself.
- **tmux isn't installed on this host.** The driver is built to be
  driven by piping a full script over stdin instead (see Run above) -
  it queues incoming lines and drains them one at a time even though
  Node's `readline` fires all the `line` events before the first
  `async` command resolves. If a future host does have tmux, the usual
  `send-keys`/`capture-pane` wrapping around the same `node driver.mjs`
  invocation works too.

## Troubleshooting

- **`curl` never succeeds / port already in use**: a previous dev
  server is still bound to 3000. `lsof -ti:3000 -sTCP:LISTEN | xargs -r
  kill`, then start again.
- **`Cannot find package 'playwright'`**: the one-time `npm install`
  in `.claude/skills/run-fragatto/` was skipped - run it.
