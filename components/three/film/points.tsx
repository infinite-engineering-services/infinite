"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { classColor, classList, stations } from "../scenes";
import type { FilmData } from "./scan-data";

/**
 * The scan film's point cloud. Same look as the original LiDAR hero: raw
 * intensity greyscale ahead of the red laser line, classified colour behind it.
 * Extra uniforms drive the story: fly-out from each scanner, per-setup tint,
 * fade while the model builds, explode by discipline, flatten to plan, and the
 * ground points travelling onto the gas network.
 */
const vertex = /* glsl */ `
  attribute float aClass;
  attribute float aIntensity;
  attribute float aStation;
  attribute float aRand;
  attribute vec3 aTarget;
  attribute float aSeq;
  attribute float aKind;

  uniform float uIntro;
  uniform float uSweep;
  uniform float uRegister;
  uniform float uFade;
  uniform float uExplode;
  uniform float uFlatten;
  uniform float uMorph;
  uniform float uSize;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uCursor;
  uniform float uCursorAmt;
  uniform float uCursorR;
  uniform float uTime;
  uniform vec3 uStations[4];
  uniform vec3 uStationColor[4];
  uniform vec3 uClassColor[12];
  uniform float uClassOffset[12];

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    int ci = int(aClass + 0.5);
    int si = int(aStation + 0.5);
    bool travels = aKind > 0.5;

    vec3 p = position;
    p.y += uExplode * uClassOffset[ci];
    p.y *= 1.0 - uFlatten;

    // Intro: each point leaves its scanner at a staggered moment and lands
    float k = smoothstep(aRand * 0.7, aRand * 0.7 + 0.3, uIntro);
    p = mix(uStations[si], p, k);

    // Map: ground points travel outward along the network
    float m = travels ? smoothstep(aSeq * 0.65, aSeq * 0.65 + 0.35, uMorph) : 0.0;
    p = mix(p, aTarget, m);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float d = position.x - uSweep;
    vec3 raw = vec3(aIntensity * 0.82 + 0.06);
    vec3 classified = uClassColor[ci] * (0.42 + 0.72 * aIntensity);
    float passed = 1.0 - smoothstep(-0.15, 0.15, d);
    vec3 c = mix(raw, classified, passed);
    float beam = (1.0 - smoothstep(0.0, 0.5, abs(d))) * (1.0 - uFlatten);
    c = mix(c, vec3(1.0, 0.353, 0.212), beam * 0.9);
    c = mix(c, uStationColor[si] * (0.45 + 0.65 * aIntensity), uRegister);
    vec3 net = aKind > 1.5 ? vec3(0.62, 0.66, 0.63) : vec3(0.957, 0.769, 0.188);
    c = mix(c, net, m);
    // Scanner cursor: points inside the ring light up classified, the ring glows red
    float cd = distance(p.xz, uCursor.xz);
    float near = (1.0 - smoothstep(0.0, uCursorR, cd)) * uCursorAmt;
    float ring = (1.0 - smoothstep(0.0, 0.32, abs(cd - uCursorR - 0.2 * sin(uTime * 3.0)))) * uCursorAmt;
    c = mix(c, classified * 1.35 + 0.08, near);
    c = mix(c, vec3(1.0, 0.353, 0.212) * 1.4, ring * 0.9);
    vColor = c;
    vGlow = max(beam, ring);

    float fog = smoothstep(uFogFar, uFogNear, -mv.z);
    float fade = mix(ci == 0 ? min(uFade + 0.25, 1.0) : uFade, 1.0, m);
    vAlpha = (0.5 + 0.5 * max(max(passed, beam), max(near, ring))) * mix(fog, 1.0, m) * k * fade;
    float size = clamp(uSize * (1.0 + beam * 1.6 + near * 0.8 + ring * 1.8) * (60.0 / -mv.z), 1.0, 7.0);
    gl_PointSize = max(size, m * (aKind > 1.5 ? 1.4 : 2.2));
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // Laser and cursor points render as soft glowing sprites, the rest as crisp dots
    float soft = 1.0 - smoothstep(0.05, 0.5, d);
    float a = mix(1.0, soft * soft * 1.6, vGlow);
    gl_FragColor = vec4(vColor * (1.0 + vGlow * 0.6), vAlpha * a);
  }
`;

/** Vertical lift per class when the model separates by discipline (metres). */
export const classOffset: Record<string, number> = {
  ground: 0,
  concrete: 0,
  slab: 0,
  vehicle: 0,
  wall: 5,
  roof: 5,
  glass: 5,
  steel: 10,
  pipe: 15,
  duct: 15,
  vessel: 20,
  equip: 20,
};

const stationHues = ["#FF5A36", "#3ECFD2", "#F4C430", "#ECEAE2"].map((h) => new THREE.Color(h));

export function makePointsMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uIntro: { value: 0 },
      uSweep: { value: -40 },
      uRegister: { value: 0 },
      uFade: { value: 1 },
      uExplode: { value: 0 },
      uFlatten: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 1.15 * Math.min(pixelRatio, 2) },
      uFogNear: { value: 45 },
      uFogFar: { value: 120 },
      uCursor: { value: new THREE.Vector3(0, 0, 0) },
      uCursorAmt: { value: 0 },
      uCursorR: { value: 5 },
      uTime: { value: 0 },
      uStations: { value: stations.map((s) => new THREE.Vector3(...s)) },
      uStationColor: { value: stationHues },
      uClassColor: { value: classList.map((c) => new THREE.Vector3(...classColor[c])) },
      uClassOffset: { value: classList.map((c) => classOffset[c] ?? 0) },
    },
  });
}

/** Builds the point geometry. Points are pre-shuffled, so a smaller draw range thins the cloud evenly. */
export function useFilmGeometry(data: FilmData) {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.position, 3));
    g.setAttribute("aClass", new THREE.BufferAttribute(data.cls, 1));
    g.setAttribute("aIntensity", new THREE.BufferAttribute(data.intensity, 1, true));
    g.setAttribute("aStation", new THREE.BufferAttribute(data.station, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(data.rand, 1, true));
    g.setAttribute("aTarget", new THREE.BufferAttribute(data.target, 3));
    g.setAttribute("aSeq", new THREE.BufferAttribute(data.seq, 1));
    g.setAttribute("aKind", new THREE.BufferAttribute(data.kind, 1));
    return g;
  }, [data]);
}

export function FilmPoints({
  geometry,
  material,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
}) {
  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
