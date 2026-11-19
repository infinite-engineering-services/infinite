// Draws the "scanned field sketch → clean CAD" floor-plan pair into public/art/.
// Both images share one geometry so the before/after slider lines up exactly.
// Run: npm run art   (outputs are committed; re-run only to change the drawing)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "art");
mkdirSync(OUT, { recursive: true });

const C = { bg: "#0E1411", line: "#2B3630", ink: "#EDEFE6", muted: "#9AA59C", yellow: "#F2C230", red: "#FF5A3C", cyan: "#5CC8D7", green: "#7BC47F" };
const W = 1600,
  H = 900,
  S = 72, // px per metre
  OX = 300,
  OY = 112;
const X = (m) => OX + m * S;
const Y = (m) => OY + m * S;
const n = (v) => +v.toFixed(1);

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

/* ── Single-storey house, 13.5 m × 9.0 m (44'-3" × 29'-6") ────── */
const HW = 13.5,
  HH = 9;
const outer = [
  [0, 0, HW, 0],
  [HW, 0, HW, HH],
  [HW, HH, 0, HH],
  [0, HH, 0, 0],
];
const inner = [
  [0, 4.5, HW, 4.5],
  [0, 5.7, HW, 5.7],
  [5.4, 0, 5.4, 2.6],
  [9.2, 0, 9.2, 4.5],
  [4.2, 5.7, 4.2, HH],
  [8.2, 5.7, 8.2, HH],
  [10.4, 5.7, 10.4, HH],
  [11.6, 3.0, HW, 3.0],
  [11.6, 3.0, 11.6, 4.5],
];
// Doors: [hingeX, hingeY, leafEndX, leafEndY, openEndX, openEndY]; cased openings: [x1,y1,x2,y2]
const doors = [
  [0, 4.65, 0, 5.55, 0.9, 4.65], // entry
  [9.6, 4.5, 10.5, 4.5, 9.6, 3.6], // master
  [3.0, 5.7, 3.9, 5.7, 3.0, 6.6], // bed 2
  [4.5, 5.7, 5.4, 5.7, 4.5, 6.6], // bed 3
  [8.6, 5.7, 9.4, 5.7, 8.6, 6.5], // bath
  [10.8, 5.7, 11.7, 5.7, 10.8, 6.6], // utility
  [11.6, 3.4, 11.6, 4.2, 12.4, 3.4], // ensuite
];
const openings = [
  [2.2, 4.5, 3.8, 4.5],
  [6.6, 4.5, 8.0, 4.5],
];
const windows = [
  [1.2, 0, 3.6, 0],
  [6.2, 0, 8.2, 0],
  [10.2, 0, 12.4, 0],
  [1.0, HH, 3.0, HH],
  [5.2, HH, 7.2, HH],
  [8.9, HH, 9.7, HH],
  [11.2, HH, 12.6, HH],
  [HW, 1.0, HW, 2.4],
  [0, 1.4, 0, 3.2],
  [0, 6.6, 0, 8.0],
];
const rooms = [
  ["LIVING", `17'-9" × 14'-9"`, 3.7, 3.5],
  ["KITCHEN / DINING", `12'-6" × 14'-9"`, 7.6, 1.75],
  ["PRIMARY BEDROOM", `14'-1" × 9'-10"`, 11.3, 1.5],
  ["BEDROOM 2", `13'-9" × 10'-10"`, 2.1, 7.5],
  ["BEDROOM 3", `13'-1" × 10'-10"`, 6.2, 7.5],
  ["BATH", "", 9.75, 7.0],
  ["UTILITY", `10'-2" × 10'-10"`, 11.95, 7.5],
  ["HALL", "", 6.6, 5.2],
];
const seg = ([x1, y1, x2, y2]) => `M${n(X(x1))} ${n(Y(y1))}L${n(X(x2))} ${n(Y(y2))}`;

