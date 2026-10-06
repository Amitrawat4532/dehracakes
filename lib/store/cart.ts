"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type AddInput = Omit<CartItem, "key" | "quantity"> & { quantity?: number };

type CartState = {
  items: CartItem[];
  deliveryDate: string;
  isOpen: boolean;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setDeliveryDate: (date: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

function lineKey(item: Pick<CartItem, "productId" | "sizeId" | "message">) {
  return `${item.productId}:${item.sizeId}:${(item.message ?? "").trim().toLowerCase()}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      deliveryDate: "",
      isOpen: false,
      add: ({ quantity = 1, ...item }) =>
        set((state) => {
          const key = lineKey(item);
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i,
              )
            : [...state.items, { ...item, key, quantity }];
          return { items, isOpen: true };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, 10) } : i)),
        })),
      setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
      clear: () => set({ items: [], deliveryDate: "" }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "dehra:cart",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items, deliveryDate }) => ({ items, deliveryDate }),
      skipHydration: true,
    },
  ),
);

export const cartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity * i.unitPrice, 0);
