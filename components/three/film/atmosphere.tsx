"use client";
/* eslint-disable react-hooks/immutability -- R3F render loop: materials and objects are mutated every frame by design */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/utils";
import { stations } from "../scenes";

/** Mutable levels the scene writes each frame (0–1). */
export type AtmosphereLevels = { scanners: number; dust: number; spin: number };

/**
 * Cinematic layer: the four scanner heads with spinning laser fans (strong
 * during the intro, a faint idle spin afterwards) and slow survey dust.
 */
export function Atmosphere({ levels }: { levels: React.RefObject<AtmosphereLevels> }) {
  const fans = useRef<THREE.Group[]>([]);
  const laserMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(1, 0.353, 0.212),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const headMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(1, 0.42, 0.28),
        size: 9,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const tripodMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: 0x8e9791, transparent: true, opacity: 0 }),
    [],
  );

  // A fan of 7 laser lines per scanner, spread vertically like a real TLS mirror
  const fanGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 7; i++) {
      const pitch = -0.32 + i * 0.09;
      pts.push(0, 0, 0, Math.cos(pitch) * 30, Math.sin(pitch) * 30, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const headGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(stations.flat(), 3));
    return g;
  }, []);
  const tripodGeo = useMemo(() => {
    const pts: number[] = [];
    for (const [x, y, z] of stations)
      for (const a of [0, 2.1, 4.2]) pts.push(x, y, z, x + Math.cos(a) * 0.7, 0, z + Math.sin(a) * 0.7);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  // Survey dust: slow motes in the air above the site
  const dust = useMemo(() => {
    const rnd = seeded(31);
    const n = 1400;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -36 + rnd() * 72;
      pos[i * 3 + 1] = rnd() * 16;
      pos[i * 3 + 2] = -24 + rnd() * 44;
      seed[i] = rnd() * 6.28;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        varying float vA;
        void main() {
          vec3 p = position;
          p.x = mod(position.x + uTime * 0.35 + 36.0, 72.0) - 36.0;
          p.y += sin(uTime * 0.4 + aSeed) * 0.6;
          p.z += cos(uTime * 0.3 + aSeed * 1.7) * 0.6;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vA = smoothstep(130.0, 30.0, -mv.z) * (0.4 + 0.6 * fract(aSeed * 7.13));
          gl_PointSize = clamp(90.0 / -mv.z, 1.0, 3.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(0.93, 0.92, 0.89, (1.0 - d * 2.0) * vA * uOpacity * 0.5);
        }
      `,
    });
    return { g, m };
  }, []);

  useFrame((state, dt) => {
    const l = levels.current;
    if (!l) return;
    const t = state.clock.elapsedTime;
    laserMat.opacity = 0.55 * l.scanners;
    headMat.opacity = Math.min(1, l.scanners * 1.6);
    tripodMat.opacity = 0.5 * Math.min(1, l.scanners * 1.6);
    fans.current.forEach((f, i) => {
      if (f) f.rotation.y += dt * (0.6 + 2.6 * l.spin) * (i % 2 ? 1 : -1);
    });
    dust.m.uniforms.uTime.value = t;
    dust.m.uniforms.uOpacity.value = l.dust;
  });

  return (
    <group>
      <points geometry={dust.g} material={dust.m} frustumCulled={false} renderOrder={4} />
      <points geometry={headGeo} material={headMat} frustumCulled={false} renderOrder={5} />
      <lineSegments geometry={tripodGeo} material={tripodMat} frustumCulled={false} />
      {stations.map((s, i) => (
        <group
          key={i}
          position={s}
          ref={(g) => {
            if (g) fans.current[i] = g;
          }}
        >
          <lineSegments geometry={fanGeo} material={laserMat} frustumCulled={false} renderOrder={5} />
        </group>
      ))}
    </group>
  );
}
