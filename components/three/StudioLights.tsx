"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Soft studio lighting. The environment map is generated procedurally once
 * (RoomEnvironment → PMREM) — no HDR download, no per-frame cost.
 */
export function StudioLights({
  envIntensity = 0.55,
  keyRef,
}: {
  envIntensity?: number;
  keyRef?: RefObject<THREE.DirectionalLight | null>;
}) {
    const gl = useThree((s) => s.gl);
    const get = useThree((s) => s.get);

    useEffect(() => {
      const pmrem = new THREE.PMREMGenerator(gl);
      const room = new RoomEnvironment();
      const env = pmrem.fromScene(room, 0.04).texture;
      const { scene } = get();
      scene.environment = env;
      scene.environmentIntensity = envIntensity;
      return () => {
        scene.environment = null;
        env.dispose();
        room.dispose();
        pmrem.dispose();
      };
    }, [gl, get, envIntensity]);

    return (
      <>
        <hemisphereLight args={["#fff6ea", "#b88a62", 0.55]} />
        <directionalLight ref={keyRef} position={[3.5, 5, 4]} intensity={2.1} color="#fff1e0" />
        <directionalLight position={[-4, 2.5, -3]} intensity={1.3} color="#ffd9c7" />
        <directionalLight position={[0, -2, 4]} intensity={0.25} color="#ffe9d2" />
      </>
    );
}
