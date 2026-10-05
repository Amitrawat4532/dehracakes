"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { ASSEMBLED, CakeModel, type CakeChannels } from "./cake/CakeModel";
import { StudioLights } from "./StudioLights";

/** Inertial turntable driven by pointer drags. */
class Spinner {
  angle = 0.4;
  velocity = 0;
  step(dt: number) {
    this.velocity *= Math.exp(-3 * dt);
    this.angle += this.velocity * dt + dt * 0.25;
    return this.angle;
  }
  push(dx: number) {
    this.angle += dx * 0.01;
    this.velocity = dx * 0.6;
  }
}

function Turntable({ spinner, quality }: { spinner: Spinner; quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const channels = useRef<CakeChannels>({ ...ASSEMBLED });
  useFrame((state, dt) => {
    const angle = spinner.step(dt);
    if (group.current) {
      group.current.rotation.y = angle;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    }
  });
  return (
    <group ref={group}>
      <CakeModel quality={quality} channels={channels} />
    </group>
  );
}

/** Drag-to-turn 3D preview for the product page (same procedural cake). */
export default function ProductCakePreview({ quality = "high" }: { quality?: "high" | "low" }) {
  const [spinner] = useState(() => new Spinner());
  const last = useRef<number | null>(null);

  return (
    <div
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={(e) => {
        last.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (last.current === null) return;
        spinner.push(e.clientX - last.current);
        last.current = e.clientX;
      }}
      onPointerUp={() => {
        last.current = null;
      }}
      onPointerCancel={() => {
        last.current = null;
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 30, position: [0, 2.4, 7.6] }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)}
      >
        <StudioLights />
        <Turntable spinner={spinner} quality={quality} />
      </Canvas>
    </div>
  );
}
