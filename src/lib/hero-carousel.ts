import type { Product } from "@/types/storefront";

export type HeroCarouselSlide = {
  type: "product";
  id: string;
  product: Product;
};

export function buildHeroCarouselSlides(products: Product[]): HeroCarouselSlide[] {
  return products.map((product) => ({
    type: "product" as const,
    id: `product-${product.productCode}`,
    product,
  }));
}

export function getHeroSlideLabel(slide: HeroCarouselSlide): string {
  return slide.product.productName;
}
