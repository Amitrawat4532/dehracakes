"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { activeLayerStep, layerSteps } from "@/lib/three/layerStory";
import { sceneState } from "@/lib/three/sceneState";
import { useStageSection, useStaticFallback } from "@/lib/three/useStageSection";

/**
 * Signature scroll sequence. The shared WebGL cake (re)builds itself layer by
 * layer as the section scrolls: sponge → cream → chocolate → decoration →
 * finished. Without WebGL, a CSS cross-section tells the same story.
 */
export function LayerStory() {
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const isStatic = useStaticFallback();

  useStageSection(section, "layers");

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        sceneState.layers = self.progress;
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        const next = activeLayerStep(self.progress);
        setStep((prev) => (prev === next ? prev : next));
      },
    });
    const intro = gsap.fromTo(
      el.querySelectorAll("[data-layer-intro]"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "power3.out",
        duration: 1.2,
        scrollTrigger: { trigger: el, start: "top 70%" },
      },
    );
    return () => {
      st.kill();
      intro.scrollTrigger?.kill();
      intro.kill();
    };
  }, []);

  const current = layerSteps[step];

  return (
    <section
      ref={section}
      id="craft"
      aria-labelledby="craft-title"
      data-immersive
      className="relative h-[480vh] bg-cream md:h-[520vh]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,#fbf4ea,transparent)]" />
      <div className="sticky top-0 z-10 h-svh overflow-hidden">
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[auto_1fr_auto] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+1svh)] sm:px-8 md:pb-10 md:pt-[calc(var(--nav-h)+2svh)]">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <p data-layer-intro className="eyebrow text-caramel">The craft</p>
              <h2 data-layer-intro id="craft-title" className="font-display mt-2 text-[clamp(2.2rem,5.4vw,5.4rem)] font-[360] text-espresso md:mt-3">
                Made layer <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">by layer.</em>
              </h2>
            </div>
            <p data-layer-intro className="hidden max-w-[17rem] pt-2 text-sm leading-relaxed text-mocha lg:block">
              Scroll to build our signature Belgian chocolate cake, the way we do every morning.
            </p>
          </div>

          {/* Middle: step copy (left) · cake (centre, WebGL) · index (right) */}
          <div className="relative grid items-center md:grid-cols-[minmax(0,20rem)_1fr_minmax(0,14rem)] md:gap-8">
            {/* Step copy — a bottom card on phones, a left column on desktop */}
            <div className="absolute inset-x-0 bottom-0 z-10 md:static" aria-live="polite">
              <div className="rounded-[1.75rem] bg-ivory/85 p-5 shadow-[0_20px_50px_-20px_rgb(42_26_18/0.35)] ring-1 ring-espresso/5 backdrop-blur-xl md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:ring-0 md:backdrop-blur-none">
                {/* Segmented progress (phones) */}
                <div className="mb-4 flex gap-1.5 md:hidden" aria-hidden="true">
                  {layerSteps.map((s, i) => (
                    <span key={s.n} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-espresso" : "bg-espresso/12"}`} />
                  ))}
                </div>
                <div key={current.n} className="animate-[fade-up_0.7s_var(--ease-out-expo)_both]">
                  <div className="flex items-baseline gap-3 md:block">
                    <p className="font-display text-[1.6rem] font-[300] leading-none text-caramel tabular-nums md:text-[clamp(3.5rem,7vw,7rem)] md:text-caramel/70">{current.n}</p>
                    <h3 className="font-display text-[1.6rem] font-[400] leading-none text-espresso md:mt-4 md:text-[2.6rem]">{current.title}</h3>
                  </div>
                  <p className="mt-2.5 max-w-[20rem] text-[0.9rem] leading-relaxed text-cocoa md:mt-3 md:text-[0.95rem]">{current.body}</p>
                  <p className="eyebrow mt-5 hidden items-center gap-2 text-[0.62rem] text-mocha md:inline-flex">
                    <span className="size-1.5 rounded-full bg-rose" />
                    {current.detail}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-full min-h-[40svh]">
              {isStatic ? <StaticCrossSection step={step} /> : null}
            </div>

            <ol className="hidden flex-col gap-1 md:flex" aria-label="Steps">
              {layerSteps.map((s, i) => (
                <li
                  key={s.n}
                  className={`flex items-baseline gap-4 border-t py-3 transition-colors duration-500 ${
                    i === step ? "border-espresso text-espresso" : i < step ? "border-espresso/25 text-cocoa/70" : "border-espresso/10 text-mocha/50"
                  }`}
                >
                  <span className="text-xs tabular-nums">{s.n}</span>
                  <span className="font-display text-xl">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Progress */}
          <div className="mt-4 hidden items-center gap-4 md:mt-0 md:flex">
            <span className="eyebrow text-[0.6rem] text-mocha">Sponge</span>
            <div className="relative h-px flex-1 bg-espresso/15">
              <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-espresso" />
            </div>
            <span className="eyebrow text-[0.6rem] text-mocha">Finished</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** CSS-only cross-section for devices without WebGL / with reduced motion. */
function StaticCrossSection({ step }: { step: number }) {
  const layers = [
    { kind: "sponge", show: 0 },
    { kind: "cream", show: 1 },
    { kind: "ganache", show: 2 },
    { kind: "sponge", show: 0 },
    { kind: "cream", show: 1 },
    { kind: "ganache", show: 2 },
    { kind: "sponge", show: 0 },
  ].reverse();
  const colors: Record<string, string> = {
    sponge: "bg-[#e3bd84] h-12",
    cream: "bg-[#fbf3e6] h-4",
    ganache: "bg-[#3a1d12] h-3",
  };
  const finished = step >= 3;
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative w-[min(70vw,22rem)]">
        <div className={`relative overflow-hidden rounded-xl transition-opacity duration-500 ${finished ? "ring-8 ring-[#f2e7d6]" : ""}`}>
          {finished ? <div className="h-4 bg-[#2a150d]" /> : null}
          {layers.map((l, i) => (
            <div key={i} className={`${colors[l.kind]} transition-opacity duration-500 ${step >= l.show ? "opacity-100" : "opacity-0"}`} />
          ))}
        </div>
        <div className="mx-auto mt-2 h-2 w-[115%] -translate-x-[6.5%] rounded-full bg-[#c9a46a]" />
      </div>
    </div>
  );
}
