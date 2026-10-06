import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/services/catalog";
import type { Product } from "@/lib/types";
import { QuickAddButton } from "./AddToCartButton";

/**
 * Dense shop tile: two-up on phones (thumb-reachable one-tap add on the
 * image), three-up on desktop with more breathing room.
 */
export function ProductTile({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group/tile">
      <div className="relative">
        <Link
          href={`/cakes/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-parchment active:opacity-90 sm:rounded-[1.5rem]"
          aria-label={`${product.name} — view details`}
        >
          <ViewTransition name={`cake-${product.slug}`} share="morph" default="none">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 46vw, 31vw"
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/tile:scale-[1.05]"
            />
          </ViewTransition>
          {product.badge ? (
            <span className="eyebrow absolute left-2.5 top-2.5 rounded-full bg-ivory/90 px-2.5 py-1 text-[0.55rem] text-espresso backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.6rem]">
              {product.badge}
            </span>
          ) : null}
        </Link>
        <QuickAddButton
          product={product}
          compact
          className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/tile:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
        />
      </div>
      <Link href={`/cakes/${product.slug}`} className="block px-0.5 pt-3 sm:pt-4">
        <h3 className="font-display text-[1.08rem] font-[420] leading-tight text-espresso sm:text-[1.5rem]">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-[0.78rem] text-mocha sm:text-sm">{product.tagline}</p>
        <p className="mt-1.5 text-[0.85rem] tabular-nums text-espresso sm:mt-2 sm:text-base">
          <span className="text-mocha">from </span>
          {formatPrice(startingPrice(product))}
        </p>
      </Link>
    </article>
  );
}
