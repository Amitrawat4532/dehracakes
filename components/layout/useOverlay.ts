"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/lenis";

/** Escape-to-close + scroll lock (native and Lenis) for modal overlays. */
export function useOverlay(open: boolean, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
    };
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    getLenis()?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
}
