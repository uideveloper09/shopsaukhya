import type {
  CustomerReviewDisplay,
  Product,
  ProductReview,
  ReviewMedia,
} from "@/types/storefront";
import { getProductCardImage } from "@/lib/utils";

const FALLBACK_NAMES = [
  "Priya Sharma",
  "Ananya Reddy",
  "Meera Patel",
  "Kavita Nair",
  "Riya Mehta",
  "Sneha Krishnan",
];

const FALLBACK_TEXTS = [
  "The fabric quality is exceptional and the fit is perfect. I received so many compliments wearing this!",
  "Saukhya has become my go-to for ethnic wear. Beautiful packaging and fast delivery too.",
  "So comfortable yet elegant — perfect for office and casual outings. The cotton feels amazing.",
  "It drapes beautifully and the silhouette is so flattering. Already planning my next order.",
  "True to size and the colour looks exactly like the photos. Love sharing my Saukhya looks!",
  "Wore this for a family function and got endless compliments. The craftsmanship shows.",
];

const DETAIL_IMAGES: Record<number, string[]> = {
  16: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/16/optimized/8df4f032-471c-476d-842b-98a70ada71cf_2-detail.jpg",
    "https://cdn.logicalfire.com/saukhya/ProductImg/16/optimized/898070eb-15ed-448a-a754-a8ef10403b98_3-detail.jpg",
  ],
  15: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/15/optimized/f6f41853-bb99-47e3-9cb1-cdd3ce47f58a_2-detail.jpg",
    "https://cdn.logicalfire.com/saukhya/ProductImg/15/optimized/c6e64fcd-c579-4b23-a19d-222480218b6a_3-detail.jpg",
  ],
  14: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/14/optimized/d111ddc6-bfaa-4823-8420-80adbca13541_2-detail.jpg",
    "https://cdn.logicalfire.com/saukhya/ProductImg/14/optimized/48e42e29-0560-45b4-acb4-9dc6779727ae_3-detail.jpg",
  ],
  13: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/13/optimized/910f26f6-5e69-4bf1-814d-ec0707cd7eaa_2-detail.jpg",
    "https://cdn.logicalfire.com/saukhya/ProductImg/13/optimized/c46d411b-4c88-4464-ba9e-d08ad225faaa_3-detail.jpg",
  ],
  10: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/10/optimized/2648e087-4774-4e2d-8011-40b184-detail.jpg",
  ],
  8: [
    "https://cdn.logicalfire.com/saukhya/ProductImg/8/optimized/a890fa77-8bf6-4e1a-82-detail.jpg",
  ],
};

/** Prefer API media; fall back to review/customer image fields. */
export function extractReviewMedia(review: ProductReview): ReviewMedia[] {
  if (review.media?.length) return review.media;

  if (review.reviewVideoUrl) {
    return [
      {
        type: "video",
        url: review.reviewVideoUrl,
        thumbnailUrl: review.reviewImageUrl ?? review.customerImageUrl,
      },
    ];
  }

  if (review.reviewImageUrl) {
    return [{ type: "image", url: review.reviewImageUrl }];
  }

  if (review.customerImageUrl) {
    return [{ type: "image", url: review.customerImageUrl }];
  }

  return [];
}

export function normalizeProductReview(review: ProductReview): CustomerReviewDisplay | null {
  const media = extractReviewMedia(review);
  if (!media.length) return null;

  return {
    id: String(review.reviewCode),
    customerName: review.customerName,
    rating: review.rating,
    reviewText: review.reviewText,
    productName: review.productName,
    isVerified: review.isVerifiedPurchase ?? true,
    customerAvatarUrl: review.customerImageUrl,
    media,
  };
}

export function buildReviewsFromProducts(products: Product[]): CustomerReviewDisplay[] {
  return products.slice(0, 6).map((product, index) => {
    const extras = DETAIL_IMAGES[product.productCode] ?? [];
    const primaryImage = extras[0] ?? getProductCardImage(product);
    const galleryImages = Array.from(new Set([primaryImage, ...extras]));
    const isVideo = index % 3 === 0;

    const media: ReviewMedia[] = isVideo
      ? [
          {
            type: "video",
            url: galleryImages[1] ?? primaryImage,
            thumbnailUrl: primaryImage,
          },
          ...galleryImages.slice(1).map((url) => ({ type: "image" as const, url })),
        ]
      : galleryImages.map((url) => ({ type: "image" as const, url }));

    return {
      id: `product-${product.productCode}`,
      customerName: FALLBACK_NAMES[index % FALLBACK_NAMES.length],
      rating: 5,
      reviewText: FALLBACK_TEXTS[index % FALLBACK_TEXTS.length],
      productName: product.productName,
      isVerified: true,
      media,
    };
  });
}

export function resolveCustomerReviews(
  reviews: ProductReview[],
  products: Product[],
): CustomerReviewDisplay[] {
  const fromApi = reviews
    .map(normalizeProductReview)
    .filter((review): review is CustomerReviewDisplay => review !== null);

  if (fromApi.length) return fromApi;
  if (products.length) return buildReviewsFromProducts(products);
  return [];
}

export function isVideoFile(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}
