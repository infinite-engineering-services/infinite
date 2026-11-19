"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { classColor, classList, stationPrims, type Cls, type Prim } from "../scenes";
import { classOffset } from "./points";

const tint: Partial<Record<Cls, string>> = {
  steel: "#56635c",
  concrete: "#8d928a",
  slab: "#b9bdb4",
  ground: "#1a221f",
};

function primGeometry(q: Prim): THREE.BufferGeometry {
  let g: THREE.BufferGeometry;
  if (q.k === "box") {
    g = new THREE.BoxGeometry(...q.s);
    g.translate(...q.c);
  } else if (q.k === "cyl") {
    g = new THREE.CylinderGeometry(q.r, q.r, q.h, q.r > 1 ? 40 : 14);
    if (q.axis === "x") g.rotateZ(Math.PI / 2);
    if (q.axis === "z") g.rotateX(Math.PI / 2);
    g.translate(...q.c);
  } else {
    g = new THREE.ConeGeometry(q.r, q.h, q.r > 1 ? 40 : 14);
    g.translate(q.c[0], q.c[1] + q.h / 2, q.c[2]);
  }
  return g;
}

function withClass(g: THREE.BufferGeometry, cls: Cls, color: boolean) {
  const n = g.getAttribute("position").count;
  const ci = classList.indexOf(cls);
  g.setAttribute("aClass", new THREE.BufferAttribute(new Float32Array(n).fill(ci), 1));
  if (color) {
    const c = tint[cls] ? new THREE.Color(tint[cls]) : new THREE.Color().setRGB(...classColor[cls], THREE.SRGBColorSpace);
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  }
  return g;
}

/** Merges the station's 190 primitives into one solid geometry and one CAD-edge geometry. */
export function buildModelGeometry() {
  const prims = stationPrims();
  const solids: THREE.BufferGeometry[] = [];
  const edges: THREE.BufferGeometry[] = [];
  for (const q of prims) {
    const g = primGeometry(q);
    solids.push(withClass(g.clone(), q.cls, true));
    const big = q.k !== "box" || q.s[0] * q.s[1] * q.s[2] > 0.05;
    if (big) edges.push(withClass(new THREE.EdgesGeometry(g, 28), q.cls, false));
    g.dispose();
  }
  const solid = mergeGeometries(solids, false)!;
  const lines = mergeGeometries(edges, false)!;
  solids.forEach((g) => g.dispose());
  edges.forEach((g) => g.dispose());
  return { solid, lines };
}

const shared = /* glsl */ `
  attribute float aClass;
  uniform float uExplode;
  uniform float uFlatten;
  uniform float uClassOffset[12];
  vec3 storyPosition(vec3 p) {
    int ci = int(aClass + 0.5);
    p.y += uExplode * uClassOffset[ci];
    p.y *= 1.0 - uFlatten;
    return p;
  }
`;

const noise = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
`;

export function makeModelMaterials() {
  const common = {
    uBuild: { value: 0 },
    uOpacity: { value: 1 },
    uExplode: { value: 0 },
    uFlatten: { value: 0 },
    uClassOffset: { value: classList.map((c) => classOffset[c] ?? 0) },
  };

  const solid = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: common,
    vertexShader: /* glsl */ `
      ${shared}
      attribute vec3 color;
      varying vec3 vN;
      varying vec3 vC;
      varying vec3 vP;
      void main() {
        vP = position;
        vC = color;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(storyPosition(position), 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      ${noise}
      uniform float uBuild;
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vC;
      varying vec3 vP;
      void main() {
        // Model grows bottom-up behind a noisy cyan front
        float front = mix(-1.5, 15.0, uBuild);
        float h = vP.y + vnoise(vP.xz * 0.9) * 0.9;
        if (h > front) discard;
        vec3 L = normalize(vec3(0.45, 0.85, 0.35));
        float diff = 0.36 + 0.64 * max(dot(normalize(vN), L), 0.0);
        vec3 c = vC * diff;
        float band = (1.0 - smoothstep(0.0, 0.45, front - h)) * step(uBuild, 0.995);
        c = mix(c, vec3(0.243, 0.812, 0.824) * 1.4, band);
        gl_FragColor = vec4(c, uOpacity);
      }
    `,
  });

  const lines = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { ...common, uEdges: { value: 0 } },
    vertexShader: /* glsl */ `
      ${shared}
      varying vec3 vP;
      void main() {
        vP = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(storyPosition(position), 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uEdges;
      uniform float uBuild;
      varying vec3 vP;
      void main() {
        if (vP.y > mix(-1.5, 15.0, uBuild) + 0.3) discard;
        gl_FragColor = vec4(0.925, 0.918, 0.886, uEdges);
      }
    `,
  });
  // The two materials share uniform objects, so one write drives both
  lines.uniforms.uBuild = solid.uniforms.uBuild;
  lines.uniforms.uExplode = solid.uniforms.uExplode;
  lines.uniforms.uFlatten = solid.uniforms.uFlatten;
  return { solid, lines };
}

export function FilmModel({
  solid,
  lines,
}: {
  solid: THREE.ShaderMaterial;
  lines: THREE.ShaderMaterial;
}) {
  const geo = useMemo(() => buildModelGeometry(), []);
  return (
    <group>
      <mesh geometry={geo.solid} material={solid} renderOrder={1} frustumCulled={false} />
      <lineSegments geometry={geo.lines} material={lines} renderOrder={3} frustumCulled={false} />
    </group>
  );
}
