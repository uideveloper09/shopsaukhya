"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: number[];
  toggle: (productCode: number) => void;
  has: (productCode: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productCode) =>
        set((state) => ({
          items: state.items.includes(productCode)
            ? state.items.filter((id) => id !== productCode)
            : [...state.items, productCode],
        })),
      has: (productCode) => get().items.includes(productCode),
    }),
    { name: "saukhya:wishlist:v1" },
  ),
);
