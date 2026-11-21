---
name: run-infinite-engineering
description: Build, run, and drive the Infinite Engineering website (Next.js 16). Use when asked to start or run the site, build it, test it, smoke-test the pages, take a screenshot of a page or section, check mobile layout, try the quote form or the map, or re-render the studio images.
---

Marketing site for Infinite Engineering Service and Technology Pvt. Ltd. (Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, a three.js/R3F scroll film, MapLibre map). Drive it with `.claude/skills/run-infinite-engineering/driver.mjs`: it starts the server if none is running, opens headless Edge/Chrome through `puppeteer-core`, runs your commands, saves screenshots, and stops the server it started.

All paths are relative to the unit root: the folder that holds `package.json` (`infinite-engineering/`).

## Prerequisites

- Node 24 and npm 11 (verified with v24.10.0 / 11.9.0).
- Microsoft Edge or Chrome installed. The driver finds them in the default install paths; otherwise set `BROWSER_PATH`.
- About 1.5 GB of free disk. This machine's C: drive has run completely full once (see Troubleshooting).

## Setup

```bash
npm install
```

No env vars are needed to run. The quote form only sends email when `RESEND_API_KEY` or `WEB3FORMS_KEY` is set in `.env.local` (see `.env.example`).

## Build

```bash
npm run build
```

Stop any running `next start` first (see Gotchas); a running `next dev` is fine, it builds into `.next/dev`. The build takes about 30 s, copies the MapLibre worker into `public/vendor/` in its `prebuild` hook and prerenders 48 static pages (26 of them service pages).

## Run (agent path)

Smoke-test every route. Routes come from `/sitemap.xml`; each one is checked for status 200, exactly one `<h1>`, no console errors or failed requests, and no horizontal overflow at 1440 and 390 px:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs smoke
```

Quote form end to end on `/contact` (mobile). The form has two steps: an empty step-1 submit shows 4 inline errors (name, email, services, consent); a valid submit reaches the server action; if it succeeds, the optional step-2 details form is filled and sent too:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs form
```

Scripted session: pipe commands on stdin, one per line.

```bash
node .claude/skills/run-infinite-engineering/driver.mjs <<'EOF'
viewport desktop
nav /
scroll #proof
eval getComputedStyle(document.querySelector('.band-track')).animationName
click text=Live map
wait-for .maplibregl-canvas
wait 4000
screenshot map-tab
motion reduce
nav /
eval [getComputedStyle(document.querySelector('.band-track')).animationName, getComputedStyle(document.querySelector('.film-stage')).display]
screenshot reduced-home
motion normal
viewport mobile
nav /contact
wait-for form button[type=submit]
overflow
console
EOF
```

The scroll band prints `"band-x"` normally and `["none","none"]` under reduced motion (band static, 3D stage hidden, one still render per chapter instead).

