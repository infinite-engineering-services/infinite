import { seeded } from "@/lib/utils";

/**
 * One source of truth for the 3D scenes. A scene is a list of primitives;
 * the same list is (a) sampled into a simulated terrestrial laser scan and
 * (b) built into a solid BIM-style model, so "scan" and "model" always match.
 */
export type Cls =
  | "ground"
  | "wall"
  | "roof"
  | "glass"
  | "pipe"
  | "vessel"
  | "steel"
  | "equip"
  | "concrete"
  | "vehicle"
  | "duct"
  | "slab";

type V3 = [number, number, number];
export type Prim =
  | { k: "box"; c: V3; s: V3; cls: Cls }
  | { k: "cyl"; c: V3; r: number; h: number; axis: "x" | "y" | "z"; cls: Cls }
  | { k: "cone"; c: V3; r: number; h: number; cls: Cls };

const box = (c: V3, s: V3, cls: Cls): Prim => ({ k: "box", c, s, cls });
const cyl = (c: V3, r: number, h: number, axis: "x" | "y" | "z", cls: Cls): Prim => ({ k: "cyl", c, r, h, axis, cls });

/** Classified colours (RGB 0–1). Pipework is gas yellow, vessels cyan, valves red. */
export const classColor: Record<Cls, V3> = {
  ground: [0.4, 0.45, 0.4],
  wall: [0.86, 0.87, 0.81],
  roof: [0.62, 0.65, 0.6],
  glass: [0.22, 0.42, 0.48],
  pipe: [0.949, 0.761, 0.188],
  vessel: [0.36, 0.78, 0.84],
  steel: [0.55, 0.6, 0.58],
  equip: [1.0, 0.353, 0.235],
  concrete: [0.6, 0.62, 0.58],
  vehicle: [0.82, 0.84, 0.86],
  duct: [0.36, 0.78, 0.84],
  slab: [0.7, 0.72, 0.68],
};

/** Stable class order, shared by shaders (class index → colour / offset). */
export const classList: Cls[] = [
  "ground",
  "wall",
  "roof",
  "glass",
  "pipe",
  "vessel",
  "steel",
  "equip",
  "concrete",
  "vehicle",
  "duct",
  "slab",
];

