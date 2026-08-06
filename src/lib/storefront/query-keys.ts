export const storefrontKeys = {
  all: ["storefront"] as const,
  home: () => [...storefrontKeys.all, "home"] as const,
  navigation: () => [...storefrontKeys.all, "navigation"] as const,
  categories: () => [...storefrontKeys.all, "categories"] as const,
  subcategories: () => [...storefrontKeys.all, "subcategories"] as const,
  products: (params?: Record<string, string | number>) =>
    [...storefrontKeys.all, "products", params ?? {}] as const,
  productReviews: (productCode: number) =>
    [...storefrontKeys.all, "reviews", productCode] as const,
  discounts: () => [...storefrontKeys.all, "discounts"] as const,
};
