export interface ProductSizes {
  is_XS?: boolean;
  is_S?: boolean;
  is_M?: boolean;
  is_L?: boolean;
  is_XL?: boolean;
  is_XXL?: boolean;
  is_XXXL?: boolean;
}

export interface ProductImage {
  productCode: number;
  productName: string;
  productImageUrl: string;
  position: number;
  isActive: boolean;
}

export interface Product {
  productCode: number;
  productName: string;
  description?: string;
  productImageUrl: string;
  productCodeDisplay?: string;
  seoSlug: string;
  canonicalUrl: string;
  categoryCode: number;
  categoryName: string;
  subCategoryCode: number;
  subCategoryName: string;
  payableAmount: number;
  originalAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  discountCode?: string | null;
  discountLabel?: string | null;
  objSizes: ProductSizes;
  images?: ProductImage[];
  rating?: number;
  fabric?: string;
  fit?: string;
  length?: string;
  sleeve?: string;
  position?: number;
}

export interface HomeBanner {
  bannerCode: number;
  title: string;
  label: string;
  altText: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  linkType: string;
  linkUrl: string;
  categoryCode: number | null;
  subCategoryCode: number | null;
  productCode: number | null;
  collectionKey: string | null;
  position: number;
  isActive: boolean;
}

export interface SectionFilter {
  filterCode: number;
  sectionCode: number;
  label: string;
  slug: string;
  categoryCode: number | null;
  subCategoryCode: number | null;
  imageUrl: string;
  position: number;
  isActive: boolean;
  displayOnHome: boolean;
}

export interface HomeSection {
  sectionCode: number;
  sectionKey: string;
  title: string;
  subtitle: string;
  sectionType: string;
  position: number;
  maxItems: number;
  isActive: boolean;
  filters: SectionFilter[];
  products: Product[];
}

export interface HomeSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string | null;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface HomeData {
  seo: HomeSeo;
  banners: HomeBanner[];
  sections: HomeSection[];
}

export interface MenuItem {
  menuCode: number;
  parentMenuCode: number | null;
  menuName: string;
  menuUrl: string;
  menuType: string;
  seoSlug: string;
  canonicalUrl: string;
  categoryCode: number | null;
  subCategoryCode: number | null;
  position: number;
  isActive: boolean;
  openInNewTab: boolean;
}

export interface NavigationData {
  headerMenus: MenuItem[];
  megaMenus: MenuItem[];
  footerMenus: MenuItem[];
}

export interface Category {
  categoryCode: number;
  categoryName: string;
  description: string;
  seoSlug: string;
  canonicalUrl: string;
  position: number;
  isActive: boolean;
  isHaveSubCategory: boolean;
}

export interface SubCategory {
  subCategoryCode: number;
  categoryCode: number;
  categoryName: string;
  subCategoryName: string;
  description: string | null;
  seoSlug: string;
  canonicalUrl: string;
  position: number;
  isActive: boolean;
}

export interface ReviewMedia {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
}

export interface ProductReview {
  reviewCode: number;
  productCode: number;
  customerName: string;
  rating: number;
  reviewText: string;
  customerImageUrl?: string;
  reviewImageUrl?: string;
  reviewVideoUrl?: string;
  reviewMediaType?: "image" | "video";
  productName?: string;
  isVerifiedPurchase?: boolean;
  media?: ReviewMedia[];
  createdAt: string;
}

export interface CustomerReviewDisplay {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  productName?: string;
  isVerified?: boolean;
  customerAvatarUrl?: string;
  media: ReviewMedia[];
}

export interface DiscountCode {
  discountCodeId: number;
  discountCode: string;
  discountLabel: string;
  discountType: string;
  discountPercent: number;
  appliesTo: string;
  productCode: number | null;
  categoryCode: number | null;
  subCategoryCode: number | null;
  eligibility: string;
  isAutomatic: boolean;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface FabricCard {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  care: string;
  season: string;
  slug: string;
  textTone?: "light" | "dark";
}

export interface VlogCard {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

export interface TrustItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface RecentlyViewedProduct {
  productCode: number;
  productName: string;
  seoSlug: string;
  productImageUrl: string;
  finalAmount: number;
  originalAmount: number;
  discountPercent: number;
  viewedAt: number;
}

export interface CategoryDisplay {
  subCategoryCode: number;
  name: string;
  slug: string;
  imageUrl: string;
  href: string;
}
