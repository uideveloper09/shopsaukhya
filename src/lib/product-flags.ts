import type { Product } from "@/types/storefront";

/** Bahaar / top home picks are treated as trending (matches live storefront curation). */
export function isProductTrending(product: Product): boolean {
  return product.categoryCode === 1 || (product.position ?? 999) <= 7;
}

export function isProductOnOffer(product: Product): boolean {
  return (product.discountPercent ?? 0) > 0;
}

export function getHeroCarouselProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aOffer = isProductOnOffer(a) ? 0 : 1;
    const bOffer = isProductOnOffer(b) ? 0 : 1;
    if (aOffer !== bOffer) return aOffer - bOffer;
    return (a.position ?? 999) - (b.position ?? 999);
  });
}
