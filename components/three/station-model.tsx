"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { BimGround, BimLights, BimModel } from "./bim-model";
import { stationPrims } from "./scenes";

/** Orbitable BIM model of the same station shown as a point cloud in the hero. */
export default function StationModel() {
  const prims = useMemo(() => stationPrims(), []);
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [34, 20, 38], fov: 32, near: 1, far: 300 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0E1411"]} />
      <fog attach="fog" args={["#0E1411", 70, 150]} />
      <BimLights />
      <BimGround />
      <BimModel prims={prims} />
      <Grid
        position={[0, 0.01, 0]}
        args={[120, 120]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#26302C"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#3C4A42"
        fadeDistance={110}
        infiniteGrid
      />
      <OrbitControls
        makeDefault
        target={[-1, 2, -4]}
        enablePan={false}
        minDistance={18}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
      />
    </Canvas>
  );
}
