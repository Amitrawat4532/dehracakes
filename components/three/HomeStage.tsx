"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { STAGE_FAILED_EVENT, sceneState, subscribeScene } from "@/lib/three/sceneState";
import { useRenderTier } from "@/lib/three/useRenderTier";

// three.js + R3F live in their own chunk, fetched only after first paint.
const CakeStage = dynamic(() => import("./CakeStage"), { ssr: false });

/** If WebGL throws (context loss, driver bug), drop to the static fallback. */
class WebGLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HomeStage() {
  const tier = useRenderTier();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  // Defer the 3D bundle until the browser is idle after first paint.
  useEffect(() => {
    if (!tier || tier === "static") return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setLoad(true), { timeout: 1200 });
    return () => cancel(id);
  }, [tier]);

  useEffect(
    () =>
      subscribeScene(() => {
        setReady(sceneState.ready);
        setActive(sceneState.active);
      }),
    [],
  );

  // Pointer → normalised coordinates for subtle parallax (desktop only).
  useEffect(() => {
    if (tier !== "full") return;
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tier]);

  if (!tier || tier === "static" || !load) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] transition-opacity duration-[1400ms] ease-[var(--ease-soft)]"
      style={{ opacity: ready ? 1 : 0, visibility: active ? "visible" : "hidden" }}
    >
      <WebGLBoundary onError={() => window.dispatchEvent(new Event(STAGE_FAILED_EVENT))}>
        <CakeStage tier={tier} />
      </WebGLBoundary>
    </div>
  );
}
