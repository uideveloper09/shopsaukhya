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

  // Legacy hash routes from shopsaukhya SPA: #/shop → /shop
  if (value.startsWith("#")) {
    const withoutHash = value.slice(1);
    if (!withoutHash || withoutHash === "/") return "/";
    return withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;
  }

  try {
    if (/^https?:\/\//i.test(value) || value.startsWith("//")) {
      const url = new URL(value, SITE_URL);
      const site = new URL(SITE_URL);
      const sameHost =
        url.hostname === site.hostname ||
        url.hostname === "www.shopsaukhya.com" ||
        url.hostname === "shopsaukhya.com" ||
        url.hostname === "uat.bitcraftly.com" ||
        url.hostname === "localhost";

      if (!sameHost) return value;
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
  } catch {
    return value;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

export function getMenuHref(menuUrl: string): string {
  return toAppHref(menuUrl);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