function planCad() {
  let b = "";
  // drawing grid
  let g = "";
  for (let x = 0; x <= W; x += 50) g += `M${x} 0V${H}`;
  for (let y = 0; y <= H; y += 50) g += `M0 ${y}H${W}`;
  b += `<path d="${g}" stroke="${C.line}" stroke-opacity="0.45" fill="none"/>`;
  // fixtures (A-FURN, thin green)
  const R = (x, y, w, h, rx = 0) => `<rect x="${n(X(x))}" y="${n(Y(y))}" width="${n(w * S)}" height="${n(h * S)}" rx="${rx}"/>`;
  b += `<g fill="none" stroke="${C.green}" stroke-width="1.4" stroke-opacity="0.85">`;
  b += R(0.5, 0.5, 0.9, 2.4, 6) + R(1.6, 0.9, 1.1, 1.6, 4); // sofa + coffee table
  b += R(5.6, 0.2, 3.4, 0.62) + R(5.6, 0.82, 0.62, 1.6); // L-counter
  b += `<circle cx="${n(X(7.9))}" cy="${n(Y(0.5))}" r="13"/><circle cx="${n(X(8.45))}" cy="${n(Y(0.5))}" r="13"/>`; // hob
  b += R(6.3, 0.3, 0.8, 0.42, 4); // sink
  b += `<circle cx="${n(X(7.4))}" cy="${n(Y(3.1))}" r="${n(0.65 * S)}"/>`; // dining table
  b += R(10.3, 0.4, 1.9, 2.1, 4) + R(10.4, 0.5, 0.8, 0.45, 6) + R(11.3, 0.5, 0.8, 0.45, 6); // primary bed
  b += R(1.2, 6.9, 1.5, 2.0, 4) + R(1.3, 8.35, 1.3, 0.42, 6); // bed 2
  b += R(5.4, 6.9, 1.5, 2.0, 4) + R(5.5, 8.35, 1.3, 0.42, 6); // bed 3
  b += R(8.35, 7.2, 0.8, 1.7, 14); // tub
  b += `<ellipse cx="${n(X(9.9))}" cy="${n(Y(8.5))}" rx="16" ry="22"/>` + R(9.65, 5.85, 0.6, 0.45, 5); // wc + basin
  b += R(12.5, 3.2, 0.85, 0.85) + `<ellipse cx="${n(X(11.95))}" cy="${n(Y(4.2))}" rx="13" ry="18"/>`; // ensuite shower + wc
  b += R(12.6, 5.9, 0.75, 0.75) + R(12.6, 6.8, 0.75, 0.75) + `<circle cx="${n(X(12.97))}" cy="${n(Y(6.27))}" r="19"/>`; // washer/dryer
  b += `</g>`;
  // walls (A-WALL)
  b += `<path d="${inner.map(seg).join("")}" stroke="${C.ink}" stroke-width="5" stroke-linecap="square" fill="none"/>`;
  b += `<path d="${outer.map(seg).join("")}" stroke="${C.ink}" stroke-width="10" stroke-linecap="square" fill="none"/>`;
  // cut openings
  const cut = [...doors.map(([hx, hy, lx, ly]) => [hx, hy, lx, ly]), ...openings, ...windows];
  b += `<path d="${cut.map(seg).join("")}" stroke="${C.bg}" stroke-width="13" fill="none"/>`;
  // windows (A-GLAZ): three thin lines
  for (const [x1, y1, x2, y2] of windows) {
    const horiz = y1 === y2;
    for (const o of [-4, 0, 4])
      b += horiz
        ? `<path d="M${n(X(x1))} ${n(Y(y1) + o)}H${n(X(x2))}" stroke="${C.cyan}" stroke-width="1.5"/>`
        : `<path d="M${n(X(x1) + o)} ${n(Y(y1))}V${n(Y(y2))}" stroke="${C.cyan}" stroke-width="1.5"/>`;
  }
  // doors (A-DOOR): leaf + swing arc
  for (const [hx, hy, lx, ly, ox, oy] of doors) {
    const r = n(Math.hypot(lx - hx, ly - hy) * S);
    const cross = (lx - hx) * (oy - hy) - (ly - hy) * (ox - hx);
    b += `<path d="M${n(X(hx))} ${n(Y(hy))}L${n(X(ox))} ${n(Y(oy))}" stroke="${C.yellow}" stroke-width="3"/>`;
    b += `<path d="M${n(X(lx))} ${n(Y(ly))}A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${n(X(ox))} ${n(Y(oy))}" stroke="${C.yellow}" stroke-width="1.4" fill="none"/>`;
  }
  // room tags (A-ANNO)
  b += `<g font-family="monospace" text-anchor="middle">`;
  for (const [name, size, x, y] of rooms) {
    b += `<text x="${n(X(x))}" y="${n(Y(y))}" font-size="17" fill="${C.ink}">${name}</text>`;
    if (size) b += `<text x="${n(X(x))}" y="${n(Y(y) + 21)}" font-size="13" fill="${C.muted}">${size.replace(/"/g, "&quot;")}</text>`;
  }
  b += `</g>`;
  // dimension chains (A-DIMS)
  const dy = Y(0) - 46,
    dx = X(0) - 56;
  const ticksX = [0, 5.4, 9.2, HW],
    ticksY = [0, 4.5, 5.7, HH];
  let d = `M${X(0)} ${dy}H${X(HW)}M${dx} ${Y(0)}V${Y(HH)}`;
  for (const t of ticksX) d += `M${n(X(t) - 7)} ${dy + 7}l14 -14M${n(X(t))} ${dy - 12}V${Y(0) - 12}`;
  for (const t of ticksY) d += `M${dx - 7} ${n(Y(t) + 7)}l14 -14M${dx - 12} ${n(Y(t))}H${X(0) - 12}`;
  b += `<path d="${d}" stroke="${C.cyan}" stroke-width="1.3" fill="none"/>`;
  b += `<g font-family="monospace" font-size="15" fill="${C.cyan}" text-anchor="middle">`;
  [`17'-9"`, `12'-6"`, `14'-1"`].forEach((t, i) => (b += `<text x="${n(X((ticksX[i] + ticksX[i + 1]) / 2))}" y="${dy - 9}">${t.replace(/"/g, "&quot;")}</text>`));
  [`14'-9"`, `3'-11"`, `10'-10"`].forEach((t, i) => {
    const yy = n(Y((ticksY[i] + ticksY[i + 1]) / 2));
    b += `<text x="${dx - 12}" y="${yy}" transform="rotate(-90 ${dx - 12} ${yy})">${t.replace(/"/g, "&quot;")}</text>`;
  });
  b += `</g>`;
  // north arrow + title block
  b += `<g transform="translate(1440 150)" stroke="${C.ink}" fill="none" stroke-width="1.5"><circle r="26"/><path d="M0 -34L9 12L0 4L-9 12Z" fill="${C.ink}"/><text y="-42" text-anchor="middle" font-family="monospace" font-size="16" fill="${C.ink}" stroke="none">N</text></g>`;
  b += `<g font-family="monospace" fill="${C.muted}" font-size="14"><rect x="1300" y="770" width="270" height="100" fill="${C.bg}" stroke="${C.ink}" stroke-width="1.5"/><path d="M1300 804H1570M1300 838H1570M1470 838V870" stroke="${C.ink}" stroke-width="1"/><text x="1312" y="793" fill="${C.ink}" font-size="15">AS-BUILT FLOOR PLAN</text><text x="1312" y="827">SCALE 1/4&quot; = 1'-0&quot;</text><text x="1312" y="860">DRAWN FROM SCAN</text><text x="1482" y="860" fill="${C.ink}" font-size="16">A-101</text></g>`;
  b += `<text x="40" y="52" font-family="monospace" font-size="17" fill="${C.muted}">AUTOCAD · A-WALL  A-DOOR  A-GLAZ  A-FURN  A-DIMS</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${C.bg}"/>${b}</svg>`;
}

