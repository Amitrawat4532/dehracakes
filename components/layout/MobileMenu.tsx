"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CloseIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { navLinks, site } from "@/lib/site";
import { useOverlay } from "./useOverlay";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useOverlay(open, onClose);
  const stagger = (i: number) => ({ transitionDelay: open ? `${100 + i * 45}ms` : "0ms" }) as CSSProperties;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={`fixed inset-0 z-[60] bg-espresso text-ivory transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] lg:hidden ${
        open ? "[clip-path:inset(0_0_0_0_round_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0_round_0_0_2rem_2rem)]"
      }`}
      inert={!open}
    >
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl">
            Dehra <span className="font-sans text-[0.6rem] uppercase tracking-[0.32em]">Cakes</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full border border-ivory/20 active:scale-90"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="mt-10 flex flex-col">
          {navLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-ivory/10">
              <Link
                href={l.href}
                onClick={onClose}
                className={`flex items-baseline gap-4 py-3.5 transition-transform duration-700 ease-[var(--ease-out-expo)] active:opacity-60 ${open ? "translate-y-0" : "translate-y-full"}`}
                style={stagger(i)}
              >
                <span className="text-[0.65rem] tabular-nums text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[2.1rem] font-[340] leading-none">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/custom-cakes"
          onClick={onClose}
          className={`mt-8 flex items-center gap-4 rounded-2xl bg-ivory/[0.06] p-3 transition-all duration-700 ease-[var(--ease-out-expo)] active:scale-[0.98] ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={stagger(navLinks.length)}
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
            <Image src="/images/story/custom-cake.webp" alt="" fill sizes="64px" className="object-cover" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-medium">Planning something special?</span>
            <span className="block text-xs text-ivory/60">Design a custom cake with us</span>
          </span>
          <ArrowRight size={18} className="mr-2 text-ivory/60" />
        </Link>

        <div className="mt-auto pt-8">
          <Link
            href="/cakes"
            onClick={onClose}
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-ivory text-[0.95rem] font-medium text-espresso active:scale-[0.98]"
          >
            Order a Cake <ArrowRight size={18} />
          </Link>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-ivory/80">
            <a href={site.phoneHref} className="flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/15 active:bg-ivory/10">
              <PhoneIcon size={16} /> Call
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/15 active:bg-ivory/10">
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
            <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full border border-ivory/15 active:bg-ivory/10">
              <InstagramIcon size={16} /> Insta
            </a>
          </div>
          <p className="mt-5 text-center text-[0.7rem] text-ivory/40">{site.address.locality}, {site.address.region}</p>
        </div>
      </div>
    </div>
  );
}
