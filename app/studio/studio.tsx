"use client";

/**
 * DEV-ONLY render studio. `npm run capture` opens each scene here in a headless
 * browser and saves it to public/renders/. Not reachable in production builds.
 */
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Map as MLMap, setWorkerUrl } from "maplibre-gl";
import { BimGround, BimLights, BimModel } from "@/components/three/bim-model";
import {
  StationCloud,
  stationCamera,
} from "@/components/three/point-cloud-hero";
import { hospitalPrims, stationPrims } from "@/components/three/scenes";
import { surveyStyle } from "@/components/map/pipeline-map";
import { seeded } from "@/lib/utils";

setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

const markReady = (delay = 600) =>
  setTimeout(() => (document.title = "ready"), delay);

function Look({ at }: { at: readonly [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(...at);
    markReady(1500);
  }, [camera, at]);
  return null;
}

function Three({ scene }: { scene: string }) {
  const station = useMemo(() => stationPrims(), []);
  const hospital = useMemo(() => hospitalPrims(), []);
  const cam = {
    position: stationCamera.position,
    fov: stationCamera.fov,
    near: 1,
    far: 300,
  };

  if (scene.startsWith("cloud")) {
    const sweep = scene === "cloud-raw" ? -99 : scene === "cloud-hero" ? 3 : 99;
    return (
      <Canvas
        dpr={1}
        camera={cam}
        gl={{ antialias: false, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#0E1411"]} />
        <Look at={stationCamera.target} />
        <StationCloud sweep={sweep} sway={false} scale={2.2} />
      </Canvas>
    );
  }
  if (scene === "bim-station") {
    return (
      <Canvas
        shadows
        dpr={1}
        camera={cam}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#0E1411"]} />
        <Look at={stationCamera.target} />
        <BimLights />
        <BimGround />
        <gridHelper
          args={[120, 60, "#33413a", "#1f2924"]}
          position={[0, 0.01, 0]}
        />
        <BimModel prims={station} />
      </Canvas>
    );
  }
  // bim-hospital
  return (
    <Canvas
      shadows
      dpr={1}
      camera={{ position: [30, 11.5, 42], fov: 32, near: 1, far: 300 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#0E1411"]} />
      <Look at={[-1, 8.6, 0]} />
      <BimLights />
      <BimGround />
      <gridHelper
        args={[120, 60, "#33413a", "#1f2924"]}
        position={[0, 0.01, 0]}
      />
      <BimModel prims={hospital} />
    </Canvas>
  );
}

/* ── Heritage façade: orthographic point-cloud elevation with CAD trace ── */
function Facade() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const W = (cv.width = 1600),
      H = (cv.height = 900);
    const g = cv.getContext("2d")!;
    g.fillStyle = "#0E1411";
    g.fillRect(0, 0, W, H);
    const rnd = seeded(1898);
    const FW = 25,
      FH = 12.2; // façade metres
    const sc = 58,
      ox = (W - FW * sc) / 2,
      oy = H - 110;
    const bay = FW / 5;

    // Relief depth (m) at façade coordinate; null = open (no return)
    const depth = (x: number, y: number): number | null => {
      if (x < 0 || x > FW || y < 0) return null;
      const top =
        11.2 + 0.55 * Math.pow(Math.abs(Math.sin((x * Math.PI) / 0.9)), 0.55);
      if (y > top) return null;
      if (y > 10.6) return 0.05;
      if (y < 0.6) return 0.18;
      const bx = (x % bay) - bay / 2; // -bay/2 … bay/2 from bay centre
      const edge = bay / 2 - Math.abs(bx);
      if (y > 10.0) return 0.38 + (x % 0.42 < 0.21 ? 0.12 : 0); // cornice with dentils
      if (y > 5.15 && y < 5.5) return 0.22; // string course
      if (edge < 0.3 && y < 10)
        return 0.3 * Math.sqrt(1 - Math.pow((edge - 0.3) / 0.3, 2)) + 0.05; // engaged column
      if (y < 5.15) {
        // Pointed, cusped arch
        const hw = 1.45,
          spring = 3.1;
        if (Math.abs(bx) < hw) {
          if (y < spring) return Math.abs(bx) > hw - 0.14 ? 0.1 : null;
          const ay = y - spring;
          const lim =
            hw * Math.pow(Math.max(0, 1 - ay / 1.55), 0.62) +
            0.07 * Math.sin(ay * 9);
          if (Math.abs(bx) < lim - 0.14) return null;
          if (Math.abs(bx) < lim) return 0.1;
        }
        return 0;
      }
      // Upper floor: projecting jharokha with arched window and dome
      if (Math.abs(bx) < 1.25 && y > 6.1 && y < 9.0) {
        const win =
          Math.abs(bx) < 0.55 &&
          y > 6.9 &&
          y < 8.3 + 0.35 * Math.sqrt(Math.max(0, 1 - Math.pow(bx / 0.55, 2)));
        return win ? null : 0.5;
      }
      if (
        y >= 9.0 &&
        y < 9.9 &&
        Math.abs(bx) <
          1.4 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 9.0) / 0.9, 2)))
      )
        return 0.45;
      if (y > 5.6 && y <= 6.1 && Math.abs(bx) < 1.25 - (6.1 - y) * 1.6)
        return 0.4; // brackets
      // Jali screens between
      if (y > 6.4 && y < 8.8 && Math.abs(bx) > 1.5 && edge > 0.45)
        return x % 0.24 < 0.11 && y % 0.24 < 0.11 ? null : 0.02;
      return 0;
    };

    const N = 760000;
    for (let i = 0; i < N; i++) {
      const x = rnd() * FW,
        y = rnd() * FH;
      const d = depth(x, y);
      if (d === null) {
        if (rnd() > 0.035) continue; // sparse interior returns
      }
      const dd = d ?? -0.6;
      const dx = (depth(x + 0.05, y) ?? -0.4) - dd;
      const dy = (depth(x, y + 0.05) ?? -0.4) - dd;
      let v = 0.5 + dd * 0.45 - dx * 2.2 + dy * 1.6;
      if (y % 0.42 < 0.03) v -= 0.12; // stone courses
      v += (rnd() - 0.5) * 0.22 + 0.08 * Math.sin(x * 0.7 + y * 1.3);
      // Occlusion gap bottom-left where a tree stood
      if (Math.hypot(x - 3.2, y - 2.2) < 1.5 && rnd() < 0.8) continue;
      const c = Math.round(Math.max(0.1, Math.min(1, v)) * 235);
      g.fillStyle = `rgb(${c},${c},${Math.round(c * 0.96)})`;
      g.fillRect(ox + x * sc, oy - y * sc, 1.25, 1.25);
    }
    // ground scatter
    for (let i = 0; i < 26000; i++) {
      const c = 60 + rnd() * 80;
      g.fillStyle = `rgb(${c},${c},${c})`;
      g.fillRect(
        ox - 60 + rnd() * (FW * sc + 120),
        oy + rnd() * rnd() * 46,
        1.2,
        1.2,
      );
    }

    // CAD trace over the right two bays
    const X = (m: number) => ox + m * sc,
      Y = (m: number) => oy - m * sc;
    g.save();
    g.beginPath();
    g.rect(X(bay * 3), 0, W, H);
    g.clip();
    g.fillStyle = "rgba(14,20,17,0.72)";
    g.fillRect(X(bay * 3), 0, W, H);
    g.strokeStyle = "#5CC8D7";
    g.lineWidth = 1.6;
    g.lineJoin = "round";
    const line = (pts: [number, number][]) => {
      g.beginPath();
      pts.forEach(([a, b], i) =>
        i ? g.lineTo(X(a), Y(b)) : g.moveTo(X(a), Y(b)),
      );
      g.stroke();
    };
    for (const yy of [0, 0.6, 5.15, 5.5, 10.0, 10.6])
      line([
        [bay * 3, yy],
        [FW, yy],
      ]);
    line([
      [FW, 0],
      [FW, 10.6],
    ]);
    const crest: [number, number][] = [];
    for (let x = bay * 3; x <= FW; x += 0.03)
      crest.push([
        x,
        11.2 + 0.55 * Math.pow(Math.abs(Math.sin((x * Math.PI) / 0.9)), 0.55),
      ]);
    line(crest);
    for (let b = 3; b < 5; b++) {
      const cx = b * bay + bay / 2;
      for (const e of [-bay / 2 + 0.3, bay / 2 - 0.3])
        line([
          [cx + e, 0.6],
          [cx + e, 10],
        ]);
      const arch: [number, number][] = [
        [cx - 1.45, 0.6],
        [cx - 1.45, 3.1],
      ];
      for (let ay = 0; ay <= 1.55; ay += 0.03)
        arch.push([
          cx - (1.45 * Math.pow(1 - ay / 1.55, 0.62) + 0.07 * Math.sin(ay * 9)),
          3.1 + ay,
        ]);
      for (let ay = 1.55; ay >= 0; ay -= 0.03)
        arch.push([
          cx + (1.45 * Math.pow(1 - ay / 1.55, 0.62) + 0.07 * Math.sin(ay * 9)),
          3.1 + ay,
        ]);
      arch.push([cx + 1.45, 3.1], [cx + 1.45, 0.6]);
      line(arch);
      line([
        [cx - 1.25, 6.1],
        [cx - 1.25, 9.0],
        [cx + 1.25, 9.0],
        [cx + 1.25, 6.1],
        [cx - 1.25, 6.1],
      ]);
      line([
        [cx - 0.55, 6.9],
        [cx - 0.55, 8.3],
      ]);
      line([
        [cx + 0.55, 6.9],
        [cx + 0.55, 8.3],
      ]);
      line([
        [cx - 0.55, 6.9],
        [cx + 0.55, 6.9],
      ]);
      g.beginPath();
      g.ellipse(X(cx), Y(8.3), 0.55 * sc, 0.35 * sc, 0, Math.PI, 0);
      g.stroke();
      g.beginPath();
      g.ellipse(X(cx), Y(9.0), 1.4 * sc, 0.9 * sc, 0, Math.PI, 0);
      g.stroke();
      line([
        [cx - 1.25, 6.1],
        [cx - 0.45, 5.6],
        [cx + 0.45, 5.6],
        [cx + 1.25, 6.1],
      ]);
    }
    g.restore();

    // Section line, dimensions, labels
    g.strokeStyle = "#FF5A3C";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(X(bay * 3), 40);
    g.lineTo(X(bay * 3), H - 40);
    g.stroke();
    g.strokeStyle = "#F2C230";
    g.fillStyle = "#F2C230";
    g.lineWidth = 1.2;
    g.font = "500 17px monospace";
    const dimY = oy + 62;
    g.beginPath();
    g.moveTo(X(0), dimY);
    g.lineTo(X(FW), dimY);
    for (let b = 0; b <= 5; b++) {
      g.moveTo(X(b * bay), dimY - 9);
      g.lineTo(X(b * bay), dimY + 9);
    }
    g.stroke();
    for (let b = 0; b < 5; b++)
      g.fillText("5 000", X(b * bay + bay / 2) - 26, dimY - 10);
    g.fillStyle = "#9AA59C";
    g.fillText("POINT CLOUD · ORTHO ELEVATION · INTENSITY", 40, 44);
    g.fillStyle = "#5CC8D7";
    g.fillText("CAD ELEVATION · 1:50", X(bay * 3) + 16, 44);
    markReady(300);
  }, []);
  return <canvas ref={ref} style={{ width: "100vw", height: "100vh" }} />;
}

