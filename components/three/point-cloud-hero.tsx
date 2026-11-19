"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scanStation } from "./scenes";

const vertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aIntensity;
  uniform float uSweep;
  uniform float uSize;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = position.x - uSweep;
    // Ahead of the laser: raw intensity greyscale. Behind it: classified colour.
    vec3 raw = vec3(aIntensity * 0.82 + 0.06);
    vec3 classified = aColor * (0.42 + 0.72 * aIntensity);
    float passed = 1.0 - smoothstep(-0.15, 0.15, d);
    vec3 c = mix(raw, classified, passed);
    float beam = 1.0 - smoothstep(0.0, 0.5, abs(d));
    c = mix(c, vec3(1.0, 0.353, 0.235), beam * 0.9);
    vColor = c;
    float fog = smoothstep(120.0, 45.0, -mv.z);
    vAlpha = (0.5 + 0.5 * max(passed, beam)) * fog;
    gl_PointSize = clamp(uSize * (1.0 + beam) * (60.0 / -mv.z), 1.0, 4.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (dot(uv, uv) > 0.25) discard;
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

/**
 * The simulated station scan. `sweep`:
 *  - "animate": laser passes left → right, classifying the cloud, then repeats
 *  - number: fixed laser position (use -99 for raw intensity, 99 for fully classified)
 */
export function StationCloud({
  sweep = "animate",
  sway = true,
  scale = 1,
}: {
  sweep?: "animate" | number;
  sway?: boolean;
  scale?: number;
}) {
  const data = useMemo(() => scanStation(scale), [scale]);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { gl, pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uSweep: { value: typeof sweep === "number" ? sweep : -40 },
      uSize: { value: 1.15 * Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl, sweep],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sweep === "animate" && mat.current) {
      // 8 s pass, 5 s hold fully classified, repeat
      const cycle = (t + 2) % 13;
      mat.current.uniforms.uSweep.value =
        cycle < 8 ? -34 + (cycle / 8) * 68 : 60;
    }
    if (sway && group.current) {
      group.current.rotation.y = Math.sin(t * 0.07) * 0.2 + pointer.x * 0.05;
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute
            attach="attributes-aIntensity"
            args={[data.intensity, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export const stationCamera = {
  position: [38, 20, 41] as [number, number, number],
  target: [0, 1.5, -4] as const,
  fov: 29,
};

/** Holds the horizontal field of view of a 16:9 frame, so narrow canvases show the whole station. */
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const half =
      Math.tan(THREE.MathUtils.degToRad(stationCamera.fov / 2)) * (16 / 9);
    const aspect = size.width / size.height;
    // eslint-disable-next-line react-hooks/immutability -- three.js cameras are mutable by design
    cam.fov =
      aspect >= 16 / 9
        ? stationCamera.fov
        : THREE.MathUtils.radToDeg(2 * Math.atan(half / aspect));
    cam.lookAt(...stationCamera.target);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function PointCloudHero({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering when the hero is scrolled out of view
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        aria-hidden
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{
          position: stationCamera.position,
          fov: stationCamera.fov,
          near: 1,
          far: 260,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ camera }) => {
          camera.lookAt(...stationCamera.target);
          onReady?.();
        }}
      >
        <FitCamera />
        <StationCloud />
      </Canvas>
    </div>
  );
}