/* ── City gate / metering station ────────────────────────────── */
export function stationPrims(): Prim[] {
  const p: Prim[] = [];

  // Control building (back left) with parapet, windows, door, canopy, roof units
  const bx = -18,
    bz = -11,
    bw = 14,
    bh = 4.2,
    bd = 8;
  p.push(box([bx, bh / 2, bz], [bw, bh, bd], "wall"));
  p.push(box([bx, bh + 0.1, bz], [bw + 0.5, 0.2, bd + 0.5], "roof"));
  for (const [dx, dz, sx, sz] of [
    [0, bd / 2 + 0.15, bw + 0.5, 0.2],
    [0, -bd / 2 - 0.15, bw + 0.5, 0.2],
    [bw / 2 + 0.15, 0, 0.2, bd + 0.5],
    [-bw / 2 - 0.15, 0, 0.2, bd + 0.5],
  ])
    p.push(box([bx + dx, bh + 0.5, bz + dz], [sx, 0.6, sz], "wall"));
  const front = bz + bd / 2;
  for (const wx of [-23, -20, -17]) p.push(box([wx, 2.3, front], [1.7, 1.4, 0.14], "glass"));
  p.push(box([-13, 1.2, front], [1.3, 2.4, 0.14], "glass")); // door
  p.push(box([-13, 2.75, front + 0.8], [2.6, 0.12, 1.6], "roof")); // canopy
  for (const wz of [-13, -9]) p.push(box([bx + bw / 2, 2.3, wz], [0.14, 1.4, 1.7], "glass"));
  p.push(box([-21, bh + 0.75, -12.5], [1.3, 0.9, 0.9], "steel"));
  p.push(box([-19, bh + 0.75, -12.5], [1.3, 0.9, 0.9], "steel"));

  // Pipe rack (back centre): portal frames, two tiers of pipes with flanges
  const rz0 = -10.6,
    rz1 = -7.4;
  for (let x = -8; x <= 8; x += 4) {
    p.push(box([x, 2.6, rz0], [0.26, 5.2, 0.26], "steel"));
    p.push(box([x, 2.6, rz1], [0.26, 5.2, 0.26], "steel"));
    p.push(box([x, 3.1, (rz0 + rz1) / 2], [0.22, 0.26, rz1 - rz0], "steel"));
    p.push(box([x, 4.9, (rz0 + rz1) / 2], [0.22, 0.26, rz1 - rz0], "steel"));
  }
  p.push(box([0, 5.1, rz0], [16.3, 0.16, 0.16], "steel"));
  p.push(box([0, 5.1, rz1], [16.3, 0.16, 0.16], "steel"));
  const rackPipes: [number, number, number][] = [
    [3.23, -9.9, 0.28],
    [3.23, -9.0, 0.2],
    [3.23, -8.1, 0.32],
    [5.03, -9.6, 0.22],
    [5.03, -8.4, 0.36],
  ];
  for (const [y0, z, r] of rackPipes) {
    p.push(cyl([0, y0 + r, z], r, 19, "x", "pipe"));
    for (const fx of [-6, 0, 6]) p.push(cyl([fx + z * 0.3, y0 + r, z], r + 0.09, 0.14, "x", "pipe"));
  }
  // Rack → ground at the building end
  p.push(cyl([-9.5, 1.75, -9.9], 0.28, 3.5, "y", "pipe"));
  p.push(cyl([-9.5, 1.75, -8.1], 0.32, 3.5, "y", "pipe"));

  // Storage tank (back right): shell, cone roof, spiral stair, top handrail
  const tx = 16,
    tz = -11,
    tr = 3.2,
    th = 9;
  p.push(cyl([tx, th / 2, tz], tr, th, "y", "vessel"));
  p.push({ k: "cone", c: [tx, th, tz], r: tr, h: 0.9, cls: "vessel" });
  for (let i = 0; i < 34; i++) {
    const a = 0.6 + (i / 34) * Math.PI * 1.25;
    p.push(box([tx + Math.cos(a) * (tr + 0.4), 0.3 + (i / 34) * (th - 0.4), tz + Math.sin(a) * (tr + 0.4)], [0.5, 0.06, 0.5], "steel"));
  }
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    p.push(cyl([tx + Math.cos(a) * (tr - 0.05), th + 0.5, tz + Math.sin(a) * (tr - 0.05)], 0.035, 1, "y", "steel"));
  }
  p.push(cyl([11.6, 0.8, -9.4], 0.2, 3.4, "x", "pipe")); // tank outlet towards rack
  // Vent stack
  p.push(cyl([23, 6.5, -14], 0.22, 13, "y", "steel"));
  p.push(cyl([23, 0.3, -14], 0.7, 0.6, "y", "concrete"));

  // Twin-stream metering skid (centre front) on a concrete plinth
  p.push(box([3, 0.1, -1.2], [17.5, 0.2, 5.4], "concrete"));
  for (const z of [-2.3, -0.1]) {
    p.push(cyl([3, 1.05, z], 0.2, 15, "x", "pipe"));
    p.push(cyl([-1.5, 1.25, z], 0.46, 2.1, "y", "vessel")); // filter
    p.push({ k: "cone", c: [-1.5, 2.3, z], r: 0.46, h: 0.3, cls: "vessel" });
    p.push(box([2.6, 1.05, z], [0.75, 0.6, 0.6], "steel")); // regulator body
    p.push(cyl([2.6, 1.55, z], 0.36, 0.22, "y", "steel"));
    p.push(box([7.2, 1.1, z], [1.1, 0.75, 0.7], "vessel")); // meter
    for (const vx of [-3.3, 5.2, 9.2]) {
      p.push(cyl([vx, 1.05, z], 0.27, 0.36, "x", "steel"));
      p.push(cyl([vx, 1.5, z], 0.04, 0.5, "y", "steel"));
      p.push(cyl([vx, 1.78, z], 0.24, 0.05, "y", "equip")); // handwheel
    }
    for (const sx of [-3.9, 0.5, 4, 8.3, 10]) p.push(box([sx, 0.52, z], [0.12, 0.66, 0.12], "steel"));
  }
  p.push(cyl([-4.5, 1.05, -1.2], 0.26, 3.2, "z", "pipe")); // inlet header
  p.push(cyl([10.5, 1.05, -1.2], 0.26, 3.2, "z", "pipe")); // outlet header
  p.push(cyl([-4.5, 1.05, -5.2], 0.24, 4.9, "z", "pipe")); // rack → skid
  p.push(cyl([-4.5, 2.2, -7.75], 0.24, 2.3, "y", "pipe"));
  p.push(cyl([10.5, 1.05, 3.3], 0.24, 5.9, "z", "pipe")); // skid → ground outlet
  p.push(cyl([10.5, 0.52, 6.25], 0.24, 1.05, "y", "pipe"));
  for (const [gx, gz] of [
    [-6, 1.9],
    [-6, -4.3],
    [12, 1.9],
    [12, -4.3],
    [3, 1.9],
  ])
    p.push(cyl([gx, 0.5, gz], 0.09, 1, "y", "equip")); // bollards

  // Boundary walls, light poles, service vehicle
  p.push(box([-2, 1.1, -19], [58, 2.2, 0.25], "concrete"));
  p.push(box([-31, 1.1, -4], [0.25, 2.2, 30], "concrete"));
  for (const [lx, lz] of [
    [-27, 4],
    [27, -16],
  ]) {
    p.push(cyl([lx, 4, lz], 0.08, 8, "y", "steel"));
    p.push(box([lx + 0.6, 7.9, lz], [1.3, 0.1, 0.25], "steel"));
  }
  p.push(box([-14, 0.95, 8], [4.7, 0.9, 1.9], "vehicle"));
  p.push(box([-12.6, 1.85, 8], [1.9, 0.9, 1.75], "vehicle"));
  for (const wx of [-15.6, -12.5])
    for (const wz of [7.1, 8.9]) p.push(cyl([wx, 0.4, wz], 0.4, 0.26, "z", "steel"));

  return p;
}

