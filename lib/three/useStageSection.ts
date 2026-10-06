"use client";

import { useEffect, useState, type RefObject } from "react";
import { useRenderTier } from "./useRenderTier";
import { STAGE_FAILED_EVENT, setSceneActive, setSceneMode, type SceneMode } from "./sceneState";

const visible = new Set<SceneMode>();

/**
 * Registers a section as a "window" onto the shared WebGL stage. While it is
 * on screen the stage renders in that section's mode; when no stage section
 * is visible, rendering stops.
 */
export function useStageSection(ref: RefObject<HTMLElement | null>, mode: SceneMode) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.add(mode);
          setSceneMode(mode);
        } else {
          visible.delete(mode);
          const other = [...visible][0];
          if (other) setSceneMode(other);
        }
        setSceneActive(visible.size > 0);
      },
      { rootMargin: "10% 0px 10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      visible.delete(mode);
      setSceneActive(visible.size > 0);
    };
  }, [ref, mode]);
}

/**
 * `null` while unknown (SSR/hydration), `true` when sections must render
 * their static fallback instead of relying on the WebGL stage.
 */
export function useStaticFallback(): boolean | null {
  const tier = useRenderTier();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const onFail = () => setFailed(true);
    window.addEventListener(STAGE_FAILED_EVENT, onFail);
    return () => window.removeEventListener(STAGE_FAILED_EVENT, onFail);
  }, []);
  if (tier === null) return null;
  return tier === "static" || failed;
}
