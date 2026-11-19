// MapLibre v6 loads its web worker from a URL next to its own module, which
// does not survive bundling. Serve the worker as a static file instead.
// Runs automatically before `npm run build` and `npm run dev`.
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "node_modules", "maplibre-gl", "dist", "maplibre-gl-worker.mjs");
const dir = join(process.cwd(), "public", "vendor");
mkdirSync(dir, { recursive: true });
copyFileSync(src, join(dir, "maplibre-gl-worker.mjs"));
console.log("maplibre worker → public/vendor/maplibre-gl-worker.mjs");
