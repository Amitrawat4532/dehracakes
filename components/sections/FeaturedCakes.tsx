import Link from "next/link";
import type { CSSProperties } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SwipeRail } from "@/components/ui/SwipeRail";
import { occasions } from "@/lib/data/occasions";
import type { Product } from "@/lib/types";

/**
 * The product collection that follows the hero (its heading is delivered by
 * the hero's second beat). Opaque + z-10 so it slides over the WebGL stage.
 *
 * Phones: a swipeable rail with quick occasion shortcuts — one thumb, no
 * endless vertical scroll. Tablet/desktop: the editorial staggered grid.
 */
export function FeaturedCakes({ products }: { products: Product[] }) {
  return (
    <section
      id="cakes"
      aria-label="Featured cakes"
      className="relative z-10 rounded-t-[2rem] bg-ivory pb-16 pt-10 shadow-[0_-30px_60px_-30px_rgb(42_26_18/0.18)] md:rounded-t-[3.5rem] md:pb-40 md:pt-24"
    >
      <div className="mx-auto max-w-[1440px] md:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-6 px-5 md:mb-20 md:px-0">
          <Reveal className="reveal-fade max-w-md">
            <p className="eyebrow text-caramel">Signature cakes</p>
            <p className="mt-3 text-sm leading-relaxed text-mocha">
              <span className="md:hidden">Four sizes each, personalised with your message. Swipe to explore.</span>
              <span className="max-md:hidden">
                Every cake is available in four sizes and can be personalised with a message. Pre-order a day ahead for delivery anywhere in Dehradun, or pick up from our studio.
              </span>
            </p>
          </Reveal>
          <ButtonLink href="/cakes" variant="outline" className="max-md:hidden">
            View all cakes
          </ButtonLink>
        </div>

        {/* Quick occasion shortcuts (phones) */}
        <nav aria-label="Shop by occasion" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto px-5 md:hidden">
          {occasions.map((o) => (
            <Link
              key={o.slug}
              href={`/cakes?occasion=${o.slug}`}
              className="shrink-0 rounded-full border border-espresso/12 bg-card/60 px-4 py-2 text-[0.82rem] text-cocoa active:scale-95 active:bg-cream"
            >
              {o.name}
            </Link>
          ))}
        </nav>

        <SwipeRail
          label="Signature cakes"
          count={products.length}
          progressClassName="md:hidden"
          className="md:grid md:snap-none md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 lg:grid-cols-3 lg:gap-x-10"
        >
          {products.map((product, i) => (
            <Reveal
              key={product.id}
              className={`reveal-fade w-[80vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none ${i % 3 === 1 ? "lg:translate-y-24" : ""}`}
              style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </SwipeRail>

        <div className="mt-8 px-5 md:hidden">
          <Link
            href="/cakes"
            className="flex h-14 items-center justify-between rounded-full border border-espresso/15 px-6 text-[0.95rem] font-medium text-espresso active:scale-[0.98] active:bg-cream"
          >
            View all cakes
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
