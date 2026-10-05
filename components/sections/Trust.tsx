import Image from "next/image";
import type { CSSProperties } from "react";
import { CalendarIcon, LeafIcon, SparkIcon, StarIcon, TruckIcon } from "@/components/ui/Icons";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { SwipeRail } from "@/components/ui/SwipeRail";
import { testimonials, trustStats } from "@/lib/data/testimonials";

const promises = [
  { icon: SparkIcon, title: "Freshly baked", body: "Every cake is baked to order — never from the freezer." },
  { icon: LeafIcon, title: "Honest ingredients", body: "Real butter, fresh cream, Belgian chocolate. Eggless on request." },
  { icon: CalendarIcon, title: "Pre-order with ease", body: "Choose your date and time slot up to 30 days ahead." },
  { icon: TruckIcon, title: "Careful delivery", body: "Hand-delivered across Dehradun, or pick up from our studio." },
];

export function Trust() {
  return (
    <section id="about" aria-labelledby="trust-title" className="relative z-10 bg-cream py-16 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow reveal-fade text-caramel">Why Dehra Cakes</p>
            <h2 id="trust-title" className="font-display mt-4 text-[clamp(2.6rem,5.6vw,5.6rem)] font-[360] text-espresso">
              <SplitWords text="Baked for moments" />{" "}
              <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">
                <SplitWords text="that matter." delay={160} />
              </em>
            </h2>
            <p className="reveal-fade mt-5 max-w-lg text-[0.95rem] md:mt-7 md:text-[1.02rem] leading-relaxed text-cocoa" style={{ "--d": "200ms" } as CSSProperties}>
              We&apos;re a small team of bakers in Dehradun who believe a cake should taste as good as it looks. No shortcuts, no premixes — just careful baking, every single day.
            </p>

            <dl className="reveal-fade mt-9 grid grid-cols-3 md:mt-12 gap-4 border-t border-espresso/15 pt-8" style={{ "--d": "300ms" } as CSSProperties}>
              {trustStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-xs leading-snug text-mocha">{s.label}</dt>
                  <dd className="font-display text-[clamp(2rem,4vw,3.4rem)] font-[340] leading-none text-espresso tabular-nums">
                    {s.value}
                    <span className="text-caramel">{s.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.68rem] uppercase tracking-[0.14em] text-mocha/60">Placeholder figures for this demo</p>
          </Reveal>

          <Reveal className="reveal-image relative aspect-[4/3] overflow-hidden rounded-[1.5rem] md:aspect-auto md:min-h-[22rem] md:rounded-[2rem] lg:min-h-0">
            <Image
              src="/images/story/hands-dough.webp"
              alt="A baker's hands kneading dough on a floured counter"
              fill
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-ivory/90 p-4 backdrop-blur-md sm:right-auto">
              <div className="flex text-caramel" aria-label="Rated 4.9 out of 5 (placeholder)">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="text-sm text-espresso">
                <strong className="font-medium">4.9</strong> on Google <span className="text-mocha">(placeholder)</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* Testimonials — swipe on phones, three columns on desktop */}
        <div className="-mx-5 mt-14 sm:-mx-8 md:mx-0 md:mt-28">
          <SwipeRail
            label="Customer reviews"
            count={testimonials.length}
            progressClassName="md:hidden"
            className="md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
          >
            {testimonials.map((t, i) => (
              <Reveal
                as="figure"
                key={t.name}
                className="reveal-fade flex w-[84vw] max-w-[22rem] shrink-0 snap-start flex-col justify-between rounded-[1.5rem] bg-card p-6 shadow-soft md:w-auto md:max-w-none md:rounded-[1.75rem] md:p-9"
                style={{ "--d": `${i * 110}ms` } as CSSProperties}
              >
                <blockquote className="font-display text-[1.3rem] font-[380] leading-[1.28] text-espresso [letter-spacing:-0.01em] md:text-[1.45rem]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-between border-t border-espresso/10 pt-5 text-sm md:mt-8">
                  <span>
                    <span className="block font-medium text-espresso">{t.name}</span>
                    <span className="text-mocha">{t.place}</span>
                  </span>
                  <span className="eyebrow rounded-full bg-cream px-3 py-1.5 text-[0.58rem] text-cocoa">{t.occasion}</span>
                </figcaption>
              </Reveal>
            ))}
          </SwipeRail>
        </div>

        {/* Promises */}
        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-espresso/10 md:mt-20 md:rounded-[1.75rem] lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-cream p-5 md:p-8">
              <Icon size={22} className="text-caramel" />
              <h3 className="font-display mt-4 text-[1.15rem] font-[400] leading-tight text-espresso md:mt-6 md:text-2xl">{title}</h3>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-mocha md:mt-2 md:text-sm">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
