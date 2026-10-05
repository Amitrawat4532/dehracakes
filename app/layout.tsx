import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { MobileOrderBar } from "@/components/layout/MobileOrderBar";
import { Navbar } from "@/components/layout/Navbar";
import { CartHydrator } from "@/components/providers/CartHydrator";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dehra Cakes — Handcrafted Cakes & Cake Delivery in Dehradun",
    template: "%s · Dehra Cakes Dehradun",
  },
  description: site.description,
  keywords: [
    "Dehradun cake shop",
    "cakes in Dehradun",
    "cake delivery Dehradun",
    "birthday cakes Dehradun",
    "custom cakes Dehradun",
    "online cake order Dehradun",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: "Dehra Cakes — Handcrafted cakes, made in Dehradun",
    description: site.description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "Dehra Cakes — Freshly baked happiness" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dehra Cakes — Handcrafted cakes, made in Dehradun",
    description: site.description,
    images: ["/brand/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f2e9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": `${site.url}/#bakery`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/brand/og.jpg`,
  logo: `${site.url}/brand/dehra-cakes-logo.webp`,
  telephone: site.phone,
  email: site.email,
  priceRange: "₹₹",
  servesCuisine: "Cakes, Patisserie",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: { "@type": "City", name: "Dehradun" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "20:00" },
  ],
  sameAs: [site.instagramHref],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${geist.variable} antialiased`}>
      <body className="min-h-svh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-espresso px-5 py-3 text-sm text-ivory transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`.reveal-fade,.reveal-image,.reveal-image img,.reveal-words .w>span{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <JsonLd data={bakerySchema} />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <MobileOrderBar />
        <SmoothScroll />
        <CartHydrator />
      </body>
    </html>
  );
}
