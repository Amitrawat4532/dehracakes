import type { Occasion } from "@/lib/types";

function img(file: string, alt: string, width: number, height: number) {
  return { src: `/images/occasions/${file}`, alt, width, height };
}

export const occasions: Occasion[] = [
  {
    slug: "birthday",
    name: "Birthday",
    blurb: "Candles, wishes and the first slice.",
    image: img("birthday.webp", "Pastel birthday cake with macarons and a gold drip", 1400, 2029),
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    blurb: "For the years, and the ones ahead.",
    image: img("anniversary.webp", "Elegant cream cake topped with blackberries and lilac flowers on a cake stand", 1400, 1895),
  },
  {
    slug: "wedding",
    name: "Wedding",
    blurb: "Tiered, timeless, made to be remembered.",
    image: img("wedding.webp", "Three-tier white wedding cake decorated with pink roses", 1400, 2100),
  },
  {
    slug: "valentines",
    name: "Valentine's",
    blurb: "Red velvet, said softly.",
    image: img("valentines.webp", "Red velvet cupcake with cream and red crumbs", 1400, 2100),
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    blurb: "Soft colours for a brand-new hello.",
    image: img("baby-shower.webp", "Pastel striped cake with cream drip and cherries", 1400, 2099),
  },
  {
    slug: "celebration",
    name: "Celebration",
    blurb: "Promotions, homecomings, just because.",
    image: img("celebration.webp", "Two-tier cream cake covered in fresh berries", 1400, 2095),
  },
];
