import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural cake geometry. Everything is generated from a few profiles at
 * runtime — zero model downloads, and each layer can be animated on its own.
 * `detail` scales segment counts down for the "lite" render tier.
 */

export type Detail = { radial: number; curve: number };
export const HIGH: Detail = { radial: 96, curve: 10 };
export const LOW: Detail = { radial: 48, curve: 5 };

/** Seeded PRNG so the cake looks identical on every load. */
export function rng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Disc with softly rounded top/bottom edges, base at y = 0. */
export function roundedDisc(radius: number, height: number, bevel: number, d: Detail) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, 0)];
  const steps = d.curve;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - bevel + Math.cos(a) * bevel, bevel + Math.sin(a) * bevel));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - bevel + Math.cos(a) * bevel, height - bevel + Math.sin(a) * bevel));
  }
  pts.push(new THREE.Vector2(0, height));
  return new THREE.LatheGeometry(pts, d.radial);
}

/**
 * Ganache drip: a glossy top cap, a rolled lip and irregular drips running
 * down the side. Origin sits at the top edge so scaling Y "pours" it down.
 */
export function dripGeometry(radius: number, d: Detail, seed = 11) {
  const rand = rng(seed);
  const parts: THREE.BufferGeometry[] = [];

  const cap = roundedDisc(radius + 0.006, 0.045, 0.02, d);
  cap.translate(0, -0.025, 0);
  parts.push(cap);

  const lip = new THREE.TorusGeometry(radius - 0.004, 0.034, Math.max(8, d.curve * 2), d.radial);
  lip.rotateX(Math.PI / 2);
  lip.translate(0, -0.012, 0);
  parts.push(lip);

  const count = d.radial >= 96 ? 30 : 22;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.12;
    const long = rand() > 0.62;
    const len = long ? 0.22 + rand() * 0.28 : 0.05 + rand() * 0.14;
    const r = 0.028 + rand() * 0.018;
    const drip = new THREE.CapsuleGeometry(r, len, 4, Math.max(8, d.curve + 4));
    // Flatten against the cake wall
    drip.scale(1, 1, 0.55);
    // Bulb at the bottom: widen the lower hemisphere a touch
    const pos = drip.attributes.position as THREE.BufferAttribute;
    for (let v = 0; v < pos.count; v++) {
      const y = pos.getY(v);
      if (y < -len / 2) {
        pos.setX(v, pos.getX(v) * 1.18);
        pos.setZ(v, pos.getZ(v) * 1.18);
      }
    }
    drip.translate(0, -len / 2 - 0.01, 0);
    drip.rotateY(-angle + Math.PI / 2);
    const rr = radius + r * 0.18;
    drip.translate(Math.cos(angle) * rr, 0, Math.sin(angle) * rr);
    parts.push(drip);
  }

  const merged = mergeGeometries(
    parts.map((g) => (g.index ? g.toNonIndexed() : g)),
    false,
  )!;
  merged.computeVertexNormals();
  parts.forEach((g) => g.dispose());
  return merged;
}

/** A piped buttercream rosette (star-tip swirl). */
export function rosetteGeometry(d: Detail) {
  const profile = [
    [0, 0],
    [0.1, 0],
    [0.118, 0.028],
    [0.112, 0.07],
    [0.088, 0.118],
    [0.056, 0.162],
    [0.022, 0.198],
    [0.004, 0.214],
    [0, 0.216],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(profile, d.radial >= 96 ? 64 : 40);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = pos.getY(i);
    const theta = Math.atan2(z, x);
    const ridge = 1 + 0.17 * Math.cos(8 * theta + y * 22);
    pos.setX(i, x * ridge);
    pos.setZ(i, z * ridge);
  }
  g.computeVertexNormals();
  return g;
}

