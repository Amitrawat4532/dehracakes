"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type PointerEvent } from "react";
import { useOverlay } from "@/components/layout/useOverlay";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { BagIcon, CloseIcon } from "@/components/ui/Icons";
import { formatPrice, isoDateFromToday } from "@/lib/format";
import { cartCount, cartSubtotal, useCart } from "@/lib/store/cart";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, close, deliveryDate, setDeliveryDate } = useCart();
  const count = useCart(cartCount);
  const subtotal = useCart(cartSubtotal);
  useOverlay(isOpen, close);

  // Swipe-down-to-close for the phone bottom sheet.
  const sheet = useRef<HTMLElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const onDragStart = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (sheet.current) sheet.current.style.transition = "none";
  };
  const onDragMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !sheet.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    sheet.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onDragEnd = () => {
    const el = sheet.current;
    const dy = drag.current?.dy ?? 0;
    drag.current = null;
    if (!el) return;
    el.style.transition = "";
    el.style.transform = "";
    if (dy > 110) close();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
      inert={!isOpen}
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className={`absolute inset-0 bg-espresso/30 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={sheet}
        className={`absolute flex flex-col bg-ivory shadow-lift transition-transform duration-700 ease-[var(--ease-out-expo)] max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[88svh] max-sm:rounded-t-[1.75rem] max-sm:pb-[env(safe-area-inset-bottom)] sm:inset-y-3 sm:right-3 sm:w-full sm:max-w-[28rem] sm:rounded-[2rem] ${
          isOpen ? "translate-x-0 translate-y-0" : "max-sm:translate-y-[105%] sm:translate-x-[105%]"
        }`}
      >
        {/* Grab handle — drag down to dismiss (phones) */}
        <div
          className="flex touch-none justify-center pb-1 pt-3 sm:hidden"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          aria-hidden="true"
        >
          <span className="h-1.5 w-11 rounded-full bg-espresso/20" />
        </div>
        <header className="flex items-center justify-between px-6 pb-3 pt-2 sm:pb-4 sm:pt-6">
          <h2 className="font-display text-[1.75rem] font-[380] text-espresso sm:text-3xl">
            Your cart <span className="align-top font-sans text-sm text-mocha tabular-nums">({count})</span>
          </h2>
          <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-espresso/6" aria-label="Close cart">
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-cream text-cocoa">
              <BagIcon size={26} />
            </span>
            <p className="font-display mt-6 text-2xl text-espresso">Your cart is waiting.</p>
            <p className="mt-2 text-sm text-mocha">Find something sweet for your next moment.</p>
            <ButtonLink href="/cakes" className="mt-8" onClick={close}>
              Browse cakes
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-espresso/8 overflow-y-auto overscroll-contain px-6" data-lenis-prevent>
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} onNavigate={close} />
              ))}
            </ul>
            <footer className="border-t border-espresso/10 px-6 pb-5 pt-4 sm:pb-6 sm:pt-5">
              <Field label="Delivery / pickup date" htmlFor="drawer-date">
                <Input
                  id="drawer-date"
                  type="date"
                  min={isoDateFromToday(1)}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="!py-3"
                />
              </Field>
              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-sm text-cocoa">Subtotal</span>
                <span className="text-xl font-medium tabular-nums text-espresso">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-mocha">Delivery calculated at pre-order. No payment taken online yet.</p>
              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={() => {
                  close();
                  router.push("/preorder");
                }}
              >
                Proceed to pre-order
              </Button>
              <Link href="/cart" onClick={close} className="mt-3 block text-center text-sm text-cocoa underline underline-offset-4 hover:text-espresso">
                View full cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
