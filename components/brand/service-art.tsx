import type { CSSProperties, ReactNode } from "react";
import { Render } from "@/components/brand/primitives";
import type { ArtName, Service, Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Original line illustrations for services that have no 3D render yet.
 * Drawn in code on a 480×270 sheet in the Survey Noir style: hairline ink,
 * a faint survey grid, mono annotations and the stage colour as the only
 * accent. Strokes marked `.d` draw on (see `.art` in globals.css).
 */

type V = [number, number];
const W = 480;
const H = 270;

const f = (n: number) => Math.round(n * 10) / 10;
const path = (pts: V[], close = false) =>
  "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + (close ? "Z" : "");
/** Isometric projection: x right-down, y left-down, z up. */
const iso = (x: number, y: number, z: number, s = 1, ox = 240, oy = 150): V => [
  ox + (x - y) * 0.866 * s,
  oy + (x + y) * 0.5 * s - z * s,
];
/** Deterministic pseudo-random numbers so server and client agree. */
function rng(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0`;
const rect = (x: number, y: number, w: number, h: number) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true);

/* ── Drawing primitives ─────────────────────────────────────── */
const ink = "rgba(236,234,226,0.62)";
const faint = "rgba(236,234,226,0.22)";
const acc = "var(--acc)";

function L({ d, i = 0, a, w = 1, dash, o }: { d: string; i?: number; a?: boolean; w?: number; dash?: boolean; o?: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={dash ? "f" : "d"}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash ? "3 4" : undefined}
      style={{ "--d": i, stroke: a ? acc : ink, strokeWidth: w, opacity: o } as CSSProperties}
    />
  );
}
function Dot({ x, y, r = 3, i = 0, pulse, hollow }: { x: number; y: number; r?: number; i?: number; pulse?: boolean; hollow?: boolean }) {
  return (
    <circle
      cx={f(x)}
      cy={f(y)}
      r={r}
      className={pulse ? "p" : "f"}
      style={{ "--d": i, fill: hollow ? "#0a0e0d" : acc, stroke: acc, strokeWidth: 1.2 } as CSSProperties}
    />
  );
}
function T({ x, y, children, a, anchor = "start", i = 6, size = 8.5 }: { x: number; y: number; children: ReactNode; a?: boolean; anchor?: "start" | "middle" | "end"; i?: number; size?: number }) {
  return (
    <text
      x={x}
      y={y}
      className="f"
      textAnchor={anchor}
      style={{ "--d": i, fill: a ? acc : "rgba(236,234,226,0.5)", fontFamily: "var(--font-mono)", fontSize: size, letterSpacing: "0.08em" } as CSSProperties}
    >
      {children}
    </text>
  );
}
function Scatter({ pts, i = 4, a, r = 0.9 }: { pts: V[]; i?: number; a?: boolean; r?: number }) {
  return (
    <g className="f" style={{ "--d": i, fill: a ? acc : "rgba(236,234,226,0.45)" } as CSSProperties}>
      {pts.map(([x, y], k) => (
        <circle key={k} cx={f(x)} cy={f(y)} r={r} />
      ))}
    </g>
  );
}

/* ── The drawings ───────────────────────────────────────────── */

function Steel() {
  const s = 0.9, ox = 236, oy = 222;
  const P = (x: number, y: number, z: number) => iso(x, y, z, s, ox, oy);
  // I-section profile (u across flange, v along web)
  const prof: V[] = [[-30, -32], [30, -32], [30, -24], [3, -24], [3, 24], [30, 24], [30, 32], [-30, 32], [-30, 24], [-3, 24], [-3, -24], [-30, -24]];
  const col = (z: number) => path(prof.map(([u, v]) => P(-70 + v, u, z)), true);
  const colV = prof.map(([u, v]) => path([P(-70 + v, u, 0), P(-70 + v, u, 150)]));
  const beamProf: V[] = prof.map(([u, v]) => [u * 0.8, v * 1.1]);
  const beam = (x: number) => path(beamProf.map(([u, v]) => P(x, u, 104 + v)), true);
  const beamL = [0, 1, 6, 7].map((k) => path([P(-36, beamProf[k][0], 104 + beamProf[k][1]), P(150, beamProf[k][0], 104 + beamProf[k][1])]));
  const plate = path([P(-37, -34, 148), P(-37, 34, 148), P(-37, 34, 60), P(-37, -34, 60)], true);
  const bolts: V[] = [[-18, 132], [18, 132], [-18, 78], [18, 78]].map(([u, z]) => P(-38, u, z));
  return (
    <>
      <L d={col(0)} i={0} />
      {colV.map((d, k) => <L key={k} d={d} i={1} o={k % 3 === 0 ? 1 : 0.5} />)}
      <L d={col(150)} i={2} />
      <L d={plate} i={3} a w={1.3} />
      <L d={beam(-36)} i={4} />
      {beamL.map((d, k) => <L key={k} d={d} i={5} />)}
      <L d={beam(150)} i={6} />
      {bolts.map(([x, y], k) => <Dot key={k} x={x} y={y} r={3.2} i={k} pulse />)}
      <L d={path([P(-36, 60, 52), P(150, 60, 52)])} i={7} dash />
      <L d={path([P(-36, 54, 52), P(-36, 66, 52)])} i={7} />
      <L d={path([P(150, 54, 52), P(150, 66, 52)])} i={7} />
      <T x={318} y={234} i={8}>SPAN 5 400</T>
      <T x={322} y={64} a>CONN · 4 × M20 8.8</T>
      <L d={path([[318, 66], bolts[1]])} i={8} a o={0.6} />
      <T x={40} y={60}>C1 · W12 × 26</T>
      <T x={40} y={72} i={7}>B4 · W10 × 22</T>
    </>
  );
}

function Cad3d() {
  const s = 0.78, ox = 214, oy = 150;
  const cyl = (r: number, z0: number, h: number, i: number, a?: boolean) => {
    const [cx, cy0] = iso(0, 0, z0, s, ox, oy);
    const cy1 = cy0 - h * s;
    const rx = r * 1.2247 * s, ry = r * 0.7071 * s;
    return (
      <g key={z0}>
        <L d={ellipse(cx, cy1, rx, ry)} i={i} a={a} />
        <L d={`M${f(cx - rx)} ${f(cy0)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy0)}`} i={i} a={a} />
        <L d={path([[cx - rx, cy0], [cx - rx, cy1]])} i={i} a={a} />
        <L d={path([[cx + rx, cy0], [cx + rx, cy1]])} i={i} a={a} />
      </g>
    );
  };
  const [ax, ay] = iso(0, 0, 0, s, ox, oy);
  const holes = Array.from({ length: 6 }, (_, k) => {
    const t = (k / 6) * Math.PI * 2;
    const [x, y] = iso(Math.cos(t) * 52, Math.sin(t) * 52, -60 + 14, s, ox, oy);
    return <L key={k} d={ellipse(x, y, 5, 3)} i={3} a />;
  });
  return (
    <>
      <L d={path([[ax, ay + 66], [ax, ay - 112]])} i={0} dash />
      {cyl(66, -60, 14, 1)}
      {holes}
      {cyl(18, -20, 64, 4)}
      {cyl(44, 62, 12, 6, true)}
      {cyl(12, 96, 22, 7)}
      <L d={path([[ox + 66, oy + 34], [ox + 120, oy + 34]])} i={8} />
      <T x={ox + 124} y={oy + 37}>Ø 132 · PCD 104</T>
      <L d={path([[ox + 46, oy - 56], [ox + 120, oy - 56]])} i={8} a />
      <T x={ox + 124} y={oy - 53} a>GEAR · M2 Z44</T>
      <T x={40} y={60}>ASSY 03 · EXPLODED</T>
      <T x={40} y={72} i={7}>STEP AP242 · ⌖ 0.05 A</T>
    </>
  );
}

function Asbuilt() {
  const r = rng(7);
  const g = 214;
  const cols = [80, 190, 300];
  const pipes: [number, number, number][] = [[110, 120, 9], [140, 120, 13], [172, 120, 7], [220, 120, 11], [255, 120, 9], [110, 168, 7], [140, 168, 11], [230, 168, 14], [268, 168, 7]];
  const cloud: V[] = [];
  pipes.forEach(([x, y, rad]) => {
    for (let k = 0; k < 26; k++) {
      const t = r() * Math.PI * 2;
      const e = rad + (r() - 0.5) * 1.6;
      cloud.push([x + Math.cos(t) * e, y + Math.sin(t) * e]);
    }
  });
  for (let k = 0; k < 90; k++) cloud.push([40 + r() * 360, g + (r() - 0.5) * 2]);
  return (
    <>
      <L d={path([[30, g], [450, g]])} i={0} />
      {cols.map((x, k) => <L key={x} d={rect(x - 4, 96, 8, g - 96)} i={1 + k * 0.3} />)}
      <L d={path([[70, 132], [310, 132]])} i={2} />
      <L d={path([[70, 180], [310, 180]])} i={2} />
      {pipes.map(([x, y, rad], k) => <L key={k} d={ellipse(x, y, rad, rad)} i={3 + k * 0.15} />)}
      <Scatter pts={cloud} i={2} />
      <L d={`M352 ${g}V92a38 22 0 0 1 76 0V${g}`} i={4} />
      <L d={path([[352, 140], [428, 140]])} i={5} o={0.5} />
      <L d={path([[310, 76], [360, 76], [360, 60], [420, 60]])} i={6} dash />
      <L d={path([[310, 84], [372, 84], [372, 66], [420, 66]])} i={7} a w={1.6} />
      <Dot x={372} y={84} r={3} i={2} pulse />
      <T x={300} y={44} a>AS-BUILT ROUTE · Δ 12 mm</T>
      <T x={40} y={60}>SECTION A–A · PIPE RACK</T>
      <T x={40} y={72} i={7}>DESIGN - - -   AS-BUILT ——</T>
    </>
  );
}

function Photogrammetry() {
  const terrain = Array.from({ length: 7 }, (_, row) => {
    const y = 150 + row * 14;
    const spread = 1 + row * 0.08;
    const pts: V[] = Array.from({ length: 25 }, (_, k) => {
      const x = 240 + (k - 12) * 17 * spread;
      return [x, y - Math.sin(k * 0.45 + row * 0.6) * 8 - Math.cos(k * 0.2) * 5];
    });
    return pts;
  });
  const cams: V[] = [[150, 52], [240, 40], [330, 52]];
  return (
    <>
      {terrain.map((pts, k) => <L key={k} d={path(pts)} i={k * 0.4} o={0.35 + k * 0.08} />)}
      {Array.from({ length: 9 }, (_, k) => {
        const pts = terrain.map((row) => row[k * 3]);
        return <L key={k} d={path(pts)} i={2} o={0.3} />;
      })}
      {cams.map(([x, y], k) => {
        const fp: V[] = [[x - 70, 150], [x + 70, 150], [x + 90, 220], [x - 90, 220]];
        return (
          <g key={k}>
            <L d={rect(x - 9, y - 6, 18, 12)} i={3 + k} a w={1.3} />
            {fp.map((p, j) => <L key={j} d={path([[x, y + 6], p])} i={4 + k} a o={0.35} />)}
            <L d={path(fp, true)} i={5 + k} a o={0.5} />
          </g>
        );
      })}
      {[[120, 196], [360, 190], [246, 232]].map(([x, y], k) => (
        <g key={k}>
          <L d={path([[x, y - 6], [x + 6, y + 4], [x - 6, y + 4]], true)} i={8} a />
          <Dot x={x} y={y + 1} r={1.6} i={k} pulse />
        </g>
      ))}
      <T x={444} y={36} a anchor="end">80% FORWARD OVERLAP</T>
      <T x={40} y={36}>IMG 0142 · 0143 · 0144</T>
      <T x={364} y={186} i={9}>GCP 03</T>
    </>
  );
}

function Lidar() {
  const r = rng(11);
  const ground = (x: number) => 196 - Math.sin(x / 70) * 14 - Math.cos(x / 31) * 4;
  const pts: V[] = [];
  for (let x = 30; x < 450; x += 2.2) pts.push([x, ground(x) - r() * 3]);
  const trees: V[] = [];
  [[96, 34], [138, 26], [372, 30]].forEach(([cx, hgt]) => {
    for (let k = 0; k < 120; k++) {
      const t = r() * Math.PI * 2, d = Math.sqrt(r());
      trees.push([cx + Math.cos(t) * 18 * d, ground(cx) - hgt - 14 + Math.sin(t) * 16 * d]);
    }
  });
  const bld: V[] = [];
  for (let k = 0; k < 110; k++) bld.push([200 + r() * 70, ground(235) - 52 + r() * 1.6]);
  for (let k = 0; k < 40; k++) bld.push([200 + r() * 1.5, ground(235) - r() * 52]);
  const tower = (x: number) => {
    const b = ground(x);
    return <L key={x} d={path([[x - 7, b], [x, b - 120], [x + 7, b]]) + path([[x - 14, b - 104], [x + 14, b - 104]])} i={3} />;
  };
  const wire = (y0: number) => {
    const a: V = [300, ground(300) - 116 + y0], b: V = [446, ground(446) - 116 + y0];
    const m: V = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 22];
    return `M${f(a[0])} ${f(a[1])}Q${f(m[0])} ${f(m[1])} ${f(b[0])} ${f(b[1])}`;
  };
  const dtm: V[] = Array.from({ length: 43 }, (_, k) => [30 + k * 10, ground(30 + k * 10)]);
  return (
    <>
      <Scatter pts={pts} i={0} />
      <Scatter pts={trees} i={1} />
      <Scatter pts={bld} i={1} />
      {tower(300)}
      {tower(446)}
      <L d={wire(0)} i={5} a />
      <L d={wire(10)} i={5.5} a />
      <L d={path(dtm)} i={4} a w={1.6} />
      {[0, 1, 2, 3].map((k) => <L key={k} d={path(dtm.map(([x, y]) => [x, y + 10 + k * 9]))} i={6 + k * 0.3} o={0.45 - k * 0.08} />)}
      <T x={40} y={36}>PROFILE · CH 0+000 – 0+420</T>
      <T x={40} y={250} a>CLASS 2 · BARE-EARTH DTM</T>
      <T x={300} y={36} a>CLASS 14 · WIRE DETECTED</T>
      <T x={200} y={250} i={8}>CONTOURS @ 1 ft</T>
    </>
  );
}

function Utility() {
  const streets = [
    path([[30, 80], [450, 70]]), path([[30, 170], [450, 182]]), path([[110, 30], [120, 250]]),
    path([[250, 30], [244, 250]]), path([[372, 30], [388, 250]]),
  ];
  const main: V[] = [[40, 124], [118, 124], [246, 128], [380, 132], [446, 132]];
  const branches = [path([[118, 124], [116, 64]]), path([[246, 128], [248, 210]]), path([[380, 132], [376, 52]]), path([[180, 126], [184, 200]])];
  const power = path([[40, 220], [118, 212], [246, 222], [384, 216], [446, 226]]);
  return (
    <>
      {streets.map((d, k) => <L key={k} d={d} i={0} o={0.28} w={9} />)}
      <L d={path(main)} i={2} a w={2} />
      {branches.map((d, k) => <L key={k} d={d} i={3 + k * 0.4} a w={1.2} />)}
      <L d={power} i={4} dash />
      {main.slice(1, 4).map(([x, y], k) => (
        <rect key={k} x={x - 4} y={y - 4} width={8} height={8} className="f" style={{ "--d": 5, fill: "#0a0e0d", stroke: acc, strokeWidth: 1.4 } as CSSProperties} />
      ))}
      {[[116, 64], [248, 210], [376, 52], [184, 200]].map(([x, y], k) => <Dot key={k} x={x} y={y} r={3.2} i={k} pulse />)}
      <T x={40} y={114} a>WTR MAIN · DI 300</T>
      <T x={256} y={146}>V-114 · GATE VALVE</T>
      <T x={40} y={236}>11 kV FEEDER</T>
      <T x={330} y={250} a>TOPOLOGY ✓ CONNECTED</T>
    </>
  );
}

function Telecom() {
  const tx = 92, base = 228, top = 40;
  const lw = (y: number) => 6 + ((y - top) / (base - top)) * 30;
  const levels = [60, 92, 128, 166, 206, base];
  const lattice: string[] = [];
  levels.slice(0, -1).forEach((y, k) => {
    const y2 = levels[k + 1];
    lattice.push(path([[tx - lw(y), y], [tx + lw(y2), y2]]), path([[tx + lw(y), y], [tx - lw(y2), y2]]), path([[tx - lw(y), y], [tx + lw(y), y]]));
  });
  const homes: V[] = [[330, 70], [380, 92], [420, 130], [400, 186], [340, 214]];
  const sp: V = [292, 150];
  return (
    <>
      <L d={path([[tx - 6, top], [tx - 36, base]])} i={0} />
      <L d={path([[tx + 6, top], [tx + 36, base]])} i={0} />
      {lattice.map((d, k) => <L key={k} d={d} i={1 + k * 0.05} o={0.6} />)}
      {[-1, 1].map((s) => <L key={s} d={rect(tx + s * 14 - 4, 44, 8, 22)} i={2} a />)}
      {[0, 1, 2].map((k) => <L key={k} d={`M${tx + 24 + k * 8} 46a${10 + k * 8} ${10 + k * 8} 0 0 1 0 ${16 + k * 2}`} i={3 + k * 0.3} a o={0.7 - k * 0.15} />)}
      <L d={`M${tx + 36} ${base - 6}C 170 ${base - 6} 200 150 ${sp[0]} ${sp[1]}`} i={4} a w={1.8} />
      <L d={rect(sp[0] - 9, sp[1] - 9, 18, 18)} i={5} a w={1.4} />
      {homes.map(([x, y], k) => (
        <g key={k}>
          <L d={path([sp, [x - 8, y]])} i={6 + k * 0.2} a o={0.75} />
          <L d={path([[x - 8, y + 6], [x - 8, y - 2], [x, y - 9], [x + 8, y - 2], [x + 8, y + 6]], true)} i={7} />
          <Dot x={x - 8} y={y} r={2} i={k} pulse />
        </g>
      ))}
      <T x={300} y={252}>FTTH · LLD</T>
      <T x={262} y={180} a>SPLITTER 1:32</T>
      <T x={140} y={36}>POLE LOADING · TOWER STRENGTHENING</T>
    </>
  );
}

function Cyclone() {
  const cx = 230;
  const spiral: V[] = [];
  for (let t = 0; t < Math.PI * 9; t += 0.12) {
    const y = 70 + (t / (Math.PI * 9)) * 150;
    const rad = y < 130 ? 46 : 46 - ((y - 130) / 90) * 36;
    spiral.push([cx + Math.cos(t) * rad, y + Math.sin(t) * rad * 0.18]);
  }
  const r = rng(5);
  const dust: V[] = Array.from({ length: 40 }, () => {
    const p = spiral[Math.floor(r() * spiral.length)];
    return [p[0] + (r() - 0.5) * 6, p[1] + (r() - 0.5) * 4];
  });
  return (
    <>
      <L d={path([[cx - 52, 60], [cx - 52, 130], [cx - 12, 222], [cx + 12, 222], [cx + 52, 130], [cx + 52, 60]], true)} i={0} />
      <L d={ellipse(cx, 60, 52, 9)} i={1} />
      <L d={rect(cx - 16, 26, 32, 70)} i={2} />
      <L d={path([[cx - 52, 66], [cx - 130, 66], [cx - 130, 92], [cx - 52, 92]])} i={2} />
      <L d={rect(cx - 12, 222, 24, 18)} i={3} />
      <L d={path(spiral)} i={4} a w={1.2} />
      <Scatter pts={dust} i={6} a r={1.2} />
      <L d={path([[cx - 120, 79], [cx - 70, 79]])} i={6} a w={1.4} />
      <L d={path([[cx - 78, 74], [cx - 70, 79], [cx - 78, 84]])} i={6} a w={1.4} />
      <L d={path([[cx, 22], [cx, 6]])} i={7} />
      <L d={path([[cx - 5, 12], [cx, 6], [cx + 5, 12]])} i={7} />
      <T x={cx + 22} y={18}>CLEAN GAS</T>
      <T x={cx - 130} y={110}>DUST-LADEN INLET</T>
      <T x={cx + 22} y={256}>DUST OUTLET</T>
      <T x={330} y={110} a>η vs d₅₀ CURVE</T>
      <L d={`M330 200C350 200 360 130 380 124S420 118 446 118`} i={8} a />
      <L d={path([[330, 120], [330, 200], [446, 200]])} i={8} o={0.6} />
      <T x={330} y={216}>Δp · PRESSURE DROP</T>
    </>
  );
}

function Web() {
  return (
    <>
      <L d={rect(54, 34, 300, 196)} i={0} />
      <L d={path([[54, 52], [354, 52]])} i={1} />
      {[0, 1, 2].map((k) => <Dot key={k} x={66 + k * 10} y={43} r={2.4} hollow i={1} />)}
      <L d={rect(110, 38, 180, 10)} i={1} o={0.5} />
      <L d={path([[70, 70], [130, 70]])} i={2} a w={2} />
      {[220, 252, 284, 316].map((x) => <L key={x} d={path([[x, 70], [x + 22, 70]])} i={2} o={0.6} />)}
      <L d={path([[70, 100], [250, 100]])} i={3} w={6} o={0.85} />
      <L d={path([[70, 116], [210, 116]])} i={3} w={6} o={0.85} />
      <L d={path([[70, 136], [230, 136]])} i={4} o={0.5} />
      <L d={rect(70, 150, 58, 16)} i={4} a w={1.3} />
      {[0, 1, 2].map((k) => <L key={k} d={rect(70 + k * 94, 182, 84, 36)} i={5 + k * 0.3} o={0.7} />)}
      <L d={rect(270, 90, 70, 76)} i={5} o={0.5} />
      <L d={rect(376, 70, 74, 130)} i={6} o={0.5} />
      {["<main>", "  <Hero/>", "  <Grid/>", "</main>"].map((t, k) => (
        <T key={k} x={384} y={90 + k * 14} i={7}>{t}</T>
      ))}
      <L d={`M413 176a14 14 0 1 1 -0.1 0`} i={8} a w={2.2} />
      <T x={404} y={216} a>LCP ✓</T>
      <L d={path([[214, 158], [214, 172], [218, 168], [222, 176], [225, 175], [221, 167], [227, 167]], true)} i={8} />
      <T x={54} y={252}>RESPONSIVE · WCAG 2.2 AA</T>
    </>
  );
}

function Mobile() {
  const phone = (x: number, y: number, k: number) => (
    <g key={x}>
      <L d={`M${x + 12} ${y}h76a12 12 0 0 1 12 12v176a12 12 0 0 1 -12 12h-76a12 12 0 0 1 -12 -12v-176a12 12 0 0 1 12 -12z`} i={k} />
      <L d={path([[x + 38, y + 8], [x + 62, y + 8]])} i={k} w={3} />
    </g>
  );
  return (
    <>
      {phone(120, 34, 0)}
      {phone(250, 44, 1)}
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <L d={rect(132, 64 + k * 30, 18, 18)} i={2 + k * 0.2} a={k === 0} />
          <L d={path([[158, 69 + k * 30], [204, 69 + k * 30]])} i={2 + k * 0.2} />
          <L d={path([[158, 79 + k * 30], [190, 79 + k * 30]])} i={2 + k * 0.2} o={0.5} />
        </g>
      ))}
      <L d={path([[120, 212], [220, 212]])} i={3} o={0.5} />
      {[0, 1, 2, 3].map((k) => <Dot key={k} x={138 + k * 22} y={226} r={2.4} hollow={k > 0} i={4} />)}
      <L d={`M262 190C280 150 300 170 316 130S344 96 338 88`} i={4} a w={1.6} />
      <L d={path([[262, 200], [338, 200]])} i={4} o={0.5} />
      {[[262, 190], [316, 130], [338, 88]].map(([x, y], k) => <Dot key={k} x={x} y={y} r={2.6} i={k} pulse />)}
      <L d={rect(262, 216, 76, 20)} i={5} a w={1.3} />
      <L d={rect(358, 30, 96, 30)} i={6} a />
      <T x={366} y={49} a>NEW ORDER</T>
      <T x={120} y={262}>iOS</T>
      <T x={250} y={262}>ANDROID</T>
    </>
  );
}

function Iot() {
  const nodes: [number, number, string][] = [[70, 70, "TEMP"], [92, 200, "FLOW"], [190, 46, "kWh"], [186, 226, "SOIL"], [300, 214, "GPS"], [96, 136, "AQI"]];
  const gw: V = [240, 140];
  const hex = Array.from({ length: 6 }, (_, k) => [gw[0] + Math.cos((k * Math.PI) / 3) * 22, gw[1] + Math.sin((k * Math.PI) / 3) * 22] as V);
  return (
    <>
      {nodes.map(([x, y], k) => <L key={k} d={path([[x, y], gw])} i={1 + k * 0.2} a o={0.55} dash={k % 2 === 1} />)}
      {nodes.map(([x, y, t], k) => (
        <g key={t}>
          <L d={rect(x - 8, y - 8, 16, 16)} i={0} />
          {[1, 2].map((j) => <L key={j} d={`M${x + 10 + j * 4} ${y - 6 - j * 2}a${6 + j * 4} ${6 + j * 4} 0 0 1 0 ${12 + j * 4}`} i={2} a o={0.6} />)}
          <Dot x={x} y={y} r={2} i={k} pulse />
          <T x={x - 8} y={y + 20} i={5}>{t}</T>
        </g>
      ))}
      <path d={path(hex, true)} style={{ fill: "#0a0e0d" }} />
      <L d={path(hex, true)} i={3} a w={1.6} />
      <T x={gw[0]} y={gw[1] + 3} anchor="middle" a>GW</T>
      <L d={path([[262, 140], [342, 104]])} i={4} a w={1.3} />
      <L d={`M346 104a18 18 0 0 1 30 -18a22 22 0 0 1 40 6a16 16 0 0 1 2 32h-68a14 14 0 0 1 -4 -20z`} i={5} />
      <L d={rect(346, 150, 100, 64)} i={6} o={0.6} />
      <L d={`M352 200L368 186L382 192L398 168L414 176L440 158`} i={7} a />
      <T x={346} y={232} i={8}>LIVE · ALERT &gt; 40 °C</T>
    </>
  );
}

function Sap() {
  const c: V = [236, 146];
  const mods = ["FI", "CO", "MM", "SD", "PP", "HCM"];
  return (
    <>
      <L d={ellipse(c[0], c[1], 92, 92)} i={0} o={0.35} dash />
      <L d={ellipse(c[0], c[1], 40, 40)} i={1} a w={1.6} />
      <T x={c[0]} y={c[1] - 2} anchor="middle" a size={9}>S/4HANA</T>
      <T x={c[0]} y={c[1] + 11} anchor="middle" i={4}>CORE</T>
      {mods.map((m, k) => {
        const t = (k / mods.length) * Math.PI * 2 - Math.PI / 2;
        const x = c[0] + Math.cos(t) * 92, y = c[1] + Math.sin(t) * 92;
        const ix = c[0] + Math.cos(t) * 42, iy = c[1] + Math.sin(t) * 42;
        return (
          <g key={m}>
            <L d={path([[ix, iy], [x - Math.cos(t) * 20, y - Math.sin(t) * 12]])} i={2 + k * 0.2} a o={0.6} />
            <rect x={x - 22} y={y - 12} width={44} height={24} style={{ fill: "#0a0e0d" }} />
            <L d={rect(x - 22, y - 12, 44, 24)} i={3 + k * 0.2} />
            <T x={x} y={y + 3} anchor="middle" i={5}>{m}</T>
          </g>
        );
      })}
      <L d={rect(380, 60, 72, 40)} i={6} o={0.5} />
      <T x={388} y={84} i={7}>LEGACY</T>
      <L d={`M380 92C340 110 340 120 324 126`} i={7} a dash />
      <T x={36} y={30}>GREENFIELD · CONVERSION · MIGRATION</T>
      <T x={340} y={250} a>GRC · CONTROLS</T>
    </>
  );
}

function Sas() {
  const bars = Array.from({ length: 13 }, (_, k) => {
    const x = 50 + k * 14;
    const h = 120 * Math.exp(-((k - 6) ** 2) / 10);
    return rect(x, 200 - h, 10, h);
  });
  const curve: V[] = Array.from({ length: 60 }, (_, k) => {
    const x = 46 + k * 3.1;
    const u = (x - 139) / 14;
    return [x, 200 - 124 * Math.exp(-(u * u) / 10)];
  });
  const r = rng(3);
  const sc: V[] = Array.from({ length: 46 }, () => {
    const x = r();
    return [282 + x * 160, 196 - x * 90 - (r() - 0.5) * 34];
  });
  return (
    <>
      <L d={path([[44, 200], [240, 200]])} i={0} />
      {bars.map((d, k) => <L key={k} d={d} i={1 + k * 0.08} o={0.55} />)}
      <L d={path(curve)} i={3} a w={1.6} />
      <L d={path([[139, 70], [139, 206]])} i={4} dash />
      <T x={143} y={66} a>μ</T>
      <L d={path([[278, 110], [278, 200], [446, 200]])} i={2} />
      <Scatter pts={sc} i={3} r={1.6} />
      <L d={path([[282, 196], [446, 104]])} i={5} a w={1.4} />
      <L d={rect(282, 40, 164, 48)} i={6} o={0.6} />
      {[52, 64, 76].map((y) => <L key={y} d={path([[290, y], [438, y]])} i={7} o={0.35} />)}
      <T x={290} y={34}>TABLE 14.2.1 · ADaM ADSL</T>
      <T x={44} y={226} i={8}>DISTRIBUTION · n = 412</T>
      <T x={300} y={226} a>MODEL FIT · R² 0.86</T>
    </>
  );
}

function Ai() {
  const layers = [[90, 4], [190, 6], [290, 6], [390, 3]] as const;
  const pos = layers.map(([x, n]) => Array.from({ length: n }, (_, k) => [x, 135 + (k - (n - 1) / 2) * 30] as V));
  const lines: { d: string; hot: boolean }[] = [];
  pos.slice(0, -1).forEach((col, li) =>
    col.forEach((a, ai) => pos[li + 1].forEach((b, bi) => lines.push({ d: path([a, b]), hot: (ai + bi + li) % 5 === 0 }))),
  );
  return (
    <>
      {lines.map((l, k) => <L key={k} d={l.d} i={1 + (k % 6) * 0.2} a={l.hot} o={l.hot ? 0.9 : 0.22} />)}
      {pos.flat().map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={7} className="f" style={{ "--d": 3, fill: "#0a0e0d", stroke: ink, strokeWidth: 1 } as CSSProperties} />
      ))}
      {pos[3].map(([x, y], k) => <Dot key={k} x={x} y={y} r={k === 1 ? 4 : 2} i={k} pulse={k === 1} />)}
      <L d={rect(30, 100, 44, 70)} i={0} o={0.6} />
      <L d={rect(38, 112, 22, 30)} i={2} a w={1.3} />
      <T x={30} y={186}>INPUT</T>
      <L d={rect(404, 126, 46, 6)} i={6} o={0.5} />
      <L d={rect(404, 126, 40, 6)} i={7} a />
      <T x={404} y={150} a>P 0.94</T>
      <T x={30} y={40}>NLP · VISION · FORECAST</T>
      <T x={300} y={250} i={8}>AUTOMATE · PREDICT</T>
    </>
  );
}

function CloudArt() {
  const rack = (x: number, y: number, k: number) => (
    <g key={`${x}-${y}`}>
      {[0, 1, 2].map((j) => <L key={j} d={rect(x, y + j * 16, 46, 12)} i={k + j * 0.2} />)}
      {[0, 1, 2].map((j) => <Dot key={j} x={x + 38} y={y + 6 + j * 16} r={1.6} i={j} pulse />)}
    </g>
  );
  return (
    <>
      {rack(52, 112, 0)}
      <T x={52} y={178}>ON-PREMISES</T>
      <L d={`M290 150a34 34 0 0 1 28 -52a44 44 0 0 1 82 4a30 30 0 0 1 14 56h-110a26 26 0 0 1 -14 -8z`} i={2} a w={1.6} />
      {[["IaaS", 300], ["PaaS", 344], ["SaaS", 388]].map(([t, x], k) => (
        <g key={t}>
          <L d={rect(Number(x) - 4, 126, 38, 18)} i={3 + k * 0.3} o={0.6} />
          <T x={Number(x) + 15} y={138} anchor="middle" i={5}>{t}</T>
        </g>
      ))}
      {[0, 1, 2].map((k) => (
        <L key={k} d={`M108 ${126 + k * 16}C180 ${126 + k * 16} 210 ${130 + k * 6} 282 ${136 + k * 4}`} i={4 + k * 0.4} a o={0.75 - k * 0.15} dash={k === 1} />
      ))}
      <T x={160} y={112} a>MIGRATE</T>
      {[["AP-SOUTH", 300, 206], ["EU-WEST", 360, 226], ["US-EAST", 420, 206]].map(([t, x, y], k) => (
        <g key={t as string}>
          <L d={path([[350, 170], [Number(x), Number(y)]])} i={6} o={0.4} />
          <Dot x={Number(x)} y={Number(y)} r={3} i={k} pulse />
          <T x={Number(x)} y={Number(y) + 16} anchor="middle" i={7}>{t}</T>
        </g>
      ))}
      <T x={36} y={40}>PLAN → MIGRATE → RUN</T>
      <T x={36} y={250} a>AWS · AZURE · GCP</T>
    </>
  );
}

function Security() {
  const c: V = [200, 138];
  const shield = (s: number) =>
    `M${c[0]} ${c[1] - 92 * s}L${c[0] + 74 * s} ${c[1] - 66 * s}V${c[1] + 4 * s}C${c[0] + 74 * s} ${c[1] + 54 * s} ${c[0] + 30 * s} ${c[1] + 84 * s} ${c[0]} ${c[1] + 98 * s}C${c[0] - 30 * s} ${c[1] + 84 * s} ${c[0] - 74 * s} ${c[1] + 54 * s} ${c[0] - 74 * s} ${c[1] + 4 * s}V${c[1] - 66 * s}Z`;
  const threats: V[] = [[56, 60], [70, 210], [340, 52], [352, 214], [400, 132]];
  return (
    <>
      {[1, 0.78, 0.56].map((s, k) => <L key={s} d={shield(s)} i={k} a={k === 0} w={k === 0 ? 1.6 : 1} o={k === 0 ? 1 : 0.5} />)}
      <L d={rect(c[0] - 16, c[1] - 4, 32, 26)} i={3} a w={1.4} />
      <L d={`M${c[0] - 10} ${c[1] - 4}v-8a10 10 0 0 1 20 0v8`} i={3} a w={1.4} />
      <Dot x={c[0]} y={c[1] + 9} r={2.4} i={1} pulse />
      {threats.map(([x, y], k) => (
        <g key={k}>
          <L d={path([[x, y], [c[0] + (x - c[0]) * 0.42, c[1] + (y - c[1]) * 0.42]])} i={4 + k * 0.2} dash />
          <L d={path([[x - 5, y - 5], [x + 5, y + 5]]) + path([[x + 5, y - 5], [x - 5, y + 5]])} i={5} a w={1.4} />
        </g>
      ))}
      <T x={300} y={110}>NETWORK · CLOUD</T>
      <T x={300} y={124}>ENDPOINT · IDENTITY</T>
      <T x={300} y={150} a>MDR · 24×7</T>
      <T x={36} y={40}>VAPT · SIEM · IAM</T>
      <T x={36} y={250} i={8}>GDPR · HIPAA · PCI DSS</T>
    </>
  );
}

function Testing() {
  const stages = ["BUILD", "UNIT", "API", "E2E", "LOAD", "RELEASE"];
  return (
    <>
      {stages.map((s, k) => {
        const x = 34 + k * 72;
        const fail = k === 3;
        return (
          <g key={s}>
            <L d={rect(x, 72, 58, 40)} i={k * 0.6} a={k === 5} />
            <T x={x + 29} y={88} anchor="middle" i={k * 0.6 + 1}>{s}</T>
            {k < 5 ? <L d={path([[x + 58, 92], [x + 72, 92]])} i={k * 0.6 + 0.5} /> : null}
            {fail ? (
              <L d={path([[x + 22, 96], [x + 36, 106]]) + path([[x + 36, 96], [x + 22, 106]])} i={k * 0.6 + 1} a w={1.6} />
            ) : (
              <L d={path([[x + 22, 101], [x + 27, 106], [x + 37, 96]])} i={k * 0.6 + 1} a w={1.6} />
            )}
          </g>
        );
      })}
      <L d={`M${34 + 3 * 72 + 29} 116v24`} i={4} a dash />
      <L d={rect(34 + 3 * 72 - 26, 142, 110, 22)} i={5} a />
      <T x={34 + 3 * 72 + 29} y={157} anchor="middle" a>BUG #482 · CAUGHT</T>
      <L d={path([[34, 238], [446, 238]])} i={5} />
      <L d={`M34 232C90 230 130 226 170 214S240 196 270 200S330 222 360 196S420 186 446 190`} i={6} a w={1.3} />
      <L d={path([[34, 196], [446, 196]])} i={7} dash />
      <T x={36} y={186}>P95 LATENCY · SLA</T>
      <T x={34} y={40}>MANUAL · AUTOMATED · PERFORMANCE · SECURITY</T>
    </>
  );
}

function Marketing() {
  const funnel = [[34, 70, 220], [54, 110, 180], [74, 150, 140], [94, 190, 100]] as const;
  const labels = ["REACH", "ENGAGE", "ENQUIRE", "CONVERT"];
  const pts: V[] = [[280, 216], [310, 206], [340, 196], [370, 172], [400, 150], [430, 108], [450, 80]];
  return (
    <>
      {funnel.map(([x, y, w], k) => (
        <g key={k}>
          <L d={path([[x, y], [x + w, y], [x + w - 20, y + 34], [x + 20, y + 34]], true)} i={k * 0.5} a={k === 3} />
          <T x={x + w / 2} y={y + 21} anchor="middle" i={k + 2}>{labels[k]}</T>
        </g>
      ))}
      {["SEO", "SOCIAL", "VIDEO", "CHAT"].map((t, k) => (
        <g key={t}>
          <L d={path([[78 + k * 48, 38], [110 + k * 22, 68]])} i={3} a o={0.5} dash />
          <T x={60 + k * 48} y={34} i={2}>{t}</T>
        </g>
      ))}
      <L d={path([[270, 60], [270, 224], [456, 224]])} i={1} />
      <L d={path(pts)} i={4} a w={1.6} />
      {pts.map(([x, y], k) => <Dot key={k} x={x} y={y} r={2.4} i={k} pulse={k === pts.length - 1} />)}
      <T x={280} y={56} a>ENQUIRIES · MONTH ON MONTH</T>
      <T x={280} y={246} i={8}>KPI · ROI REPORTING</T>
    </>
  );
}

function Game() {
  const s = 0.9, ox = 330, oy = 150;
  const tiles: string[] = [];
  for (let gx = 0; gx < 6; gx++)
    for (let gy = 0; gy < 6; gy++) {
      const x = (gx - 3) * 22, y = (gy - 3) * 22, z = (gx + gy) % 4 === 0 ? 10 : 0;
      tiles.push(path([iso(x, y, z, s, ox, oy), iso(x + 22, y, z, s, ox, oy), iso(x + 22, y + 22, z, s, ox, oy), iso(x, y + 22, z, s, ox, oy)], true));
    }
  const route: V[] = [iso(-55, -55, 0, s, ox, oy), iso(-11, -55, 0, s, ox, oy), iso(-11, 11, 0, s, ox, oy), iso(33, 11, 0, s, ox, oy), iso(33, 55, 0, s, ox, oy)];
  return (
    <>
      {tiles.map((d, k) => <L key={k} d={d} i={k * 0.03} o={0.4} />)}
      <L d={path(route)} i={4} a w={1.6} dash />
      <Dot x={route[0][0]} y={route[0][1]} r={3.4} i={0} pulse />
      <Dot x={route[4][0]} y={route[4][1]} r={3} hollow i={2} />
      <L d={`M70 128C70 104 88 96 110 100H170C192 96 210 104 210 128L218 178C222 196 204 206 190 194L172 172H108L90 194C76 206 58 196 62 178Z`} i={1} w={1.4} />
      <L d={path([[100, 126], [100, 146]]) + path([[90, 136], [110, 136]])} i={3} a w={1.6} />
      {[[172, 128], [186, 140], [172, 152], [158, 140]].map(([x, y], k) => <Dot key={k} x={x} y={y} r={3} hollow={k % 2 === 1} i={k} />)}
      <T x={60} y={40}>UNITY · UNREAL · COCOS2D</T>
      <T x={300} y={40} a>LVL 03 · PATHFINDING</T>
      <T x={60} y={250} i={8}>iOS · ANDROID · WEB · PC</T>
    </>
  );
}

function Xr() {
  const s = 0.8, ox = 344, oy = 150;
  const C = (x: number, y: number, z: number) => iso(x, y, z, s, ox, oy);
  const b = 40;
  const cube = [
    path([C(-b, -b, 0), C(b, -b, 0), C(b, b, 0), C(-b, b, 0)], true),
    path([C(-b, -b, 2 * b), C(b, -b, 2 * b), C(b, b, 2 * b), C(-b, b, 2 * b)], true),
    ...[[-b, -b], [b, -b], [b, b], [-b, b]].map(([x, y]) => path([C(x, y, 0), C(x, y, 2 * b)])),
  ];
  const r = rng(9);
  const cloud: V[] = Array.from({ length: 120 }, () => C((r() - 0.5) * 2 * b, (r() - 0.5) * 2 * b, r() * 2 * b));
  return (
    <>
      <L d={`M60 110C60 92 74 86 96 86H196C218 86 232 92 232 110V146C232 162 220 170 204 170H170L156 154H136L122 170H88C72 170 60 162 60 146Z`} i={0} w={1.4} />
      <L d={ellipse(110, 128, 22, 18)} i={1} a />
      <L d={ellipse(182, 128, 22, 18)} i={1} a />
      <L d={path([[232, 112], [262, 112]])} i={2} o={0.6} />
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([u, v], k) => (
        <L key={k} d={path([[204, 128], [ox + u * 70, oy - 30 + v * 56]])} i={3} a o={0.3} />
      ))}
      {cube.map((d, k) => <L key={k} d={d} i={4 + k * 0.1} />)}
      <Scatter pts={cloud} i={5} a r={1.1} />
      <T x={60} y={40}>META QUEST · ARKIT · ARCORE</T>
      <T x={280} y={250} a>SCAN → IMMERSIVE WALKTHROUGH</T>
      <T x={60} y={200} i={7}>MIXED REALITY · TRAINING</T>
    </>
  );
}

const drawings: Record<ArtName, () => ReactNode> = {
  steel: Steel,
  cad3d: Cad3d,
  asbuilt: Asbuilt,
  photogrammetry: Photogrammetry,
  lidar: Lidar,
  utility: Utility,
  telecom: Telecom,
  cyclone: Cyclone,
  web: Web,
  mobile: Mobile,
  iot: Iot,
  sap: Sap,
  sas: Sas,
  ai: Ai,
  cloud: CloudArt,
  security: Security,
  testing: Testing,
  marketing: Marketing,
  game: Game,
  xr: Xr,
};

const stageColor: Record<Stage, string> = {
  scan: "var(--color-scan)",
  model: "var(--color-model)",
  map: "var(--color-map)",
  build: "var(--color-build)",
};

export function ServiceArt({
  name,
  stage,
  label,
  className,
}: {
  name: ArtName;
  stage: Stage;
  /** Accessible description; omit when the art is decorative. */
  label?: string;
  className?: string;
}) {
  const Drawing = drawings[name];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("art block h-full w-full bg-[#0a0e0d]", className)}
      style={{ "--acc": stageColor[stage] } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <g style={{ stroke: "rgba(236,234,226,0.05)", strokeWidth: 1 }}>
        {Array.from({ length: 15 }, (_, k) => (
          <line key={`v${k}`} x1={(k + 1) * 30} y1={0} x2={(k + 1) * 30} y2={H} />
        ))}
        {Array.from({ length: 8 }, (_, k) => (
          <line key={`h${k}`} x1={0} y1={(k + 1) * 30} x2={W} y2={(k + 1) * 30} />
        ))}
      </g>
      <g style={{ stroke: faint, strokeWidth: 1, fill: "none" }}>
        <path d="M12 22V12H22M458 12H468V22M468 248V258H458M22 258H12V248" />
      </g>
      <Drawing />
    </svg>
  );
}

/** The best visual for a service: its 3D render or CAD sheet if it has one, otherwise its line art. */
export function ServiceVisual({
  s,
  className,
  sizes,
  eager,
  decorative,
}: {
  s: Pick<Service, "title" | "media" | "art" | "stage">;
  className?: string;
  sizes?: string;
  eager?: boolean;
  decorative?: boolean;
}) {
  const alt = decorative ? "" : (s.media?.alt ?? `${s.title} illustration`);
  if (s.media?.svg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={s.media.src} alt={alt} loading={eager ? "eager" : "lazy"} className={cn("h-full w-full bg-[#0a0e0d] object-cover object-top", className)} />
    );
  }
  if (s.media) return <Render name={s.media.src} alt={alt} sizes={sizes} eager={eager} className={className} />;
  return <ServiceArt name={s.art ?? "web"} stage={s.stage} label={decorative ? undefined : alt} className={className} />;
}
