#!/usr/bin/env node
// Driver for the Infinite Engineering site: starts the Next.js server if needed,
// drives the pages in headless Edge/Chrome (puppeteer-core) and saves screenshots.
//
//   node .claude/skills/run-infinite-engineering/driver.mjs smoke          # all routes: status, console errors, overflow
//   node .claude/skills/run-infinite-engineering/driver.mjs form           # quote-form flow end to end
//   node .claude/skills/run-infinite-engineering/driver.mjs <<'EOF'        # scripted session (commands below)
//   nav /
//   screenshot home
//   EOF
//
// Flags: --port 3100  --dev (next dev instead of next start; needed for /studio)
//        --no-serve (never start a server; fail if nothing is listening)
// Run from the unit root (the folder with package.json).
import { spawn, spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, def) => (argv.includes(`--${name}`) ? argv[argv.indexOf(`--${name}`) + 1] : def);
const PORT = opt("port", "3100");
const BASE = `http://localhost:${PORT}`;
const DEV = flag("dev");
const mode = argv.find((a) => ["smoke", "form"].includes(a)) ?? "script";

const ROOT = process.cwd();
const RUN = join(ROOT, ".run");
const SHOTS = join(RUN, "shots");
mkdirSync(SHOTS, { recursive: true });

if (!existsSync(join(ROOT, "package.json")) || !existsSync(join(ROOT, "node_modules", "next"))) {
  console.error("Run this from the unit root after `npm install` (package.json / node_modules/next not found).");
  process.exit(2);
}

const BROWSER =
  process.env.BROWSER_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find((p) => existsSync(p));
if (!BROWSER) {
  console.error("No Chrome/Edge found. Set BROWSER_PATH to a Chromium-based browser executable.");
  process.exit(2);
}

/* ── Server ──────────────────────────────────────────────────── */
const up = async () => {
  try {
    // A free port refuses instantly; a cold `next dev` can take 10 s+ to compile `/`.
    await fetch(BASE, { signal: AbortSignal.timeout(30000) });
    return true;
  } catch {
    return false;
  }
};

let server = null;
async function ensureServer() {
  if (await up()) return console.log(`server: already listening on ${BASE}`);
  if (flag("no-serve")) throw new Error(`Nothing is listening on ${BASE} and --no-serve was given.`);
  if (!DEV && !existsSync(join(ROOT, ".next", "BUILD_ID"))) throw new Error("No production build found. Run `npm run build` first (or pass --dev).");
  if (DEV) {
    // `npm run dev` does this in its predev hook; we spawn next directly, so do it here.
    const copy = spawn(process.execPath, ["scripts/copy-maplibre-worker.mjs"], { cwd: ROOT, stdio: "ignore" });
    await new Promise((r) => copy.on("exit", r));
  }
  const log = openSync(join(RUN, "server.log"), "w");
  // Spawn node directly (no npm/npx wrapper) so killing the child really frees the port on Windows.
  server = spawn(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), DEV ? "dev" : "start", "-p", PORT], {
    cwd: ROOT,
    stdio: ["ignore", log, log],
  });
  closeSync(log);
  const t0 = Date.now();
  while (!(await up())) {
    if (server.exitCode !== null) throw new Error(`Server exited early. See .run/server.log:\n${readFileSync(join(RUN, "server.log"), "utf8").slice(-600)}`);
    if (Date.now() - t0 > 90000) throw new Error("Server did not come up within 90 s. See .run/server.log");
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`server: started next ${DEV ? "dev" : "start"} on ${BASE} (${((Date.now() - t0) / 1000).toFixed(1)} s, log .run/server.log)`);
}

/* ── Browser ─────────────────────────────────────────────────── */
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};
let browser, page;
const problems = []; // console errors, page errors, failed requests since the last `console`

async function openBrowser() {
  browser = await puppeteer.launch({
    executablePath: BROWSER,
    headless: "new",
    // Software WebGL so the 3D hero, model viewer and MapLibre map render without a GPU
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  page = await browser.newPage();
  await page.setViewport(VIEWPORTS.desktop);
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    // "Failed to load resource" lines carry no URL; the response listener below reports those instead
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) {
      // React's hydration warning puts the useful part (the +/- attribute diff) at the end.
      const diff = m.text().split("\n").filter((l) => /^[+-]\s{3,}\S/.test(l)).slice(0, 12).join("\n");
      problems.push(`console: ${m.text().slice(0, 200)}${diff ? `\n${diff}` : ""}`);
    }
  });
  page.on("response", (r) => {
    // Vercel Analytics scripts only exist on Vercel; their local 404s are expected
    if (r.status() >= 400 && !r.url().includes("/_vercel/")) problems.push(`HTTP ${r.status()} ${r.url()}`);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sel = (s) => (s.startsWith("text=") ? `::-p-text(${s.slice(5)})` : s);
const url = (p) => (p.startsWith("http") ? p : BASE + p);

async function settle() {
  // Scroll through once so lazy sections (form, map, slider, images) mount, then return to top
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
}

const overflow = () =>
  page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));

