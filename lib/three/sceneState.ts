/**
 * Shared, mutable state between DOM scroll logic and the WebGL scene.
 *
 * Scroll handlers write here; the R3F render loop reads here every frame.
 * Using a plain object (not React state) means scrolling never triggers
 * React re-renders.
 */
export type SceneMode = "hero" | "layers";

type Listener = () => void;

/** Fired on window when the WebGL stage crashes, so sections can fall back. */
export const STAGE_FAILED_EVENT = "dehra:stage-failed";

export const sceneState = {
  mode: "hero" as SceneMode,
  /** 0 → 1 across the pinned hero section */
  hero: 0,
  /** 0 → 1 across the pinned "layer by layer" section */
  layers: 0,
  /** Normalised pointer, -1..1 */
  pointer: { x: 0, y: 0 },
  /** Whether any 3D section is on screen; used to pause rendering. */
  active: true,
  /** True once the first frame with the cake has rendered. */
  ready: false,
};

const listeners = new Set<Listener>();

export function subscribeScene(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSceneActive(active: boolean) {
  if (sceneState.active === active) return;
  sceneState.active = active;
  listeners.forEach((l) => l());
}

export function setSceneMode(mode: SceneMode) {
  if (sceneState.mode === mode) return;
  sceneState.mode = mode;
  listeners.forEach((l) => l());
}

export function setSceneReady() {
  if (sceneState.ready) return;
  sceneState.ready = true;
  listeners.forEach((l) => l());
}
