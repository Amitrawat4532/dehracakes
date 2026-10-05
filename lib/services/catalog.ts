import { occasions } from "@/lib/data/occasions";
import { products } from "@/lib/data/products";
import type { Occasion, OccasionSlug, Product } from "@/lib/types";

/**
 * Catalogue access layer. Every page reads products through these functions,
 * so moving to Supabase means replacing the bodies here, e.g.
 *
 *   const { data } = await supabase.from("products").select("*, sizes(*)");
 *
 * The functions are async today to keep that swap signature-compatible.
 */

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByOccasion(slug: OccasionSlug): Promise<Product[]> {
  return products.filter((p) => p.occasions.includes(slug));
}

export async function getOccasions(): Promise<Occasion[]> {
  return occasions;
}

export function startingPrice(product: Product) {
  return Math.min(...product.sizes.map((s) => s.price));
}
