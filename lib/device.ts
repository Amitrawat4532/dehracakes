/**
 * Decides how much 3D a device should get. Evaluated once on the client.
 *
 *  - "full":   desktop-class GPU, fine pointer — full scene, high detail
 *  - "lite":   phones / tablets / modest CPUs — simplified geometry, lower DPR
 *  - "static": no WebGL, reduced motion, data saver, slow network or very
 *              low memory — no WebGL at all, optimized images instead
 */
export type RenderTier = "full" | "lite" | "static";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

let cached: RenderTier | null = null;

export function getRenderTier(): RenderTier {
  if (cached) return cached;
  if (typeof window === "undefined") return "static";

  const nav = navigator as NavigatorWithHints;
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("tier");
  if (forced === "full" || forced === "lite" || forced === "static") {
    cached = forced;
    return cached;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = ["slow-2g", "2g"].includes(nav.connection?.effectiveType ?? "");
  const lowMemory = (nav.deviceMemory ?? 8) <= 2;

  if (reducedMotion || saveData || slowNetwork || lowMemory || !hasWebGL()) {
    cached = "static";
    return cached;
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;

  cached = coarse || narrow || fewCores ? "lite" : "full";
  return cached;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
