"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/store/cart";

/** Rehydrates the persisted cart after mount to keep SSR markup stable. */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
