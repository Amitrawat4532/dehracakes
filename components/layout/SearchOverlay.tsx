"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { products } from "@/lib/data/products";
import { occasions } from "@/lib/data/occasions";
import { formatPrice } from "@/lib/format";
import { useOverlay } from "./useOverlay";

/** Instant client-side search across the (small) catalogue. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useOverlay(open, onClose);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => input.current?.select(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.description, ...p.flavourNotes, ...p.occasions].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search cakes"
      inert={!open}
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" />
      <div
        className={`relative mx-auto flex max-w-3xl flex-col bg-ivory p-4 shadow-lift transition-transform duration-700 ease-[var(--ease-out-expo)] max-sm:h-full max-sm:w-full max-sm:pt-[max(1rem,env(safe-area-inset-top))] sm:mt-6 sm:w-[calc(100%-1.5rem)] sm:rounded-[2rem] sm:p-6 ${open ? "translate-y-0" : "-translate-y-8"}`}
      >
        <div className="flex items-center gap-3 rounded-full bg-card px-5 ring-1 ring-espresso/10 focus-within:ring-caramel">
          <SearchIcon className="text-mocha" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chocolate, birthday, eggless…"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-espresso sm:text-lg placeholder:text-mocha/50 focus:outline-none"
            aria-label="Search"
          />
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-espresso/6" aria-label="Close search">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-1">
          {occasions.map((o) => (
            <button
              type="button"
              key={o.slug}
              onClick={() => setQuery(o.slug.replace("-", " "))}
              className="shrink-0 rounded-full border border-espresso/12 px-3.5 py-2 text-xs text-cocoa hover:border-espresso/40 active:scale-95"
            >
              {o.name}
            </button>
          ))}
        </div>

        <ul className="mt-4 min-h-0 flex-1 divide-y divide-espresso/8 overflow-y-auto overscroll-contain sm:max-h-[60svh] sm:flex-none" data-lenis-prevent>
          {results.map((p) => (
            <li key={p.id}>
              <Link href={`/cakes/${p.slug}`} onClick={onClose} className="flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-cream">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src={p.image.src} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-xl text-espresso">{p.name}</span>
                  <span className="block truncate text-sm text-mocha">{p.tagline}</span>
                </span>
                <span className="text-sm tabular-nums text-espresso">{formatPrice(p.sizes[0].price)}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="p-6 text-center text-sm text-mocha">
              Nothing matches “{query}”.{" "}
              <Link href="/custom-cakes" onClick={onClose} className="text-espresso underline underline-offset-4">
                Ask for a custom cake
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
