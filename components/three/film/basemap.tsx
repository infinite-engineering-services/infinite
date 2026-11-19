"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * The GIS render (public/renders/gis-network.webp) laid into the 3D world at
 * its true position, so the travelling scan points land on the drawn network.
 * Georeferenced from the steel trunk ST-001 in the image: DRS-01 sits at pixel
 * (447, 687) and the trunk end at (1131, 267), which is 9.51 m per pixel,
 * north up, in the same local metres as the scene (x east, z south).
 */
const PX = 9.51;
const ORIGIN_PX: [number, number] = [447, 687];
const IMG: [number, number] = [1600, 900];
const W = IMG[0] * PX;
const H = IMG[1] * PX;
export const basemapCenter: [number, number] = [
  (IMG[0] / 2 - ORIGIN_PX[0]) * PX,
  (IMG[1] / 2 - ORIGIN_PX[1]) * PX,
];

export function makeBasemapMaterial() {
  return new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
}

export function Basemap({ material, small }: { material: THREE.MeshBasicMaterial; small: boolean }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H);
    g.rotateX(-Math.PI / 2);
    g.translate(basemapCenter[0], -0.5, basemapCenter[1]);
    return g;
  }, []);

  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(`/renders/gis-network${small ? "-800" : ""}.webp`, (tex) => {
      if (!alive) return tex.dispose();
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      material.map = tex;
      material.needsUpdate = true;
    });
    return () => {
      alive = false;
      material.map?.dispose();
      geometry.dispose();
    };
  }, [material, geometry, small]);

  return <mesh geometry={geometry} material={material} renderOrder={0} frustumCulled={false} />;
}
