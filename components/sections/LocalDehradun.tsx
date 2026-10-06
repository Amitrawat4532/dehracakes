import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight, ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function LocalDehradun() {
  return (
    <section id="contact" aria-labelledby="local-title" className="relative z-10 bg-ivory py-16 md:py-36">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
          <div className="reveal-image relative h-[70svh] min-h-[28rem] md:h-[78svh]">
            <Image
              src="/images/story/dehradun-hills.webp"
              alt="Mist rolling over the Himalayan foothills at dawn"
              fill
              sizes="(max-width: 1440px) 96vw, 1380px"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-espresso/10 via-espresso/20 to-espresso/75" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-14">
            <p className="eyebrow reveal-fade text-ivory/80">30.3165° N, 78.0322° E</p>
            <h2 id="local-title" className="font-display mt-4 max-w-4xl text-[clamp(2.5rem,6.2vw,6.4rem)] font-[340] text-ivory">
              <SplitWords text="Made in Dehradun." />
              <br />
              <em className="text-caramel-soft [font-variation-settings:'SOFT'_100,'WONK'_1]">
                <SplitWords text="Made for your moments." delay={200} />
              </em>
            </h2>
          </div>
        </Reveal>

        {/* Phone quick actions */}
        <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
          {[
            { href: site.phoneHref, label: "Call", icon: PhoneIcon, external: false },
            { href: site.whatsappHref, label: "WhatsApp", icon: WhatsAppIcon, external: true },
            { href: site.mapsHref, label: "Directions", icon: PinIcon, external: true },
          ].map(({ href, label, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card py-4 text-[0.8rem] font-medium text-espresso shadow-soft active:scale-95 active:bg-cream"
            >
              <Icon size={20} className="text-caramel" />
              {label}
            </a>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 lg:grid-cols-[1fr_1fr_1.2fr]">
          <Reveal className="reveal-fade rounded-[1.5rem] bg-card p-6 shadow-soft md:rounded-[1.75rem] md:p-9">
            <h3 className="eyebrow text-caramel">Visit &amp; pickup</h3>
            <address className="mt-5 not-italic leading-relaxed text-espresso">
              <span className="font-display block text-2xl font-[400]">Dehra Cakes Studio</span>
              <span className="mt-2 block text-sm text-cocoa">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </span>
            </address>
            <ul className="mt-6 space-y-2 text-sm text-cocoa">
              {site.hours.map((h) => (
                <li key={h.days} className="flex items-center gap-3">
                  <ClockIcon size={16} className="text-caramel" />
                  <span className="w-24">{h.days}</span>
                  <span className="tabular-nums text-espresso">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-mocha">Pickup orders are boxed and ready at your chosen time slot. Address shown is a placeholder.</p>
          </Reveal>

          <Reveal className="reveal-fade rounded-[1.5rem] bg-card p-6 shadow-soft md:rounded-[1.75rem] md:p-9" style={{ "--d": "100ms" } as CSSProperties}>
            <h3 className="eyebrow text-caramel">We deliver to</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {site.deliveryAreas.map((a) => (
                <li key={a} className="rounded-full border border-espresso/12 px-3.5 py-1.5 text-sm text-cocoa">
                  {a}
                </li>
              ))}
              <li className="rounded-full bg-cream px-3.5 py-1.5 text-sm text-mocha">+ more</li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-mocha">Delivery areas are placeholders — final coverage to be confirmed by the bakery.</p>
            <div className="mt-7 flex-col gap-3 border-t border-espresso/10 pt-6 text-sm max-lg:hidden lg:flex">
              <a href={site.phoneHref} className="flex items-center gap-3 text-espresso hover:text-cocoa">
                <PhoneIcon size={17} className="text-caramel" /> {site.phone}
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-espresso hover:text-cocoa">
                <WhatsAppIcon size={17} className="text-caramel" /> Order on WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-espresso hover:text-cocoa">
                <span className="w-[17px] text-center text-caramel">@</span> {site.email}
              </a>
            </div>
          </Reveal>

          {/* Map placeholder: a lightweight stylised map instead of a heavy embed */}
          <Reveal className="reveal-fade group/map relative min-h-[15rem] overflow-hidden md:min-h-[20rem] rounded-[1.75rem] bg-[#e9dcc8]" style={{ "--d": "200ms" } as CSSProperties}>
            <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M24 0H0V24" fill="none" stroke="#d8c6ab" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />
              <path d="M-10 210 C 80 180, 140 230, 220 190 S 360 140, 420 170" fill="none" stroke="#c9d6c2" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
              <path d="M200 -10 L 210 120 L 190 320" fill="none" stroke="#fffaf2" strokeWidth="9" />
              <path d="M-10 120 L 210 120 L 420 90" fill="none" stroke="#fffaf2" strokeWidth="7" />
              <path d="M60 -10 L 120 320" fill="none" stroke="#fffaf2" strokeWidth="5" />
              <path d="M320 -10 L 300 320" fill="none" stroke="#fffaf2" strokeWidth="5" />
              <text x="222" y="70" fontSize="9" fill="#9b8064" letterSpacing="2">RAJPUR RD</text>
              <text x="40" y="112" fontSize="9" fill="#9b8064" letterSpacing="2">CLOCK TOWER</text>
            </svg>
            <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-full">
              <span className="absolute left-1/2 top-full size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/20 [animation:float-shadow_2.6s_ease-in-out_infinite]" />
              <span className="relative grid size-12 place-items-center rounded-full bg-espresso text-ivory shadow-lift">
                <PinIcon size={20} />
              </span>
            </div>
            <a
              href={site.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-ivory/95 px-5 py-4 text-sm font-medium text-espresso backdrop-blur transition-colors hover:bg-white"
            >
              Open in Google Maps
              <ArrowUpRight size={18} className="transition-transform duration-500 group-hover/map:rotate-45" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
