// Builds the SYNTHETIC CGD demo dataset for the interactive map (public/geo/).
// All features are fictitious and exist only to demonstrate GIS capability.
// Run: npm run geo
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as turf from "@turf/turf";

const OUT = join(process.cwd(), "public", "geo");
mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(4242);
const round = (n) => Math.round(n * 1e6) / 1e6;
const roundCoords = (fc) =>
  JSON.parse(JSON.stringify(fc), (k, v) => (typeof v === "number" && k !== "id" ? round(v) : v));

// Demo area: west Ahmedabad (fictitious network)
const origin = [72.515, 23.035];
const off = (dx, dy) => [origin[0] + dx * 0.0098, origin[1] + dy * 0.009]; // ~1 km units

/* ── Steel trunk (transmission feeder) ───────────────────────── */
const trunkCoords = [off(-3.2, -2.4), off(-1.8, -1.6), off(-0.6, -0.5), off(0.6, 0.1), off(1.9, 0.9), off(3.3, 1.6)];
const trunk = turf.lineString(trunkCoords, {
  kind: "steel",
  id: "ST-001",
  material: "Steel API 5L X52",
  diameter: '8"',
  pressure: "19 bar (MP)",
  installed: 2014,
});

/* ── PE distribution mains branching from the trunk ──────────── */
const mains = [];
let mainId = 1;
for (let i = 1; i < trunkCoords.length - 1; i++) {
  const [x, y] = trunkCoords[i];
  for (const dir of [1, -1]) {
    const pts = [[x, y]];
    let cx = x,
      cy = y;
    const segs = 3 + Math.floor(r() * 3);
    for (let s = 0; s < segs; s++) {
      cx += (r() - 0.35) * 0.006 * dir;
      cy += (0.004 + r() * 0.004) * dir;
      pts.push([cx, cy]);
    }
    const year = 2012 + Math.floor(r() * 12);
    mains.push(
      turf.lineString(pts, {
        kind: "pe",
        id: `PE-${String(mainId++).padStart(3, "0")}`,
        material: "MDPE PE100",
        diameter: ["63 mm", "90 mm", "125 mm"][Math.floor(r() * 3)],
        pressure: "4 bar (LP)",
        installed: year,
      }),
    );
  }
}

/* ── Point assets: DRS, valves, CP test posts ─────────────────── */
const assets = [];
assets.push(turf.point(trunkCoords[0], { kind: "drs", id: "DRS-01", name: "District Regulating Station 01", capacity: "5,000 SCMH" }));
assets.push(turf.point(trunkCoords[3], { kind: "drs", id: "DRS-02", name: "District Regulating Station 02", capacity: "3,000 SCMH" }));
let v = 1;
for (const m of mains) {
  const c = m.geometry.coordinates;
  assets.push(turf.point(c[1], { kind: "valve", id: `V-${String(v++).padStart(4, "0")}`, type: "PE ball valve", status: "Open" }));
}
const trunkLen = turf.length(trunk);
for (let d = 0.4; d < trunkLen; d += 1.1) {
  assets.push(
    turf.point(turf.along(trunk, d).geometry.coordinates, {
      kind: "cp",
      id: `CP-${String(Math.round(d * 10)).padStart(3, "0")}`,
      name: "CP test post",
      potential: `${(-0.85 - r() * 0.35).toFixed(2)} V CSE`,
    }),
  );
}

/* ── Sensitive receptors & HCA buffers ───────────────────────── */
// Placed ~80–100 m beside the trunk so they fall inside the impact radius
const nearTrunk = (km, dLat) => {
  const [x, y] = turf.along(trunk, km).geometry.coordinates;
  return [x, y + dLat];
};
const receptors = [
  turf.point(nearTrunk(2.4, 0.0008), { kind: "school", name: "School (identified site)" }),
  turf.point(nearTrunk(5.2, -0.0009), { kind: "hospital", name: "Hospital (identified site)" }),
  turf.point(nearTrunk(6.9, 0.0007), { kind: "school", name: "School (identified site)" }),
];
// Potential impact radius for an 8" line at 19 bar (illustrative): ~120 m
const PIR_KM = 0.12;
const hcaCircles = receptors.map((p) => turf.buffer(p, PIR_KM + 0.08, { units: "kilometers", steps: 32 }));
// HCA segments: trunk portions within the receptor circles
const hcaSegments = [];
for (const c of hcaCircles) {
  const split = turf.lineSplit(trunk, c);
  for (const seg of split.features) {
    const mid = turf.along(seg, turf.length(seg) / 2);
    if (turf.booleanPointInPolygon(mid, c)) hcaSegments.push(seg);
  }
}
const corridor = turf.buffer(trunk, PIR_KM, { units: "kilometers", steps: 16 });
const hca = turf.featureCollection([
  ...hcaSegments.map((s) => turf.buffer(s, PIR_KM, { units: "kilometers", steps: 16 })).map((f) => ({ ...f, properties: { kind: "hca" } })),
]);

/* ── Leak reports → hexbin hotspot ───────────────────────────── */
const leaks = [];
const hot = [off(-1.2, -1.0), off(1.0, 0.9), off(2.2, 1.9)];
for (let i = 0; i < 260; i++) {
  const c = hot[Math.floor(r() * hot.length)];
  const rad = Math.abs(((r() + r() + r()) / 3 - 0.5) * 2) * 0.012;
  const t = r() * Math.PI * 2;
  leaks.push(turf.point([c[0] + Math.cos(t) * rad, c[1] + Math.sin(t) * rad]));
}
for (let i = 0; i < 60; i++) leaks.push(turf.point(off(-3 + r() * 6.5, -2.5 + r() * 5)));
const bbox = turf.bbox(turf.featureCollection([trunk, ...mains, ...leaks]));
const hex = turf.hexGrid(bbox, 0.35, { units: "kilometers" });
const counted = turf.collect(hex, turf.featureCollection(leaks.map((l, i) => ({ ...l, properties: { n: i } }))), "n", "ids");
const hexbins = turf.featureCollection(
  counted.features
    .map((h) => ({ ...h, properties: { count: h.properties.ids.length } }))
    .filter((h) => h.properties.count > 0),
);

const write = (name, fc) => {
  const s = JSON.stringify(roundCoords(fc));
  writeFileSync(join(OUT, name), s);
  console.log(`geo: ${name} ${(s.length / 1024).toFixed(1)} KB (${fc.features.length} features)`);
};
write("network.geojson", turf.featureCollection([trunk, ...mains]));
write("assets.geojson", turf.featureCollection(assets));
write("receptors.geojson", turf.featureCollection(receptors));
write("hca.geojson", turf.featureCollection([{ ...corridor, properties: { kind: "corridor" } }, ...hca.features]));
write("leak-hex.geojson", hexbins);

const summary = {
  bbox: turf.bbox(turf.featureCollection([trunk, ...mains])),
  trunkKm: +trunkLen.toFixed(2),
  peKm: +mains.reduce((a, m) => a + turf.length(m), 0).toFixed(2),
  valves: assets.filter((a) => a.properties.kind === "valve").length,
  drs: 2,
  cp: assets.filter((a) => a.properties.kind === "cp").length,
  hcaSegments: hcaSegments.length,
  hcaKm: +hcaSegments.reduce((a, s) => a + turf.length(s), 0).toFixed(2),
  leakReports: leaks.length,
  maxHex: Math.max(...hexbins.features.map((h) => h.properties.count)),
};
writeFileSync(join(process.cwd(), "components", "map", "summary.json"), JSON.stringify(summary, null, 2));
console.log(summary);
