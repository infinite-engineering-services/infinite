"use client";
/* eslint-disable react-hooks/immutability -- R3F render loop: the camera and shader uniforms are mutated every frame by design */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildFilmData, loadNetwork, type FilmData } from "./scan-data";
import * as THREE from "three";
import { Atmosphere, type AtmosphereLevels } from "./atmosphere";
import { Basemap, makeBasemapMaterial } from "./basemap";
import { CameraRig } from "./camera-rig";
import { FilmModel, makeModelMaterials } from "./model";
import { FilmPoints, makePointsMaterial, useFilmGeometry } from "./points";
import { film, hotspotDefs, smooth } from "./store";
import { tierSettings } from "./tier";

declare global {
  interface Window {
    __frames?: number;
    __filmPoints?: number;
  }
}

type Props = {
  tier: "low" | "mid" | "high";
  visible: boolean;
  onReady: (points: number) => void;
  onFail: () => void;
};

/** Computes the cloud in a worker (falls back to the main thread), then mounts the canvas. */
export default function FilmCanvas({ tier, visible, onReady, onFail }: Props) {
  const [data, setData] = useState<FilmData | null>(null);

  useEffect(() => {
    let cancelled = false;
    let worker: Worker | undefined;
    const scale = tierSettings[tier].scale;
    const mainThread = () =>
      loadNetwork(location.origin).then((lines) =>
        setTimeout(() => !cancelled && setData(buildFilmData(scale, lines)), 0),
      );
    try {
      worker = new Worker(new URL("./scan.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<FilmData>) => !cancelled && setData(e.data);
      worker.onerror = () => {
        worker?.terminate();
        mainThread();
      };
      worker.postMessage({ scale, origin: location.origin });
    } catch {
      mainThread();
    }
    return () => {
      cancelled = true;
      worker?.terminate();
    };
  }, [tier]);

  if (!data) return null;
  return (
    <Canvas
      aria-hidden
      dpr={[1, tierSettings[tier].dpr]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [38, 20, 41], fov: 29, near: 1, far: 300 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Software renderers (no GPU) cannot run the film smoothly: use the posters.
        // ?webgl keeps it on for testing in headless browsers.
        const ctx = gl.getContext();
        const ext = ctx.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext ? String(ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
        if (
          /swiftshader|llvmpipe|basic render|software/i.test(renderer) &&
          !new URLSearchParams(location.search).has("webgl")
        ) {
          onFail();
          return;
        }
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <Scene data={data} small={tier === "low"} onReady={() => onReady(data.count)} onFail={onFail} />
    </Canvas>
  );
}

function Scene({
  data,
  small,
  onReady,
  onFail,
}: {
  data: FilmData;
  small: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  const { gl, setDpr, camera } = useThree();
  const levels = useRef<AtmosphereLevels>({ scanners: 0, dust: 0, spin: 1 });
  const tools = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      hit: new THREE.Vector3(),
      v: new THREE.Vector3(),
    }),
    [],
  );
  const points = useMemo(() => makePointsMaterial(gl.getPixelRatio()), [gl]);
  const model = useMemo(() => makeModelMaterials(), []);
  const pointsGeo = useFilmGeometry(data);
  const basemap = useMemo(() => makeBasemapMaterial(), []);
  const clock = useRef({ t: 0, started: false, frames: 0, acc: 0, slow: 0, inHero: false, heroSince: 0, started2: false, draw: 1 });
  // ?webgl (used by the test driver with software WebGL) keeps the 3D running however slow it is
  const testMode = useRef(typeof location !== "undefined" && new URLSearchParams(location.search).has("webgl"));
  const dist = useRef(61.7);
  const u = useRef({ sweep: -40, reg: 0, build: 0, fade: 1, explode: 0, flatten: 0, morph: 0, edges: 0, opacity: 1, map: 0, cursor: 0 });

  useEffect(() => {
    window.__filmPoints = data.count;
    return () => {
      points.dispose();
      model.solid.dispose();
      model.lines.dispose();
      basemap.dispose();
      pointsGeo.dispose();
    };
  }, [data, points, model, basemap, pointsGeo]);

  useFrame((_, dt) => {
    const c = clock.current;
    if (!c.started) {
      c.started = true;
      requestAnimationFrame(onReady);
    }
    window.__frames = (window.__frames ?? 0) + 1;
    if (!film.paused) c.t += Math.min(dt, 0.1);
    const s = film.explore.on ? film.explore.s : film.s;
    const t = c.t;

    // Adaptive quality, in gentle steps so the film never jumps to a flat image:
    // 1) lower the pixel ratio, 2) thin the cloud evenly down to 30 %, and only
    // 3) hand back to the posters if it still runs under ~14 fps for 6 s at the
    // lowest setting. Long gaps (tab hidden, scrolled away) are ignored.
    if (dt > 0.25) {
      c.frames = 0;
      c.acc = 0;
    } else {
      c.frames++;
      c.acc += dt;
    }
    if (c.acc > 2) {
      const fps = c.frames / c.acc;
      c.frames = 0;
      c.acc = 0;
      const pr = gl.getPixelRatio();
      if (fps < 30) {
        if (pr > 1) setDpr(Math.max(1, pr - 0.25));
        else if (c.draw > 0.3) {
          c.draw = Math.max(0.3, c.draw * 0.7);
          pointsGeo.setDrawRange(0, Math.floor(data.count * c.draw));
        }
      }
      if (fps < 14 && pr <= 1 && c.draw <= 0.3) {
        c.slow++;
        if (c.slow >= 3 && !testMode.current) onFail();
      } else c.slow = 0;
    }

    // Hero: the original LiDAR loop. A 6 s pass, 5 s hold fully classified, repeat.
    // The loop clock restarts each time the hero is re-entered, and re-entry
    // begins with a hold, so scrolling back up never runs the laser backwards.
    const inHero = s < 0.85;
    if (inHero && !c.inHero) c.heroSince = c.started2 ? t : 0;
    c.inHero = inHero;
    c.started2 = true;
    const ht = t - c.heroSince;
    const first = c.heroSince === 0;
    const cycle = (ht - (first ? 1.6 : 5)) % 11;
    const loop =
      first && ht < 1.6 ? -40 : !first && ht < 5 ? 60 : cycle < 6 ? -34 + (cycle / 6) * 68 : 60;
    const targets = {
      sweep: inHero ? loop : 60,
      reg: smooth(1.15, 1.4, s) * (1 - smooth(1.62, 1.88, s)),
      build: smooth(2.0, 2.5, s),
      fade: 1 - 0.9 * smooth(2.05, 2.45, s),
      explode: smooth(2.55, 2.8, s) * (1 - smooth(2.92, 3.06, s)),
      flatten: smooth(3.0, 3.18, s),
      morph: smooth(3.24, 3.56, s),
      edges: smooth(2.98, 3.14, s) * (1 - 0.6 * smooth(3.36, 3.56, s)),
      opacity: 1 - smooth(3.1, 3.26, s),
      map: smooth(3.46, 3.58, s),
      cursor: 0,
    };
    // Scanner cursor: live where the scan is on screen (hero, scan chapter, explore scan view)
    const cursorZone = film.explore.on ? s < 1.5 : s < 1.9;
    if (film.pointer.active && cursorZone) {
      tools.ndc.set(film.pointer.x, film.pointer.y);
      tools.ray.setFromCamera(tools.ndc, camera);
      if (tools.ray.ray.intersectPlane(tools.plane, tools.hit) && Math.abs(tools.hit.x) < 45 && Math.abs(tools.hit.z + 2) < 32) {
        film.cursor.x = tools.hit.x;
        film.cursor.y = 0;
        film.cursor.z = tools.hit.z;
        film.cursor.hit = true;
        targets.cursor = 1;
      } else film.cursor.hit = false;
    } else film.cursor.hit = false;
    const v = u.current;
    const k = 1 - Math.exp(-5 * Math.min(dt, 0.1));
    for (const key of Object.keys(targets) as (keyof typeof targets)[]) {
      // The sweep jumps back to the start of each pass; everything else glides
      v[key] =
        key === "sweep" && inHero && targets.sweep < v.sweep - 30
          ? targets.sweep // a new laser pass starts at the left edge
          : v[key] + (targets[key] - v[key]) * k;
    }

    const pu = points.uniforms;
    pu.uIntro.value = smooth(0, 2.6, t);
    pu.uSweep.value = v.sweep;
    pu.uRegister.value = v.reg;
    pu.uFade.value = v.fade;
    pu.uExplode.value = v.explode;
    pu.uFlatten.value = v.flatten;
    pu.uMorph.value = v.morph;
    pu.uTime.value = t;
    pu.uCursorAmt.value = v.cursor;
    if (film.cursor.hit) pu.uCursor.value.set(film.cursor.x, 0, film.cursor.z);
    pu.uFogNear.value = dist.current * 0.73;
    pu.uFogFar.value = dist.current * 1.95;

    const mu = model.solid.uniforms;
    mu.uBuild.value = v.build;
    mu.uExplode.value = v.explode;
    mu.uFlatten.value = v.flatten;
    mu.uOpacity.value = v.opacity;
    // Intro: scanners spin up and throw their laser fans, then idle faintly
    const lv = levels.current;
    const introGlow = 1 - smooth(2.6, 4.2, t);
    lv.scanners = Math.max(introGlow, 0.18) * (1 - smooth(0.85, 1.25, s)) + (film.explore.on && s < 1.5 ? 0.25 : 0);
    lv.spin = introGlow;
    lv.dust = 1 - smooth(2.9, 3.2, s);

    // Explore mode: pin the DOM hotspot labels to their 3D positions
    if (film.explore.on) {
      const w = gl.domElement.clientWidth;
      const h = gl.domElement.clientHeight;
      hotspotDefs.forEach((d, i) => {
        const el = film.hotspots[i];
        if (!el) return;
        tools.v.set(d.at[0], d.at[1] * (1 - v.flatten) + v.explode * 0, d.at[2]).project(camera);
        const visible = tools.v.z < 1 && Math.abs(tools.v.x) < 1.05 && Math.abs(tools.v.y) < 1.05;
        el.style.opacity = visible ? "1" : "0";
        el.style.transform = `translate(${((tools.v.x + 1) / 2) * w}px, ${((1 - tools.v.y) / 2) * h}px)`;
      });
    }

    basemap.opacity = v.map * 0.95;
    basemap.visible = v.map > 0.002;
    model.lines.uniforms.uEdges.value = Math.max(v.edges, v.build > 0.98 ? 0.18 * v.opacity : 0);
  });

  return (
    <>
      <CameraRig onDistance={(d) => (dist.current = d)} />
      <Atmosphere levels={levels} />
      <Basemap material={basemap} small={small} />
      <FilmModel solid={model.solid} lines={model.lines} />
      <FilmPoints geometry={pointsGeo} material={points} />
    </>
  );
}
