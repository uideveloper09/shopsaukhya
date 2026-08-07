import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ProductSizes } from "@/types/storefront";
import { SITE_URL, SIZE_LABELS } from "@/constants/brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAvailableSizes(sizes: ProductSizes): string[] {
  const map: Record<string, boolean | undefined> = {
    XS: sizes.is_XS,
    S: sizes.is_S,
    M: sizes.is_M,
    L: sizes.is_L,
    XL: sizes.is_XL,
  };
  return SIZE_LABELS.filter((size) => map[size]);
}

export function getProductCardImage(product: Product): string {
  return (
    product.productImageUrl?.replace("-detail.jpg", "-card.jpg") ??
    product.productImageUrl
  );
}

export function extractFabricFromProduct(product: Product): string {
  const name = product.productName.toLowerCase();
  const fabrics = [
    "cotton",
    "linen",
    "muslin",
    "silk",
    "chanderi",
    "organza",
    "georgette",
    "crepe",
  ];
  return fabrics.find((f) => name.includes(f)) ?? "Cotton";
}

export function getProductHref(product: Product): string {
  return toAppHref(product.canonicalUrl || `/product/${product.seoSlug}`);
}

/**
 * Normalize storefront / hash / absolute same-origin URLs to App Router paths
 * so Next.js <Link> can soft-navigate without a full page reload.
 */
export function toAppHref(href: string): string {
  const value = href.trim();
  if (!value) return "/";

  if (
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("sms:")
  ) {
    return value;
  }

  // Absolute URL that still uses the legacy hash router:
  // https://www.shopsaukhya.com/#/shop?subcategory=1 → treat as #/shop?...
  if (/^https?:\/\//i.test(value) || value.startsWith("//")) {
    try {
      const url = new URL(value, SITE_URL);
      const site = new URL(SITE_URL);
      const sameHost =
        url.hostname === site.hostname ||
        url.hostname === "www.shopsaukhya.com" ||
        url.hostname === "shopsaukhya.com" ||
        url.hostname === "uat.bitcraftly.com" ||
        url.hostname === "localhost";

      if (!sameHost) return value;

      if (url.hash.startsWith("#/")) {
        return toAppHref(url.hash);
      }

      return `${url.pathname}${url.search}` || "/";
    } catch {
      return value;
    }
  }

  // Legacy hash routes from shopsaukhya SPA: #/shop → /shop
  if (value.startsWith("#")) {
    const withoutHash = value.slice(1);
    if (!withoutHash || withoutHash === "/") return "/";
    return withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;
  }

  // "/#/shop?subcategory=1" style leftovers (path + hash router)
  const embeddedHash = value.indexOf("#/");
  if (embeddedHash >= 0) {
    return toAppHref(value.slice(embeddedHash));
  }

  return value.startsWith("/") ? value : `/${value}`;
}

const SHOP_SLUG_HREF: Record<string, string> = {
  "all-styles": "/shop",
  shirts: "/shop?subcategory=1",
  tops: "/shop?subcategory=2",
  dresses: "/shop?subcategory=3",
  "co-ord-sets": "/shop?subcategory=4",
  "kurta-sets": "/shop?subcategory=5",
};

export function getMenuHref(menuUrl: string): string {
  const href = toAppHref(menuUrl);
  const qIndex = href.indexOf("?");
  const pathRaw = (qIndex >= 0 ? href.slice(0, qIndex) : href).split("#")[0];
  const query = qIndex >= 0 ? href.slice(qIndex + 1) : "";
  const path = (pathRaw.replace(/\/$/, "") || "/").toLowerCase();

  if (path === "/home") return "/";
  if (path === "/about" || path === "/about-us") return "/about";
  if (path === "/contact" || path === "/contact-us") return "/contact";

  if (path === "/shop") {
    return query ? `/shop?${query}` : "/shop";
  }

  const shopSlug = path.match(/^\/shop\/([^/]+)$/);
  if (shopSlug) {
    return SHOP_SLUG_HREF[shopSlug[1]] ?? "/shop";
  }

  if (SHOP_SLUG_HREF[path.replace(/^\//, "")]) {
    return SHOP_SLUG_HREF[path.replace(/^\//, "")];
  }

  return href;
}

/** Prefer structured category codes from navigation API (avoids hash/redirect reloads). */
export function getMenuItemHref(item: {
  menuUrl: string;
  categoryCode?: number | null;
  subCategoryCode?: number | null;
}): string {
  if (item.subCategoryCode) {
    return `/shop?subcategory=${item.subCategoryCode}`;
  }
  if (item.categoryCode) {
    return `/shop?category=${item.categoryCode}`;
  }
  return getMenuHref(item.menuUrl);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
