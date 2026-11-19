import { mapTargets, scanStationPacked, type MapTargets, type NetLine, type PackedCloud } from "../scenes";

export type FilmData = PackedCloud & MapTargets;

/** Reads the gas network lines (steel trunk + PE mains) for the map chapter. */
export async function loadNetwork(origin: string): Promise<NetLine[]> {
  try {
    const res = await fetch(new URL("/geo/network.geojson", origin));
    const fc = (await res.json()) as {
      features: { properties: { kind: string }; geometry: { type: string; coordinates: [number, number][] } }[];
    };
    return fc.features
      .filter((f) => f.geometry.type === "LineString" && (f.properties.kind === "steel" || f.properties.kind === "pe"))
      .map((f) => ({ kind: f.properties.kind as NetLine["kind"], coords: f.geometry.coordinates }));
  } catch {
    return [];
  }
}

export function buildFilmData(scale: number, lines: NetLine[]): FilmData {
  const cloud = scanStationPacked(scale);
  return { ...cloud, ...mapTargets(cloud, lines) };
}

export const transferables = (d: FilmData) => [
  d.position.buffer,
  d.cls.buffer,
  d.intensity.buffer,
  d.station.buffer,
  d.rand.buffer,
  d.target.buffer,
  d.seq.buffer,
  d.kind.buffer,
];
