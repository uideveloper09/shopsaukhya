import { API_BASE } from "@/constants/brand";

/** Live storefront origin — https://www.shopsaukhya.com */
export const STOREFRONT_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shopsaukhya.com";

export const STOREFRONT_API_PATH = API_BASE;

/** ISR revalidation (seconds) */
export const REVALIDATE = {
  home: 300,
  navigation: 600,
  catalog: 300,
  reviews: 600,
} as const;