/** Strawberry body with a subtle colour gradient baked into vertex colours. */
export function strawberryGeometry(d: Detail) {
  const profile = [
    [0, 0],
    [0.03, 0.012],
    [0.07, 0.055],
    [0.098, 0.11],
    [0.108, 0.16],
    [0.1, 0.2],
    [0.072, 0.232],
    [0.03, 0.247],
    [0, 0.25],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(profile, d.radial >= 96 ? 40 : 24);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const deep = new THREE.Color("#8f0f1c");
  const bright = new THREE.Color("#c4222f");
  const pale = new THREE.Color("#e9b3a6");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 0.25;
    // tiny surface wobble so it doesn't read as a perfect lathe
    const th = Math.atan2(pos.getZ(i), pos.getX(i));
    const wobble = 1 + 0.035 * Math.sin(th * 5 + y * 9);
    pos.setX(i, pos.getX(i) * wobble);
    pos.setZ(i, pos.getZ(i) * wobble * 0.94);
    if (y < 0.75) c.copy(deep).lerp(bright, y / 0.75);
    else c.copy(bright).lerp(pale, (y - 0.75) / 0.25);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Green calyx (leaf crown) for the strawberries. */
export function calyxGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  const leaves = 7;
  for (let i = 0; i < leaves; i++) {
    const leaf = new THREE.SphereGeometry(0.05, 10, 6);
    leaf.scale(1, 0.14, 0.38);
    leaf.translate(0.05, 0, 0);
    leaf.rotateZ(0.25);
    leaf.rotateY((i / leaves) * Math.PI * 2);
    parts.push(leaf);
  }
  const stem = new THREE.CylinderGeometry(0.008, 0.012, 0.05, 6);
  stem.translate(0, 0.025, 0);
  parts.push(stem);
  const merged = mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)), false)!;
  merged.translate(0, 0.245, 0);
  merged.computeVertexNormals();
  return merged;
}

/** Thin tempered-chocolate shard. */
export function shardGeometry(seed = 3) {
  const rand = rng(seed);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.2 + rand() * 0.04, 0.02);
  shape.lineTo(0.24, 0.16 + rand() * 0.05);
  shape.lineTo(0.12, 0.3 + rand() * 0.06);
  shape.lineTo(-0.02, 0.2);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 1,
  });
  g.translate(-0.11, 0, -0.006);
  return g;
}

/** Porcelain cake stand: plate (porcelain) and pedestal (brushed gold). */
export function standGeometries(d: Detail) {
  const plate = new THREE.LatheGeometry(
    [
      [0, -0.05],
      [1.25, -0.05],
      [1.4, -0.03],
      [1.47, 0.01],
      [1.49, 0.035],
      [1.455, 0.03],
      [1.38, 0.0],
      [0, 0.0],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    d.radial,
  );
  const pedestal = new THREE.LatheGeometry(
    [
      [0, -0.05],
      [0.42, -0.05],
      [0.2, -0.12],
      [0.13, -0.22],
      [0.12, -0.52],
      [0.16, -0.6],
      [0.48, -0.72],
      [0.62, -0.78],
      [0.62, -0.81],
      [0, -0.81],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    d.radial,
  );
  const rim = new THREE.TorusGeometry(1.475, 0.012, 8, d.radial);
  rim.rotateX(Math.PI / 2);
  rim.translate(0, 0.036, 0);
  return { plate, pedestal, rim };
}

/** Speckled crumb texture for the sponge, drawn once into a small canvas. */
export function crumbTexture(base: string, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const rand = rng(23);
  for (let i = 0; i < size * 9; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 0.4 + rand() * 1.8;
    const dark = rand() > 0.45;
    ctx.fillStyle = dark ? `rgba(120,70,30,${0.08 + rand() * 0.2})` : `rgba(255,240,205,${0.1 + rand() * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** Soft radial "contact shadow" — a single texture instead of a shadow pass. */
export function shadowTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(42,26,18,0.55)");
  g.addColorStop(0.45, "rgba(42,26,18,0.22)");
  g.addColorStop(1, "rgba(42,26,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