To drive a server someone else already runs (for example the user's `npm run dev` on :3000), attach instead of starting one. Never stop that server:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs --no-serve --port 3000 <<'EOF'
nav /about
text h1
console
EOF
```

Screenshots → `.run/shots/<name>.png`. Server log → `.run/server.log`. **Open the screenshot and look at it** before reporting that a page works.

| command | what it does |
|---|---|
| `nav <path>` | Load a page, print status and title |
| `viewport desktop\|tablet\|mobile\|WxH` | 1440×900, 768×1024, 390×844 (touch), or custom |
| `wait-for <selector>` | Wait for an element. `text=Some text` matches by visible text |
| `click <selector>` | Scroll into view and click. Selector may contain spaces |
| `fill <selector> <text>` | Clear and type. Quote the selector if it contains spaces |
| `press <key>` | Keyboard key, e.g. `Enter`, `ArrowRight` |
| `scroll <selector\|pixels>` | Scroll a section to the top of the viewport |
| `settle` | Scroll through the whole page once so lazy sections mount |
| `wait <ms>` | Fixed pause (map tiles need a few seconds) |
| `motion reduce\|normal` | Emulate `prefers-reduced-motion` (use before `nav`). Reduced motion hides the 3D stage and shows one still render per chapter |
| `text <selector>` | Print an element's text |
| `eval <js>` | Run JS in the page, print the JSON result |
| `overflow` | Report horizontal overflow at the current viewport |
| `status <path>` | HTTP status without the browser |
| `screenshot <name> [full]` | Save PNG; `full` captures the whole page |
| `console` | Print and clear console errors, page errors, failed requests |

Flags: `--port 3100` (default), `--dev` (run `next dev` instead of the production build), `--no-serve` (never start a server).

Section ids on the homepage: the 3D film `#film` with chapters `#top`, `#scan`, `#model`, `#map`; then `#services` (the service atlas: Engineering / Technology toggle, preview panel on ≥1024 px), `#proof` (paper: compare tabs + live map tab, map panel `#gis-demo`), `#work`, `#pilot`, `#faq` (paper), `#quote` (form).

### The 3D film (homepage)

The film is a sticky WebGL stage (`components/three/film/*`) driven by native scroll. Headless Edge renders WebGL in software, so the site normally falls back to the poster frames there. Add `?webgl` to the URL to force the real 3D, and to keep it running however slow it is. Wait for the scan worker and intro, then jump to a chapter with a helper:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs <<'EOF'
viewport desktop
nav /?webgl
wait 8000
eval [window.__filmPoints, window.__frames]
eval (()=>{const go=(id,f)=>{const a=document.getElementById(id);window.scrollTo(0,a.offsetTop+a.offsetHeight*f-innerHeight*0.4)};window.__go=go;go('model',0.35);return 1})()
wait 7000
screenshot film-model
eval (window.__go('map',0.7),1)
wait 9000
screenshot film-map
EOF
```

`window.__filmPoints` is the point count from the worker (181,082 at mid tier); `window.__frames` counts rendered frames. Software WebGL manages only a few frames per second, so give each scroll position 6–9 s before the screenshot.

Explore mode (full-screen orbit view with Scan / Model / Plan and six hotspots) opens from the hero button and closes on Esc; while open, `<html>` has the class `exploring`:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs <<'EOF'
viewport desktop
nav /?webgl
wait 8000
click text=Explore the station in 3D
wait 4000
eval [document.documentElement.classList.contains('exploring'), document.querySelectorAll('[aria-label$=": details"]').length]
click text=Model
wait 5000
click [aria-label$=": details"]
wait 1500
screenshot explore-model
press Escape
wait 800
eval document.documentElement.classList.contains('exploring')
EOF
```

Expect `[true,6]`, then `false` after Esc; the screenshot shows the Revit-style model with the "Pipe rack" card.

### Render studio (dev only)

`/studio?scene=<name>` renders one scene full-screen and sets `document.title` to `ready`. It returns 404 in production, so use `--dev`:

```bash
node .claude/skills/run-infinite-engineering/driver.mjs --dev --port 3200 <<'EOF'
nav /studio?scene=bim-hospital
wait 9000
eval document.title
screenshot studio-hospital
EOF
```

Scenes: `cloud-hero`, `cloud-raw`, `cloud-class`, `bim-station`, `bim-hospital`, `facade`, `map-network`, `map-raw`, `map-hca`, `map-city`.

To regenerate the images in `public/renders/`, keep a dev server on port 3200 in the background and run the capture script with the scenes you want (no arguments means all ten, which takes over ten minutes in software WebGL):

```bash
npx next dev -p 3200
```

```bash
node scripts/capture-studio.mjs bim-hospital facade
```

Stop that dev server afterwards with the PowerShell command under Gotchas, using port 3200.

## Run (human path)

```bash
npx next start -p 3100
```

Open http://localhost:3100. This serves the last `npm run build`; it does not pick up code changes until you rebuild.

## Test

There is no unit-test suite. The checks are lint, types and the driver's smoke test:

```bash
npm run lint
npm run typecheck
```

Both print nothing when they pass. `node scripts/check-placeholders.mjs` lists sample content that still needs real data (16 markers on 2026-11-20: domain, CIN, GSTIN, LinkedIn, WhatsApp, two sample projects, the founder story; expected until the owner supplies them, not a failure).

## Lighthouse

The production server must be the fresh build (stop any old `next start` on 3100 first, or you measure stale HTML):

```bash
npx next start -p 3100
npx -y lighthouse@12 http://localhost:3100/ --chrome-path="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.run/lh-mobile.json --quiet
```

Add `--preset=desktop` for desktop. Measured 2026-11-18: accessibility, best practices and SEO 100 on both; performance about 62 mobile and 68 desktop (simulated slow 4G + 4x CPU).

## Gotchas

- **Stop the server before `npm run build`.** A running `next start`, or a shell whose current directory is inside `.next/`, makes the build fail with `EBUSY: resource busy or locked, rmdir '.next\static\chunks'`.
- **The driver only stops a server it started.** A server started any other way keeps the port. Free it in PowerShell:
  ```powershell
  $c = Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id $c.OwningProcess -Force -Confirm:$false }
  ```
- **A background `npx next start` reports "failed, exit code 127" when its process is killed.** That is the kill, not a crash.
- **`ERROR: The process with PID … could not be terminated`** lines appear when puppeteer closes Edge on Windows. They are harmless.
- **`/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` return 404 locally.** They only exist on Vercel. The driver ignores them.
- **WebGL needs software rendering in headless mode.** The driver passes `--use-angle=swiftshader --enable-unsafe-swiftshader`. Without them the map canvas (and the 3D studio scenes) stay blank.
- **Who gets real 3D is decided in `components/three/film/tier.ts`, after load + idle.** Reduced motion, Save-Data, slower than 4g or no WebGL2 → posters. Touch devices get the light `low` tier only with ≥4 GB memory and ≥6 cores, else posters. The canvas also falls back to posters on a software renderer unless the URL has `?webgl`. So a plain headless screenshot shows posters, which is correct.
- **The map and the homepage form are lazy.** MapLibre loads only when the `Live map` tab is opened; the homepage form loads when it nears the viewport (on `/contact` it renders immediately). `wait-for .maplibregl-canvas` and `wait-for form button[type=submit]` before interacting.
- **Measuring JS: links to `/contact` prefetch its form chunk (~50 KB, zod + the form) in the background.** When you sum `performance` script entries on `/`, subtract chunks not referenced in `.next/server/app/index.html`, or you will over-count the homepage's own JS (187 KB on 2026-11-18).
- **A valid form submit in production without an email key shows "Our form is temporarily unavailable…".** That is the intended fallback, and it proves the server action ran. In dev it logs the request to the server log, shows the success state and the step-2 details form. Running `form --dev` while someone else's `next dev` is up fails with "Another next dev server is already running"; use `form --no-serve --port 3000` against theirs instead.
- **Frosted glass stalls headless rendering.** Stacked `backdrop-filter` blurs make software rendering hang (screenshots time out). `driver.mjs form` adds the `no-blur` class first; do the same with `eval document.documentElement.classList.add('no-blur')` in your own form scripts. Phones (`pointer: coarse`) never get blur anyway.
- **The floating mobile dock covers buttons at the bottom edge.** Scroll a button to the centre before clicking it (`click` does; raw puppeteer `page.click` may hit the dock instead).
- **The quote action allows 8 requests per IP per hour (in memory).** Repeated form runs against one dev server end in "Too many requests"; restart that server to reset.
- **The form drops anything submitted within 3 seconds of mounting** (spam time-trap) and silently "accepts" it. Wait 3.2 s before submitting, as `driver.mjs form` does.
- **Do not use Edge's own `--headless --screenshot --window-size=390,…` for mobile shots.** The window cannot go below about 500 px, so the page looks cut off on the right. The driver's `viewport mobile` emulates the width properly.
- **A headless screenshot of the 2D-canvas `facade` studio scene can come out blank** under the swiftshader flags. `scripts/capture-studio.mjs` reads that canvas with `toDataURL` instead.
- **`text h1` prints headings twice** ("…one team.…one team."). Kinetic headings render an `sr-only` copy plus the split, animated words. That is intended.
- **Hover previews: focus the row instead.** The driver has no hover command. The atlas swaps its preview on focus too: `eval (document.querySelector('#services a[href="/services/cyber-security"]').focus(), 1)`.
- **`Section` must not use `overflow-hidden`.** It makes every section a scroll container, which silently breaks `position: sticky` inside it (atlas preview, FAQ heading). It uses `overflow-clip`.
- **The mobile menu button can report "Node is either not clickable"** under the floating header. Open it with `eval (document.querySelector('[aria-label="Open menu"]').click(), 1)`.
- **A temporary route added under `next dev` leaves stale types in `.next/dev/types`.** After deleting the route, `npm run build` fails with `Cannot find module '../../../app/<route>/page.js'`; delete `.next/dev/types` and rebuild.
- **This is Next.js 16 with Cache Components.** `export const dynamicParams` is a build error, and `next/dynamic` with `ssr: false` must live in a client component. Read `node_modules/next/dist/docs/` before changing routing or caching code.

## Troubleshooting

- **`npm error code ENOSPC` / "Disk full … 0 MB free"**: the C: drive is full. `npm cache clean --force` freed about 7 GB here. Ask the user before deleting anything else.
- **`Could not create a project called "Infinite" because of npm naming restrictions`**: npm rejects capital letters, which is why the project lives in the lowercase `infinite-engineering/` subfolder.
- **`Type '"/services/[slug]"' does not satisfy the constraint '"/"'` from `tsc`**: route types are stale after adding a route. Run `npx next typegen`, then `npm run typecheck`.
- **Map area is blank and the console says `Worker failed to load`**: `public/vendor/maplibre-gl-worker.mjs` is missing. Run `node scripts/copy-maplibre-worker.mjs` (the `predev`/`prebuild` hooks and `driver.mjs --dev` do this for you).
- **`Error: listen EADDRINUSE: address already in use :::3200`**: an earlier `next dev` is still running. Killing only its parent process leaves a child holding the port on Windows. Free the port with the PowerShell command under Gotchas (the driver avoids this by killing the whole process tree with `taskkill /T`).
- **`Nothing is listening on http://localhost:3000 and --no-serve was given` although the dev server is up**: older copies of the driver gave the probe 2.5 s, and a cold `next dev` takes longer to compile `/`. The probe now waits 30 s (a free port still fails instantly).
- **`driver error: No production build found`**: run `npm run build`, or pass `--dev`.
- **`ConnectionClosedError: Connection closed` in the capture script**: headless Edge ran out of memory after several WebGL scenes in one browser. The script now launches a fresh browser per scene; re-run only the scenes that failed.