/* ── Map renders on the real basemap ─────────────────────────── */
function MapScene({ scene }: { scene: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const city = scene === "map-city";
    const map = new MLMap({
      container: ref.current!,
      style: surveyStyle,
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
      ...(city
        ? { center: [72.5215, 23.0345], zoom: 15.3, pitch: 58, bearing: -24 }
        : scene === "map-hca"
          ? { center: [72.5235, 23.036], zoom: 13.6 }
          : { center: [72.517, 23.034], zoom: 12.9 }),
    });
    map.on("load", async () => {
      const get = (n: string) =>
        fetch(`/geo/${n}.geojson`).then((r) => r.json());
      const [network, assets, hca, hex, receptors] = await Promise.all(
        ["network", "assets", "hca", "leak-hex", "receptors"].map(get),
      );
      const src = (id: string, data: unknown) =>
        map.addSource(id, {
          type: "geojson",
          data: data as GeoJSON.FeatureCollection,
        });
      src("network", network);
      src("assets", assets);
      src("hca", hca);
      src("hex", hex);
      src("receptors", receptors);

      if (city) {
        map.addLayer({
          id: "b3d",
          type: "fill-extrusion",
          source: "omt",
          "source-layer": "building",
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "render_height"], 6],
              0,
              "#1d2823",
              12,
              "#2c3d36",
              30,
              "#3f6f73",
              60,
              "#5CC8D7",
            ],
            "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
            "fill-extrusion-base": [
              "coalesce",
              ["get", "render_min_height"],
              0,
            ],
            "fill-extrusion-opacity": 0.92,
          },
        });
      }
      if (scene === "map-raw") {
        // Unprocessed survey: noisy GPS shots along the routes, no topology
        const rnd = seeded(9);
        const pts: GeoJSON.Feature[] = [];
        for (const f of network.features) {
          const c = f.geometry.coordinates as [number, number][];
          for (let i = 0; i < c.length - 1; i++)
            for (let k = 0; k < 26; k++) {
              const t = rnd();
              pts.push({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [
                    c[i][0] +
                      (c[i + 1][0] - c[i][0]) * t +
                      (rnd() - 0.5) * 0.0011,
                    c[i][1] +
                      (c[i + 1][1] - c[i][1]) * t +
                      (rnd() - 0.5) * 0.0011,
                  ],
                },
              });
            }
        }
        src("raw", { type: "FeatureCollection", features: pts });
        map.addLayer({
          id: "raw",
          type: "circle",
          source: "raw",
          paint: {
            "circle-radius": 2.6,
            "circle-color": "#EDEFE6",
            "circle-opacity": 0.75,
          },
        });
      } else {
        if (scene === "map-hca")
          map.addLayer({
            id: "hex",
            type: "fill",
            source: "hex",
            paint: {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "count"],
                1,
                "#3A3412",
                8,
                "#8A6E14",
                20,
                "#F2C230",
                40,
                "#FF5A3C",
              ],
              "fill-opacity": 0.6,
              "fill-outline-color": "#0E1411",
            },
          });
        map.addLayer({
          id: "hca",
          type: "fill",
          source: "hca",
          filter: ["==", ["get", "kind"], "hca"],
          paint: { "fill-color": "#FF5A3C", "fill-opacity": 0.3 },
        });
        map.addLayer({
          id: "corr",
          type: "line",
          source: "hca",
          filter: ["==", ["get", "kind"], "corridor"],
          paint: {
            "line-color": "#FF5A3C",
            "line-width": 1.2,
            "line-dasharray": [3, 3],
            "line-opacity": 0.7,
          },
        });
        map.addLayer({
          id: "pe",
          type: "line",
          source: "network",
          filter: ["==", ["get", "kind"], "pe"],
          paint: {
            "line-color": "#7BC47F",
            "line-width": city ? 4 : 2.6,
            "line-dasharray": [2, 1.2],
          },
        });
        map.addLayer({
          id: "glow",
          type: "line",
          source: "network",
          filter: ["==", ["get", "kind"], "steel"],
          paint: {
            "line-color": "#F2C230",
            "line-width": 16,
            "line-opacity": 0.16,
            "line-blur": 5,
          },
        });
        map.addLayer({
          id: "st",
          type: "line",
          source: "network",
          filter: ["==", ["get", "kind"], "steel"],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#F2C230", "line-width": city ? 6 : 4.5 },
        });
        map.addLayer({
          id: "rec",
          type: "circle",
          source: "receptors",
          paint: {
            "circle-radius": 8,
            "circle-color": "#0E1411",
            "circle-stroke-color": "#FF5A3C",
            "circle-stroke-width": 3,
          },
        });
        map.addLayer({
          id: "as",
          type: "circle",
          source: "assets",
          paint: {
            "circle-radius": [
              "match",
              ["get", "kind"],
              "drs",
              9,
              "valve",
              6,
              4.5,
            ],
            "circle-color": [
              "match",
              ["get", "kind"],
              "drs",
              "#5CC8D7",
              "valve",
              "#0E1411",
              "#EDEFE6",
            ],
            "circle-stroke-color": [
              "match",
              ["get", "kind"],
              "drs",
              "#0E1411",
              "valve",
              "#5CC8D7",
              "#0E1411",
            ],
            "circle-stroke-width": 2.2,
          },
        });
      }
      map.once("idle", () => markReady(1200));
    });
    return () => map.remove();
  }, [scene]);
  return <div ref={ref} style={{ width: "100vw", height: "100vh" }} />;
}

export default function Studio() {
  const [scene, setScene] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScene(
      new URLSearchParams(window.location.search).get("scene") ?? "cloud-class",
    );
  }, []);
  if (!scene) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0E1411",
      }}
    >
      <style>{"nextjs-portal{display:none!important}"}</style>
      {scene === "facade" ? (
        <Facade />
      ) : scene.startsWith("map") ? (
        <MapScene scene={scene} />
      ) : (
        <Three scene={scene} />
      )}
    </div>
  );
}
