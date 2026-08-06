"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem, NavigationData } from "@/types/storefront";
import { ANNOUNCEMENT } from "@/constants/brand";
import { Logo } from "@/components/ui/logo";
import { cn, getMenuHref } from "@/lib/utils";
import {
  IconCart,
  IconHeart,
  IconSearch,
  IconUser,
  IconChevronRight,
} from "@/components/ui/icons";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

interface HeaderProps {
  navigation: NavigationData;
}

export function Header({ navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.count);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shopMenu = navigation.headerMenus.find((m) => m.menuName === "Shop");
  const megaItems = shopMenu
    ? navigation.megaMenus.filter((m) => m.parentMenuCode === shopMenu.menuCode)
    : navigation.megaMenus;

  return (
    <>
      <div className="w-full bg-saukhya-pink py-2 text-center text-xs tracking-wide text-white">
        {ANNOUNCEMENT}
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-saukhya-soft backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="container-saukhya">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
            <button
              type="button"
              className="flex flex-col gap-1.5 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="h-0.5 w-5 bg-saukhya-text" />
              <span className="h-0.5 w-5 bg-saukhya-text" />
              <span className="h-0.5 w-3.5 bg-saukhya-text" />
            </button>

            <Logo size="md" priority className="mx-auto md:mx-0" />

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
              {navigation.headerMenus.map((item) =>
                item.menuName === "Shop" ? (
                  <div
                    key={item.menuCode}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button
                      type="button"
                      className="text-sm font-medium transition-colors hover:text-saukhya-pink"
                    >
                      {item.menuName}
                    </button>
                    <AnimatePresence>
                      {megaOpen && (
                        <MegaMenu items={megaItems} onClose={() => setMegaOpen(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.menuCode}
                    href={getMenuHref(item.menuUrl)}
                    className="text-sm font-medium transition-colors hover:text-saukhya-pink"
                  >
                    {item.menuName}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-saukhya-pink/5"
                aria-label="Search"
              >
                <IconSearch />
              </button>
              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-saukhya-pink/5"
                aria-label="Wishlist"
              >
                <IconHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saukhya-pink text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-saukhya-pink/5 sm:flex"
                aria-label="Account"
              >
                <IconUser />
              </Link>
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-saukhya-pink/5"
                aria-label="Cart"
              >
                <IconCart />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-saukhya-pink text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

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
                  placeholder="Search for styles, fabrics, collections..."
                  className="w-full rounded-saukhya-md border border-saukhya-border bg-saukhya-warm px-4 py-3 text-sm outline-none focus:border-saukhya-pink/40"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-saukhya-border bg-white md:hidden"
              aria-label="Mobile"
            >
              <div className="container-saukhya space-y-1 py-4">
                {navigation.headerMenus.map((item) => (
                  <Link
                    key={item.menuCode}
                    href={getMenuHref(item.menuUrl)}
                    className="block py-2.5 text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.menuName}
                  </Link>
                ))}
                {megaItems.map((item) => (
                  <Link
                    key={item.menuCode}
                    href={getMenuHref(item.menuUrl)}
                    className="block py-2 pl-4 text-sm text-saukhya-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.menuName}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MegaMenu({
  items,
  onClose,
}: {
  items: MenuItem[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 top-full z-50 mt-2 w-[480px] -translate-x-1/2 rounded-saukhya-lg bg-white p-6 shadow-saukhya-hover"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-saukhya-muted">
        Shop by Category
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Link
            key={item.menuCode}
            href={getMenuHref(item.menuUrl)}
            onClick={onClose}
            className="group flex items-center justify-between rounded-saukhya-sm px-3 py-2.5 text-sm transition-colors hover:bg-saukhya-pink/5 hover:text-saukhya-pink"
          >
            {item.menuName}
            <IconChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="mt-4 block text-center text-xs font-medium uppercase tracking-widest text-saukhya-pink"
      >
        View All Products
      </Link>
    </motion.div>
  );
}
