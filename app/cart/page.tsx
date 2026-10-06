import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <section className="mx-auto min-h-svh max-w-300 px-5 pb-28 pt-[calc(var(--nav-h)+1.5rem)] md:pt-[calc(var(--nav-h)+3rem)] sm:px-8">
      <h1 className="font-display text-[clamp(2.6rem,6vw,5.2rem)] font-[340] text-espresso">
        Your <em className="text-cocoa">cart</em>
      </h1>
      <CartView />
    </section>
  );
}
