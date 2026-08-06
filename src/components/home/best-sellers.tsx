"use client";

import type { Product } from "@/types/storefront";
import { CuratedProductCard } from "@/components/ui/curated-product-card";
import { SectionHeading } from "@/components/ui/section-heading";

interface BestSellersProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function BestSellers({
  products,
  title = "Best Sellers",
  subtitle = "Our most loved styles from the Bahaar Collection",
}: BestSellersProps) {
  const displayProducts = products.slice(0, 8);

  if (!displayProducts.length) return null;

  return (
    <section
      className="section-padding bg-saukhya-warm-alt/60 floral-decoration"
      aria-labelledby="bestsellers-heading"
    >
      <div className="container-saukhya">
        <SectionHeading id="bestsellers-heading" title={title} subtitle={subtitle} />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <CuratedProductCard
              key={product.productCode}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
