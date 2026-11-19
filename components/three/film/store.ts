/**
 * Shared, mutable film state. Written by DOM listeners, read every frame by
 * the R3F scene, so scrolling and pointer moves never cause React re-renders.
 *
 * `s` is the chapter coordinate: about 0.4 at the top, 1–2 scan, 2–3 model,
 * 3–3.6 map.
 */
export type Tier = "poster" | "low" | "mid" | "high";

export const film = {
  s: 0,
  paused: false,
  tier: "poster" as Tier,
  /** True once the live 3D film has rendered its first frame. */
  ready: false,
  /** Pointer in normalised device coordinates over the stage (fine pointers only). */
  pointer: { x: 0, y: 0, active: false },
  /** Where the scanner cursor hits the ground plane (local metres), written by the scene. */
  cursor: { x: 0, y: 0, z: 0, hit: false },
  /** Explore mode: the visitor flies the camera and picks the chapter state. */
  explore: {
    on: false,
    s: 1.2,
    az: 40,
    el: 24,
    dist: 58,
  },
  /** DOM hotspot elements, positioned by the scene every frame in explore mode. */
  hotspots: [] as (HTMLElement | null)[],
};

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Points of interest on the demonstration station (local metres). */
export const hotspotDefs = [
  {
    id: "rack",
    at: [0, 5.9, -9] as const,
    title: "Pipe rack",
    body: "Five lines on two tiers, flanged every 6 m, on steel portal frames at 4 m centres.",
    spec: "Ø 0.4–0.7 m lines · steel · LOD 300",
  },
  {
    id: "tank",
    at: [16, 10.4, -11] as const,
    title: "Storage tank",
    body: "Ø 6.4 m × 9 m shell with a cone roof, spiral stair and top handrail.",
    spec: "Vessel · stair · handrail",
  },
  {
    id: "skid",
    at: [3, 2.6, -1.2] as const,
    title: "Twin-stream metering skid",
    body: "Filters, regulators, meters and isolation valves on a concrete plinth.",
    spec: "Equipment · valves · LOD 350",
  },
  {
    id: "building",
    at: [-18, 5.6, -11] as const,
    title: "Control building",
    body: "14 × 8 m envelope with parapet, glazing, canopy and roof units.",
    spec: "Architecture · LOD 300",
  },
  {
    id: "stack",
    at: [23, 13.4, -14] as const,
    title: "Vent stack",
    body: "13 m stack on a concrete pad, captured from two scan setups.",
    spec: "Steel · 13 m",
  },
  {
    id: "setup",
    at: [-6, 2.4, 7] as const,
    title: "Scan setup S1",
    body: "One of four terrestrial laser scanner setups, registered to one control network.",
    spec: "4 setups · WGS 84",
  },
];
