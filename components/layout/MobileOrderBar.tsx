"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/format";
import { cartCount, cartSubtotal, useCart } from "@/lib/store/cart";

/**
 * Sticky bottom bar on phones: "Order a cake" or, once something is in the
 * cart, a direct path to checkout. It steps aside during immersive 3D
 * sections (`[data-immersive]`), while the cart sheet is open, and on pages
 * with their own sticky purchase bar.
 */
export function MobileOrderBar() {
  const pathname = usePathname();
  const count = useCart(cartCount);
  const subtotal = useCart(cartSubtotal);
  const open = useCart((s) => s.open);
  const cartOpen = useCart((s) => s.isOpen);
  const [scrolled, setScrolled] = useState(false);
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track immersive sections covering the middle of the screen.
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setImmersive(visible.size > 0);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-immersive]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const hidden = pathname.startsWith("/cakes/") || pathname === "/preorder" || pathname === "/cart";
  if (hidden) return null;

  const show = (scrolled || count > 0) && !immersive && !cartOpen;

  return (
    <div
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-all duration-500 ease-[var(--ease-out-expo)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full bg-espresso/95 p-1.5 pl-5 text-ivory shadow-lift ring-1 ring-ivory/10 backdrop-blur-md">
        {count > 0 ? (
          <>
            <button type="button" onClick={open} className="flex min-h-11 flex-1 items-center gap-3 text-left text-sm active:opacity-70">
              <span className="relative">
                <BagIcon size={19} />
                <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-rose px-1 text-[0.58rem] font-semibold leading-4 tabular-nums">
                  {count}
                </span>
              </span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </button>
            <Link href="/preorder" className="rounded-full bg-ivory px-6 py-3 text-sm font-medium text-espresso active:scale-95">
              Checkout
            </Link>
          </>
        ) : (
          <>
            <span className="flex-1 text-[0.82rem] leading-tight text-ivory/75">
              Freshly baked
              <br />
              in Dehradun
            </span>
            <Link href="/cakes" className="rounded-full bg-ivory px-6 py-3 text-sm font-medium text-espresso active:scale-95">
              Order a Cake
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
