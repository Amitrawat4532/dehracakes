"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/device";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Inertial scrolling (Lenis) wired into GSAP's ticker so ScrollTrigger and
 * Lenis share one requestAnimationFrame loop. Disabled for reduced motion and
 * on touch devices, where native scrolling feels better.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -80 }, autoRaf: false });
    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // Route changes: jump to top (or to the hash target) without easing.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target instanceof HTMLElement) {
      requestAnimationFrame(() => lenis.scrollTo(target, { offset: -80, immediate: true }));
    } else {
      lenis.scrollTo(0, { immediate: true });
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}
