import type { FabricCard } from "@/types/storefront";

/**
 * Fabric swatch images live in /public/fabric/
 * Referenced in code as `/fabric/{name}.png`
 */
export const FABRIC_ASSETS_PATH = "/fabric" as const;

export const FABRIC_SECTION = {
  title: "Our Fabrics, Our Promise",
  subtitle: "Breathable, lightweight, and soft — crafted for every season",
} as const;

function fabricImage(filename: string): string {
  return `${FABRIC_ASSETS_PATH}/${filename}`;
}

/** Our Fabrics, Our Promise — card data */
export const FABRIC_CARDS: FabricCard[] = [
  {
    id: "cotton",
    name: "Cotton",
    tagline: "Breathable, soft & natural",
    description:
      "Pure cotton with a soft hand-feel — ideal for everyday comfort, breathability, and effortless drape.",
    imageUrl: fabricImage("cotton.png"),
    benefits: ["Breathable", "Lightweight", "Skin-friendly"],
    care: "Gentle machine wash",
    season: "All season",
    slug: "cotton",
    textTone: "dark",
  },
  {
    id: "linen",
    name: "Linen",
    tagline: "Airy drape, cool & refined",
    description:
      "Naturally breathable linen and cotton-linen blends that keep you cool with a relaxed, refined silhouette.",
    imageUrl: fabricImage("linen.png"),
    benefits: ["Breathable", "Lightweight", "Easy drape"],
    care: "Hand wash recommended",
    season: "Summer",
    slug: "linen",
    textTone: "dark",
  },
  {
    id: "muslin",
    name: "Muslin",
    tagline: "Featherlight & graceful",
    description:
      "Delicate muslin with a whisper-soft touch, fluid movement, and an airy meadow-inspired finish.",
    imageUrl: fabricImage("muslin.png"),
    benefits: ["Ultra-light", "Soft touch", "Fluid fall"],
    care: "Delicate wash",
    season: "Spring & Summer",
    slug: "muslin",
    textTone: "dark",
  },
  {
    id: "silk",
    name: "Silk",
    tagline: "Luminous sheen & richness",
    description:
      "Luxurious silk with a natural lustre and romantic depth — perfect for festive and evening wear.",
    imageUrl: fabricImage("silk.png"),
    benefits: ["Rich sheen", "Smooth feel", "Elevated drape"],
    care: "Dry clean only",
    season: "Festive",
    slug: "silk",
    textTone: "light",
  },
  {
    id: "chanderi",
    name: "Chanderi",
    tagline: "Heritage weave, sheer elegance",
    description:
      "Traditional Chanderi-inspired weaves with a subtle shimmer — lightweight yet beautifully structured.",
    imageUrl: fabricImage("chanderi.png"),
    benefits: ["Sheer elegance", "Lightweight", "Subtle shimmer"],
    care: "Dry clean preferred",
    season: "All season",
    slug: "chanderi",
    textTone: "dark",
  },
  {
    id: "organza",
    name: "Organza",
    tagline: "Sheer structure, ethereal form",
    description:
      "Crisp organza and georgette with structured pleats and an airy, occasion-ready silhouette.",
    imageUrl: fabricImage("organza.png"),
    benefits: ["Sheer finish", "Structured hold", "Occasion-ready"],
    care: "Dry clean only",
    season: "Evening wear",
    slug: "organza",
    textTone: "dark",
  },
];

/** Lookup helper */
export function getFabricBySlug(slug: string): FabricCard | undefined {
  return FABRIC_CARDS.find((fabric) => fabric.slug === slug);
}
