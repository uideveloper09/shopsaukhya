import type { Metadata } from "next";
import { Suspense } from "react";
import { SHOP_PAGE } from "@/constants/shop";
import { storefrontApi } from "@/services/storefront-api";
import { ShopPageView } from "@/components/shop/shop-page-view";

export const metadata: Metadata = {
  title: SHOP_PAGE.metaTitle,
  description: SHOP_PAGE.metaDescription,
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories, subcategories] = await Promise.all([
    storefrontApi.products(),
    storefrontApi.categories(),
    storefrontApi.subcategories(),
  ]);

  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.position - b.position);
  const activeSubcategories = subcategories
    .filter((s) => s.isActive)
    .sort((a, b) => a.position - b.position);

  return (
    <Suspense
      fallback={
        <div className="container-saukhya section-padding text-sm text-saukhya-muted">
          Loading styles…
        </div>
      }
    >
      <ShopPageView
        products={products}
        categories={activeCategories}
        subcategories={activeSubcategories}
      />
    </Suspense>
  );
}
