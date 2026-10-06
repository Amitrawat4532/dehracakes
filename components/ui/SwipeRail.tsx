"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/**
 * Mobile-native horizontal rail: scroll-snap, edge-to-edge bleed, and a
 * progress bar + counter that update without React re-renders on scroll
 * (the counter only re-renders when the active slide changes).
 *
 * `className` styles the scroller, so callers can turn it back into a grid
 * at larger breakpoints (e.g. `md:grid md:overflow-visible`).
 */
export function SwipeRail({
  children,
  count,
  className = "",
  progressClassName = "",
  tone = "dark",
  scrollerRef,
  label,
}: {
  children: ReactNode;
  count: number;
  className?: string;
  progressClassName?: string;
  tone?: "dark" | "light";
  scrollerRef?: RefObject<HTMLDivElement | null>;
  label: string;
}) {
  const ownRef = useRef<HTMLDivElement>(null);
  const ref = scrollerRef ?? ownRef;
  const bar = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(1 / count, p)})`;
      const next = Math.min(count - 1, Math.round(p * (count - 1)));
      setIndex((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref, count]);

  const track = tone === "dark" ? "bg-espresso/12" : "bg-ivory/20";
  const fill = tone === "dark" ? "bg-espresso" : "bg-ivory";
  const text = tone === "dark" ? "text-mocha" : "text-ivory/60";

  return (
    <>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 [-webkit-overflow-scrolling:touch] ${className}`}
      >
        {children}
      </div>
      <div className={`mt-6 flex items-center gap-4 px-5 ${progressClassName}`} aria-hidden="true">
        <span className={`relative h-[2px] flex-1 overflow-hidden rounded-full ${track}`}>
          <span
            ref={bar}
            className={`absolute inset-0 origin-left rounded-full transition-transform duration-300 ease-out ${fill}`}
            style={{ transform: `scaleX(${1 / count})` }}
          />
        </span>
        <span className={`text-xs tabular-nums ${text}`}>
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </>
  );
}