/* ── Script commands ─────────────────────────────────────────── */
const commands = {
  async nav(p = "/") {
    const res = await page.goto(url(p), { waitUntil: "networkidle2", timeout: 60000 });
    console.log(`nav ${p} → ${res.status()} "${await page.title()}"`);
  },
  async viewport(v = "desktop") {
    const vp = VIEWPORTS[v] ?? (([w, h]) => ({ width: +w, height: +h }))(v.split("x"));
    await page.setViewport(vp);
    console.log(`viewport ${vp.width}x${vp.height}`);
  },
  /** `motion reduce` emulates prefers-reduced-motion; `motion normal` clears it. Use before `nav`. */
  async motion(v = "reduce") {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: v === "reduce" ? "reduce" : "no-preference" }]);
    console.log(`prefers-reduced-motion: ${v}`);
  },
  async "wait-for"(s) {
    await page.waitForSelector(sel(s), { timeout: 20000 });
    console.log(`found ${s}`);
  },
  wait: (ms = "500") => sleep(+ms),
  async click(s) {
    const el = await page.waitForSelector(sel(s), { timeout: 15000 });
    await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
    await el.click();
    console.log(`click ${s}`);
  },
  async fill(s, ...text) {
    const el = await page.waitForSelector(sel(s), { timeout: 15000 });
    await el.evaluate((e) => {
      e.scrollIntoView({ block: "center" });
      e.focus();
      e.select?.();
    });
    await page.keyboard.press("Backspace");
    await page.keyboard.type(text.join(" "));
    console.log(`fill ${s}`);
  },
  press: (key) => page.keyboard.press(key),
  async scroll(target = "0") {
    if (/^\d+$/.test(target)) await page.evaluate((y) => window.scrollTo(0, y), +target);
    else await page.$eval(sel(target), (e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 70));
    await sleep(700);
  },
  settle,
  async eval(js) {
    console.log(JSON.stringify(await page.evaluate(js)));
  },
  async text(s) {
    console.log(await page.$eval(sel(s), (e) => e.textContent.trim().replace(/\s+/g, " ").slice(0, 400)));
  },
  async screenshot(name = "shot", full) {
    const file = join(SHOTS, `${name}.png`);
    await page.screenshot({ path: file, fullPage: full === "full" });
    console.log(`screenshot → ${file}`);
  },
  async overflow() {
    const o = await overflow();
    console.log(`overflow: scrollWidth ${o.scrollWidth} / clientWidth ${o.clientWidth} → ${o.scrollWidth > o.clientWidth ? "HORIZONTAL OVERFLOW" : "ok"}`);
  },
  async status(p) {
    console.log(`status ${p} → ${(await fetch(url(p))).status}`);
  },
  console() {
    console.log(problems.length ? problems.join("\n") : "console: no errors");
    problems.length = 0;
  },
};

const WHOLE_LINE = new Set(["wait-for", "click", "scroll", "text", "eval"]);
async function runScript(text) {
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [cmd, ...words] = line.split(/\s+/);
    if (!commands[cmd]) throw new Error(`Unknown command "${cmd}". Commands: ${Object.keys(commands).join(", ")}`);
    const rest = line.slice(cmd.length).trim();
    // Selectors may contain spaces: these commands take the whole rest of the line as one argument.
    // `fill` takes a selector then the text; quote the selector if it has spaces: fill "form input[name=q]" hello
    let args = words;
    if (WHOLE_LINE.has(cmd)) args = rest ? [rest] : [];
    else if (cmd === "fill" && rest.startsWith('"')) {
      const end = rest.indexOf('"', 1);
      args = [rest.slice(1, end), rest.slice(end + 1).trim()];
    }
    await commands[cmd](...args);
  }
}

