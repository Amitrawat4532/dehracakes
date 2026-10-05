import type Lenis from "lenis";

/** The active Lenis instance (null on touch devices / reduced motion). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
