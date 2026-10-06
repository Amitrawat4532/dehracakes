import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/cakes", label: "Cakes" },
      { href: "/collections", label: "Collections" },
      { href: "/custom-cakes", label: "Custom Cakes" },
      { href: "/preorder", label: "Order" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/#about", label: "About" },
      { href: "/#craft", label: "Our craft" },
      { href: "/#contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-espresso text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-16 sm:px-8 md:pb-10 md:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-14">
          <div className="col-span-2 flex items-start gap-5 lg:col-span-1">
            <Image
              src="/brand/dehra-cakes-logo.webp"
              alt="Dehra Cakes logo"
              width={96}
              height={64}
              className="h-14 w-auto rounded-xl md:h-16"
            />
            <div>
              <p className="font-display text-[1.7rem] font-[380] leading-tight md:text-3xl">Freshly baked happiness.</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/60">
                A premium cake studio in Dehradun, baking for birthdays, weddings and everything in between.
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow text-ivory/45">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ivory/85 transition-colors hover:text-caramel-soft">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <p className="eyebrow text-ivory/45">Say hello</p>
            <address className="mt-5 space-y-3 not-italic text-ivory/85">
              <p>Dehradun, Uttarakhand, India</p>
              <p>
                <a href={site.phoneHref} className="hover:text-caramel-soft">{site.phone}</a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-caramel-soft">{site.email}</a>
              </p>
            </address>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex">
              <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/20 px-4 text-sm transition-colors hover:bg-ivory hover:text-espresso">
                <InstagramIcon size={18} /> Instagram
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/20 px-4 text-sm transition-colors hover:bg-ivory hover:text-espresso">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display mt-14 select-none md:mt-20 whitespace-nowrap text-center text-[19.5vw] font-[300] leading-[0.8] tracking-[-0.045em] text-ivory/[0.07] md:mt-28 [font-variation-settings:'SOFT'_100,'WONK'_1]"
        >
          Dehra Cakes
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Dehra Cakes · Dehradun, Uttarakhand, India</p>
          <p>Design concept · photography via Unsplash · prices &amp; details are placeholders</p>
        </div>
      </div>
    </footer>
  );
}
