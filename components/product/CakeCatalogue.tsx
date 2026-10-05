"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductTile } from "./ProductTile";
import type { Occasion, OccasionSlug, Product } from "@/lib/types";

/** Product grid with occasion filter chips, synced to `?occasion=`. */
export function CakeCatalogue({ products, occasions }: { products: Product[]; occasions: Occasion[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = params.get("occasion") as OccasionSlug | null;

  const filtered = useMemo(
    () => (active ? products.filter((p) => p.occasions.includes(active)) : products),
    [products, active],
  );

  const select = (slug: OccasionSlug | null) => {
    const url = slug ? `${pathname}?occasion=${slug}` : pathname;
    router.replace(url, { scroll: false });
  };

  const chip = (selected: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-300 active:scale-95 ${
      selected ? "border-espresso bg-espresso text-ivory" : "border-espresso/15 text-cocoa hover:border-espresso/40"
    }`;

  return (
    <>
      <div className="no-scrollbar sticky top-[calc(var(--nav-h)-0.25rem)] z-20 -mx-5 mt-8 flex gap-2 overflow-x-auto bg-ivory/90 px-5 py-3 backdrop-blur-md sm:static sm:mx-0 sm:mt-12 sm:flex-wrap sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none" role="group" aria-label="Filter by occasion">
        <button type="button" className={chip(!active)} aria-pressed={!active} onClick={() => select(null)}>
          All cakes
        </button>
        {occasions.map((o) => (
          <button type="button" key={o.slug} className={chip(active === o.slug)} aria-pressed={active === o.slug} onClick={() => select(o.slug)}>
            {o.name}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-mocha sm:mt-6" aria-live="polite">
        {filtered.length} cake{filtered.length === 1 ? "" : "s"}
        {active ? ` for ${occasions.find((o) => o.slug === active)?.name}` : ""}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-10">
        {filtered.map((p, i) => (
          <ProductTile key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
    </>
  );
}
