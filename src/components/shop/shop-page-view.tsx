"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { getProductCardImage } from "@/lib/utils";
import { CuratedProductCard } from "@/components/ui/curated-product-card";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

const ease = [0.22, 1, 0.36, 1] as const;

type ShopPageViewProps = {
  products: Product[];
  categories: Category[];
  subcategories: SubCategory[];
};

function selectClassName(active?: boolean) {
  return `w-full appearance-none border-b bg-transparent py-2.5 pr-8 text-sm outline-none transition ${
    active
      ? "border-saukhya-pink text-saukhya-text"
      : "border-saukhya-border/80 text-saukhya-text"
  }`;
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

  const mosaicImages = useMemo(() => {
    return products
      .slice(0, 5)
      .map((p) => getProductCardImage(p))
      .filter(Boolean);
  }, [products]);

  const activeFilters = useMemo(() => {
    const chips: { key: keyof ShopFiltersState; label: string }[] = [];
    if (filters.categoryCode) {
      const cat = categories.find((c) => c.categoryCode === filters.categoryCode);
      if (cat) chips.push({ key: "categoryCode", label: cat.categoryName });
    }
    if (filters.subcategoryCode) {
      const sub = subcategories.find(
        (s) => s.subCategoryCode === filters.subcategoryCode,
      );
      if (sub) chips.push({ key: "subcategoryCode", label: sub.subCategoryName });
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
  }, [filters, categories, subcategories]);

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
      {/* Hero edit band */}
      <section className="relative overflow-hidden border-b border-saukhya-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,57,136,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(201,169,110,0.12),transparent_45%)]"
        />

        <div className="container-saukhya relative py-12 md:py-16 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              className="lg:col-span-6"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-saukhya-gold">
                {SHOP_PAGE.kicker}
              </p>
              <h1
                className="mt-4 max-w-xl text-[2.2rem] font-medium leading-[1.15] tracking-tight text-saukhya-maroon md:text-5xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {SHOP_PAGE.title}
              </h1>
              <motion.div
                aria-hidden
                className="mt-5 h-px origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/50 to-transparent"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.85, ease, delay: 0.25 }}
              />
              <p className="mt-5 max-w-lg text-base leading-[1.8] text-saukhya-muted md:text-[17px]">
                {SHOP_PAGE.intro}
              </p>

              <div
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon/80"
                aria-label="Shop summary"
              >
                <span>{products.length} styles</span>
                <span className="text-saukhya-border">·</span>
                <span>{styleEdits} style edits</span>
                <span className="text-saukhya-border">·</span>
                <span>{discountedCount} savings</span>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.12 }}
              aria-hidden
            >
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const src = mosaicImages[index];
                  return (
                    <motion.div
                      key={src ?? `empty-${index}`}
                      className={`relative overflow-hidden bg-[#f3ece9] ${
                        index === 2 ? "aspect-[3/4]" : "aspect-[3/4] mt-4 odd:mt-0"
                      } ${index % 2 === 1 ? "translate-y-4 md:translate-y-6" : ""}`}
                      whileHover={
                        reduceMotion || !src
                          ? undefined
                          : { y: -4, transition: { duration: 0.35 } }
                      }
                    >
                      {src ? (
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="15vw"
                          className="object-cover"
                          priority={index < 3}
                        />
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="section-padding">
        <div className="container-saukhya">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-saukhya-border/70 pb-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-saukhya-gold">
                {SHOP_PAGE.catalogKicker}
              </p>
              <h2
                className="mt-2 text-2xl font-medium text-saukhya-maroon md:text-3xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {SHOP_PAGE.catalogTitle}
              </h2>
              <p className="mt-2 text-sm text-saukhya-muted">
                {filtered.length} of {products.length} styles showing
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 border border-saukhya-maroon/20 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink md:hidden"
              aria-expanded={filtersOpen}
              aria-controls="shop-filter-panel"
            >
              {filtersOpen ? "Close" : "Filters"}
            </button>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            {/* Filters */}
            <aside
              id="shop-filter-panel"
              className={`lg:col-span-3 ${
                filtersOpen ? "block" : "hidden lg:block"
              }`}
            >
              <Reveal from="left" className="space-y-7 lg:sticky lg:top-28">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                    Search
                  </span>
                  <input
                    type="search"
                    value={filters.query}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    placeholder="Search styles, fabric, code"
                    aria-label="Search styles"
                    className="w-full border-b border-saukhya-border/80 bg-transparent py-2.5 text-sm outline-none transition placeholder:text-saukhya-muted/60 focus:border-saukhya-pink"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                    Collection
                  </span>
                  <select
                    value={filters.categoryCode || ""}
                    onChange={(e) =>
                      updateFilters({
                        categoryCode: Number(e.target.value) || 0,
                        subcategoryCode: 0,
                      })
                    }
                    className={selectClassName(!!filters.categoryCode)}
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
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                    Style
                  </span>
                  <select
                    value={filters.subcategoryCode || ""}
                    onChange={(e) =>
                      updateFilters({
                        subcategoryCode: Number(e.target.value) || 0,
                      })
                    }
                    className={selectClassName(!!filters.subcategoryCode)}
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
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                      Size
                    </span>
                    <select
                      value={filters.size}
                      onChange={(e) => updateFilters({ size: e.target.value })}
                      className={selectClassName(!!filters.size)}
                    >
                      <option value="">All sizes</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {materials.length > 0 && (
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                      Material
                    </span>
                    <select
                      value={filters.material}
                      onChange={(e) =>
                        updateFilters({ material: e.target.value })
                      }
                      className={selectClassName(!!filters.material)}
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

                <label className="block">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
                    Price
                  </span>
                  <select
                    value={filters.price}
                    onChange={(e) => updateFilters({ price: e.target.value })}
                    className={selectClassName(!!filters.price)}
                  >
                    {SHOP_PRICE_RANGES.map((range) => (
                      <option key={range.key || "all"} value={range.key}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex cursor-pointer items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={filters.discountOnly}
                    onChange={(e) =>
                      updateFilters({ discountOnly: e.target.checked })
                    }
                    className="h-4 w-4 accent-saukhya-pink"
                  />
                  <span className="text-sm text-saukhya-text">
                    Early Bird Savings
                  </span>
                </label>

                {activeFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-muted transition-colors hover:text-saukhya-pink"
                  >
                    Clear filters
                  </button>
                )}
              </Reveal>
            </aside>

            {/* Results */}
            <div className="lg:col-span-9">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <AnimatePresence initial={false}>
                  {activeFilters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-2"
                      aria-label="Active filters"
                    >
                      {activeFilters.map((chip) => (
                        <button
                          key={`${chip.key}-${chip.label}`}
                          type="button"
                          onClick={() => clearChip(chip.key)}
                          className="inline-flex items-center gap-2 border border-saukhya-border bg-white px-3 py-1.5 text-xs text-saukhya-text transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink"
                        >
                          {chip.label}
                          <span aria-hidden>×</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="ml-auto flex items-center gap-3">
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
                    className="border-b border-saukhya-border/80 bg-transparent py-1.5 text-sm outline-none focus:border-saukhya-pink"
                  >
                    {SHOP_SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {filtered.length > 0 ? (
                <RevealStagger
                  className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
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
                        priority={index < 4}
                        showMetaBelow
                      />
                    </RevealItem>
                  ))}
                </RevealStagger>
              ) : (
                <Reveal from="bottom" className="py-20 text-center">
                  <h3
                    className="text-2xl font-medium text-saukhya-maroon"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    No styles found
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm text-saukhya-muted">
                    Try clearing filters or searching with a different fabric,
                    style, or price range.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-pink"
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
