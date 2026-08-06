import type { Product, RecentlyViewedProduct } from "@/types/storefront";
import {
  RECENTLY_VIEWED_KEY,
  RECENTLY_VIEWED_MAX,
  RECENTLY_VIEWED_TTL_MS,
} from "@/constants/brand";

export const RECENTLY_VIEWED_UPDATED_EVENT = "saukhya:recently-viewed-updated";

const STORED_KEYS = new Set([
  "productCode",
  "productName",
  "seoSlug",
  "productImageUrl",
  "finalAmount",
  "originalAmount",
  "discountPercent",
  "viewedAt",
]);

export function getRecentlyViewedKey(
  item: Partial<Product | RecentlyViewedProduct>,
): string {
  return String(item.productCode ?? item.seoSlug ?? item.productName ?? "").trim();
}

export function loadRecentlyViewed(): RecentlyViewedProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];

    const items = JSON.parse(raw) as RecentlyViewedProduct[];
    if (!Array.isArray(items)) return [];

    const now = Date.now();
    return items
      .filter((item) => item && getRecentlyViewedKey(item))
      .filter((item) => now - (item.viewedAt ?? 0) < RECENTLY_VIEWED_TTL_MS)
      .slice(0, RECENTLY_VIEWED_MAX);
  } catch {
    return [];
  }
}

export function toRecentlyViewedProduct(
  product: Partial<Product | RecentlyViewedProduct>,
): RecentlyViewedProduct {
  return {
    productCode: product.productCode ?? 0,
    productName: product.productName ?? "",
    seoSlug: product.seoSlug ?? "",
    productImageUrl: product.productImageUrl ?? "",
    finalAmount: product.finalAmount ?? 0,
    originalAmount: product.originalAmount ?? product.finalAmount ?? 0,
    discountPercent: product.discountPercent ?? 0,
    viewedAt: Date.now(),
  };
}

export function trackRecentlyViewed(
  product: Partial<Product | RecentlyViewedProduct>,
): void {
  if (typeof window === "undefined") return;

  const key = getRecentlyViewedKey(product);
  if (!key || !product.productName) return;

  const entry = toRecentlyViewedProduct(product);
  const next = [
    entry,
    ...loadRecentlyViewed().filter((item) => getRecentlyViewedKey(item) !== key),
  ].slice(0, RECENTLY_VIEWED_MAX);

  try {
    const sanitized = next.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(([field]) => STORED_KEYS.has(field)),
      ),
    ) as RecentlyViewedProduct[];

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_UPDATED_EVENT));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_UPDATED_EVENT));
  } catch {
    // Ignore storage failures
  }
}

function buildProductLookup(products: Product[]): Map<string, Product> {
  const lookup = new Map<string, Product>();

  for (const product of products) {
    lookup.set(String(product.productCode), product);
    if (product.seoSlug) lookup.set(product.seoSlug, product);
  }

  return lookup;
}

function storedToProduct(item: RecentlyViewedProduct): Product {
  return {
    productCode: item.productCode,
    productName: item.productName,
    seoSlug: item.seoSlug,
    productImageUrl: item.productImageUrl,
    canonicalUrl: `/product/${item.seoSlug}`,
    categoryCode: 0,
    categoryName: "",
    subCategoryCode: 0,
    subCategoryName: "",
    payableAmount: item.finalAmount,
    originalAmount: item.originalAmount,
    discountPercent: item.discountPercent,
    discountAmount: Math.max(0, item.originalAmount - item.finalAmount),
    finalAmount: item.finalAmount,
    objSizes: {},
  };
}

export function resolveRecentlyViewedProducts(
  stored: RecentlyViewedProduct[],
  productSource: Product[],
  options?: { limit?: number; excludeProductCode?: number },
): Product[] {
  const limit = options?.limit ?? 4;
  const exclude = options?.excludeProductCode;
  const lookup = buildProductLookup(productSource);

  return stored
    .filter((item) => !exclude || item.productCode !== exclude)
    .map((item) => {
      const live =
        lookup.get(String(item.productCode)) ?? lookup.get(item.seoSlug);
      return live ?? storedToProduct(item);
    })
    .slice(0, limit);
}

export function getRecentlyViewedDisplayProducts(
  stored: RecentlyViewedProduct[],
  productSource: Product[],
  options?: { limit?: number; excludeProductCode?: number },
): { products: Product[]; fromHistory: boolean } {
  const limit = options?.limit ?? 4;
  const fromHistory = resolveRecentlyViewedProducts(stored, productSource, {
    ...options,
    limit,
  });

  if (fromHistory.length) {
    return { products: fromHistory, fromHistory: true };
  }

  return {
    products: productSource.slice(0, limit),
    fromHistory: false,
  };
}
