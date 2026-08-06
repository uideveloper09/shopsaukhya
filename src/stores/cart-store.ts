"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productCode: number;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  addItem: (productCode: number, size: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      addItem: (productCode, size) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productCode === productCode && i.size === size,
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productCode === productCode && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
            count: get().count + 1,
          });
        } else {
          set({
            items: [...items, { productCode, size, quantity: 1 }],
            count: get().count + 1,
          });
        }
      },
    }),
    { name: "saukhya:storefrontCart:v2" },
  ),
);
