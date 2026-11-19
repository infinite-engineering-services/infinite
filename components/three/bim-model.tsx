"use client";

import { useMemo } from "react";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { classColor, type Cls, type Prim } from "./scenes";

const finish: Partial<
  Record<Cls, { metalness?: number; roughness?: number; opacity?: number }>
> = {
  pipe: { metalness: 0.35, roughness: 0.45 },
  vessel: { metalness: 0.25, roughness: 0.5 },
  steel: { metalness: 0.6, roughness: 0.5 },
  equip: { metalness: 0.2, roughness: 0.5 },
  glass: { metalness: 0.1, roughness: 0.15, opacity: 0.55 },
  vehicle: { metalness: 0.3, roughness: 0.4 },
};
const tint: Partial<Record<Cls, string>> = {
  steel: "#4a5750",
  concrete: "#8d928a",
  slab: "#b9bdb4",
};

/** Builds a solid, edge-lined BIM-style model from scene primitives. */
export function BimModel({
  prims,
  edges = true,
}: {
  prims: Prim[];
  edges?: boolean;
}) {
  const materials = useMemo(() => {
    const m = {} as Record<Cls, THREE.MeshStandardMaterial>;
    (Object.keys(classColor) as Cls[]).forEach((k) => {
      const f = finish[k] ?? {};
      m[k] = new THREE.MeshStandardMaterial({
        color: tint[k]
          ? new THREE.Color(tint[k])
          : new THREE.Color().setRGB(...classColor[k], THREE.SRGBColorSpace),
        metalness: f.metalness ?? 0,
        roughness: f.roughness ?? 0.85,
        transparent: f.opacity !== undefined,
        opacity: f.opacity ?? 1,
      });
    });
    return m;
  }, []);

  return (
    <group>
      {prims.map((q, i) => {
        if (q.k === "box") {
          const big = q.s[0] * q.s[1] * q.s[2] > 0.4;
          return (
            <mesh
              key={i}
              position={q.c}
              material={materials[q.cls]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={q.s} />
              {edges && big ? <Edges color="#0E1411" threshold={15} /> : null}
            </mesh>
          );
        }
        if (q.k === "cyl") {
          const rot: [number, number, number] =
            q.axis === "x"
              ? [0, 0, Math.PI / 2]
              : q.axis === "z"
                ? [Math.PI / 2, 0, 0]
                : [0, 0, 0];
          return (
            <mesh
              key={i}
              position={q.c}
              rotation={rot}
              material={materials[q.cls]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[q.r, q.r, q.h, q.r > 1 ? 48 : 20]} />
            </mesh>
          );
        }
        return (
          <mesh
            key={i}
            position={[q.c[0], q.c[1] + q.h / 2, q.c[2]]}
            material={materials[q.cls]}
            castShadow
          >
            <coneGeometry args={[q.r, q.h, q.r > 1 ? 48 : 20]} />
          </mesh>
        );
      })}
    </group>
  );
}

export function BimLights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#dfe8e2", "#1a2420", 0.6]} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />
      <directionalLight
        position={[-25, 15, -20]}
        intensity={0.45}
        color="#5CC8D7"
      />
    </>
  );
}

export function BimGround({ size = 120 }: { size?: number }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#141c18" roughness={1} />
    </mesh>
  );
}
