"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Category, Product, SubCategory } from "@/types/storefront";
import {
  SHOP_PAGE,
  SHOP_PRICE_RANGES,
  type ShopSortMode,
} from "@/constants/shop";
import {
  DEFAULT_SHOP_FILTERS,
  countDiscountedProducts,
  filterAndSortProducts,
  getProductMaterials,
  getProductSizes,
  type ShopFiltersState,
} from "@/lib/shop-filters";
import { cn, getProductCardImage } from "@/lib/utils";
import { CuratedProductCard } from "@/components/ui/curated-product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { IconCheck, IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { ShopSortDropdown } from "@/components/shop/shop-sort-dropdown";
import { ShopFilterSelect } from "@/components/shop/shop-filter-select";

const ease = [0.22, 1, 0.36, 1] as const;

type ShopPageViewProps = {
  products: Product[];
  categories: Category[];
  subcategories: SubCategory[];
};

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
      {children}
    </span>
  );
}

function filterField(active?: boolean) {
  return cn(
    "w-full appearance-none border bg-[#faf6f4] px-3.5 py-2.5 text-sm text-saukhya-text outline-none transition",
    "focus:border-saukhya-pink focus:bg-white focus:ring-1 focus:ring-saukhya-pink/25",
    active
      ? "border-saukhya-pink/50 text-saukhya-maroon"
      : "border-saukhya-maroon/20",
  );
}

