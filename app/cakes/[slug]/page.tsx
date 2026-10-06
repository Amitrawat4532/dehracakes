import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/product/ProductTile";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { JsonLd } from "@/components/seo/JsonLd";
import { occasions } from "@/lib/data/occasions";
import { getProductBySlug, getProducts } from "@/lib/services/catalog";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/cakes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name} Cake`;
  const description = `${product.description} Order online for delivery in Dehradun or pickup — from ₹${product.sizes[0].price}.`;
  return {
    title,
    description,
    alternates: { canonical: `/cakes/${product.slug}` },
    openGraph: {
      title: `${title} · Dehra Cakes Dehradun`,
      description,
      url: `/cakes/${product.slug}`,
      images: [{ url: product.image.src, width: product.image.width, height: product.image.height, alt: product.image.alt }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/cakes/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 4);
  const productOccasions = occasions.filter((o) => product.occasions.includes(o.slug));
  const prices = product.sizes.map((s) => s.price);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} Cake`,
    description: product.story,
    image: [product.image, ...product.gallery].map((i) => `${site.url}${i.src}`),
    brand: { "@type": "Brand", name: site.name },
    category: "Cakes",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.sizes.length,
      availability: "https://schema.org/PreOrder",
      areaServed: "Dehradun",
      seller: { "@id": `${site.url}/#bakery` },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Cakes", item: `${site.url}/cakes` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${site.url}/cakes/${product.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-[calc(var(--nav-h)+env(safe-area-inset-top))] sm:px-8 sm:pt-[calc(var(--nav-h)+2.5rem)] md:pb-28">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-mocha max-lg:hidden">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-espresso">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/cakes" className="hover:text-espresso">Cakes</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-espresso">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:pt-4">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
              {product.badge ? (
                <span className="eyebrow shrink-0 rounded-full bg-espresso px-3 py-1.5 text-[0.6rem] text-ivory">{product.badge}</span>
              ) : null}
              {productOccasions.map((o) => (
                <Link key={o.slug} href={`/cakes?occasion=${o.slug}`} className="eyebrow shrink-0 rounded-full border border-espresso/15 px-3 py-1.5 text-[0.6rem] text-cocoa hover:border-espresso/40">
                  {o.name}
                </Link>
              ))}
            </div>
            <h1 className="font-display mt-4 text-[clamp(2.6rem,5.5vw,5rem)] font-[360] text-espresso lg:mt-6">
              {product.name} <em className="text-cocoa [font-variation-settings:'SOFT'_100,'WONK'_1]">Cake</em>
            </h1>
            <p className="mt-3 text-[1.05rem] text-cocoa lg:mt-4 lg:text-lg">{product.tagline}</p>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-mocha lg:mt-5 lg:text-base">{product.story}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {product.flavourNotes.map((n) => (
                <li key={n} className="rounded-full bg-cream px-3.5 py-1.5 text-sm text-cocoa">{n}</li>
              ))}
            </ul>

            <div className="mt-8 border-t border-espresso/10 pt-7 lg:mt-10 lg:pt-9">
              <PurchasePanel product={product} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-title" className="bg-cream py-14 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-7 flex items-end justify-between md:mb-12">
            <h2 id="related-title" className="font-display text-[clamp(2.2rem,4vw,3.6rem)] font-[360] text-espresso">
              You may also <em className="text-cocoa">love</em>
            </h2>
            <Link href="/cakes" className="hidden text-sm text-espresso underline underline-offset-4 md:block">All cakes</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3">
            {related.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
