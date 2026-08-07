export const SHOP_PAGE = {
  metaTitle: "Shop",
  metaDescription:
    "Shop Saukhya women's Indian wear — curated fabrics, soft festive silhouettes, and relaxed occasion-ready sets from current edits.",
  kicker: "Saukhya Collections",
  title: "Fresh silhouettes for soft festive days.",
  intro:
    "Curated fabrics, fresh textures, and relaxed occasion-ready sets from the current Saukhya edits.",
  catalogKicker: "Saukhya Catalog",
  catalogTitle: "Shop Saukhya styles",
  pageSize: 6,
} as const;

export const SHOP_PRICE_RANGES = [
  { key: "", label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { key: "under-3500", label: "Under ₹3,500", min: 0, max: 3500 },
  { key: "3500-5000", label: "₹3,500 – ₹5,000", min: 3500, max: 5000 },
  { key: "over-5000", label: "Over ₹5,000", min: 5000, max: Number.POSITIVE_INFINITY },
] as const;

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price low to high" },
  { value: "price-high", label: "Price high to low" },
  { value: "discount", label: "Best discount" },
] as const;

export type ShopSortMode = (typeof SHOP_SORT_OPTIONS)[number]["value"];
