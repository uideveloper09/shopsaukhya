"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, RecentlyViewedProduct } from "@/types/storefront";
import { CuratedProductCard } from "@/components/ui/curated-product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  clearRecentlyViewed,
  getRecentlyViewedDisplayProducts,
  loadRecentlyViewed,
  RECENTLY_VIEWED_UPDATED_EVENT,
} from "@/lib/recently-viewed";

interface RecentlyViewedProps {
  products?: Product[];
}

export function RecentlyViewed({ products = [] }: RecentlyViewedProps) {
  const [storedItems, setStoredItems] = useState<RecentlyViewedProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setStoredItems(loadRecentlyViewed());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.includes("recentlyViewed")) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, refresh);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(RECENTLY_VIEWED_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  const { products: displayProducts, fromHistory } = useMemo(
    () => getRecentlyViewedDisplayProducts(storedItems, products, { limit: 4 }),
    [storedItems, products],
  );

  const handleClear = () => {
    clearRecentlyViewed();
    refresh();
  };

  if (!mounted || !displayProducts.length) return null;

  return (
    <section
      className="section-padding bg-saukhya-warm-alt/60 floral-decoration"
      aria-labelledby="recently-viewed-heading"
    >
      <div className="container-saukhya relative">
        {fromHistory && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-0 top-1 z-10 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-muted transition-colors hover:text-saukhya-pink"
          >
            Clear history
          </button>
        )}

        <SectionHeading
          id="recently-viewed-heading"
          title="Recently Viewed Styles"
          subtitle={
            fromHistory
              ? "Pick up where you left off"
              : "Styles you may want to explore next"
          }
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <CuratedProductCard
              key={product.productCode}
              product={product}
              priority={index < 2}
              showMetaBelow
            />
          ))}
        </div>
      </div>
    </section>
  );
}
