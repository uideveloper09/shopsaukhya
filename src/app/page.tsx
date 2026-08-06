import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroBanner } from "@/components/home/hero-banner";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategorySection } from "@/components/home/category-section";
import { AboutSection } from "@/components/home/about-section";
import { FabricSection } from "@/components/home/fabric-section";
import { BestSellers } from "@/components/home/best-sellers";
import { WatchAndBuy } from "@/components/home/watch-and-buy";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { WhyShopSection } from "@/components/home/why-shop-section";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import { FashionVlogs } from "@/components/home/fashion-vlogs";
import { getHomepageData } from "@/services/storefront-api";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getHomepageData();

  return {
    title: home.seo.metaTitle,
    description: home.seo.metaDescription,
    openGraph: {
      title: home.seo.ogTitle,
      description: home.seo.ogDescription,
      images: home.seo.ogImage ? [home.seo.ogImage] : [],
    },
    alternates: {
      canonical: home.seo.canonicalUrl,
    },
  };
}

export default async function HomePage() {
  const {
    home,
    navigation,
    products,
    catalogProducts,
    filters,
    productSection,
    reviews,
  } = await getHomepageData();

  const featuredProduct = products[0];

  return (
    <>
      <Header
        navigation={navigation}
        products={catalogProducts.length ? catalogProducts : products}
      />
      <main className="w-full">
        <HeroBanner products={products} />
        <TrustStrip />
        <CategorySection filters={filters} products={products} />
        <AboutSection />
        <FabricSection />
        <BestSellers
          products={products}
          title={productSection?.title ?? "Best Sellers"}
          subtitle={productSection?.subtitle}
        />
        <WatchAndBuy featuredProduct={featuredProduct} />
        <CustomerReviews reviews={reviews} products={products} />
        <WhyShopSection />
        <RecentlyViewed products={products} />
        <FashionVlogs />
      </main>
      <Footer navigation={navigation} />
    </>
  );
}
