"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  HIGH,
  LOW,
  calyxGeometry,
  crumbTexture,
  dripGeometry,
  rng,
  rosetteGeometry,
  roundedDisc,
  shadowTexture,
  shardGeometry,
  standGeometries,
  strawberryGeometry,
} from "./geometry";

/**
 * Animation channels (0 → 1). Hero uses the fully assembled cake (all 1,
 * explode 0); the "Made layer by layer" section scrubs through them.
 */
export type CakeChannels = {
  explode: number;
  sponge: number;
  cream: number;
  ganache: number;
  coat: number;
  drip: number;
  toppings: number;
};

export const ASSEMBLED: CakeChannels = {
  explode: 0,
  sponge: 1,
  cream: 1,
  ganache: 1,
  coat: 1,
  drip: 1,
  toppings: 1,
};

const R = 1;
const LAYERS = [
  { kind: "sponge", h: 0.3 },
  { kind: "cream", h: 0.07 },
  { kind: "ganache", h: 0.05 },
  { kind: "sponge", h: 0.3 },
  { kind: "cream", h: 0.07 },
  { kind: "ganache", h: 0.05 },
  { kind: "sponge", h: 0.3 },
] as const;
const STACK_H = LAYERS.reduce((n, l) => n + l.h, 0); // 1.14
const COAT_R = R + 0.045;
const COAT_H = STACK_H + 0.05;
const GAP = 0.26;
const TOP_Y = COAT_H + 0.022;

const saturate = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

type Props = {
  quality: "high" | "low";
  channels: RefObject<CakeChannels>;
};

