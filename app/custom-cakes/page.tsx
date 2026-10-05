import type { Metadata } from "next";
import { CustomCake } from "@/components/sections/CustomCake";

export const metadata: Metadata = {
  title: "Custom Cakes in Dehradun",
  description:
    "Design a custom cake for weddings, birthdays and celebrations in Dehradun. Share an inspiration image and our cake designer will sketch and quote it for you.",
  alternates: { canonical: "/custom-cakes" },
};

const faqs = [
  {
    q: "How much notice do you need?",
    a: "At least 3 days for most custom cakes, and 2–3 weeks for tiered wedding cakes.",
  },
  {
    q: "Can you recreate a cake from a photo?",
    a: "Yes — upload it with your enquiry. We'll suggest any changes needed for taste, structure or the weather.",
  },
  {
    q: "Do you make eggless custom cakes?",
    a: "Every flavour on our menu is available eggless at no extra cost.",
  },
  {
    q: "How is the price decided?",
    a: "By size, complexity and finish. You'll receive a clear quote before anything is confirmed.",
  },
];

export default function CustomCakesPage() {
  return (
    <>
      <div className="pt-[var(--nav-h)]">
        <CustomCake headingLevel={1} />
      </div>
      <section aria-labelledby="faq-title" className="bg-cream py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
          <h2 id="faq-title" className="font-display text-[clamp(2.2rem,4vw,3.6rem)] font-[360] text-espresso">
            Good to <em className="text-cocoa">know</em>
          </h2>
          <div className="divide-y divide-espresso/10 border-y border-espresso/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-espresso">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-espresso/15 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-mocha">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
