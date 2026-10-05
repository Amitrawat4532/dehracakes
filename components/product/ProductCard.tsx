import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/services/catalog";
import type { Product } from "@/lib/types";
import { QuickAddButton } from "./AddToCartButton";

/**
 * Editorial product card. Hover (fine pointers): image eases in, card lifts,
 * the size list gives way to the add-to-cart action. On touch the action is
 * always visible.
 */
export function ProductCard({
  product,
  index = 0,
  priority = false,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
}) {
  return (
    <article className="group/card relative">
      <Link
        href={`/cakes/${product.slug}`}
        className="block rounded-[1.5rem] outline-offset-4 active:scale-[0.99] md:rounded-[1.75rem] transition-transform duration-700 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover/card:-translate-y-1.5"
        aria-label={`${product.name} — view details`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-parchment md:rounded-[1.75rem] shadow-[0_1px_2px_rgb(42_26_18/0.04)] transition-shadow duration-700 group-hover/card:shadow-lift">
          <ViewTransition name={`cake-${product.slug}`} share="morph" default="none">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.06]"
            />
          </ViewTransition>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover/card:opacity-90" />
          <div className="absolute left-5 top-5 flex gap-2">
            <span className="eyebrow rounded-full bg-ivory/85 px-3 py-1.5 text-[0.6rem] text-espresso backdrop-blur-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            {product.badge ? (
              <span className="eyebrow rounded-full bg-espresso/80 px-3 py-1.5 text-[0.6rem] text-ivory backdrop-blur-sm">
                {product.badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 px-1 pt-4 md:pt-5">
          <div>
            <h3 className="font-display text-[1.4rem] font-[400] text-espresso md:text-[1.65rem]">{product.name}</h3>
            <p className="mt-1.5 line-clamp-2 max-w-[22rem] text-[0.84rem] leading-relaxed text-mocha md:mt-2 md:text-sm">{product.description}</p>
          </div>
          <p className="shrink-0 pt-1 text-right">
            <span className="block text-[0.68rem] uppercase tracking-[0.14em] text-mocha/80">From</span>
            <span className="text-lg font-medium tabular-nums text-espresso">{formatPrice(startingPrice(product))}</span>
          </p>
        </div>
      </Link>

      <div className="relative mt-4 h-11 px-1">
        <ul
          aria-label="Available sizes"
          className="absolute inset-x-1 top-0 flex h-11 items-center gap-1.5 transition-all duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover/card:-translate-y-2 [@media(hover:hover)]:group-hover/card:opacity-0 [@media(hover:none)]:hidden"
        >
          {product.sizes.map((s) => (
            <li key={s.id} className="rounded-full border border-espresso/12 px-3 py-1 text-xs text-cocoa">
              {s.label}
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-1 top-0 flex items-center gap-3 transition-all duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:focus-within:translate-y-0 [@media(hover:hover)]:focus-within:opacity-100">
          <QuickAddButton product={product} className="[@media(hover:none)]:flex-1" />
          <Link href={`/cakes/${product.slug}`} className="shrink-0 text-sm font-medium text-espresso underline decoration-espresso/25 underline-offset-4 hover:decoration-espresso [@media(hover:none)]:no-underline [@media(hover:none)]:rounded-full [@media(hover:none)]:border [@media(hover:none)]:border-espresso/15 [@media(hover:none)]:px-4 [@media(hover:none)]:py-2.5">
            <span className="[@media(hover:none)]:hidden">Choose size</span>
            <span className="[@media(hover:hover)]:hidden">Details</span>
          </Link>
          <span className="ml-auto text-xs text-mocha [@media(hover:none)]:hidden">{product.sizes.length} sizes</span>
        </div>
      </div>
    </article>
  );
}
