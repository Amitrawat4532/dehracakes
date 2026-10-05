/**
 * Business details. Everything marked `placeholder` must be replaced with
 * the bakery's real information before going live.
 */
export const site = {
  name: "Dehra Cakes",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dehracakes.in",
  tagline: "Freshly baked happiness",
  description:
    "Handcrafted cakes in Dehradun for birthdays, anniversaries, weddings and every moment worth remembering. Order online for delivery or pickup across Dehradun.",
  // placeholder contact details
  phone: "+91 98XXX XXXXX",
  phoneHref: "tel:+910000000000",
  whatsappHref: "https://wa.me/910000000000",
  email: "hello@dehracakes.in",
  instagramHref: "https://instagram.com/",
  address: {
    street: "Studio address placeholder, Rajpur Road",
    locality: "Dehradun",
    region: "Uttarakhand",
    postalCode: "248001",
    country: "IN",
  },
  geo: { lat: 30.3165, lng: 78.0322 },
  hours: [
    { days: "Mon – Sat", time: "10:00 – 21:00" },
    { days: "Sunday", time: "11:00 – 20:00" },
  ],
  // placeholder delivery areas
  deliveryAreas: [
    "Rajpur Road",
    "Jakhan",
    "Dalanwala",
    "Vasant Vihar",
    "Clement Town",
    "Prem Nagar",
    "Sahastradhara Road",
    "Ballupur",
  ],
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Dehradun%2C+Uttarakhand",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cakes", label: "Cakes" },
  { href: "/collections", label: "Collections" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
