import type { Metadata } from "next";
import { PreorderForm } from "@/components/forms/PreorderForm";
import { getProducts } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "Pre-order your cake",
  description: "Pre-order a cake for delivery in Dehradun or pickup from the Dehra Cakes studio.",
  alternates: { canonical: "/preorder" },
};

export default async function PreorderPage() {
  const products = await getProducts();
  return (
    <section className="mx-auto min-h-svh max-w-[1200px] px-5 pb-28 pt-[calc(var(--nav-h)+1.5rem)] md:pt-[calc(var(--nav-h)+3rem)] sm:px-8">
      <p className="eyebrow text-caramel">Checkout</p>
      <h1 className="font-display mt-4 text-[clamp(2.6rem,6vw,5.2rem)] font-[340] text-espresso">
        Pre-order <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">your cake</em>
      </h1>
      <p className="mt-4 max-w-xl text-cocoa">
        Tell us when and where. We&apos;ll confirm your order by phone — no payment is taken online in this demo.
      </p>
      <PreorderForm products={products} />
    </section>
  );
}
