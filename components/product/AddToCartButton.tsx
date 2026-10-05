"use client";

import { useState } from "react";
import { BagIcon, CheckIcon, PlusIcon } from "@/components/ui/Icons";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Quick add from a product card (defaults to the 1 kg size). */
export function QuickAddButton({
  product,
  className = "",
  compact = false,
}: {
  product: Product;
  className?: string;
  /** Round icon-only button for dense grids. */
  compact?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const size = product.sizes.find((s) => s.id === "1kg") ?? product.sizes[0];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          sizeId: size.id,
          sizeLabel: size.label,
          unitPrice: size.price,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={compact
        ? `grid size-11 place-items-center rounded-full shadow-soft backdrop-blur transition-[transform,background-color] active:scale-90 ${added ? "bg-espresso text-ivory" : "bg-ivory/95 text-espresso"} ${className}`
        : `inline-flex h-11 items-center justify-center gap-2 rounded-full bg-espresso px-5 text-sm font-medium text-ivory transition-all duration-500 ease-[var(--ease-out-expo)] hover:bg-cocoa active:scale-[0.97] ${className}`}
      aria-label={`Add ${product.name}, ${size.label}, to cart`}
    >
      {added ? <CheckIcon size={17} /> : compact ? <PlusIcon size={18} /> : <BagIcon size={17} />}
      {compact ? null : added ? "Added" : `Add ${size.label} · ${formatPrice(size.price)}`}
    </button>
  );
}
