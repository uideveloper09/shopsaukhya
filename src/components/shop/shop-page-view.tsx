"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Category, Product, SubCategory } from "@/types/storefront";
import {
  SHOP_PAGE,
  SHOP_PRICE_RANGES,
  SHOP_SORT_OPTIONS,
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

const ease = [0.22, 1, 0.36, 1] as const;

type ShopPageViewProps = {
  products: Product[];
  categories: Category[];
  subcategories: SubCategory[];
};

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
      {children}
    </span>
  );
}

function underlineSelect(active?: boolean) {
  return cn(
    "w-full appearance-none bg-transparent py-2.5 pr-7 text-sm outline-none transition border-b",
    active
      ? "border-saukhya-pink text-saukhya-maroon"
      : "border-saukhya-border/70 text-saukhya-text focus:border-saukhya-pink/60",
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

  const initial: ShopFiltersState = {
    ...DEFAULT_SHOP_FILTERS,
    categoryCode: Number(searchParams.get("category") || 0) || 0,
    subcategoryCode: Number(searchParams.get("subcategory") || 0) || 0,
    query: searchParams.get("q") || "",
    sortMode: (searchParams.get("sort") as ShopSortMode) || "featured",
  };

  const [filters, setFilters] = useState<ShopFiltersState>(initial);

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
    // Prefer names from products if sub list incomplete
    for (const product of products) {
      if (product.subCategoryCode && product.subCategoryName) {
        map.set(product.subCategoryCode, product.subCategoryName);
      }
    }
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
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
    <main className="w-full overflow-x-hidden bg-saukhya-warm">
      {/* Cinematic hero */}
      <section className="relative min-h-[48vh] overflow-hidden md:min-h-[52vh]">
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

        <div className="container-saukhya relative z-10 flex min-h-[48vh] flex-col justify-end pb-8 pt-20 md:min-h-[52vh] md:pb-10 md:pt-24">
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
            <motion.div
              className="lg:col-span-7"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-saukhya-gold">
                {SHOP_PAGE.kicker}
              </p>
              <h1
                className="mt-3 max-w-2xl text-[2rem] font-medium leading-[1.12] tracking-tight text-white md:text-[2.65rem] lg:text-[3rem]"
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

      {/* Style rail */}
      <section className="border-b border-saukhya-border/60 bg-white/70">
        <div className="container-saukhya py-5 md:py-6">
          <LayoutGroup>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none md:flex-wrap md:justify-center md:gap-x-8 md:overflow-visible">
              <button
                type="button"
                onClick={() => updateFilters({ subcategoryCode: 0 })}
                className="relative shrink-0 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-muted transition-colors hover:text-saukhya-maroon"
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
                const active = filters.subcategoryCode === style.code;
                return (
                  <button
                    key={style.code}
                    type="button"
                    onClick={() =>
                      updateFilters({
                        subcategoryCode: active ? 0 : style.code,
                      })
                    }
                    className={cn(
                      "relative shrink-0 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors",
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
      </section>

      {/* Catalog */}
      <section className="section-padding floral-decoration">
        <div className="container-saukhya">
          <SectionHeading
            title={SHOP_PAGE.catalogTitle}
            subtitle={`${filtered.length} of ${products.length} styles showing`}
          />

          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 border border-saukhya-maroon/20 bg-white/80 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink lg:hidden"
                aria-expanded={filtersOpen}
                aria-controls="shop-filter-panel"
              >
                {filtersOpen ? "Close filters" : "Refine"}
              </button>

              <label className="flex items-center gap-3 border border-saukhya-border/70 bg-white/80 px-4 py-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-saukhya-muted">
                  Sort
                </span>
                <select
                  id="shop-sort"
                  value={filters.sortMode}
                  onChange={(e) =>
                    updateFilters({
                      sortMode: e.target.value as ShopSortMode,
                    })
                  }
                  className="bg-transparent text-sm text-saukhya-text outline-none"
                >
                  {SHOP_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
          </div>

          <AnimatePresence initial={false}>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
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
                      className="inline-flex items-center gap-2 border border-saukhya-border/80 bg-white px-3 py-1.5 text-xs tracking-wide text-saukhya-text transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink"
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

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <aside
              id="shop-filter-panel"
              className={cn(
                "lg:col-span-3",
                filtersOpen ? "block" : "hidden lg:block",
              )}
            >
              <Reveal
                from="left"
                className="space-y-8 border border-saukhya-border/60 bg-white/85 p-5 shadow-saukhya-soft md:p-6 lg:sticky lg:top-28"
              >
                <div>
                  <p
                    className="text-lg font-medium text-saukhya-maroon"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Refine
                  </p>
                  <p className="mt-1 text-xs text-saukhya-muted">
                    Soft filters for a calmer find
                  </p>
                </div>

                <label className="block">
                  <FilterLabel>Search</FilterLabel>
                  <input
                    type="search"
                    value={filters.query}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    placeholder="Style, fabric, code"
                    aria-label="Search styles"
                    className="w-full border-b border-saukhya-border/70 bg-transparent py-2.5 text-sm outline-none transition placeholder:text-saukhya-muted/55 focus:border-saukhya-pink"
                  />
                </label>

                <label className="block">
                  <FilterLabel>Collection</FilterLabel>
                  <select
                    value={filters.categoryCode || ""}
                    onChange={(e) =>
                      updateFilters({
                        categoryCode: Number(e.target.value) || 0,
                        subcategoryCode: 0,
                      })
                    }
                    className={underlineSelect(!!filters.categoryCode)}
                  >
                    <option value="">All collections</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryCode} value={cat.categoryCode}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <FilterLabel>Style</FilterLabel>
                  <select
                    value={filters.subcategoryCode || ""}
                    onChange={(e) =>
                      updateFilters({
                        subcategoryCode: Number(e.target.value) || 0,
                      })
                    }
                    className={underlineSelect(!!filters.subcategoryCode)}
                  >
                    <option value="">All styles</option>
                    {activeSubs.map((sub) => (
                      <option
                        key={sub.subCategoryCode}
                        value={sub.subCategoryCode}
                      >
                        {sub.subCategoryName}
                      </option>
                    ))}
                  </select>
                </label>

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
                                : "border-saukhya-border/80 text-saukhya-text hover:border-saukhya-pink/40",
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
                  <label className="block">
                    <FilterLabel>Material</FilterLabel>
                    <select
                      value={filters.material}
                      onChange={(e) =>
                        updateFilters({ material: e.target.value })
                      }
                      className={underlineSelect(!!filters.material)}
                    >
                      <option value="">All materials</option>
                      {materials.map((material) => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <div>
                  <FilterLabel>Price</FilterLabel>
                  <div className="space-y-2">
                    {SHOP_PRICE_RANGES.map((range) => {
                      const active = filters.price === range.key;
                      return (
                        <button
                          key={range.key || "all"}
                          type="button"
                          onClick={() => updateFilters({ price: range.key })}
                          className={cn(
                            "flex w-full items-center justify-between border-b py-2.5 text-left text-sm transition-colors",
                            active
                              ? "border-saukhya-pink text-saukhya-maroon"
                              : "border-saukhya-border/50 text-saukhya-muted hover:text-saukhya-text",
                          )}
                        >
                          <span>{range.label}</span>
                          {active && (
                            <span className="h-1.5 w-1.5 rotate-45 bg-saukhya-pink" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateFilters({ discountOnly: !filters.discountOnly })
                  }
                  className={cn(
                    "flex w-full items-center justify-between border px-4 py-3 text-left transition-colors",
                    filters.discountOnly
                      ? "border-saukhya-pink/40 bg-saukhya-pink/[0.04] text-saukhya-maroon"
                      : "border-saukhya-border/70 text-saukhya-text hover:border-saukhya-pink/30",
                  )}
                >
                  <span className="text-sm">Early Bird Savings</span>
                  <span
                    className={cn(
                      "h-4 w-4 border transition-colors",
                      filters.discountOnly
                        ? "border-saukhya-pink bg-saukhya-pink"
                        : "border-saukhya-border",
                    )}
                  />
                </button>
              </Reveal>
            </aside>

            <div className="lg:col-span-9">
              {filtered.length > 0 ? (
                <RevealStagger
                  className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5"
                  stagger={0.05}
                >
                  {filtered.map((product, index) => (
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
