import { cache } from "react";
import { REVALIDATE } from "@/lib/storefront/config";
import {
  storefrontFetchSafe,
  storefrontFetch,
} from "@/lib/storefront/client";
import { unwrapList } from "@/lib/storefront/normalize";
import {
  getHomeFilters,
  getHomeProducts,
  getPrimaryProductSection,
} from "@/lib/storefront/home-selectors";
import type {
  Category,
  DiscountCode,
  HomeData,
  NavigationData,
  Product,
  ProductReview,
  SubCategory,
} from "@/types/storefront";

const EMPTY_HOME: HomeData = {
  seo: {
    metaTitle: "Saukhya | Embrace Tranquility",
    metaDescription: "Shop Saukhya's curated collection of Indian fashion.",
    metaKeywords: null,
    canonicalUrl: "/",
    ogTitle: "Saukhya",
    ogDescription: "Discover Saukhya's curated creations.",
    ogImage: "",
  },
  banners: [],
  sections: [],
};

const EMPTY_NAV: NavigationData = {
  headerMenus: [],
  megaMenus: [],
  footerMenus: [],
};

async function fetchProductReviews(productCode: number): Promise<ProductReview[]> {
  return unwrapList(
    await storefrontFetchSafe(
      `/api/storefront/catalog/products/${productCode}/reviews`,
      [] as ProductReview[],
      {
        revalidate: REVALIDATE.reviews,
        tags: [`reviews-${productCode}`],
      },
    ),
  );
}

async function fetchFeaturedReviews(products: Product[]): Promise<ProductReview[]> {
  const codes = [...new Set(products.map((p) => p.productCode))].slice(0, 8);
  if (!codes.length) return [];

  const batches = await Promise.all(codes.map((code) => fetchProductReviews(code)));
  return batches
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 12);
}

export const storefrontApi = {
  home: () =>
    storefrontFetchSafe<HomeData>("/api/storefront/home", EMPTY_HOME, {
      revalidate: REVALIDATE.home,
      tags: ["storefront-home"],
    }),

  navigation: () =>
    storefrontFetchSafe<NavigationData>(
      "/api/storefront/navigation",
      EMPTY_NAV,
      {
        revalidate: REVALIDATE.navigation,
        tags: ["storefront-navigation"],
      },
    ),

  categories: async (): Promise<Category[]> =>
    unwrapList(
      await storefrontFetchSafe<Category[] | { value: Category[] }>(
        "/api/storefront/catalog/categories",
        [],
        { revalidate: REVALIDATE.catalog, tags: ["storefront-categories"] },
      ),
    ),

  subcategories: async (): Promise<SubCategory[]> =>
    unwrapList(
      await storefrontFetchSafe<SubCategory[] | { value: SubCategory[] }>(
        "/api/storefront/catalog/subcategories",
        [],
        { revalidate: REVALIDATE.catalog, tags: ["storefront-subcategories"] },
      ),
    ),

  products: async (params?: Record<string, string | number>): Promise<Product[]> => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : "";

    return unwrapList(
      await storefrontFetchSafe<Product[] | { value: Product[] }>(
        `/api/storefront/catalog/products${query}`,
        [],
        { revalidate: REVALIDATE.catalog, tags: ["storefront-products"] },
      ),
    );
  },

  productBySlug: (slug: string) =>
    storefrontFetch<Product>(
      `/api/storefront/catalog/products/by-slug/${encodeURIComponent(slug)}`,
      { revalidate: REVALIDATE.catalog, tags: [`product-${slug}`] },
    ),

  productReviews: fetchProductReviews,

  discounts: async (): Promise<DiscountCode[]> =>
    unwrapList(
      await storefrontFetchSafe<DiscountCode[] | { value: DiscountCode[] }>(
        "/api/storefront/discounts",
        [],
        { revalidate: REVALIDATE.catalog, tags: ["storefront-discounts"] },
      ),
    ),
};

export type HomepageData = {
  home: HomeData;
  navigation: NavigationData;
  categories: Category[];
  subcategories: SubCategory[];
  products: Product[];
  filters: ReturnType<typeof getHomeFilters>;
  productSection: ReturnType<typeof getPrimaryProductSection>;
  reviews: ProductReview[];
  discounts: DiscountCode[];
};

/**
 * Cached server fetch for homepage — deduped across generateMetadata + page.
 * Live source: https://www.shopsaukhya.com/storefront-api
 */
export const getHomepageData = cache(async (): Promise<HomepageData> => {
  const [home, navigation, categories, subcategories, catalogProducts, discounts] =
    await Promise.all([
      storefrontApi.home(),
      storefrontApi.navigation(),
      storefrontApi.categories(),
      storefrontApi.subcategories(),
      storefrontApi.products(),
      storefrontApi.discounts(),
    ]);

  let products = getHomeProducts(home);
  if (!products.length && catalogProducts.length) {
    products = catalogProducts;
  }

  const filters = getHomeFilters(home);
  const productSection = getPrimaryProductSection(home);
  const reviews = await fetchFeaturedReviews(products);

  return {
    home,
    navigation,
    categories,
    subcategories,
    products,
    filters,
    productSection,
    reviews,
    discounts,
  };
});
