import type { Metadata } from "next";
import { CONTACT_PAGE } from "@/constants/content-pages";
import { ContactPageView } from "@/components/pages/contact-page-view";
import { getTrendingProducts } from "@/lib/product-flags";
import { getProductCardImage } from "@/lib/utils";
import { getHomepageData } from "@/services/storefront-api";

export const metadata: Metadata = {
  title: CONTACT_PAGE.metaTitle,
  description: CONTACT_PAGE.metaDescription,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { products } = await getHomepageData();
  const trending = getTrendingProducts(products, 3);
  const collageImages = trending.map((product) => ({
    src: getProductCardImage(product),
    alt: product.productName,
  }));

  return <ContactPageView collageImages={collageImages} />;
}
