import type { ImageAsset, Product, SizeOption } from "@/lib/types";

/**
 * Demo catalogue. Prices are dummy values for demonstration purposes.
 * In production these rows come from the Supabase `products` table.
 */

function img(file: string, alt: string, width: number, height: number): ImageAsset {
  return { src: `/images/cakes/${file}`, alt, width, height };
}

function sizes([half, one, oneHalf, two]: [number, number, number, number]): SizeOption[] {
  return [
    { id: "0.5kg", label: "0.5 kg", weightKg: 0.5, serves: "4–6", price: half },
    { id: "1kg", label: "1 kg", weightKg: 1, serves: "8–10", price: one },
    { id: "1.5kg", label: "1.5 kg", weightKg: 1.5, serves: "12–15", price: oneHalf },
    { id: "2kg", label: "2 kg", weightKg: 2, serves: "16–20", price: two },
  ];
}

export const products: Product[] = [
  {
    id: "p_choc_truffle",
    slug: "chocolate-truffle",
    name: "Chocolate Truffle",
    tagline: "Dark, dense, unapologetically rich.",
    description:
      "Moist chocolate sponge layered with silky truffle ganache and finished with hand-piped chocolate rosettes.",
    story:
      "Our most-requested cake. Three layers of cocoa sponge, soaked lightly and sandwiched with a 55% dark chocolate truffle, then poured over with a warm ganache that sets to a soft shine.",
    flavourNotes: ["55% dark chocolate", "Cocoa sponge", "Truffle ganache"],
    image: img("chocolate-truffle.webp", "Chocolate truffle cake with glossy ganache drip and piped chocolate rosettes", 1400, 1030),
    gallery: [
      img("chocolate-truffle-2.webp", "Slices of chocolate truffle cake with ganache being poured over", 1400, 2100),
      img("black-forest-2.webp", "Close-up of chocolate cake decorated with shavings", 1400, 1122),
    ],
    sizes: sizes([549, 949, 1349, 1749]),
    occasions: ["birthday", "celebration", "anniversary"],
    eggless: true,
    badge: "Bestseller",
  },
  {
    id: "p_red_velvet",
    slug: "red-velvet",
    name: "Red Velvet",
    tagline: "Velvet crumb, tangy cream cheese.",
    description:
      "Classic buttermilk red velvet with a whisper of cocoa, layered with whipped cream-cheese frosting.",
    story:
      "A soft, tender crumb with a gentle cocoa note and a deep crimson colour, balanced by a lightly tangy cream-cheese frosting that is never too sweet.",
    flavourNotes: ["Buttermilk sponge", "Cream cheese", "Hint of cocoa"],
    image: img("red-velvet.webp", "Slice of red velvet cake with cream cheese frosting on a white plate", 1400, 1249),
    gallery: [
      img("red-velvet-2.webp", "Red velvet cake slice with fresh strawberries", 1400, 998),
      img("red-velvet-3.webp", "Red velvet cupcake topped with cream and red velvet crumbs", 1400, 2100),
    ],
    sizes: sizes([649, 1099, 1549, 1999]),
    occasions: ["valentines", "anniversary", "birthday"],
    eggless: true,
  },
  {
    id: "p_black_forest",
    slug: "black-forest",
    name: "Black Forest",
    tagline: "Cherries, cream and cocoa — done properly.",
    description:
      "Chocolate sponge, soft whipped cream and dark cherries, finished with chocolate shavings.",
    story:
      "The cake everyone grew up with, rebuilt with care: a lighter whipped cream, sour-sweet cherries in every layer and generous dark chocolate curls on top.",
    flavourNotes: ["Dark cherries", "Whipped cream", "Chocolate curls"],
    image: img("black-forest.webp", "Layered black forest cake with chocolate, cream and cherries", 1400, 1616),
    gallery: [
      img("black-forest-2.webp", "Black forest cake decorated with cherries and chocolate", 1400, 1122),
    ],
    sizes: sizes([499, 899, 1299, 1699]),
    occasions: ["birthday", "celebration"],
    eggless: true,
  },
  {
    id: "p_butterscotch",
    slug: "butterscotch-crunch",
    name: "Butterscotch Crunch",
    tagline: "Caramel warmth with a golden crunch.",
    description:
      "Vanilla sponge with butterscotch cream, house-made praline and a salted caramel drip.",
    story:
      "Brown-butter vanilla sponge layered with butterscotch cream and a crackly praline we make in small batches, finished with a soft salted caramel drip.",
    flavourNotes: ["House praline", "Salted caramel", "Brown-butter sponge"],
    image: img("butterscotch-crunch.webp", "Butterscotch cake with caramel drip and crunchy toppings", 1400, 2107),
    gallery: [
      img("butterscotch-crunch-2.webp", "Slice of layered caramel cake with crunchy praline", 1400, 2100),
    ],
    sizes: sizes([499, 899, 1299, 1699]),
    occasions: ["birthday", "celebration", "baby-shower"],
    eggless: true,
  },
  {
    id: "p_belgian",
    slug: "belgian-chocolate",
    name: "Belgian Chocolate",
    tagline: "Ivory cream, Belgian ganache, golden finish.",
    description:
      "Vanilla sponge with Belgian chocolate filling, ivory buttercream and a hand-poured dark ganache drip.",
    story:
      "Golden vanilla sponge, layers of whipped vanilla cream and Belgian dark chocolate ganache, wrapped in smooth ivory buttercream. Finished with a glossy drip, fresh strawberries and gold pearls.",
    flavourNotes: ["Belgian dark chocolate", "Vanilla bean", "Fresh strawberries"],
    image: img("belgian-chocolate.webp", "Ivory cake with dark Belgian chocolate ganache dripping down the sides", 1400, 1083),
    gallery: [
      img("belgian-chocolate-2.webp", "Hand holding a chocolate and cream layered cake", 1400, 2108),
      img("chocolate-truffle-2.webp", "Chocolate ganache poured over stacked cake slices", 1400, 2100),
    ],
    sizes: sizes([599, 999, 1399, 1799]),
    occasions: ["anniversary", "birthday", "wedding", "celebration"],
    eggless: true,
    has3d: true,
    badge: "Signature",
  },
  {
    id: "p_fresh_fruit",
    slug: "fresh-fruit",
    name: "Fresh Fruit Cake",
    tagline: "Light sponge, cream and seasonal fruit.",
    description:
      "Airy vanilla chiffon, light vanilla cream and the season's freshest fruit, glazed to a soft shine.",
    story:
      "Our lightest cake: a cloud-soft chiffon, vanilla cream and whatever fruit is best that week — strawberries in winter, mango in summer — finished with a delicate glaze.",
    flavourNotes: ["Seasonal fruit", "Vanilla chiffon", "Light cream"],
    image: img("fresh-fruit.webp", "Strawberry and cream layered fruit cake on a white background", 1400, 970),
    gallery: [
      img("fresh-fruit-2.webp", "Slice of berry cream cake topped with raspberries", 1400, 1750),
    ],
    sizes: sizes([599, 1049, 1499, 1899]),
    occasions: ["baby-shower", "anniversary", "wedding"],
    eggless: true,
  },
];
