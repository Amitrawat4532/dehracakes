import type { Metadata } from "next";
import { Suspense } from "react";
import { CakeCatalogue } from "@/components/product/CakeCatalogue";
import { getOccasions, getProducts } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "Cakes — Order Online in Dehradun",
  description:
    "Browse Dehra Cakes' signature cakes — Belgian chocolate, red velvet, black forest and more. Order online for cake delivery in Dehradun or pickup.",
  alternates: { canonical: "/cakes" },
};

export default async function CakesPage() {
  const [products, occasions] = await Promise.all([getProducts(), getOccasions()]);
  return (
    <section className="mx-auto min-h-svh max-w-[1440px] px-5 pb-28 pt-[calc(var(--nav-h)+1.5rem)] sm:px-8 md:pt-[calc(var(--nav-h)+5rem)]">
      <p className="eyebrow text-caramel">The menu</p>
      <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.4rem,7vw,6.8rem)] sm:mt-4 font-[340] text-espresso">
        Cakes, baked to <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">order</em> in Dehradun.
      </h1>
      <Suspense fallback={<div className="mt-16 h-96" />}>
        <CakeCatalogue products={products} occasions={occasions} />
      </Suspense>
    </section>
  );
}
