import type { VlogCard } from "@/types/storefront";
import { CDN_BASE } from "./brand";

export const VLOG_CARDS: VlogCard[] = [
  {
    id: "fashion-tips",
    title: "5 Ways to Style Your Kurta Set",
    category: "Fashion Tips",
    excerpt:
      "From brunch to evening soirées — discover versatile styling ideas for your favourite kurta sets.",
    imageUrl: `${CDN_BASE}/ProductImg/16/optimized/00642a29-d886-4cd7-8335-9415b3372a90_1-card.jpg`,
    slug: "fashion-tips-kurta-sets",
  },
  {
    id: "fabric-guide",
    title: "Understanding Indian Fabrics",
    category: "Fabric Guide",
    excerpt:
      "A guide to cotton, linen, muslin, and organza — choose the perfect fabric for every season.",
    imageUrl: `${CDN_BASE}/ProductImg/14/optimized/85302e1f-cb14-4c09-b356-b3693c6cfac0_1-card.jpg`,
    slug: "fabric-guide-indian-textiles",
  },
  {
    id: "styling",
    title: "Effortless Day-to-Night Styling",
    category: "Styling",
    excerpt:
      "Transform a daytime co-ord set into an evening look with thoughtful accessories and layers.",
    imageUrl: `${CDN_BASE}/ProductImg/10/optimized/2648e087-4774-4e2d-8011-40b1848929b8_1-card.jpg`,
    slug: "day-to-night-styling",
  },
  {
    id: "wedding",
    title: "Wedding Guest Edit",
    category: "Wedding Looks",
    excerpt:
      "Curated picks for mehendi, sangeet, and reception — elegant without overshadowing the bride.",
    imageUrl: `${CDN_BASE}/ProductImg/15/optimized/734d617d-c4cd-497e-a362-f9dd942ede73_1-card.jpg`,
    slug: "wedding-guest-edit",
  },
  {
    id: "festival",
    title: "Festival Collection Highlights",
    category: "Festival Collection",
    excerpt:
      "Celebrate in colour with our Bahaar Collection — floral prints and joyful silhouettes.",
    imageUrl: `${CDN_BASE}/Banner/bahaar-slider-desktop-1.png`,
    slug: "festival-collection-highlights",
  },
];

export const CUSTOMER_REVIEWS = [
  {
    id: "1",
    customerName: "Priya Sharma",
    rating: 5,
    reviewText:
      "The Elira Cotton Kurta Set is absolutely stunning. The fabric quality is exceptional and the fit is perfect. I received so many compliments!",
    customerImageUrl: undefined,
  },
  {
    id: "2",
    customerName: "Ananya Reddy",
    rating: 5,
    reviewText:
      "Saukhya has become my go-to for ethnic wear. The attention to detail in every piece is remarkable. Fast delivery and beautiful packaging too.",
    customerImageUrl: undefined,
  },
  {
    id: "3",
    customerName: "Meera Patel",
    rating: 5,
    reviewText:
      "I love how comfortable yet elegant the co-ord sets are. Perfect for office and casual outings. The cotton feels so soft against the skin.",
    customerImageUrl: undefined,
  },
  {
    id: "4",
    customerName: "Kavita Nair",
    rating: 5,
    reviewText:
      "The Gulrez Georgette Dress is a dream! It drapes beautifully and the pleated belt adds such a flattering shape. Highly recommend Saukhya.",
    customerImageUrl: undefined,
  },
];
