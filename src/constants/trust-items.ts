import type { TrustItem } from "@/types/storefront";

export const TRUST_ITEMS: TrustItem[] = [
  {
    id: "shipping",
    title: "Free Shipping",
    description: "On orders above ₹2,999",
    icon: "shipping",
  },
  {
    id: "returns",
    title: "Easy Returns",
    description: "7-day hassle-free returns",
    icon: "returns",
  },
  {
    id: "payments",
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: "payments",
  },
  {
    id: "cod",
    title: "COD Available",
    description: "Pay on delivery",
    icon: "cod",
  },
  {
    id: "curated",
    title: "Curated Styles",
    description: "Handpicked collections",
    icon: "curated",
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Dedicated style assistance",
    icon: "support",
  },
];