function planScan() {
  const r = rng(5);
  const paper = "#E8E2D2",
    pencil = "#35332E";
  let b = "";
  // graph-paper grid, stains, fold
  let g = "";
  for (let x = 0; x <= W; x += 24) g += `M${x} 0V${H}`;
  for (let y = 0; y <= H; y += 24) g += `M0 ${y}H${W}`;
  b += `<path d="${g}" stroke="#9DB3B8" stroke-opacity="0.35" stroke-width="1" fill="none"/>`;
  for (let i = 0; i < 5; i++)
    b += `<circle cx="${n(r() * W)}" cy="${n(r() * H)}" r="${n(70 + r() * 150)}" fill="#BFA871" fill-opacity="${(0.07 + r() * 0.1).toFixed(2)}"/>`;
  b += `<circle cx="1330" cy="180" r="74" fill="none" stroke="#8A6A3A" stroke-opacity="0.35" stroke-width="7"/>`; // cup ring
  b += `<path d="M${W / 2} 0V${H}" stroke="#B5AB93" stroke-width="3" stroke-opacity="0.6"/>`;
  // wobbly double-pass pencil lines over the same geometry
  const wob = (x1, y1, x2, y2, amp = 4) => {
    let d = "";
    for (let pass = 0; pass < 2; pass++) {
      const steps = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) * 2.2));
      d += `M${n(X(x1) + (r() - 0.5) * amp * 2)} ${n(Y(y1) + (r() - 0.5) * amp * 2)}`;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        d += `L${n(X(x1 + (x2 - x1) * t) + (r() - 0.5) * amp)} ${n(Y(y1 + (y2 - y1) * t) + (r() - 0.5) * amp)}`;
      }
    }
    return d;
  };
  let d = "";
  for (const s of [...outer, ...inner]) d += wob(...s);
  b += `<g transform="rotate(-1.1 800 450)">`;
  b += `<path d="${d}" fill="none" stroke="${pencil}" stroke-width="3.6" stroke-opacity="0.72" stroke-linecap="round"/>`;
  // openings marked with ticks, doors as rough arcs
  let t = "";
  for (const [x1, y1, x2, y2] of [...windows, ...openings]) t += wob(x1, y1, x2, y2, 9);
  b += `<path d="${t}" fill="none" stroke="${paper}" stroke-width="7"/><path d="${t}" fill="none" stroke="${pencil}" stroke-width="1.3" stroke-opacity="0.6"/>`;
  for (const [hx, hy, lx, ly, ox, oy] of doors) {
    const rad = n(Math.hypot(lx - hx, ly - hy) * S);
    const cross = (lx - hx) * (oy - hy) - (ly - hy) * (ox - hx);
    b += `<path d="${seg([hx, hy, lx, ly])}" stroke="${paper}" stroke-width="9"/>`;
    b += `<path d="M${n(X(lx))} ${n(Y(ly))}A${rad} ${rad} 0 0 ${cross > 0 ? 1 : 0} ${n(X(ox) + 4)} ${n(Y(oy) - 3)}L${n(X(hx))} ${n(Y(hy))}" stroke="${pencil}" stroke-width="1.8" stroke-opacity="0.65" fill="none"/>`;
  }
  // handwritten field notes and tape measurements
  const notes = [
    ["Living", 2.0, 2.3],
    ["Kitchen", 6.6, 2.0],
    ["Primary", 10.2, 1.7],
    ["Bed 2", 1.5, 7.5],
    ["Bed 3", 5.6, 7.5],
    ["bath", 8.6, 8.2],
    ["utility", 11.2, 7.7],
    ["17'-9\"", 2.2, -0.35],
    ["12'6", 6.9, -0.35],
    ["14'1?", 10.9, -0.35],
    ["29'-6 o/a", -1.75, 4.9],
    ["chk this wall", 6.0, 4.15],
  ];
  b += `<g font-family="'Segoe Script','Bradley Hand',cursive" fill="${pencil}" fill-opacity="0.78">`;
  for (const [txt, x, y] of notes)
    b += `<text x="${n(X(x))}" y="${n(Y(y))}" font-size="${txt.length > 9 ? 22 : 30}" transform="rotate(${n((r() - 0.5) * 7)} ${n(X(x))} ${n(Y(y))})">${txt.replace(/"/g, "&quot;")}</text>`;
  b += `</g></g>`;
  // scanner noise
  let noise = "";
  for (let i = 0; i < 2600; i++) noise += `M${n(r() * W)} ${n(r() * H)}h1.5v1.5h-1.5z`;
  b += `<path d="${noise}" fill="#5A5446" fill-opacity="0.32"/>`;
  b += `<text x="40" y="${H - 28}" font-family="monospace" font-size="17" fill="#5A5446">FIELD_SKETCH_0042.TIF · 150 DPI</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${paper}"/>${b}</svg>`;
}

for (const [name, content] of Object.entries({ "plan-cad.svg": planCad(), "plan-scan.svg": planScan() })) {
  writeFileSync(join(OUT, name), content);
  console.log(`art: ${name} ${(content.length / 1024).toFixed(0)} KB`);
}
