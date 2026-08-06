"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem, NavigationData, Product } from "@/types/storefront";
import { ANNOUNCEMENT } from "@/constants/brand";
import { Logo } from "@/components/ui/logo";
import { AppLink } from "@/components/ui/app-link";
import {
  cn,
  getMenuHref,
  getProductCardImage,
  getProductHref,
} from "@/lib/utils";
import {
  IconCart,
  IconChevronRight,
  IconHeart,
  IconSearch,
  IconUser,
} from "@/components/ui/icons";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

interface HeaderProps {
  navigation: NavigationData;
  products?: Product[];
}

interface MegaColumn {
  category: MenuItem;
  products: Product[];
}

function getMegaProductLabel(product: Product): string {
  return product.productName
    .replace(/\s+(Shirt|Top|Dress|Co-?Ord Set|Kurta Set)$/i, "")
    .trim();
}

export function Header({ navigation, products = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartCount = useCartStore((s) => s.count);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileShopOpen(false);
  };

  const openMega = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMegaOpen(true);
  };

  const closeMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMegaOpen(false);
      closeTimerRef.current = null;
    }, 80);
  };

  const closeMegaNow = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMegaOpen(false);
  };

  const shopMenu = navigation.headerMenus.find((m) => m.menuName === "Shop");
  const megaItems = useMemo(() => {
    const items = shopMenu
      ? navigation.megaMenus.filter((m) => m.parentMenuCode === shopMenu.menuCode)
      : navigation.megaMenus;
    return [...items].sort((a, b) => a.position - b.position);
  }, [navigation.megaMenus, shopMenu]);

  const megaColumns = useMemo<MegaColumn[]>(() => {
    return megaItems.map((category) => ({
      category,
      products: products
        .filter((p) => p.subCategoryCode === category.subCategoryCode)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }));
  }, [megaItems, products]);

  return (
    <>
      <div className="w-full bg-saukhya-pink py-2 text-center text-xs tracking-wide text-white">
        {ANNOUNCEMENT}
      </div>

      <header
        className={cn(
          "relative sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
          (scrolled || mobileOpen) &&
            !megaOpen &&
            "shadow-[0_12px_32px_rgba(31,26,28,0.08)]",
        )}
      >
        <div className="container-saukhya">
          <div className="relative flex h-16 items-center justify-between gap-4 md:h-[72px]">
            <div onMouseEnter={closeMegaNow} className="shrink-0">
              <Logo size="md" priority />
            </div>

            <nav
              className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
              aria-label="Main"
            >
              {navigation.headerMenus.map((item) =>
                item.menuName === "Shop" ? (
                  <button
                    key={item.menuCode}
                    type="button"
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    onFocus={openMega}
                    onBlur={closeMega}
                    className={cn(
                      "relative inline-flex h-9 items-center border-0 bg-transparent p-0 text-sm font-medium leading-none transition-colors",
                      megaOpen
                        ? "text-saukhya-pink"
                        : "text-saukhya-text hover:text-saukhya-pink",
                    )}
                  >
                    {item.menuName}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute left-1/2 top-[calc(100%+2px)] -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent transition-opacity",
                        megaOpen
                          ? "border-t-saukhya-pink opacity-100"
                          : "border-t-transparent opacity-0",
                      )}
                    />
                  </button>
                ) : (
                  <AppLink
                    key={item.menuCode}
                    href={getMenuHref(item.menuUrl)}
                    onMouseEnter={closeMegaNow}
                    className="inline-flex h-9 items-center text-sm font-medium leading-none text-saukhya-text transition-colors hover:text-saukhya-pink"
                  >
                    {item.menuName}
                  </AppLink>
                ),
              )}
            </nav>

            <div
              className="ml-auto flex items-center gap-0.5 sm:gap-1"
              onMouseEnter={closeMegaNow}
            >
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-saukhya-pink transition-colors hover:bg-saukhya-pink/5"
                aria-label="Search"
              >
                <IconSearch />
              </button>
              <AppLink
                href="/account"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-saukhya-pink transition-colors hover:bg-saukhya-pink/5 sm:flex"
                aria-label="Account"
              >
                <IconUser />
              </AppLink>
              <AppLink
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-saukhya-pink transition-colors hover:bg-saukhya-pink/5"
                aria-label="Wishlist"
              >
                <IconHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saukhya-pink text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </AppLink>
              <AppLink
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-saukhya-pink transition-colors hover:bg-saukhya-pink/5"
                aria-label="Cart"
              >
                <IconCart />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saukhya-pink text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </AppLink>
              <button
                type="button"
                className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
                onClick={() =>
                  mobileOpen ? closeMobileMenu() : setMobileOpen(true)
                }
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <span className="relative flex h-4 w-5 flex-col justify-between">
                  <span
                    className={cn(
                      "block h-0.5 w-full origin-center bg-saukhya-pink transition-all duration-300",
                      mobileOpen && "translate-y-[7px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-full bg-saukhya-pink transition-all duration-300",
                      mobileOpen && "scale-x-0 opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-full origin-center bg-saukhya-pink transition-all duration-300",
                      mobileOpen && "-translate-y-[7px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && (
            <MegaMenu
              columns={megaColumns}
              onClose={closeMegaNow}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-saukhya-border bg-white"
            >
              <div className="container-saukhya py-4">
                <input
                  type="search"
                  placeholder="Search styles"
                  className="w-full rounded-saukhya-md border border-saukhya-border bg-white px-4 py-3 text-sm outline-none focus:border-saukhya-pink/40"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <MobileMenu
              navigation={navigation}
              megaColumns={megaColumns}
              mobileShopOpen={mobileShopOpen}
              onToggleShop={() => setMobileShopOpen((open) => !open)}
              onClose={closeMobileMenu}
            />
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MobileMenu({
  navigation,
  megaColumns,
  mobileShopOpen,
  onToggleShop,
  onClose,
}: {
  navigation: NavigationData;
  megaColumns: MegaColumn[];
  mobileShopOpen: boolean;
  onToggleShop: () => void;
  onClose: () => void;
}) {
  return (
    <motion.nav
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full overflow-hidden bg-white md:hidden"
      aria-label="Mobile"
    >
      <div className="max-h-[min(70vh,calc(100dvh-5.5rem))] overflow-y-auto overscroll-contain scroll-smooth [-webkit-overflow-scrolling:touch]">
        {navigation.headerMenus.map((item) => {
          if (item.menuName === "Shop") {
            return (
              <div
                key={item.menuCode}
                className="border-b border-saukhya-border"
              >
                <button
                  type="button"
                  onClick={onToggleShop}
                  aria-expanded={mobileShopOpen}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-medium text-saukhya-text sm:px-5"
                >
                  <span className={cn(mobileShopOpen && "text-saukhya-pink")}>
                    {item.menuName}
                  </span>
                  <motion.span
                    animate={{ rotate: mobileShopOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-saukhya-pink"
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {mobileShopOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 px-4 pb-4 sm:px-5">
                        {megaColumns.map(
                          ({ category, products: columnProducts }) => (
                            <div key={category.menuCode}>
                              <AppLink
                                href={getMenuHref(category.menuUrl)}
                                onClick={onClose}
                                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-saukhya-pink"
                              >
                                {category.menuName}
                              </AppLink>
                              <ul className="space-y-2">
                                {columnProducts.length > 0 ? (
                                  columnProducts.map((product) => (
                                    <li key={product.productCode}>
                                      <AppLink
                                        href={getProductHref(product)}
                                        onClick={onClose}
                                        className="block text-sm font-medium text-saukhya-text transition-colors hover:text-saukhya-pink"
                                      >
                                        {getMegaProductLabel(product)}
                                      </AppLink>
                                    </li>
                                  ))
                                ) : (
                                  <li>
                                    <AppLink
                                      href={getMenuHref(category.menuUrl)}
                                      onClick={onClose}
                                      className="block text-sm text-saukhya-muted"
                                    >
                                      View all
                                    </AppLink>
                                  </li>
                                )}
                              </ul>
                            </div>
                          ),
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <AppLink
              key={item.menuCode}
              href={getMenuHref(item.menuUrl)}
              onClick={onClose}
              className="flex items-center justify-between border-b border-saukhya-border px-4 py-3.5 text-[15px] font-medium text-saukhya-text last:border-b-0 sm:px-5"
            >
              {item.menuName}
            </AppLink>
          );
        })}
      </div>
    </motion.nav>
  );
}

function MegaMenu({
  columns,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  columns: MegaColumn[];
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const columnCount = Math.max(columns.length, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full z-50 hidden bg-white shadow-[0_16px_40px_rgba(31,26,28,0.1)] md:block"
    >
      <div className="container-saukhya py-4">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
        >
          {columns.map(({ category, products: columnProducts }, index) => (
            <motion.div
              key={category.menuCode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className={cn(
                "flex h-full min-w-0 flex-col px-4 first:pl-0 last:pr-0 lg:px-5",
                index > 0 && "border-l border-saukhya-gold/25",
              )}
            >
              <AppLink
                href={getMenuHref(category.menuUrl)}
                onClick={onClose}
                className="group mb-4 inline-flex flex-col"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-saukhya-pink">
                  {category.menuName}
                </span>
                <span className="mt-1.5 h-px w-6 bg-saukhya-gold/70 transition-all duration-300 group-hover:w-10" />
              </AppLink>

              <ul className="space-y-2.5">
                {columnProducts.length > 0 ? (
                  columnProducts.map((product) => (
                    <li key={product.productCode}>
                      <AppLink
                        href={getProductHref(product)}
                        onClick={onClose}
                        className="group flex items-center gap-2.5"
                      >
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden bg-white/80 ring-1 ring-saukhya-border">
                          <Image
                            src={getProductCardImage(product)}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="text-[13px] font-semibold leading-snug text-saukhya-text transition-colors group-hover:text-saukhya-pink">
                          {getMegaProductLabel(product)}
                        </span>
                      </AppLink>
                    </li>
                  ))
                ) : (
                  <li>
                    <AppLink
                      href={getMenuHref(category.menuUrl)}
                      onClick={onClose}
                      className="text-[13px] font-medium text-saukhya-muted transition-colors hover:text-saukhya-pink"
                    >
                      Explore collection
                    </AppLink>
                  </li>
                )}
              </ul>

              <AppLink
                href={getMenuHref(category.menuUrl)}
                onClick={onClose}
                className="mt-auto inline-flex items-center gap-1 pt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon/70 transition-colors hover:text-saukhya-pink"
              >
                View all
                <span aria-hidden>→</span>
              </AppLink>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
