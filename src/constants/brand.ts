export const BRAND = {
  name: "SAUKHYA",
  tagline: "Embrace Tranquility",
  logoUrl: "https://cdn.logicalfire.com/saukhya/logo/logo.png",
  primary: "#ec3988",
  primaryHover: "#eb3a84",
  gold: "#c9a96e",
  warmWhite: "#fff8fb",
  warmWhiteAlt: "#fffafb",
  card: "#ffffff",
  text: "#1f1a1c",
  textMuted: "#706a6d",
  border: "#1f1a1c14",
  borderPink: "#ec39881f",
  maroon: "#5c2238",
  success: "#13823b",
  radius: {
    sm: "12px",
    md: "18px",
    lg: "24px",
  },
} as const;

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/storefront-api";
export const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE ?? "https://cdn.logicalfire.com/saukhya";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shopsaukhya.com";

export const SIZE_LABELS = ["XS", "S", "M", "L", "XL"] as const;

export const RECENTLY_VIEWED_KEY = "saukhya:recentlyViewedProducts:v1";
export const RECENTLY_VIEWED_MAX = 8;
export const RECENTLY_VIEWED_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const ANNOUNCEMENT =
  "Free shipping on orders above ₹2,999 · Easy returns within 7 days · COD available";
