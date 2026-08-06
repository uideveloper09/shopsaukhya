"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, RecentlyViewedProduct } from "@/types/storefront";
import { CuratedProductCard } from "@/components/ui/curated-product-card";
import { RevealStagger, RevealItem } from "@/components/motion/reveal";
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
      <div className="container-saukhya">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div className="min-w-0 flex-1 text-left md:text-center md:mx-auto md:max-w-2xl">
            <div className="flex items-center gap-3 md:justify-center">
              <span
                aria-hidden
                className="inline-block h-[7px] w-[7px] shrink-0 rotate-45 bg-saukhya-maroon md:h-2 md:w-2"
              />
              <h2 id="recently-viewed-heading" className="section-title">
                Recently Viewed Styles
              </h2>
              <span
                aria-hidden
                className="inline-block h-[7px] w-[7px] shrink-0 rotate-45 bg-saukhya-maroon md:h-2 md:w-2"
              />
            </div>
            <p className="section-subtitle mx-0 mt-2 text-left md:mx-auto md:text-center">
              {fromHistory
                ? "Pick up where you left off"
                : "Styles you may want to explore next"}
            </p>
          </div>

          {fromHistory && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-saukhya-muted transition-colors hover:text-saukhya-pink md:absolute md:right-4 md:top-0 lg:right-8"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile: horizontal snap rail. Desktop: grid. */}
        <div className="md:hidden">
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {displayProducts.map((product, index) => (
              <div
                key={product.productCode}
                className="w-[68%] max-w-[260px] shrink-0 snap-start"
              >
                <CuratedProductCard
                  product={product}
                  priority={index < 2}
                  showMetaBelow
                />
              </div>
            ))}
          </div>
        </div>

        <RevealStagger
          className="hidden grid-cols-2 gap-3 md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-4"
          stagger={0.06}
          delay={0.05}
        >
          {displayProducts.map((product, index) => (
            <RevealItem key={product.productCode} index={index}>
              <CuratedProductCard
                product={product}
                priority={index < 2}
                showMetaBelow
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
