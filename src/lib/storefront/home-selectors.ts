import type { HomeData, HomeSection, Product, SectionFilter } from "@/types/storefront";

export function getActiveSections(home: HomeData): HomeSection[] {
  return [...home.sections]
    .filter((section) => section.isActive)
    .sort((a, b) => a.position - b.position);
}

export function getSectionByKey(
  home: HomeData,
  sectionKey: string,
): HomeSection | undefined {
  return getActiveSections(home).find((section) => section.sectionKey === sectionKey);
}

export function getPrimaryProductSection(home: HomeData): HomeSection | undefined {
  const sections = getActiveSections(home);
  return (
    sections.find((section) => section.sectionType === "product_grid") ??
    sections[0]
  );
}

export function getHomeProducts(home: HomeData): Product[] {
  return getPrimaryProductSection(home)?.products ?? [];
}

export function getHomeFilters(home: HomeData): SectionFilter[] {
  const filters = getPrimaryProductSection(home)?.filters ?? [];
  return [...filters]
    .filter((filter) => filter.isActive && filter.displayOnHome)
    .sort((a, b) => a.position - b.position);
}

export function getFeaturedProduct(home: HomeData): Product | undefined {
  return getHomeProducts(home)[0];
}
