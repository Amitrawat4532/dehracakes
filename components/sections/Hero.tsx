"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { SplitWords } from "@/components/ui/Reveal";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/three/sceneState";
import { useStageSection, useStaticFallback } from "@/lib/three/useStageSection";

/**
 * Pinned, two-beat hero.
 *  Beat 1 — the headline sits *behind* the 3D cake (magazine-cover overlap).
 *  Beat 2 — on scroll the camera dollies in, the light warms, the cake slides
 *           aside and becomes the visual for "Made for every moment".
 *
 * Two sticky layers share the viewport: the headline layer paints below the
 * fixed WebGL canvas, the interactive layer paints above it.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const isStatic = useStaticFallback();

  useStageSection(section, "hero");

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            sceneState.hero = self.progress;
          },
        },
      });
      tl.to("[data-hero='headline']", { yPercent: -35, opacity: 0, duration: 0.4 }, 0.04)
        .to("[data-hero='static-cake']", { yPercent: -12, scale: 1.06, duration: 0.6 }, 0)
        .to("[data-hero='intro']", { y: 40, opacity: 0, duration: 0.22 }, 0.02)
        .to("[data-hero='cue']", { opacity: 0, duration: 0.1 }, 0)
        .fromTo(
          "[data-hero='beat2'] > *",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.05 },
          0.42,
        )
        .to("[data-hero='glow']", { opacity: 1, duration: 0.6 }, 0.2);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="top" aria-labelledby="hero-title" data-immersive className="relative h-[220vh] md:h-[240vh]">
      {/* ---------- Back layer: warm light + headline (below the canvas) ---------- */}
      <div ref={back} className="sticky top-0 z-[1] h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_62%,#fffaf2_0%,#f6ecdf_45%,#efe2cf_100%)]"
        />
        <div
          aria-hidden="true"
          data-hero="glow"
          className="absolute inset-0 opacity-0 bg-[radial-gradient(45%_50%_at_68%_55%,rgba(255,206,150,0.55),transparent_70%)]"
        />
        <div aria-hidden="true" className="grain absolute inset-0" />

        <div data-hero="headline" className="relative mx-auto flex h-full max-w-[1600px] flex-col items-center px-5 pt-[calc(var(--nav-h)+5svh)] sm:px-8 lg:pt-[calc(var(--nav-h)+4svh)]">
          <p className="eyebrow hero-fade mb-6 flex items-center gap-3 text-mocha" style={{ "--d": "100ms" } as CSSProperties}>
            <span className="h-px w-8 bg-gold" />
            Patisserie &amp; cake studio · Dehradun
            <span className="h-px w-8 bg-gold" />
          </p>
          <h1
            id="hero-title"
            className="font-display hero-rise text-center text-[clamp(3.1rem,10.5vw,4.6rem)] font-[360] text-espresso sm:text-[clamp(4rem,8.6vw,10.25rem)]"
          >
            <SplitWords text="A little sweetness," />
            <br />
            <span className="italic text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">
              <SplitWords text="made for your moment." />
            </span>
          </h1>
          <p className="hero-fade mt-5 max-w-[19rem] text-center text-[0.92rem] leading-relaxed text-cocoa md:hidden" style={{ "--d": "700ms" } as CSSProperties}>
            Handcrafted cakes for birthdays, celebrations, and every moment worth remembering.
          </p>
        </div>

        {/* Static / no-WebGL fallback: the photographed signature cake */}
        {isStatic ? (
          <div
            data-hero="static-cake"
            className="absolute bottom-[-4svh] left-1/2 aspect-[4/5] w-[min(64vw,22rem)] -translate-x-1/2 overflow-hidden rounded-t-full shadow-lift"
          >
            <Image
              src="/images/cakes/belgian-chocolate.webp"
              alt="Dehra Cakes signature Belgian chocolate cake with ganache drip"
              fill
              priority
              sizes="(max-width: 768px) 64vw, 352px"
              className="object-cover"
            />
          </div>
        ) : (
          // Soft plinth glow while the 3D stage streams in
          <div
            aria-hidden="true"
            className="absolute bottom-[14svh] left-1/2 h-24 w-[min(70vw,34rem)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(74,48,35,0.18),transparent)] [animation:float-shadow_5s_ease-in-out_infinite]"
          />
        )}
      </div>

      {/* ---------- Front layer: copy + CTAs (above the canvas) ---------- */}
      <div ref={front} className="pointer-events-none sticky top-0 z-10 -mt-[100svh] h-svh">
        <div className="relative mx-auto h-full max-w-[1600px] px-5 sm:px-8">
          {/* Beat 1 */}
          <div
            data-hero="intro"
            className="absolute inset-x-5 bottom-[max(2rem,5svh)] flex flex-col items-center gap-6 sm:inset-x-8 md:bottom-12 md:flex-row md:items-end md:justify-between"
          >
            <p className="hero-fade hidden max-w-[19rem] text-[0.95rem] leading-relaxed text-cocoa md:block" style={{ "--d": "700ms" } as CSSProperties}>
              Handcrafted cakes for birthdays, celebrations, and every moment worth remembering.
            </p>
            <div className="hero-fade pointer-events-auto flex items-center gap-3" style={{ "--d": "850ms" } as CSSProperties}>
              <ButtonLink href="/cakes" variant="primary" size="lg" magnetic>
                Order a Cake
                <ArrowRight size={18} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/collections" variant="outline" size="lg" className="bg-ivory/40 backdrop-blur-sm">
                Explore Collection
              </ButtonLink>
            </div>
          </div>

          <div
            data-hero="cue"
            aria-hidden="true"
            className="hero-fade absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mocha md:flex"
            style={{ "--d": "1200ms" } as CSSProperties}
          >
            <span className="eyebrow text-[0.62rem]">Scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-espresso/15">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-espresso [animation:cue_2.2s_var(--ease-soft)_infinite]" />
            </span>
          </div>

          {/* Beat 2 — becomes the intro of the featured collection */}
          <div
            data-hero="beat2"
            className="absolute inset-x-5 top-[calc(var(--nav-h)+3svh)] sm:inset-x-8 md:top-1/2 md:max-w-[34rem] md:-translate-y-1/2"
          >
            <p className="eyebrow mb-5 text-caramel opacity-0">The collection</p>
            <h2 className="font-display text-[clamp(2.8rem,6.4vw,6.2rem)] font-[360] text-espresso opacity-0">
              Made for <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">every</em> moment.
            </h2>
            <p className="mt-6 max-w-[26rem] text-[0.98rem] leading-relaxed text-cocoa opacity-0">
              Six signature cakes, baked to order in our Dehradun kitchen with real butter, fresh cream and Belgian chocolate.
            </p>
            <Link
              href="/cakes"
              className="pointer-events-auto mt-8 inline-flex items-center gap-2 border-b border-espresso/30 pb-1 text-sm font-medium text-espresso opacity-0 transition-colors hover:border-espresso"
            >
              Browse all cakes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