export function CakeModel({ quality, channels }: Props) {
  const detail = quality === "high" ? HIGH : LOW;
  const physical = quality === "high";

  const assets = useMemo(() => {
    const crumb = crumbTexture("#e7c189");
    const crumbSide = crumb.clone();
    crumbSide.repeat.set(10, 0.5);
    crumbSide.needsUpdate = true;

    const Phys = (p: THREE.MeshPhysicalMaterialParameters) =>
      physical ? new THREE.MeshPhysicalMaterial(p) : new THREE.MeshStandardMaterial(p);

    const mats = {
      spongeSide: new THREE.MeshStandardMaterial({ map: crumbSide, roughness: 0.94, color: "#ffffff" }),
      spongeCap: new THREE.MeshStandardMaterial({ map: crumb, roughness: 0.96, color: "#ffffff" }),
      cream: new THREE.MeshStandardMaterial({ color: "#fbf3e6", roughness: 0.58 }),
      ganache: Phys({ color: "#33190f", roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
      coat: Phys({ color: "#f2e7d6", roughness: 0.52, sheen: 0.5, sheenColor: new THREE.Color("#fff6ea"), sheenRoughness: 0.6 }),
      drip: Phys({ color: "#2a150d", roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08 }),
      rosette: new THREE.MeshStandardMaterial({ color: "#f7eddf", roughness: 0.62 }),
      strawberry: Phys({ vertexColors: true, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
      calyx: new THREE.MeshStandardMaterial({ color: "#4d6c2c", roughness: 0.7 }),
      shard: Phys({ color: "#2c160d", roughness: 0.22, clearcoat: 0.5 }),
      gold: new THREE.MeshStandardMaterial({ color: "#d8b273", metalness: 1, roughness: 0.24 }),
      plate: Phys({ color: "#fbf8f2", roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
      pedestal: new THREE.MeshStandardMaterial({ color: "#c9a46a", metalness: 1, roughness: 0.3 }),
      shadow: new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
    };

    const geos = {
      sponge: new THREE.CylinderGeometry(R, R, 0.3, detail.radial, 1).translate(0, 0.15, 0),
      cream: roundedDisc(R - 0.012, 0.07, 0.03, detail),
      ganache: roundedDisc(R - 0.03, 0.05, 0.02, detail),
      coat: roundedDisc(COAT_R, COAT_H, 0.06, detail),
      drip: dripGeometry(COAT_R, detail),
      rosette: rosetteGeometry(detail),
      strawberry: strawberryGeometry(detail),
      calyx: calyxGeometry(),
      shard: shardGeometry(),
      pearl: new THREE.SphereGeometry(0.024, 12, 10),
      shadow: new THREE.PlaneGeometry(4.2, 4.2).rotateX(-Math.PI / 2),
      ...standGeometries(detail),
    };

    return { mats, geos, textures: [crumb, crumbSide] };
  }, [detail, physical]);

  useEffect(
    () => () => {
      Object.values(assets.geos).forEach((g) => g.dispose());
      Object.values(assets.mats).forEach((m) => {
        (m as THREE.MeshStandardMaterial).map?.dispose();
        m.dispose();
      });
      assets.textures.forEach((t) => t.dispose());
    },
    [assets],
  );

  // Topping placements (deterministic)
  const toppings = useMemo(() => {
    const rand = rng(41);
    const rosettes = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return { x: Math.cos(a) * 0.82, z: Math.sin(a) * 0.82, rot: rand() * Math.PI, delay: i / 12 };
    });
    const pearls = Array.from({ length: 22 }, () => {
      const a = rand() * Math.PI * 2;
      const r = 0.25 + rand() * 0.42;
      return { x: Math.cos(a) * r, z: Math.sin(a) * r, s: 0.6 + rand() * 0.7, delay: rand() };
    });
    const border = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2;
      return { x: Math.cos(a) * (COAT_R + 0.01), z: Math.sin(a) * (COAT_R + 0.01), rot: a };
    });
    return { rosettes, pearls, border };
  }, []);

  const layerRefs = useRef<Array<THREE.Mesh | null>>([]);
  const coatRef = useRef<THREE.Mesh>(null);
  const dripRef = useRef<THREE.Mesh>(null);
  const rosetteRef = useRef<THREE.InstancedMesh>(null);
  const pearlRef = useRef<THREE.InstancedMesh>(null);
  const borderRef = useRef<THREE.InstancedMesh>(null);
  const lastCoat = useRef(-1);
  const berryRefs = useRef<Array<THREE.Group | null>>([]);
  const shardRefs = useRef<Array<THREE.Mesh | null>>([]);
  const lastToppings = useRef(-1);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const c = channels.current;
    if (!c) return;

    // --- Layer stack ---------------------------------------------------
    let base = 0;
    let spongeIndex = 0;
    LAYERS.forEach((layer, i) => {
      const mesh = layerRefs.current[i];
      if (!mesh) return;
      const y = base + i * GAP * c.explode;
      base += layer.h;

      if (layer.kind === "sponge") {
        const p = easeOut(saturate(c.sponge * 1.6 - spongeIndex * 0.3));
        spongeIndex++;
        mesh.visible = p > 0.001;
        mesh.position.y = y + (1 - p) * 1.6;
        mesh.scale.setScalar(0.9 + 0.1 * p);
      } else {
        const p = easeBack(saturate(layer.kind === "cream" ? c.cream : c.ganache));
        mesh.visible = p > 0.01;
        mesh.position.y = y;
        mesh.scale.set(Math.max(p, 0.001), Math.max(saturate(p), 0.001), Math.max(p, 0.001));
      }
    });

    // --- Buttercream coat (grows up from the plate) ---------------------
    if (coatRef.current) {
      const p = easeOut(saturate(c.coat));
      coatRef.current.visible = p > 0.001;
      coatRef.current.scale.set(1, Math.max(p, 0.001), 1);
    }

    // --- Piped shell border at the base (follows the coat) --------------
    if (lastCoat.current !== c.coat && borderRef.current) {
      lastCoat.current = c.coat;
      const border = borderRef.current;
      toppings.border.forEach((b, i) => {
        const p = easeBack(saturate(c.coat * 2.2 - 1.2 - (i / toppings.border.length) * 0.2));
        tmp.position.set(b.x, 0.0, b.z);
        tmp.rotation.set(0, -b.rot, -Math.PI / 2.6);
        tmp.scale.set(Math.max(p * 0.5, 0.0001), Math.max(p * 0.62, 0.0001), Math.max(p * 0.5, 0.0001));
        tmp.updateMatrix();
        border.setMatrixAt(i, tmp.matrix);
      });
      border.instanceMatrix.needsUpdate = true;
      border.visible = c.coat > 0.5;
    }

    // --- Ganache drip (pours down from the top edge) ---------------------
    if (dripRef.current) {
      const p = easeOut(saturate(c.drip));
      dripRef.current.visible = p > 0.001;
      dripRef.current.scale.set(1, Math.max(p, 0.001), 1);
    }

    // --- Toppings (drop in, staggered) ----------------------------------
    if (lastToppings.current !== c.toppings) {
      lastToppings.current = c.toppings;
      const t = c.toppings;

      const rosettes = rosetteRef.current;
      if (rosettes) {
        toppings.rosettes.forEach((r, i) => {
          const p = easeBack(saturate(t * 2 - r.delay));
          tmp.position.set(r.x, TOP_Y + (1 - saturate(p)) * 0.9, r.z);
          tmp.rotation.set(0, r.rot, 0);
          tmp.scale.setScalar(Math.max(p * 1.22, 0.0001));
          tmp.updateMatrix();
          rosettes.setMatrixAt(i, tmp.matrix);
        });
        rosettes.instanceMatrix.needsUpdate = true;
        rosettes.visible = t > 0.001;
      }

      const pearls = pearlRef.current;
      if (pearls) {
        toppings.pearls.forEach((pl, i) => {
          const p = easeOut(saturate(t * 2.2 - 1 - pl.delay * 0.2));
          tmp.position.set(pl.x, TOP_Y + 0.012 + (1 - p) * 1.4, pl.z);
          tmp.rotation.set(0, 0, 0);
          tmp.scale.setScalar(Math.max(p * pl.s, 0.0001));
          tmp.updateMatrix();
          pearls.setMatrixAt(i, tmp.matrix);
        });
        pearls.instanceMatrix.needsUpdate = true;
        pearls.visible = t > 0.4;
      }

      berryRefs.current.forEach((g, i) => {
        if (!g) return;
        const p = easeBack(saturate(t * 2 - 0.55 - i * 0.12));
        g.visible = p > 0.001;
        g.position.y = (1 - saturate(p)) * 1.2;
        g.scale.setScalar(Math.max(p * 1.45, 0.0001));
      });
      shardRefs.current.forEach((m, i) => {
        if (!m) return;
        const p = easeOut(saturate(t * 2 - 0.85 - i * 0.1));
        m.visible = p > 0.001;
        m.scale.setScalar(Math.max(p, 0.0001));
      });
    }
  });

  const { mats, geos } = assets;

  return (
    <group>
      {/* Contact shadow */}
      <mesh geometry={geos.shadow} material={mats.shadow} position={[0, -0.805, 0]} renderOrder={-1} />

      {/* Stand */}
      <mesh geometry={geos.plate} material={mats.plate} />
      <mesh geometry={geos.pedestal} material={mats.pedestal} />
      <mesh geometry={geos.rim} material={mats.pedestal} />

      {/* Layers */}
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          ref={(m) => {
            layerRefs.current[i] = m;
          }}
          geometry={geos[layer.kind]}
          material={
            layer.kind === "sponge"
              ? [mats.spongeSide, mats.spongeCap, mats.spongeCap]
              : layer.kind === "cream"
                ? mats.cream
                : mats.ganache
          }
        />
      ))}

      <mesh ref={coatRef} geometry={geos.coat} material={mats.coat} />
      <mesh ref={dripRef} geometry={geos.drip} material={mats.drip} position={[0, COAT_H, 0]} />

      {/* Toppings */}
      <instancedMesh ref={rosetteRef} args={[geos.rosette, mats.rosette, toppings.rosettes.length]} frustumCulled={false} />
      <instancedMesh ref={borderRef} args={[geos.rosette, mats.coat, toppings.border.length]} frustumCulled={false} />
      <instancedMesh ref={pearlRef} args={[geos.pearl, mats.gold, toppings.pearls.length]} frustumCulled={false} />

      <group position={[0, TOP_Y, 0]}>
        {[
          { p: [-0.16, 0.0, -0.08], r: [0.15, 0.4, -0.12] },
          { p: [0.17, 0.0, 0.02], r: [-0.1, 1.8, 0.2] },
          { p: [0.0, -0.02, 0.24], r: [1.25, 0.6, 0.15] },
        ].map((b, i) => (
          <group
            key={i}
            ref={(g) => {
              berryRefs.current[i] = g;
            }}
          >
            <group position={b.p as [number, number, number]} rotation={b.r as [number, number, number]}>
              <mesh geometry={geos.strawberry} material={mats.strawberry} />
              <mesh geometry={geos.calyx} material={mats.calyx} />
            </group>
          </group>
        ))}
        {[
          { p: [-0.02, 0.0, -0.3], r: [-0.12, 0.25, 0.08] },
          { p: [0.3, 0.0, -0.22], r: [-0.05, -0.6, -0.18] },
        ].map((s, i) => (
          <mesh
            key={i}
            ref={(m) => {
              shardRefs.current[i] = m;
            }}
            geometry={geos.shard}
            material={mats.shard}
            position={s.p as [number, number, number]}
            rotation={s.r as [number, number, number]}
          />
        ))}
      </group>
    </group>
  );
}

export const CAKE_DIMENSIONS = { STACK_H, COAT_H, GAP, TOP_Y, LAYER_COUNT: LAYERS.length };
