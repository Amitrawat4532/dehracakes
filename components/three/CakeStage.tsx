"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { layerChannels } from "@/lib/three/layerStory";
import { sceneState, setSceneReady, subscribeScene } from "@/lib/three/sceneState";
import { ASSEMBLED, CakeModel, type CakeChannels } from "./cake/CakeModel";
import { StudioLights } from "./StudioLights";

/**
 * The single, page-wide WebGL canvas for the home page. It sits fixed behind
 * the content; the hero and "layer by layer" sections are transparent
 * windows onto it. Rendering pauses whenever neither section is on screen.
 */

const FOV = 30;
const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;
const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Pull the camera back on tall/narrow screens so the cake always fits. */
function fitFactor(aspect: number, halfWidth: number, baseDistance: number) {
  const needed = halfWidth / (Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * aspect);
  return Math.max(1, needed / baseDistance);
}

const KEY_DAY = new THREE.Color("#fff1e0");
const KEY_GOLDEN = new THREE.Color("#ffc58a");
const KEY_STUDIO = new THREE.Color("#fff5ea");

function Rig({ quality }: { quality: "high" | "low" }) {
  const cake = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const channels = useRef<CakeChannels>({ ...ASSEMBLED });
  const smoothPointer = useRef({ x: 0, y: 0 });
  const lastMode = useRef(sceneState.mode);
  const frames = useRef(0);
  const v = useMemo(
    () => ({
      cam: new THREE.Vector3(0, 1.6, 7.2),
      look: new THREE.Vector3(0, 0.5, 0),
      lookTarget: new THREE.Vector3(),
      camTarget: new THREE.Vector3(),
      color: new THREE.Color(),
    }),
    [],
  );
  const cakeX = useRef(0);
  const extraRot = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const { mode, hero, layers, pointer } = sceneState;
    const { width, height } = state.size;
    const aspect = width / height;
    const wide = aspect > 1.05;
    const t = state.clock.elapsedTime;

    smoothPointer.current.x = damp(smoothPointer.current.x, pointer.x, 2.5, dt);
    smoothPointer.current.y = damp(smoothPointer.current.y, pointer.y, 2.5, dt);
    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;

    let targetX = 0;
    let targetRot = 0;
    let keyIntensity = 2.1;

    if (mode === "hero") {
      Object.assign(channels.current, ASSEMBLED);
      const e = ss(0, 1, hero);
      const fit = fitFactor(aspect, wide ? 1.9 : 1.75, 8.4);
      v.camTarget.set(lerp(0, -0.25, e), lerp(2.25, 1.5, e), lerp(8.4, 5.7, e) * fit);
      v.lookTarget.set(0, lerp(wide ? 1.3 : 1.95, wide ? 0.75 : 1.75, e), 0);
      targetX = wide ? lerp(0, 0.95, ss(0.3, 0.85, hero)) : 0;
      targetRot = hero * Math.PI * 0.85;
      v.color.copy(KEY_DAY).lerp(KEY_GOLDEN, e);
      keyIntensity = lerp(2.1, 2.9, e);
    } else {
      const c = layerChannels(layers, channels.current);
      const fin = ss(0.86, 1, layers);
      // Frame the stack between the section header and the progress bar.
      const fit = fitFactor(aspect, wide ? 1.7 : 1.85, 8);
      const look = lerp(0.62, 1.62, c.explode) - fin * 0.05;
      v.camTarget.set(0, look + 1.25, lerp(8.4, 11.2, c.explode) * fit);
      // Phones: lift the cake into the space above the bottom step card.
      v.lookTarget.set(0, look + (wide ? 0 : -0.75), 0);
      targetRot = layers * Math.PI * 1.6;
      v.color.copy(KEY_STUDIO).lerp(KEY_GOLDEN, fin);
      keyIntensity = lerp(2.2, 2.7, fin);
    }

    const snap = lastMode.current !== mode || frames.current === 0;
    lastMode.current = mode;

    if (snap) {
      v.cam.copy(v.camTarget);
      v.look.copy(v.lookTarget);
      cakeX.current = targetX;
      extraRot.current = targetRot;
    } else {
      v.cam.set(
        damp(v.cam.x, v.camTarget.x, 4, dt),
        damp(v.cam.y, v.camTarget.y, 4, dt),
        damp(v.cam.z, v.camTarget.z, 4, dt),
      );
      v.look.set(
        damp(v.look.x, v.lookTarget.x, 4, dt),
        damp(v.look.y, v.lookTarget.y, 4, dt),
        damp(v.look.z, v.lookTarget.z, 4, dt),
      );
      cakeX.current = damp(cakeX.current, targetX, 4, dt);
      extraRot.current = damp(extraRot.current, targetRot, 5, dt);
    }

    // Gentle handheld parallax from the pointer
    state.camera.position.set(v.cam.x + px * 0.28, v.cam.y + py * 0.16, v.cam.z);
    state.camera.lookAt(v.look);

    if (cake.current) {
      cake.current.position.x = cakeX.current;
      cake.current.position.y = Math.sin(t * 1.1) * 0.035;
      cake.current.rotation.x = py * 0.06;
      cake.current.rotation.z = -px * 0.03;
    }
    if (spin.current) {
      spin.current.rotation.y = t * 0.14 + extraRot.current + px * 0.4;
    }
    if (keyLight.current) {
      keyLight.current.color.lerp(v.color, snap ? 1 : 1 - Math.exp(-3 * dt));
      keyLight.current.intensity = damp(keyLight.current.intensity, keyIntensity, 3, dt);
    }

    frames.current++;
    if (frames.current === 3) setSceneReady();
  });

  return (
    <>
      <StudioLights keyRef={keyLight} />
      <group ref={cake}>
        <group ref={spin}>
          <CakeModel quality={quality} channels={channels} />
        </group>
      </group>
    </>
  );
}

/** Stops the render loop entirely while the 3D sections are off screen. */
function FrameloopController() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const apply = () => setFrameloop(sceneState.active ? "always" : "never");
    apply();
    return subscribeScene(apply);
  }, [setFrameloop]);
  return null;
}

export default function CakeStage({ tier }: { tier: "full" | "lite" }) {
  const maxDpr = tier === "full" ? 1.75 : 1.5;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 1.6, 7.2] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1.02,
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <FrameloopController />
      <Rig quality={tier === "full" ? "high" : "low"} />
    </Canvas>
  );
}