/* ── Multi-storey hospital block, front façade cut away to show MEP ─ */
export function hospitalPrims(): Prim[] {
  const p: Prim[] = [];
  const W = 30,
    D = 16,
    FH = 3.6,
    floors = 5;
  for (let f = 0; f <= floors; f++) p.push(box([0, f * FH, 0], [W, 0.3, D], "slab"));
  for (let f = 0; f < floors; f++) {
    const y0 = f * FH + 0.15;
    for (let x = -W / 2 + 0.3; x <= W / 2; x += 4.9)
      for (const z of [-D / 2 + 0.3, 0]) p.push(box([x, y0 + FH / 2, z], [0.45, FH - 0.3, 0.45], "concrete"));
    // Back and left façades with ribbon glazing
    p.push(box([0, y0 + 0.5, -D / 2], [W, 1.0, 0.2], "wall"));
    p.push(box([0, y0 + 1.95, -D / 2], [W, 1.9, 0.08], "glass"));
    p.push(box([0, y0 + 3.15, -D / 2], [W, 0.5, 0.2], "wall"));
    p.push(box([-W / 2, y0 + 0.5, 0], [0.2, 1.0, D], "wall"));
    p.push(box([-W / 2, y0 + 1.95, 0], [0.08, 1.9, D], "glass"));
    p.push(box([-W / 2, y0 + 3.15, 0], [0.2, 0.5, D], "wall"));
    // Corridor partitions
    p.push(box([0, y0 + 1.35, -2], [W - 6, 2.7, 0.12], "wall"));
    for (let x = -W / 2 + 5; x < W / 2 - 3; x += 4.9) p.push(box([x, y0 + 1.35, -5], [0.12, 2.7, 6], "wall"));
    // MEP below the slab above: supply/return ducts, cable tray, medical gas, sprinkler main
    const top = y0 + FH - 0.3;
    p.push(box([0, top - 0.42, 1.4], [W - 2, 0.6, 1.2], "duct"));
    p.push(box([0, top - 0.36, 3.6], [W - 2, 0.45, 0.8], "vessel"));
    p.push(box([W / 2 - 2.2, y0 + 1.0, 4.5], [2.4, 2.0, 2.2], "vessel")); // floor AHU
    for (let x = -W / 2 + 3; x < W / 2 - 2; x += 4.9) p.push(box([x, top - 0.3, -3.2], [0.5, 0.3, 8], "duct"));
    p.push(cyl([0, top - 0.8, 5.4], 0.13, W - 2, "x", "equip"));
    p.push(cyl([0, top - 0.8, 6.0], 0.11, W - 2, "x", "pipe"));
    p.push(cyl([0, top - 0.8, 6.6], 0.11, W - 2, "x", "pipe"));
    p.push(box([0, top - 0.25, 7.4], [W - 2, 0.1, 0.6], "steel"));
  }
  // Service risers through all floors (front right)
  p.push(cyl([W / 2 - 0.8, (floors * FH) / 2, 7.2], 0.16, floors * FH, "y", "equip"));
  p.push(cyl([W / 2 - 1.4, (floors * FH) / 2, 7.2], 0.14, floors * FH, "y", "pipe"));
  p.push(cyl([W / 2 - 2.0, (floors * FH) / 2, 7.2], 0.18, floors * FH, "y", "vessel"));
  // Core, roof plant
  p.push(box([W / 2 - 3, (floors * FH) / 2, -D / 2 + 3.2], [5, floors * FH, 5.6], "wall"));
  p.push(box([-6, floors * FH + 1.1, -2], [5, 1.9, 3], "steel"));
  p.push(box([4, floors * FH + 0.9, 1], [3, 1.5, 2.4], "steel"));
  p.push(cyl([10, floors * FH + 0.9, 3], 1.1, 1.5, "y", "vessel"));
  return p;
}

