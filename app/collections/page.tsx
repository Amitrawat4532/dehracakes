import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icons";
import { getOccasions, getProducts } from "@/lib/services/catalog";

export const metadata: Metadata = {
  title: "Cake Collections — Birthday, Wedding & Anniversary Cakes in Dehradun",
  description:
    "Birthday cakes, anniversary cakes, wedding cakes and more — explore Dehra Cakes collections for every occasion in Dehradun.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [occasions, products] = await Promise.all([getOccasions(), getProducts()]);
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-[calc(var(--nav-h)+3rem)] sm:px-8 md:pt-[calc(var(--nav-h)+5rem)]">
      <p className="eyebrow text-caramel">Collections</p>
      <h1 className="font-display mt-4 max-w-4xl text-[clamp(2.8rem,7vw,6.8rem)] font-[340] text-espresso">
        A cake for <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">every</em> chapter.
      </h1>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {occasions.map((o, i) => {
          const count = products.filter((p) => p.occasions.includes(o.slug)).length;
          return (
            <Link
              key={o.slug}
              href={`/cakes?occasion=${o.slug}`}
              className={`group relative block overflow-hidden rounded-[1.75rem] ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""} aspect-[4/5] ${i === 0 ? "lg:aspect-auto" : ""}`}
            >
              <Image
                src={o.image.src}
                alt={o.image.alt}
                fill
                priority={i < 2}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-ivory">
                <div>
                  <h2 className="font-display text-4xl font-[380]">{o.name}</h2>
                  <p className="mt-1 text-sm text-ivory/75">{o.blurb} · {count} cakes</p>
                </div>
                <span className="grid size-11 place-items-center rounded-full border border-ivory/40 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ivory group-hover:text-espresso">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
