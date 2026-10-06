"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { useRenderTier } from "@/lib/three/useRenderTier";
import type { Product } from "@/lib/types";

const ProductCakePreview = dynamic(() => import("@/components/three/ProductCakePreview"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-mocha">Preparing 3D view…</div>,
});

/**
 * One gallery for every screen size. Phones: edge-to-edge swipe with dots.
 * Desktop: the same snap track, driven by thumbnails. A "3D" tab swaps in
 * the procedural cake for products that have one.
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = [product.image, ...product.gallery];
  const [active, setActive] = useState(0);
  const [show3d, setShow3d] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const tier = useRenderTier();
  const can3d = product.has3d && tier !== null && tier !== "static";

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(Math.round(el.scrollLeft / el.clientWidth)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [show3d]);

  const goTo = (i: number) => {
    setShow3d(false);
    setActive(i);
    requestAnimationFrame(() => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" }));
  };

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div className="relative -mx-5 aspect-[4/5] overflow-hidden bg-parchment sm:mx-0 sm:rounded-[2rem] lg:aspect-[4/5]">
        {show3d && can3d ? (
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_55%,#fffaf2,#efe2cf)]">
            <ProductCakePreview quality={tier === "full" ? "high" : "low"} />
            <p className="eyebrow pointer-events-none absolute inset-x-0 bottom-14 text-center text-[0.6rem] text-mocha sm:bottom-5">Drag to turn</p>
          </div>
        ) : (
          <div
            ref={track}
            className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            aria-roledescription="carousel"
            aria-label={`${product.name} photos`}
          >
            {images.map((img, i) => (
              <div
                key={img.src}
                className="relative h-full w-full shrink-0 snap-center"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${images.length}`}
              >
                {i === 0 ? (
                  <ViewTransition name={`cake-${product.slug}`} share="morph" default="none">
                    <Image src={img.src} alt={img.alt} fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" />
                  </ViewTransition>
                ) : (
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Phone overlay controls: dots + 3D toggle */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-espresso/35 to-transparent px-5 pb-4 pt-10 lg:hidden">
          <div className="pointer-events-auto flex gap-1.5" role="tablist" aria-label="Photos">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={!show3d && i === active}
                aria-label={`Photo ${i + 1}`}
                onClick={() => goTo(i)}
                className="grid h-6 place-items-center"
              >
                <span className={`block h-1.5 rounded-full bg-ivory transition-all duration-500 ${!show3d && i === active ? "w-6" : "w-1.5 opacity-60"}`} />
              </button>
            ))}
          </div>
          {can3d ? (
            <button
              type="button"
              onClick={() => setShow3d((v) => !v)}
              className="pointer-events-auto flex h-10 items-center gap-2 rounded-full bg-ivory/90 px-4 text-xs font-medium uppercase tracking-[0.14em] text-espresso backdrop-blur active:scale-95"
            >
              <Cube />
              {show3d ? "Photos" : "View 3D"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Desktop thumbnails */}
      <div className="hidden gap-3 lg:flex" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={!show3d && i === active}
            onClick={() => goTo(i)}
            className={`relative size-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-ivory transition-all ${
              !show3d && i === active ? "ring-espresso" : "ring-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
            <span className="sr-only">Show image {i + 1}</span>
          </button>
        ))}
        {can3d ? (
          <button
            type="button"
            role="tab"
            aria-selected={show3d}
            onClick={() => setShow3d(true)}
            className={`grid size-24 shrink-0 place-items-center rounded-2xl bg-espresso text-ivory ring-2 ring-offset-2 ring-offset-ivory transition-all ${
              show3d ? "ring-espresso" : "ring-transparent"
            }`}
          >
            <span className="flex flex-col items-center gap-1">
              <Cube size={22} />
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em]">View 3D</span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Cube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </svg>
  );
}
