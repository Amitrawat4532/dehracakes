import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/services/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const staticRoutes = ["", "/cakes", "/collections", "/custom-cakes", "/preorder"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${site.url}/cakes/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
