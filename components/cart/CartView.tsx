"use client";

import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { formatPrice, isoDateFromToday } from "@/lib/format";
import { cartSubtotal, useCart } from "@/lib/store/cart";
import { CartLineItem } from "./CartLineItem";

/** True once the persisted cart has been read from storage. */
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export function CartView() {
  const hydrated = useCartHydrated();
  const { items, deliveryDate, setDeliveryDate, clear } = useCart();
  const subtotal = useCart(cartSubtotal);

  if (!hydrated) return <div className="mt-12 h-64 animate-pulse rounded-[2rem] bg-cream" />;

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-[2rem] bg-cream p-10 text-center md:p-16">
        <p className="font-display text-3xl text-espresso">Nothing here yet.</p>
        <p className="mt-3 text-mocha">Every great celebration starts with one cake.</p>
        <ButtonLink href="/cakes" className="mt-8">Browse cakes</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_24rem]">
      <div>
        <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
          {items.map((item) => (
            <CartLineItem key={item.key} item={item} />
          ))}
        </ul>
        <button type="button" onClick={clear} className="mt-4 text-sm text-mocha underline underline-offset-4 hover:text-rose">
          Clear cart
        </button>
      </div>

      <aside className="h-fit rounded-[2rem] bg-card p-7 shadow-soft lg:sticky lg:top-24">
        <h2 className="font-display text-2xl text-espresso">Summary</h2>
        <div className="mt-6">
          <Field label="Delivery / pickup date" htmlFor="cart-date">
            <Input id="cart-date" type="date" min={isoDateFromToday(1)} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </Field>
        </div>
        <dl className="mt-6 space-y-3 border-t border-espresso/10 pt-6 text-sm">
          <div className="flex justify-between"><dt className="text-cocoa">Subtotal</dt><dd className="tabular-nums text-espresso">{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-cocoa">Delivery</dt><dd className="text-mocha">Calculated at pre-order</dd></div>
        </dl>
        <div className="mt-6 flex items-baseline justify-between border-t border-espresso/10 pt-6">
          <span className="text-cocoa">Total</span>
          <span className="font-display text-3xl tabular-nums text-espresso">{formatPrice(subtotal)}</span>
        </div>
        <ButtonLink href="/preorder" size="lg" className="mt-7 w-full">
          Proceed to checkout
        </ButtonLink>
        <p className="mt-4 text-center text-xs text-mocha">Pre-order now, pay on confirmation. Online payment coming soon.</p>
      </aside>
    </div>
  );
}
