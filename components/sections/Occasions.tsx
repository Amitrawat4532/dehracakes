"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SwipeRail } from "@/components/ui/SwipeRail";
import { gsap } from "@/lib/gsap";
import type { Occasion } from "@/lib/types";

/**
 * Horizontal, scroll-driven occasion gallery.
 * Desktop: the section pins and vertical scroll pans the track; each image
 * counter-drifts inside its frame for depth. Mobile: native swipe with snap.
 */
export function Occasions({ occasions }: { occasions: Occasion[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const pan = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tr.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -10, scale: 1.18 },
          {
            xPercent: 10,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: pan,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      id="collections"
      aria-label="Collections by occasion"
      className="relative z-10 overflow-hidden bg-espresso text-ivory lg:h-svh"
    >
      {/* Phone header sits above the rail */}
      <div className="px-5 pb-8 pt-16 lg:hidden">
        <p className="eyebrow text-caramel-soft">Collections</p>
        <h2 className="font-display mt-3 text-[2.6rem] font-[340] text-ivory">
          A cake for <em className="text-caramel-soft [font-variation-settings:'SOFT'_100,'WONK'_1]">every</em> chapter.
        </h2>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-ivory/65">Swipe through the occasions — tap one to see its cakes.</p>
      </div>

      <SwipeRail
        label="Occasions"
        count={occasions.length}
        tone="light"
        scrollerRef={track}
        progressClassName="pb-16 lg:hidden"
        className="h-full items-center lg:w-max lg:snap-none lg:gap-8 lg:overflow-visible lg:py-0 lg:pl-[6vw] lg:pr-[10vw]"
      >
        <div className="flex shrink-0 flex-col justify-center max-lg:hidden lg:w-[30vw] lg:pr-[4vw]">
          <p className="eyebrow text-caramel-soft">Collections</p>
          <h2 id="occasions-title" className="font-display mt-4 text-[clamp(2.6rem,4.8vw,5rem)] font-[340] text-ivory">
            A cake for <em className="text-caramel-soft [font-variation-settings:'SOFT'_100,'WONK'_1]">every</em> chapter.
          </h2>
          <p className="mt-6 max-w-[22rem] text-[0.95rem] leading-relaxed text-ivory/70">
            From first birthdays to golden anniversaries — browse cakes chosen for the occasion, or ask us to design one around it.
          </p>
          <p className="eyebrow mt-10 flex items-center gap-3 text-[0.62rem] text-ivory/50">
            <span className="h-px w-10 bg-ivory/30" /> Keep scrolling
          </p>
        </div>

        {occasions.map((o, i) => (
          <Link
            key={o.slug}
            href={`/cakes?occasion=${o.slug}`}
            className={`group/occ relative block shrink-0 snap-start overflow-hidden rounded-[1.5rem] active:scale-[0.98] transition-transform lg:rounded-[1.75rem] ${
              i % 2 === 0 ? "aspect-[3/4] w-[72vw] max-w-[20rem] lg:aspect-auto lg:h-[72svh] lg:w-[28vw] lg:max-w-none" : "aspect-[3/4] w-[72vw] max-w-[20rem] lg:mt-[12svh] lg:aspect-auto lg:h-[60svh] lg:w-[24vw] lg:max-w-none"
            }`}
          >
            <div data-parallax className="absolute inset-0 will-change-transform">
              <Image
                src={o.image.src}
                alt={o.image.alt}
                fill
                sizes="(max-width: 1024px) 74vw, 28vw"
                className="object-cover transition-[filter] duration-700 group-hover/occ:brightness-[1.06]"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-8">
              <div>
                <p className="eyebrow text-[0.6rem] text-ivory/60">{String(i + 1).padStart(2, "0")} / {String(occasions.length).padStart(2, "0")}</p>
                <h3 className="font-display mt-1.5 text-[1.9rem] font-[380] leading-none text-ivory lg:mt-2 lg:text-[2.8rem]">{o.name}</h3>
                <p className="mt-1 text-sm text-ivory/75">{o.blurb}</p>
              </div>
              <span className="grid size-11 shrink-0 place-items-center lg:size-12 rounded-full border border-ivory/30 text-ivory transition-all duration-500 group-hover/occ:rotate-45 group-hover/occ:border-ivory group-hover/occ:bg-ivory group-hover/occ:text-espresso">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </SwipeRail>
    </section>
  );
}
