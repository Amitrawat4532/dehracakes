"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/Field";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/store/cart";
import type { CartItem } from "@/lib/types";

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/cakes/${item.slug}`} onClick={onNavigate} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-parchment">
        <Image src={item.image.src} alt={item.image.alt} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/cakes/${item.slug}`} onClick={onNavigate} className="font-display block text-xl leading-tight text-espresso hover:text-cocoa">
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-mocha">{item.sizeLabel}</p>
            {item.message ? <p className="mt-1 truncate text-xs italic text-mocha">“{item.message}”</p> : null}
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-espresso">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper compact value={item.quantity} onChange={(q) => setQuantity(item.key, q)} />
          <button type="button" onClick={() => remove(item.key)} className="text-xs text-mocha underline underline-offset-4 hover:text-rose">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