export function ShopPageView({
  products,
  categories,
  subcategories,
}: ShopPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const initial: ShopFiltersState = {
    ...DEFAULT_SHOP_FILTERS,
    categoryCode: Number(searchParams.get("category") || 0) || 0,
    subcategoryCode: Number(searchParams.get("subcategory") || 0) || 0,
    query: searchParams.get("q") || "",
    sortMode: (searchParams.get("sort") as ShopSortMode) || "featured",
  };

  const [filters, setFilters] = useState<ShopFiltersState>(initial);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryCode: Number(searchParams.get("category") || 0) || 0,
      subcategoryCode: Number(searchParams.get("subcategory") || 0) || 0,
      query: searchParams.get("q") || "",
      sortMode: (searchParams.get("sort") as ShopSortMode) || "featured",
    }));
    setPage(1);
  }, [searchParams]);

  const materials = useMemo(() => getProductMaterials(products), [products]);
  const sizes = useMemo(() => getProductSizes(products), [products]);
  const discountedCount = useMemo(
    () => countDiscountedProducts(products),
    [products],
  );
  const styleEdits = useMemo(() => {
    const names = new Set(
      products.map((p) => p.subCategoryName).filter(Boolean),
    );
    return names.size;
  }, [products]);

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / SHOP_PAGE.pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * SHOP_PAGE.pageSize;
  const pageEnd = Math.min(pageStart + SHOP_PAGE.pageSize, filtered.length);
  const paged = useMemo(
    () => filtered.slice(pageStart, pageEnd),
    [filtered, pageStart, pageEnd],
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    const catalog = document.getElementById("shop-catalog-grid");
    if (catalog) {
      const top =
        catalog.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const heroImage = useMemo(() => {
    const preferred =
      products.find((p) => (p.discountPercent ?? 0) > 0) ?? products[0];
    return preferred ? getProductCardImage(preferred) : null;
  }, [products]);

  const sideImages = useMemo(() => {
    return products
      .slice(0, 4)
      .map((p) => getProductCardImage(p))
      .filter(Boolean);
  }, [products]);

  const uniqueStyles = useMemo(() => {
    const map = new Map<number, string>();
    for (const sub of subcategories) {
      if (!map.has(sub.subCategoryCode)) {
        map.set(sub.subCategoryCode, sub.subCategoryName);
      }
    }
    for (const product of products) {
      if (product.subCategoryCode && product.subCategoryName) {
        map.set(product.subCategoryCode, product.subCategoryName);
      }
    }
    // Dedupe by name — API can return same style under multiple codes
    const byName = new Map<string, { code: number; name: string }>();
    for (const [code, name] of map.entries()) {
      const key = name.trim().toLowerCase();
      if (!key || byName.has(key)) continue;
      byName.set(key, { code, name: name.trim() });
    }
    return Array.from(byName.values());
  }, [subcategories, products]);

  const activeFilters = useMemo(() => {
    const chips: { key: keyof ShopFiltersState; label: string }[] = [];
    if (filters.categoryCode) {
      const cat = categories.find((c) => c.categoryCode === filters.categoryCode);
      if (cat) chips.push({ key: "categoryCode", label: cat.categoryName });
    }
    if (filters.subcategoryCode) {
      const sub = uniqueStyles.find((s) => s.code === filters.subcategoryCode);
      if (sub) chips.push({ key: "subcategoryCode", label: sub.name });
    }
    if (filters.size) chips.push({ key: "size", label: `Size ${filters.size}` });
    if (filters.material)
      chips.push({ key: "material", label: filters.material });
    if (filters.price) {
      const range = SHOP_PRICE_RANGES.find((r) => r.key === filters.price);
      if (range) chips.push({ key: "price", label: range.label });
    }
    if (filters.discountOnly)
      chips.push({ key: "discountOnly", label: "Early Bird Savings" });
    if (filters.query.trim())
      chips.push({ key: "query", label: `“${filters.query.trim()}”` });
    return chips;
  }, [filters, categories, uniqueStyles]);

  const syncUrl = (next: ShopFiltersState) => {
    const params = new URLSearchParams();
    if (next.categoryCode) params.set("category", String(next.categoryCode));
    if (next.subcategoryCode)
      params.set("subcategory", String(next.subcategoryCode));
    if (next.query.trim()) params.set("q", next.query.trim());
    if (next.sortMode !== "featured") params.set("sort", next.sortMode);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    });
  };

  const updateFilters = (patch: Partial<ShopFiltersState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      syncUrl(next);
      return next;
    });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_SHOP_FILTERS);
    syncUrl(DEFAULT_SHOP_FILTERS);
  };

  const clearChip = (key: keyof ShopFiltersState) => {
    if (key === "discountOnly") updateFilters({ discountOnly: false });
    else if (key === "categoryCode") updateFilters({ categoryCode: 0 });
    else if (key === "subcategoryCode") updateFilters({ subcategoryCode: 0 });
    else updateFilters({ [key]: "" } as Partial<ShopFiltersState>);
  };

  const activeSubs = useMemo(() => {
    if (!filters.categoryCode) return subcategories;
    return subcategories.filter((s) => s.categoryCode === filters.categoryCode);
  }, [subcategories, filters.categoryCode]);

  return (
    <main className="w-full overflow-x-clip bg-saukhya-warm">
      {/* Cinematic hero */}
      <section className="relative min-h-[42vh] overflow-hidden md:min-h-[52vh]">
        {heroImage && (
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.55, ease }}
          >
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_18%]"
            />
          </motion.div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#1f1a1c]/85 via-[#5c2238]/58 to-[#1f1a1c]/30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#120e10]/70 via-[#120e10]/15 to-[#1f1a1c]/30"
        />

        <div className="container-saukhya relative z-10 flex min-h-[42vh] flex-col justify-end pb-7 pt-16 md:min-h-[52vh] md:pb-10 md:pt-24">
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
            <motion.div
              className="lg:col-span-7"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-saukhya-gold md:text-[11px] md:tracking-[0.36em]">
                {SHOP_PAGE.kicker}
              </p>
              <h1
                className="mt-3 max-w-2xl text-[1.75rem] font-medium leading-[1.15] tracking-tight text-white sm:text-[2rem] md:text-[2.65rem] lg:text-[3rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {SHOP_PAGE.title}
              </h1>
              <motion.div
                aria-hidden
                className="mt-5 h-px origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/70 to-transparent"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.4 }}
              />
              <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-white/90 md:text-base">
                {SHOP_PAGE.intro}
              </p>

              <div
                className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90"
                aria-label="Shop summary"
              >
                <span>
                  <em className="not-italic text-saukhya-gold">{products.length}</em>{" "}
                  styles
                </span>
                <span>
                  <em className="not-italic text-saukhya-gold">{styleEdits}</em>{" "}
                  edits
                </span>
                <span>
                  <em className="not-italic text-saukhya-gold">{discountedCount}</em>{" "}
                  savings
                </span>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:col-span-5 lg:block"
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, ease, delay: 0.2 }}
              aria-hidden
            >
              <div className="ml-auto grid max-w-sm grid-cols-3 gap-2.5">
                {sideImages.slice(0, 3).map((src, index) => (
                  <motion.div
                    key={src}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden",
                      index === 1 && "mt-5",
                    )}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { y: -4, transition: { duration: 0.4, ease } }
                    }
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="section-padding floral-decoration">
        <div className="container-saukhya">
          <SectionHeading
            title={SHOP_PAGE.catalogTitle}
            subtitle="Soft fabrics and occasion-ready sets from the current edits."
          />

          <div className="mb-5 border-b border-saukhya-border/50 md:sticky md:top-[72px] md:z-40 md:-mx-6 md:mb-10 md:bg-saukhya-warm/95 md:px-6 md:backdrop-blur-md md:supports-[backdrop-filter]:bg-saukhya-warm/90 lg:-mx-8 lg:px-8">
            <LayoutGroup>
              <div className="flex gap-1 overflow-x-auto py-2.5 scrollbar-none md:flex-wrap md:justify-center md:gap-x-8 md:overflow-visible md:py-3.5">
                <button
                  type="button"
                  onClick={() => updateFilters({ subcategoryCode: 0 })}
                  className="relative min-h-10 shrink-0 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-muted transition-colors hover:text-saukhya-maroon md:tracking-[0.2em]"
                >
                  All styles
                  {!filters.subcategoryCode && (
                    <motion.span
                      layoutId="shop-style-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-saukhya-pink"
                    />
                  )}
                </button>
                {uniqueStyles.map((style) => {
                  const selectedName = products
                    .find((p) => p.subCategoryCode === filters.subcategoryCode)
                    ?.subCategoryName?.trim()
                    .toLowerCase();
                  const active =
                    filters.subcategoryCode === style.code ||
                    (!!selectedName &&
                      selectedName === style.name.trim().toLowerCase());
                  return (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() =>
                        updateFilters({
                          subcategoryCode: active ? 0 : style.code,
                        })
                      }
                      className={cn(
                        "relative min-h-10 shrink-0 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors md:tracking-[0.2em]",
                        active
                          ? "text-saukhya-maroon"
                          : "text-saukhya-muted hover:text-saukhya-maroon",
                      )}
                    >
                      {style.name}
                      {active && (
                        <motion.span
                          layoutId="shop-style-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-saukhya-pink"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>

          <div className="mb-5 flex justify-end lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex min-h-11 items-center gap-2 border border-saukhya-maroon/20 bg-white px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink"
              aria-expanded={filtersOpen}
              aria-controls="shop-filter-panel"
            >
              {filtersOpen ? "Hide filters" : "Filters"}
              {activeFilters.length > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-saukhya-pink px-1.5 text-[10px] text-white">
                  {activeFilters.length}
                </span>
              ) : null}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div
                  className="flex flex-wrap items-center gap-2"
                  aria-label="Active filters"
                >
                  {activeFilters.map((chip) => (
                    <button
                      key={`${chip.key}-${chip.label}`}
                      type="button"
                      onClick={() => clearChip(chip.key)}
                      className="inline-flex min-h-9 items-center gap-2 border border-saukhya-border/80 bg-white px-3 py-2 text-xs tracking-wide text-saukhya-text transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink"
                    >
                      {chip.label}
                      <span aria-hidden className="text-saukhya-muted">
                        ×
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-1 text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted transition-colors hover:text-saukhya-pink"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside
              id="shop-filter-panel"
              className="relative z-0 w-full isolate lg:sticky lg:top-[8.5rem] lg:self-start"
            >
              <div className="relative flex flex-col border border-saukhya-border/60 bg-white shadow-saukhya-soft">
                <ShopSortDropdown
                  value={filters.sortMode}
                  onChange={(sortMode) => updateFilters({ sortMode })}
                />

                <div
                  className={cn(
                    "flex min-h-0 flex-col overflow-hidden lg:max-h-[calc(100vh-10.5rem)]",
                    filtersOpen ? "flex" : "hidden lg:flex",
                  )}
                >
                  <div className="flex shrink-0 items-start justify-between gap-3 border-b border-saukhya-border/50 bg-white px-5 py-4 md:px-6">
                    <div>
                      <p
                        className="text-lg font-medium text-saukhya-maroon"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Filters
                      </p>
                      <p className="mt-0.5 text-xs text-saukhya-muted">
                        Refine while you browse
                      </p>
                    </div>
                    {activeFilters.length > 0 ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-saukhya-pink transition-colors hover:text-saukhya-maroon"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5 overflow-y-auto overscroll-contain bg-[#fffdfc] px-5 py-5 scrollbar-none md:px-6 md:py-6">
                <label className="block">
                  <FilterLabel>Search</FilterLabel>
                  <input
                    type="search"
                    value={filters.query}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    placeholder="Style, fabric, code"
                    aria-label="Search styles"
                    className={cn(
                      filterField(!!filters.query.trim()),
                      "placeholder:text-saukhya-muted/70",
                    )}
                  />
                </label>

                <ShopFilterSelect
                  label="Collection"
                  value={filters.categoryCode ? String(filters.categoryCode) : ""}
                  placeholder="All collections"
                  options={[
                    { value: "", label: "All collections" },
                    ...categories.map((cat) => ({
                      value: String(cat.categoryCode),
                      label: cat.categoryName,
                    })),
                  ]}
                  onChange={(next) =>
                    updateFilters({
                      categoryCode: Number(next) || 0,
                      subcategoryCode: 0,
                    })
                  }
                />

                <ShopFilterSelect
                  label="Style"
                  value={
                    filters.subcategoryCode
                      ? String(filters.subcategoryCode)
                      : ""
                  }
                  placeholder="All styles"
                  options={[
                    { value: "", label: "All styles" },
                    ...activeSubs.map((sub) => ({
                      value: String(sub.subCategoryCode),
                      label: sub.subCategoryName,
                    })),
                  ]}
                  onChange={(next) =>
                    updateFilters({
                      subcategoryCode: Number(next) || 0,
                    })
                  }
                />

                {sizes.length > 0 && (
                  <div>
                    <FilterLabel>Size</FilterLabel>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => {
                        const active = filters.size === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              updateFilters({ size: active ? "" : size })
                            }
                            className={cn(
                              "min-w-10 border px-3 py-2 text-xs tracking-wide transition-colors",
                              active
                                ? "border-saukhya-maroon bg-saukhya-maroon text-white"
                                : "border-saukhya-maroon/20 bg-[#faf6f4] text-saukhya-text hover:border-saukhya-pink/40 hover:bg-white",
                            )}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {materials.length > 0 && (
                  <ShopFilterSelect
                    label="Material"
                    value={filters.material}
                    placeholder="All materials"
                    options={[
                      { value: "", label: "All materials" },
                      ...materials.map((material) => ({
                        value: material,
                        label: material,
                      })),
                    ]}
                    onChange={(next) => updateFilters({ material: next })}
                  />
                )}

                <div>
                  <FilterLabel>Price</FilterLabel>
                  <div className="overflow-hidden border border-saukhya-maroon/20 bg-[#faf6f4]">
                    {SHOP_PRICE_RANGES.map((range, index) => {
                      const active = filters.price === range.key;
                      return (
                        <button
                          key={range.key || "all"}
                          type="button"
                          onClick={() => updateFilters({ price: range.key })}
                          className={cn(
                            "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors",
                            index > 0 && "border-t border-saukhya-maroon/10",
                            active
                              ? "bg-white text-saukhya-maroon"
                              : "text-saukhya-muted hover:bg-white/70 hover:text-saukhya-text",
                          )}
                        >
                          <span>{range.label}</span>
                          {active && (
                            <span className="h-1.5 w-1.5 rotate-45 bg-saukhya-gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  role="checkbox"
                  aria-checked={filters.discountOnly}
                  onClick={() =>
                    updateFilters({ discountOnly: !filters.discountOnly })
                  }
                  className={cn(
                    "flex w-full items-center justify-between border px-3.5 py-3 text-left transition-colors",
                    filters.discountOnly
                      ? "border-saukhya-pink/50 bg-saukhya-pink/[0.06] text-saukhya-maroon"
                      : "border-saukhya-maroon/20 bg-[#faf6f4] text-saukhya-text hover:border-saukhya-pink/40 hover:bg-white",
                  )}
                >
                  <span className="text-sm">Early Bird Savings</span>
                  <span
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors",
                      filters.discountOnly
                        ? "border-saukhya-maroon bg-saukhya-maroon text-white"
                        : "border-saukhya-maroon/35 bg-white text-transparent",
                    )}
                  >
                    <IconCheck
                      className={cn(
                        "h-3 w-3 transition-opacity",
                        filters.discountOnly ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="relative z-0 min-w-0 isolate">
              {filtered.length > 0 ? (
                <>
                  <div id="shop-catalog-grid">
                    <RevealStagger
                      className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5"
                      stagger={0.05}
                      key={currentPage}
                    >
                      {paged.map((product, index) => (
                        <RevealItem
                          key={product.productCode}
                          index={index}
                          className="h-full"
                        >
                          <CuratedProductCard
                            product={product}
                            priority={index < 6}
                            showMetaBelow
                          />
                        </RevealItem>
                      ))}
                    </RevealStagger>
                  </div>

                  {totalPages > 1 ? (
                    <nav
                      className="mt-6 flex items-center justify-between gap-2 border-t border-saukhya-border/40 pt-5 sm:gap-4 md:mt-8 md:pt-6"
                      aria-label="Catalog pages"
                    >
                      <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="group inline-flex min-h-10 items-center gap-2 px-1 text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-muted transition-colors hover:text-saukhya-maroon disabled:pointer-events-none disabled:opacity-25"
                        aria-label="Previous page"
                      >
                        <IconChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-0.5">
                          {pageNumbers.map((item, index) =>
                            item === "…" ? (
                              <span
                                key={`ellipsis-${index}`}
                                className="w-7 text-center text-[11px] text-saukhya-gold/60"
                                aria-hidden
                              >
                                ···
                              </span>
                            ) : (
                              <button
                                key={item}
                                type="button"
                                onClick={() => goToPage(item)}
                                aria-current={
                                  item === currentPage ? "page" : undefined
                                }
                                aria-label={`Page ${item}`}
                                className={cn(
                                  "relative flex h-10 w-10 items-center justify-center text-[12px] transition-all duration-300",
                                  item === currentPage
                                    ? "text-saukhya-maroon"
                                    : "text-saukhya-muted/80 hover:text-saukhya-pink",
                                )}
                                style={
                                  item === currentPage
                                    ? { fontFamily: "var(--font-serif)" }
                                    : undefined
                                }
                              >
                                {item}
                                {item === currentPage ? (
                                  <motion.span
                                    layoutId="shop-page-indicator"
                                    className="absolute inset-x-1.5 -bottom-px h-px bg-saukhya-gold"
                                    transition={{
                                      type: "spring",
                                      stiffness: 380,
                                      damping: 32,
                                    }}
                                  />
                                ) : null}
                              </button>
                            ),
                          )}
                        </div>
                        <p className="text-[10px] tracking-[0.18em] text-saukhya-muted/70">
                          {pageStart + 1}–{pageEnd} / {filtered.length}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="group inline-flex min-h-10 items-center gap-2 px-1 text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-muted transition-colors hover:text-saukhya-maroon disabled:pointer-events-none disabled:opacity-25"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <IconChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    </nav>
                  ) : null}
                </>
              ) : (
                <Reveal
                  from="bottom"
                  className="border border-dashed border-saukhya-border/80 bg-white/60 px-6 py-16 text-center md:py-20"
                >
                  <SectionHeading
                    title="No styles found"
                    subtitle="Try clearing filters or searching with a different fabric, style, or price range."
                    className="mb-6 md:mb-8"
                  />
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-pink"
                  >
                    Clear all filters
                  </button>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