/* ── Built-in: smoke test of every route ─────────────────────── */
async function smoke() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  let failed = 0;
  const fail = (msg) => {
    failed++;
    console.log(`  FAIL ${msg}`);
  };
  console.log(`smoke: ${paths.length} routes from /sitemap.xml`);
  for (const p of paths) {
    problems.length = 0;
    await page.setViewport(VIEWPORTS.desktop);
    const res = await page.goto(BASE + p, { waitUntil: "networkidle2", timeout: 60000 });
    await settle();
    const h1 = await page.$$eval("h1", (n) => n.length);
    const desk = await overflow();
    await page.setViewport(VIEWPORTS.mobile);
    await sleep(300);
    const mob = await overflow();
    const ok = res.status() === 200 && h1 === 1 && desk.scrollWidth <= desk.clientWidth && mob.scrollWidth <= mob.clientWidth && !problems.length;
    console.log(`${ok ? "ok  " : "FAIL"} ${res.status()} ${p}`);
    if (res.status() !== 200) fail(`status ${res.status()}`);
    if (h1 !== 1) fail(`expected exactly one <h1>, found ${h1}`);
    if (desk.scrollWidth > desk.clientWidth) fail(`horizontal overflow at 1440 (${desk.scrollWidth})`);
    if (mob.scrollWidth > mob.clientWidth) fail(`horizontal overflow at 390 (${mob.scrollWidth})`);
    problems.forEach(fail);
  }
  for (const [p, want] of [["/robots.txt", 200], ["/opengraph-image", 200], ["/geo/network.geojson", 200], ["/vendor/maplibre-gl-worker.mjs", 200], ["/no-such-page", 404], ...(DEV ? [] : [["/studio", 404]])]) {
    const got = (await fetch(BASE + p)).status;
    console.log(`${got === want ? "ok  " : "FAIL"} ${got} ${p}${got === want ? "" : ` (expected ${want})`}`);
    if (got !== want) failed++;
  }
  await page.setViewport(VIEWPORTS.desktop);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await sleep(1000);
  await commands.screenshot("smoke-home");
  console.log(failed ? `smoke: ${failed} problem(s)` : "smoke: all good");
  if (failed) process.exitCode = 1;
}

/* ── Built-in: quote form flow ───────────────────────────────── */
async function form() {
  await page.setViewport(VIEWPORTS.mobile);
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle2" });
  await page.waitForSelector("form button[type=submit]", { timeout: 20000 });
  // Headless software rendering stalls on stacked backdrop blurs; use the low-power look
  await page.evaluate(() => document.documentElement.classList.add("no-blur"));
  await page.click("form button[type=submit]");
  await sleep(600);
  const errs = await page.$$eval('form [role="alert"]', (n) => n.map((e) => e.textContent));
  const focused = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
  console.log(`empty submit → ${errs.length} inline errors, focus on "${focused}"`);
  await commands.screenshot("form-errors");

  const byLabel = async (label, value) => {
    const id = await page.evaluate((t) => [...document.querySelectorAll("form label")].find((l) => l.textContent.includes(t))?.htmlFor, label);
    await commands.fill(`[id="${id}"]`, value);
  };
  // Step 1: four fields (name, work email, services, consent) + optional message
  await byLabel("Your name", "Driver Test");
  await byLabel("Work email", "driver@example.com");
  await page.evaluate(() => [...document.querySelectorAll("form label")].find((l) => l.textContent.trim() === "Gas pipeline / CGD GIS").click());
  await page.evaluate(() => document.querySelector('form input[name="consent"]').click());
  await sleep(3200); // the server drops anything submitted within 3 s of the form mounting (spam time-trap)
  await page.click("form button[type=submit]");
  await page.waitForSelector('[role="status"], form p[role="alert"].border', { timeout: 15000 }).catch(() => {});
  await sleep(500);
  const outcome = await page.evaluate(() => (document.querySelector('[role="status"] h3') ?? [...document.querySelectorAll('form [role="alert"]')].pop())?.textContent?.trim().replace(/\s+/g, " ").slice(0, 220));
  console.log(`step 1 submit → ${outcome}`);

  // Step 2 (optional details) only appears when step 1 was accepted
  if (await page.$('[role="status"] form')) {
    await byLabel("Company", "Test Utility Ltd");
    await byLabel("Project size", "40 km of PE network");
    // Centre the button first so the floating mobile dock cannot intercept the click
    await page.$eval('[role="status"] form button[type=submit]', (b) => b.scrollIntoView({ block: "center" }));
    await sleep(300);
    await page.click('[role="status"] form button[type=submit]');
    // Poll with plain evaluate calls: headless software rendering can starve rAF-based waits
    let step2 = null;
    for (let i = 0; i < 30 && !step2; i++) {
      await sleep(500);
      step2 = await page.evaluate(() => (/Details added to [A-Z0-9-]+/.exec(document.body.innerText) ?? [null])[0]);
    }
    console.log(`step 2 submit → ${step2 ?? "no confirmation"}`);
    if (!step2) process.exitCode = 1;
  }
  if (errs.length < 4 || !outcome) process.exitCode = 1;
}

/* ── Main ────────────────────────────────────────────────────── */
const readStdin = async () => {
  let s = "";
  for await (const chunk of process.stdin) s += chunk;
  return s;
};

try {
  await ensureServer();
  await openBrowser();
  if (mode === "smoke") await smoke();
  else if (mode === "form") await form();
  else {
    if (process.stdin.isTTY) throw new Error("Pipe a script on stdin, or use `smoke` / `form`. See the header of this file.");
    await runScript(await readStdin());
  }
} catch (err) {
  console.error(`driver error: ${err.message}`);
  process.exitCode = 1;
} finally {
  await browser?.close().catch(() => {});
  if (server) {
    // `next dev` forks a child that holds the port; on Windows killing the parent alone leaves it running.
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    else server.kill();
    console.log("server: stopped");
  }
}
