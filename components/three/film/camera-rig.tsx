"use client";
/* eslint-disable react-hooks/immutability -- R3F render loop: the camera and shader uniforms are mutated every frame by design */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { basemapCenter } from "./basemap";
import { film, smooth } from "./store";

/**
 * Camera keyframes along the chapter coordinate `s` (0.4 at the top of the page,
 * about 3.6 at the end of the map chapter). Each pose orbits a target:
 * distance (m), azimuth and elevation (degrees). Distance is interpolated on a
 * log scale so the zoom from 60 m to 9 km feels even.
 */
type Pose = { s: number; t: [number, number, number]; d: number; az: number; el: number };
const poses: Pose[] = [
  { s: 0.4, t: [0, 1.5, -4], d: 61.7, az: 40.2, el: 17.4 }, // original hero framing
  { s: 0.95, t: [0, 1.5, -4], d: 57, az: 37, el: 18 },
  { s: 1.45, t: [0, 3, -8.5], d: 30, az: 29, el: 13 }, // into the pipe rack
  { s: 1.95, t: [0, 2.5, -6], d: 42, az: 27, el: 16 },
  { s: 2.35, t: [0, 2, -4], d: 60, az: 33, el: 22 }, // model reveal
  { s: 2.8, t: [0, 8, -4], d: 74, az: 40, el: 26 }, // by discipline
  { s: 3.08, t: [0, 0, -4], d: 82, az: 26, el: 58 },
  { s: 3.22, t: [0, 0, -3], d: 118, az: 0, el: 89.3 }, // plan view
  { s: 3.58, t: [basemapCenter[0], 0, basemapCenter[1]], d: 16600, az: 0, el: 89.3 }, // whole network, framed on the GIS render
];

const BASE_FOV = 29;

function sample(s: number) {
  if (s <= poses[0].s) return poses[0];
  for (let i = 1; i < poses.length; i++) {
    const a = poses[i - 1];
    const b = poses[i];
    if (s <= b.s) {
      const u = smooth(a.s, b.s, s);
      return {
        s,
        t: [0, 1, 2].map((k) => a.t[k] + (b.t[k] - a.t[k]) * u) as Pose["t"],
        d: Math.exp(Math.log(a.d) + (Math.log(b.d) - Math.log(a.d)) * u),
        az: a.az + (b.az - a.az) * u,
        el: a.el + (b.el - a.el) * u,
      };
    }
  }
  return poses[poses.length - 1];
}

const deg = THREE.MathUtils.degToRad;

export function CameraRig({ onDistance }: { onDistance: (d: number) => void }) {
  const { camera, size, pointer } = useThree();
  const cur = useRef({ t: new THREE.Vector3(0, 1.5, -4), d: 61.7, az: 40.2, el: 17.4, sway: 0 });
  const fine = useRef(
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  useFrame((_, dt) => {
    const e = film.explore;
    const p = e.on
      ? { s: e.s, t: [0, e.s > 3 ? 0 : 2, -4] as Pose["t"], d: e.dist, az: e.az, el: e.el }
      : sample(film.s);
    const c = cur.current;
    const k = 1 - Math.exp(-3.5 * Math.min(dt, 0.1));
    c.t.lerp(new THREE.Vector3(...p.t), k);
    c.d = Math.exp(Math.log(c.d) + (Math.log(p.d) - Math.log(c.d)) * k);
    c.az += (p.az - c.az) * k;
    c.el += (p.el - c.el) * k;
    // Gentle pointer parallax in the hero only (fine pointers, not paused)
    const swayTarget = fine.current && !film.paused && !e.on && film.s < 1 ? pointer.x * 3 : 0;
    c.sway += (swayTarget - c.sway) * k;

    const az = deg(c.az + c.sway);
    const el = deg(c.el);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(
      c.t.x + c.d * Math.cos(el) * Math.sin(az),
      c.t.y + c.d * Math.sin(el),
      c.t.z + c.d * Math.cos(el) * Math.cos(az),
    );
    cam.up.set(0, 1, 0);
    cam.lookAt(c.t);

    // Hold the horizontal field of view of a 16:9 frame on narrow screens
    const aspect = size.width / size.height;
    const half = Math.tan(deg(BASE_FOV / 2)) * (16 / 9);
    cam.fov = aspect >= 16 / 9 ? BASE_FOV : THREE.MathUtils.radToDeg(2 * Math.atan(half / aspect));
    cam.near = Math.max(0.1, c.d * 0.02);
    cam.far = c.d * 3 + 200;
    // Portrait: lift the scene into the upper half, above the text plates
    if (aspect < 1) cam.setViewOffset(size.width, size.height, 0, size.height * 0.17, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
    onDistance(c.d);
  });

  return null;
}
