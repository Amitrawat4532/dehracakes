"use client";

import { useSyncExternalStore } from "react";
import { getRenderTier, type RenderTier } from "@/lib/device";

const noop = () => () => {};

/** `null` during SSR / hydration, then the device's render tier. */
export function useRenderTier(): RenderTier | null {
  return useSyncExternalStore(noop, getRenderTier, () => null);
}
