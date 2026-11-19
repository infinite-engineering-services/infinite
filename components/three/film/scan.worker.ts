/// <reference lib="webworker" />
// Builds the film's point cloud off the main thread (≈0.3–1 s of CPU work).
import { buildFilmData, loadNetwork, transferables } from "./scan-data";

self.onmessage = async (e: MessageEvent<{ scale: number; origin: string }>) => {
  const lines = await loadNetwork(e.data.origin);
  const data = buildFilmData(e.data.scale, lines);
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(data, transferables(data));
};
