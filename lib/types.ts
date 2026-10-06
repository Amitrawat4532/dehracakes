/**
 * Domain types. Shapes intentionally mirror the planned Supabase tables
 * (see supabase/schema.sql) so the static demo data can be swapped for
 * real queries without touching UI components.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type OccasionSlug =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "valentines"
  | "baby-shower"
  | "celebration";

export type SizeOption = {
  id: string;
  label: string;
  weightKg: number;
  serves: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  flavourNotes: string[];
  image: ImageAsset;
  gallery: ImageAsset[];
  sizes: SizeOption[];
  occasions: OccasionSlug[];
  eggless: boolean;
  /** Products with a procedural 3D preview available on the detail page. */
  has3d?: boolean;
  badge?: string;
};

export type Occasion = {
  slug: OccasionSlug;
  name: string;
  blurb: string;
  image: ImageAsset;
};

export type CartItem = {
  /** productId + sizeId + message — the same cake with a different message is a separate line. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: ImageAsset;
  sizeId: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
  message?: string;
};

export type FulfilmentMethod = "delivery" | "pickup";

export type PreorderInput = {
  name: string;
  phone: string;
  email: string;
  fulfilment: FulfilmentMethod;
  date: string;
  timeSlot: string;
  address?: string;
  instructions?: string;
  items: Array<{
    productId: string;
    name: string;
    sizeLabel: string;
    quantity: number;
    unitPrice: number;
    message?: string;
  }>;
};

export type CustomCakeEnquiryInput = {
  name: string;
  phone: string;
  flavour: string;
  size: string;
  date: string;
  message: string;
  inspirationFileName?: string;
};

export type SubmissionResult = {
  reference: string;
  createdAt: string;
};
