import type { Tier } from "./store";

/**
 * Picks how much 3D a device gets. Posters (static renders with a laser wipe)
 * are the safe default; real WebGL only where it will run smoothly.
 */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "poster";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return "poster";
  if (nav.connection?.effectiveType && nav.connection.effectiveType !== "4g") return "poster";

  // Cheap capability check only. Creating a throwaway WebGL context to read the
  // GPU name costs seconds on software renderers, so the canvas itself checks
  // the renderer once it exists (see film-canvas.tsx) and falls back if needed.
  if (typeof WebGL2RenderingContext === "undefined") return "poster";

  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) return (mem ?? 0) >= 4 && cores >= 6 ? "low" : "poster";
  if (cores >= 8 && (mem === undefined || mem >= 8)) return "high";
  return "mid";
}

/** Point-cloud scale, draw-range cap and pixel-ratio cap per tier. */
export const tierSettings: Record<Exclude<Tier, "poster">, { scale: number; dpr: number }> = {
  high: { scale: 1.6, dpr: 1.5 },
  mid: { scale: 1, dpr: 1.25 },
  low: { scale: 0.35, dpr: 1 },
};
