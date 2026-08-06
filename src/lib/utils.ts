import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ProductSizes } from "@/types/storefront";
import { SIZE_LABELS } from "@/constants/brand";

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
  return product.canonicalUrl || `/product/${product.seoSlug}`;
}

export function getMenuHref(menuUrl: string): string {
  if (menuUrl.startsWith("#")) {
    return menuUrl.replace("#", "") || "/";
  }
  return menuUrl;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
