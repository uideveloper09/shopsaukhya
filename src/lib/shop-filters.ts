import type { Product } from "@/types/storefront";
import { SIZE_LABELS } from "@/constants/brand";
import { extractFabricFromProduct, getAvailableSizes } from "@/lib/utils";
import { SHOP_PRICE_RANGES, type ShopSortMode } from "@/constants/shop";

export type ShopFiltersState = {
  categoryCode: number;
  subcategoryCode: number;
  query: string;
  sortMode: ShopSortMode;
  size: string;
  material: string;
  price: string;
  discountOnly: boolean;
};

export const DEFAULT_SHOP_FILTERS: ShopFiltersState = {
  categoryCode: 0,
  subcategoryCode: 0,
  query: "",
  sortMode: "featured",
  size: "",
  material: "",
  price: "",
  discountOnly: false,
};

export function getProductMaterials(products: Product[]): string[] {
  const set = new Set<string>();
  for (const product of products) {
    const fabric =
      product.fabric?.trim() || extractFabricFromProduct(product);
    if (fabric) set.add(fabric);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getProductSizes(products: Product[]): string[] {
  const set = new Set<string>();
  for (const product of products) {
    for (const size of getAvailableSizes(product.objSizes ?? {})) {
      set.add(size);
    }
  }
  return SIZE_LABELS.filter((size) => set.has(size));
}

export function countDiscountedProducts(products: Product[]): number {
  return products.filter((p) => (p.discountPercent ?? 0) > 0).length;
}

export function filterAndSortProducts(
  products: Product[],
  filters: ShopFiltersState,
): Product[] {
  const query = filters.query.trim().toLowerCase();
  const priceRange = SHOP_PRICE_RANGES.find((r) => r.key === filters.price);

  let list = products.filter((product) => {
    if (
      filters.categoryCode > 0 &&
      product.categoryCode !== filters.categoryCode
    ) {
      return false;
    }

    if (
      filters.subcategoryCode > 0 &&
      product.subCategoryCode !== filters.subcategoryCode
    ) {
      return false;
    }

    if (filters.discountOnly && !(product.discountPercent > 0)) {
      return false;
    }

    if (filters.size) {
      const sizes = getAvailableSizes(product.objSizes ?? {});
      if (!sizes.includes(filters.size)) return false;
    }

    if (filters.material) {
      const fabric =
        product.fabric?.trim() || extractFabricFromProduct(product);
      if (fabric.toLowerCase() !== filters.material.toLowerCase()) {
        return false;
      }
    }

    if (priceRange && priceRange.key) {
      const price = product.finalAmount ?? 0;
      if (price < priceRange.min) return false;
      if (
        Number.isFinite(priceRange.max) &&
        price >= priceRange.max
      ) {
        return false;
      }
    }

    if (query) {
      const haystack = [
        product.productName,
        product.categoryName,
        product.subCategoryName,
        product.productCodeDisplay,
        product.fabric,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  list = [...list];
  switch (filters.sortMode) {
    case "price-low":
      list.sort((a, b) => a.finalAmount - b.finalAmount);
      break;
    case "price-high":
      list.sort((a, b) => b.finalAmount - a.finalAmount);
      break;
    case "discount":
      list.sort(
        (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0),
      );
      break;
    default:
      list.sort(
        (a, b) =>
          (a.position ?? a.productCode) - (b.position ?? b.productCode),
      );
  }

  return list;
}
