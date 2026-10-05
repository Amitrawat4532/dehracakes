"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { navLinks } from "@/lib/site";
import { cartCount, useCart } from "@/lib/store/cart";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-baseline gap-[0.35em] leading-none ${className}`}>
      <span className="text-[1.45em] font-[460] tracking-[-0.01em] [font-variation-settings:'SOFT'_100,'WONK'_1]">Dehra</span>
      <span className="font-sans text-[0.62em] font-medium uppercase tracking-[0.32em]">Cakes</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart(cartCount);
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-700 ease-[var(--ease-out-expo)] ${scrolled ? "py-2.5" : "py-4 md:py-5"}`}
      >
        <div className="mx-auto max-w-[1600px] px-3 pt-[env(safe-area-inset-top)] sm:px-5">
          <nav
            aria-label="Main"
            className={`flex items-center justify-between gap-4 rounded-full pl-4 pr-2 transition-all duration-700 ease-[var(--ease-out-expo)] sm:pl-6 ${
              scrolled
                ? "h-14 bg-ivory/80 shadow-[0_8px_30px_-12px_rgb(42_26_18/0.25)] ring-1 ring-espresso/5 backdrop-blur-xl"
                : "h-16 bg-transparent"
            }`}
          >
            <Link href="/" aria-label="Dehra Cakes — home" className="text-espresso">
              <Wordmark className="text-[0.95rem] sm:text-[1.05rem]" />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="group/nav relative rounded-full px-3.5 py-2 text-[0.85rem] text-cocoa transition-colors hover:text-espresso aria-[current=page]:text-espresso"
                  >
                    {l.label}
                    <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-espresso transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/nav:scale-x-100 group-aria-[current=page]/nav:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="grid size-11 place-items-center rounded-full text-espresso transition-colors hover:bg-espresso/6"
                aria-label="Search cakes"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                onClick={openCart}
                className="relative grid size-11 place-items-center rounded-full text-espresso transition-colors hover:bg-espresso/6"
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              >
                <BagIcon />
                {count > 0 ? (
                  <span className="absolute right-1 top-1 grid min-w-[1.15rem] place-items-center rounded-full bg-rose px-1 text-[0.62rem] font-semibold leading-[1.15rem] text-ivory tabular-nums">
                    {count}
                  </span>
                ) : null}
              </button>
              <ButtonLink href="/cakes" size="md" className="ml-1 !h-11 max-sm:hidden">
                Order now
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid size-11 place-items-center rounded-full text-espresso transition-colors hover:bg-espresso/6 lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <MenuIcon />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
