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
  const { products, home } = await getHomepageData();
  const trending = getTrendingProducts(products, 3);
  const heroImages = trending.map((product) => ({
    src: getProductCardImage(product),
    alt: product.productName,
  }));

  const activeBanner = [...(home.banners ?? [])]
    .filter((banner) => banner.isActive && banner.desktopImageUrl)
    .sort((a, b) => a.position - b.position)[0];

  const bannerImage = activeBanner
    ? {
        src: activeBanner.desktopImageUrl,
        alt: activeBanner.altText || activeBanner.title || "Saukhya",
      }
    : CONTACT_PAGE.fashionStrip[1];

  return (
    <ContactPageView bannerImage={bannerImage} heroImages={heroImages} />
  );
}
