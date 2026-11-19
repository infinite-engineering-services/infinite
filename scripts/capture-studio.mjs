// Renders the studio scenes (3D station scan, BIM models, façade elevation and
// GIS maps on the real basemap) to public/renders/*.webp.
//
// 1. npm run dev -- -p 3200        (studio only exists in development)
// 2. npm run capture               (uses Edge or Chrome; override with BROWSER_PATH)
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const BASE = process.env.STUDIO_URL || "http://localhost:3200";
const OUT = join(process.cwd(), "public", "renders");
mkdirSync(OUT, { recursive: true });

const browserPath =
  process.env.BROWSER_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => existsSync(p));

// [scene, output name, width, height, webp quality]
const shots = [
  ["cloud-hero", "station-scan-hero", 1600, 1000, 62],
  ["cloud-raw", "station-scan", 1600, 900, 60],
  ["cloud-class", "station-classified", 1600, 900, 62],
  ["bim-station", "station-bim", 1600, 900, 82],
  ["bim-hospital", "hospital-bim", 1600, 900, 82],
  ["facade", "heritage-facade", 1600, 900, 66],
  ["map-network", "gis-network", 1600, 900, 80],
  ["map-raw", "gis-raw", 1600, 900, 80],
  ["map-hca", "gis-hca", 1600, 900, 80],
  ["map-city", "gis-city", 1600, 900, 80],
];
const only = process.argv.slice(2);

// A fresh browser per shot keeps software-rendered WebGL from running out of memory
for (const [scene, name, w, h, q] of shots) {
  if (only.length && !only.includes(scene)) continue;
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: "new",
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/studio?scene=${scene}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForFunction(() => document.title === "ready", { timeout: 120000 });
    // The 2D-canvas scene is read straight from the canvas (headless screenshots of it can come out blank)
    const png =
      scene === "facade"
        ? Buffer.from((await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"))).split(",")[1], "base64")
        : await page.screenshot({ type: "png" });
    const info = await sharp(png).webp({ quality: q, effort: 6 }).toFile(join(OUT, `${name}.webp`));
    // Phone-sized variant
    await sharp(png).resize({ width: 800 }).webp({ quality: q, effort: 6 }).toFile(join(OUT, `${name}-800.webp`));
    console.log(`render: ${name}.webp ${(info.size / 1024).toFixed(0)} KB`);
  } catch (err) {
    console.error(`render FAILED: ${scene}: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close().catch(() => {});
  }
}