/* ── Scan simulator ──────────────────────────────────────────── */
export interface Cloud {
  positions: Float32Array;
  colors: Float32Array;
  intensity: Float32Array;
  count: number;
}

/** The four simulated scanner setups (x, y, z in metres). */
export const stations: V3[] = [
  [-6, 1.7, 7],
  [20, 1.7, 3],
  [-25, 1.7, -2],
  [6, 1.7, -15],
];

const reflect: Record<Cls, number> = {
  ground: 0.5,
  wall: 0.9,
  roof: 0.6,
  glass: 0.22,
  pipe: 0.8,
  vessel: 0.85,
  steel: 0.55,
  equip: 0.7,
  concrete: 0.7,
  vehicle: 0.95,
  duct: 0.8,
  slab: 0.7,
};
const density: Partial<Record<Cls, number>> = { steel: 150, equip: 260, pipe: 95, glass: 9, concrete: 26, vehicle: 80 };

type Emit = (x: number, y: number, z: number, cls: Cls, intensity: number, station: number) => void;

/** Simulates a registered multi-station terrestrial laser scan of the station scene. */
export function scanStation(scale = 1): Cloud {
  const pos: number[] = [];
  const col: number[] = [];
  const inten: number[] = [];
  simulateScan(scale, (x, y, z, cls, i) => {
    pos.push(x, y, z);
    const c = classColor[cls];
    col.push(c[0], c[1], c[2]);
    inten.push(i);
  });
  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
    intensity: new Float32Array(inten),
    count: pos.length / 3,
  };
}

