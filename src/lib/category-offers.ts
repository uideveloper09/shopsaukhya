import type { Product, SectionFilter } from "@/types/storefront";

export function getCategoryMaxOfferPercent(
  category: SectionFilter,
  products: Product[],
): number {
  return products.reduce((max, product) => {
    const matchesCategory =
      category.categoryCode != null &&
      product.categoryCode === category.categoryCode;
    const matchesSubCategory =
      category.subCategoryCode != null &&
      product.subCategoryCode === category.subCategoryCode;

    if (!matchesCategory && !matchesSubCategory) return max;
    return Math.max(max, product.discountPercent ?? 0);
  }, 0);
}
