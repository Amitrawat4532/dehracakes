import Image from "next/image";
import { CustomCakeForm } from "@/components/forms/CustomCakeForm";
import { Reveal, SplitWords } from "@/components/ui/Reveal";

const steps = [
  { n: "01", title: "Share your idea", body: "A photo, a sketch or just a feeling." },
  { n: "02", title: "We design & quote", body: "A call from our cake designer within a day." },
  { n: "03", title: "Baked for your date", body: "Delivered across Dehradun, or ready for pickup." },
];

export function CustomCake({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="custom" aria-labelledby="custom-title" className="relative z-10 bg-ivory py-16 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 md:gap-14 sm:px-8 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-20">
        <div className="flex flex-col">
          <Reveal>
            <p className="eyebrow reveal-fade text-caramel">Custom cakes</p>
            <Heading id="custom-title" className="font-display mt-3 text-[clamp(2.6rem,6vw,6rem)] md:mt-4 font-[360] text-espresso">
              <SplitWords text="Imagine it." />
              <br />
              <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">
                <SplitWords text="We'll bake it." delay={180} />
              </em>
            </Heading>
            <p className="reveal-fade mt-5 max-w-md text-[0.95rem] md:mt-7 md:text-[1.02rem] leading-relaxed text-cocoa" style={{ "--d": "250ms" } as React.CSSProperties}>
              Wedding tiers, milestone birthdays, a recreation of your grandmother&apos;s recipe — tell us what you have in mind and we&apos;ll design a cake around it.
            </p>
          </Reveal>

          {/* Phones: one wide image + a horizontal step timeline */}
          <div className="mt-8 lg:hidden">
            <Reveal className="reveal-image relative aspect-[16/11] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/occasions/wedding.webp"
                alt="White tiered wedding cake with roses"
                fill
                sizes="92vw"
                className="object-cover object-[50%_35%]"
              />
              <span className="eyebrow absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1.5 text-[0.58rem] text-espresso backdrop-blur">Made to order</span>
            </Reveal>
            <ol className="mt-4 grid grid-cols-3 gap-2">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl bg-cream p-3.5">
                  <span className="text-[0.68rem] tabular-nums text-caramel">{s.n}</span>
                  <p className="mt-1 text-[0.8rem] font-medium leading-snug text-espresso">{s.title}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Desktop collage */}
          <div className="mt-12 grid flex-1 grid-cols-[1.1fr_0.9fr] gap-4 max-lg:hidden">
            <Reveal className="reveal-image relative min-h-[18rem] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/story/custom-cake.webp"
                alt="Tall custom cake with pink drip and cherries on a cake stand"
                fill
                sizes="26vw"
                className="object-cover"
              />
            </Reveal>
            <div className="flex flex-col gap-4">
              <Reveal className="reveal-image relative min-h-[10rem] flex-1 overflow-hidden rounded-[1.5rem]" style={{ "--d": "150ms" } as React.CSSProperties}>
                <Image
                  src="/images/occasions/wedding.webp"
                  alt="White tiered wedding cake with roses"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </Reveal>
              <ol className="space-y-4 rounded-[1.5rem] bg-cream p-5">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="text-xs tabular-nums text-caramel">{s.n}</span>
                    <div>
                      <p className="text-sm font-medium text-espresso">{s.title}</p>
                      <p className="text-xs leading-relaxed text-mocha">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="lg:pt-6">
          <CustomCakeForm />
        </div>
      </div>
    </section>
  );
}