/** Compact scan for the homepage film: typed arrays, shuffled so a draw range is an even level of detail. */
export interface PackedCloud {
  count: number;
  position: Float32Array;
  cls: Uint8Array;
  intensity: Uint8Array;
  station: Uint8Array;
  rand: Uint8Array;
}

export function scanStationPacked(scale = 1): PackedCloud {
  const pos: number[] = [];
  const cls: number[] = [];
  const inten: number[] = [];
  const st: number[] = [];
  const index = Object.fromEntries(classList.map((c, i) => [c, i])) as Record<Cls, number>;
  simulateScan(scale, (x, y, z, c, i, s) => {
    pos.push(x, y, z);
    cls.push(index[c]);
    inten.push(i);
    st.push(s);
  });
  const n = cls.length;
  const order = new Uint32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  const rnd = seeded(7);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }
  const out: PackedCloud = {
    count: n,
    position: new Float32Array(n * 3),
    cls: new Uint8Array(n),
    intensity: new Uint8Array(n),
    station: new Uint8Array(n),
    rand: new Uint8Array(n),
  };
  for (let k = 0; k < n; k++) {
    const i = order[k];
    out.position[k * 3] = pos[i * 3];
    out.position[k * 3 + 1] = pos[i * 3 + 1];
    out.position[k * 3 + 2] = pos[i * 3 + 2];
    out.cls[k] = cls[i];
    out.intensity[k] = Math.round(inten[i] * 255);
    out.station[k] = st[i];
    out.rand[k] = Math.floor(rnd() * 256);
  }
  return out;
}

/* ── Map targets: ground points travel onto the gas network ──── */
export interface NetLine {
  kind: "steel" | "pe";
  coords: [number, number][];
}
/** DRS-01, where the steel trunk starts: the scanned station is the city gate. */
export const DRS01: [number, number] = [72.48364, 23.0134];

/** Lon/lat → local metres around DRS-01 (x east, z south). */
export function toLocal(lon: number, lat: number): [number, number] {
  const kx = 111320 * Math.cos((DRS01[1] * Math.PI) / 180);
  return [(lon - DRS01[0]) * kx, -(lat - DRS01[1]) * 110574];
}

export interface MapTargets {
  target: Float32Array; // xyz per point
  seq: Float32Array; // 0–1 draw order outward from DRS-01
  kind: Uint8Array; // 0 stays at the station, 1 steel trunk, 2 PE main
}

export function mapTargets(cloud: PackedCloud, lines: NetLine[]): MapTargets {
  const rnd = seeded(99);
  const n = cloud.count;
  const target = new Float32Array(n * 3);
  const seq = new Float32Array(n);
  const kind = new Uint8Array(n);

  type Seg = { ax: number; az: number; bx: number; bz: number; len: number; k: 1 | 2 };
  const segs: Seg[] = [];
  for (const l of lines) {
    const pts = l.coords.map(([lon, lat]) => toLocal(lon, lat));
    for (let i = 1; i < pts.length; i++) {
      const [ax, az] = pts[i - 1];
      const [bx, bz] = pts[i];
      const len = Math.hypot(bx - ax, bz - az);
      if (len > 1) segs.push({ ax, az, bx, bz, len, k: l.kind === "steel" ? 1 : 2 });
    }
  }
  const trunk = segs.filter((g) => g.k === 1);
  const pe = segs.filter((g) => g.k === 2);
  const cum = (list: Seg[]) => {
    const c: number[] = [];
    let t = 0;
    for (const g of list) c.push((t += g.len));
    return { c, total: t };
  };
  const ct = cum(trunk);
  const cp = cum(pe);
  const pick = (list: Seg[], c: { c: number[]; total: number }) => {
    const r = rnd() * c.total;
    let lo = 0;
    let hi = c.c.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (c.c[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    return list[lo];
  };
  let maxD = 1;
  for (const g of segs) maxD = Math.max(maxD, Math.hypot(g.ax, g.az), Math.hypot(g.bx, g.bz));

  for (let i = 0; i < n; i++) {
    const x = cloud.position[i * 3];
    const z = cloud.position[i * 3 + 2];
    if (cloud.cls[i] !== 0 || segs.length === 0) {
      // Structure stays put, flattened onto the plan
      target[i * 3] = x;
      target[i * 3 + 1] = 0;
      target[i * 3 + 2] = z;
      continue;
    }
    // Trunk gets 40% of the travelling points, PE mains share the rest by length
    const g =
      (rnd() < 0.4 && trunk.length) || !pe.length ? pick(trunk, ct) : pick(pe, cp);
    const t = rnd();
    const px = g.ax + (g.bx - g.ax) * t;
    const pz = g.az + (g.bz - g.az) * t;
    // Small perpendicular jitter gives the line a survey-point texture
    const j = (rnd() - 0.5) * (g.k === 1 ? 7 : 4);
    const nx = -(g.bz - g.az) / g.len;
    const nz = (g.bx - g.ax) / g.len;
    target[i * 3] = px + nx * j;
    target[i * 3 + 1] = 0;
    target[i * 3 + 2] = pz + nz * j;
    seq[i] = Math.hypot(px, pz) / maxD;
    kind[i] = g.k;
  }
  return { target, seq, kind };
}

function simulateScan(scale: number, emit: Emit) {
  const rnd = seeded(20260115);
  const prims = stationPrims();

  const glass = prims.filter((q) => q.k === "box" && q.cls === "glass") as Extract<Prim, { k: "box" }>[];
  const inGlass = (x: number, y: number, z: number) =>
    glass.some((g) => Math.abs(x - g.c[0]) < g.s[0] / 2 + 0.06 && Math.abs(y - g.c[1]) < g.s[1] / 2 && Math.abs(z - g.c[2]) < g.s[2] / 2 + 0.06);

  const put = (x: number, y: number, z: number, nx: number, ny: number, nz: number, cls: Cls) => {
    // Visibility / incidence from the best station
    let best = 0;
    let dist = 99;
    let who = 0;
    for (let si = 0; si < stations.length; si++) {
      const s = stations[si];
      const dx = s[0] - x,
        dy = s[1] - y,
        dz = s[2] - z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const f = (nx * dx + ny * dy + nz * dz) / d;
      if (f > best) {
        best = f;
        dist = d;
        who = si;
      }
    }
    if (rnd() > 0.1 + 0.9 * Math.sqrt(best)) return;
    if (cls === "wall" && inGlass(x, y, z)) return;
    const n = 0.012;
    emit(
      x + (rnd() - 0.5) * n,
      y + (rnd() - 0.5) * n,
      z + (rnd() - 0.5) * n,
      cls,
      Math.min(1, Math.max(0.08, reflect[cls] * (0.4 + 0.6 * best) * (1 - dist / 90) + (rnd() - 0.5) * 0.14)),
      who,
    );
  };

  for (const q of prims) {
    const dens = (density[q.cls] ?? 62) * scale;
    if (q.k === "box") {
      const [cx, cy, cz] = q.c;
      const [sx, sy, sz] = q.s;
      const faces: [number, V3, number, number][] = [
        [sx * sy, [0, 0, 1], sx, sy],
        [sx * sy, [0, 0, -1], sx, sy],
        [sz * sy, [1, 0, 0], sz, sy],
        [sz * sy, [-1, 0, 0], sz, sy],
        [sx * sz, [0, 1, 0], sx, sz],
      ];
      for (const [area, n, du, dv] of faces) {
        const count = Math.round(area * dens);
        for (let i = 0; i < count; i++) {
          // Quantised columns give the vertical scan-line texture of a real TLS
          let u = (rnd() - 0.5) * du;
          if (du > 1.5) u = Math.round(u / 0.07) * 0.07 + (rnd() - 0.5) * 0.012;
          const v = (rnd() - 0.5) * dv;
          if (n[2]) put(cx + u, cy + v, cz + (n[2] * sz) / 2, n[0], n[1], n[2], q.cls);
          else if (n[0]) put(cx + (n[0] * sx) / 2, cy + v, cz + u, n[0], n[1], n[2], q.cls);
          else put(cx + u, cy + sy / 2, cz + v, 0, 1, 0, q.cls);
        }
      }
    } else if (q.k === "cyl") {
      const count = Math.round(2 * Math.PI * q.r * q.h * dens);
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2;
        const t = (rnd() - 0.5) * q.h;
        const ca = Math.cos(a),
          sa = Math.sin(a);
        if (q.axis === "y") put(q.c[0] + ca * q.r, q.c[1] + t, q.c[2] + sa * q.r, ca, 0, sa, q.cls);
        else if (q.axis === "x") put(q.c[0] + t, q.c[1] + ca * q.r, q.c[2] + sa * q.r, 0, ca, sa, q.cls);
        else put(q.c[0] + ca * q.r, q.c[1] + sa * q.r, q.c[2] + t, ca, sa, 0, q.cls);
      }
    } else {
      const count = Math.round(Math.PI * q.r * Math.hypot(q.r, q.h) * dens);
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2;
        const t = Math.sqrt(rnd());
        put(q.c[0] + Math.cos(a) * q.r * t, q.c[1] + q.h * (1 - t), q.c[2] + Math.sin(a) * q.r * t, 0, 1, 0, q.cls);
      }
    }
  }

  // Ground: concentric rings around each scanner, thinning with range, with scan shadows
  const rects = [
    [-25, -15, -11, -7],
    [-16.4, 7.05, -11.6, 8.95],
  ]; // building, vehicle (x0,z0,x1,z1)
  const circles = [[16, -11, 3.2]];
  const blocked = (sx: number, sz: number, x: number, z: number) => {
    const dx = x - sx,
      dz = z - sz;
    for (const [x0, z0, x1, z1] of rects) {
      let t0 = 0,
        t1 = 1;
      for (const [o, d, lo, hi] of [
        [sx, dx, x0, x1],
        [sz, dz, z0, z1],
      ]) {
        if (Math.abs(d) < 1e-9) {
          if (o < lo || o > hi) {
            t0 = 2;
            break;
          }
        } else {
          const a = (lo - o) / d,
            b = (hi - o) / d;
          t0 = Math.max(t0, Math.min(a, b));
          t1 = Math.min(t1, Math.max(a, b));
        }
      }
      if (t0 <= t1) return true;
    }
    for (const [cx, cz, r] of circles) {
      const fx = sx - cx,
        fz = sz - cz;
      const a = dx * dx + dz * dz,
        b = 2 * (fx * dx + fz * dz),
        c = fx * fx + fz * fz - r * r;
      const disc = b * b - 4 * a * c;
      if (disc > 0) {
        const t = (-b - Math.sqrt(disc)) / (2 * a);
        if (t > 0 && t < 1) return true;
      }
    }
    return false;
  };
  for (let si = 0; si < stations.length; si++) {
    const s = stations[si];
    for (let r = 1.1; r < 42; r *= 1.034) {
      const n = Math.round((360 + r * 9) * scale);
      const phase = rnd() * 6.28;
      for (let i = 0; i < n; i++) {
        if (rnd() < r / 60) continue;
        const a = phase + (i / n) * Math.PI * 2;
        const x = s[0] + Math.cos(a) * r,
          z = s[2] + Math.sin(a) * r;
        if (x < -31 || x > 30 || z < -19 || z > 20) continue;
        if (blocked(s[0], s[2], x, z)) continue;
        emit(x, (rnd() - 0.5) * 0.02, z, "ground", Math.max(0.1, 0.62 - r / 70 + (rnd() - 0.5) * 0.16), si);
      }
    }
  }
}
