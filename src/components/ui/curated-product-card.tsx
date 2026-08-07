"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types/storefront";
import { useCardReveal } from "@/hooks/use-card-reveal";
import { isProductOnOffer, isProductTrending } from "@/lib/product-flags";
import {
  cn,
  extractFabricFromProduct,
  formatPrice,
  getAvailableSizes,
  getProductCardImage,
  getProductHref,
} from "@/lib/utils";
import { trackRecentlyViewed } from "@/lib/recently-viewed";
import { IconHeart, IconStar } from "@/components/ui/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";

const luxurySpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 1,
};

const easeLuxury = [0.16, 1, 0.3, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: easeLuxury, delay: 0.1 + i * 0.06 },
  }),
};

interface CuratedProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
  showMetaBelow?: boolean;
  /** Reserve equal meta height (Recently Viewed grids). */
  equalMetaHeight?: boolean;
}

export function CuratedProductCard({
  product,
  className,
  priority = false,
  showMetaBelow = false,
  equalMetaHeight = false,
}: CuratedProductCardProps) {
  const { ref, showSheet, hoverBinders, handleTapAction } =
    useCardReveal<HTMLElement>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const isWishlisted = has(product.productCode);
  const sizes = getAvailableSizes(product.objSizes);
  const fabric = extractFabricFromProduct(product);
  const imageUrl = getProductCardImage(product);
  const href = getProductHref(product);
  const trending = isProductTrending(product);
  const onOffer = isProductOnOffer(product);
  const discountPercent = Math.round(product.discountPercent ?? 0);

  const handleProductView = () => {
    trackRecentlyViewed(product);
  };

  const handleAddToBag = () => {
    const size = selectedSize ?? sizes[0];
    if (size) addItem(product.productCode, size);
  };

  useEffect(() => {
    if (!showSheet) setSelectedSize(null);
  }, [showSheet]);

  return (
    <article
      ref={ref}
      className={cn("group relative h-full", className)}
      aria-expanded={showSheet}
      {...hoverBinders}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a,button")) return;
        handleTapAction(event);
      }}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[10px] bg-[#f5f0ee] shadow-saukhya-soft ring-1 ring-black/[0.04] transition-shadow duration-500 group-hover:shadow-saukhya-hover group-hover:ring-saukhya-gold/25",
        )}
      >
        <div className="relative overflow-hidden">
          <Link
            href={href}
            className="block"
            onClick={(event) => handleTapAction(event, handleProductView)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: showSheet ? 1.06 : 1,
                  filter: showSheet ? "brightness(0.9)" : "brightness(1)",
                }}
                transition={{ duration: 0.65, ease: easeLuxury }}
              >
                <Image
                  src={imageUrl}
                  alt={product.productName}
                  fill
                  priority={priority}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: showSheet ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(15,10,12,0.16)_100%)]"
              />

              {!showMetaBelow && (
                <motion.div
                  initial={false}
                  animate={{ opacity: showSheet ? 0.15 : 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t from-black/65 via-black/22 to-transparent"
                />
              )}
            </div>
          </Link>

          {(trending || onOffer) && (
            <motion.div
              initial={false}
              animate={{ opacity: showSheet ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute left-3 top-3 z-30 flex flex-wrap gap-1.5"
            >
              {trending && (
                <span className="rounded-full bg-saukhya-gold/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
                  Curated
                </span>
              )}
              {onOffer && (
                <span className="rounded-full bg-saukhya-pink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm">
                  {discountPercent > 0 ? `${discountPercent}% Off` : "Offer"}
                </span>
              )}
            </motion.div>
          )}

          <motion.button
            type="button"
            initial={false}
            animate={{ opacity: showSheet ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggle(product.productCode)}
            className={cn(
              "absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/85 shadow-sm backdrop-blur-md transition-colors duration-300",
              showSheet && "pointer-events-none",
              isWishlisted
                ? "text-saukhya-pink"
                : "text-saukhya-muted hover:border-saukhya-pink/30 hover:text-saukhya-pink",
            )}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <IconHeart filled={isWishlisted} className="h-4 w-4" />
          </motion.button>

          {!showMetaBelow && (
            <motion.div
              initial={false}
              animate={{
                opacity: showSheet ? 0 : 1,
                y: showSheet ? 12 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-12 md:px-5 md:pb-5"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
                {product.subCategoryName}
              </p>
              <h3 className="mt-1 line-clamp-1 font-medium tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[15px]">
                {product.productName}
              </h3>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-base font-semibold tabular-nums text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:text-lg">
                  {formatPrice(product.finalAmount)}
                </span>
                {onOffer && (
                  <span className="text-xs text-white/70 line-through">
                    {formatPrice(product.originalAmount)}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {showSheet && (
              <motion.div
                key="sheet"
                initial={{ y: "100%", opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={luxurySpring}
                className="absolute inset-x-0 bottom-0 z-40 overflow-hidden"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.45, ease: easeLuxury, delay: 0.04 }}
                  className="h-[2px] origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/80 to-saukhya-gold"
                />

                <div className="border-t border-white/40 bg-[rgba(255,255,255,0.9)] shadow-[0_-16px_48px_rgba(31,26,28,0.1)] backdrop-blur-[2px]">
                  <div className="px-3 py-3 md:px-3.5 md:py-3.5">
                    <motion.p
                      custom={0}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="text-[9px] font-medium uppercase tracking-[0.22em] text-saukhya-gold"
                    >
                      {product.subCategoryName || "Saukhya"}
                    </motion.p>

                    <motion.h3
                      custom={1}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-1 line-clamp-1 text-[13px] font-medium leading-snug text-saukhya-text"
                    >
                      {product.productName}
                    </motion.h3>

                    <motion.div
                      custom={2}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-2.5 space-y-1"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-base font-semibold tabular-nums text-saukhya-pink">
                          {formatPrice(product.finalAmount)}
                        </span>
                        {onOffer && (
                          <span className="text-[11px] text-saukhya-muted line-through">
                            {formatPrice(product.originalAmount)}
                          </span>
                        )}
                      </div>
                      {fabric ? (
                        <p className="text-[10px] capitalize text-saukhya-muted">
                          {fabric}
                        </p>
                      ) : null}
                    </motion.div>

                    {sizes.length > 0 && (
                      <motion.div
                        custom={3}
                        variants={reveal}
                        initial="hidden"
                        animate="visible"
                        className="mt-3"
                      >
                        <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-saukhya-muted">
                          Size
                        </p>
                        <div
                          className="grid gap-1"
                          style={{
                            gridTemplateColumns: `repeat(${sizes.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "h-7 rounded-md border text-[10px] font-medium transition-all duration-200",
                                selectedSize === size
                                  ? "border-saukhya-pink bg-saukhya-pink/8 text-saukhya-pink"
                                  : "border-saukhya-border bg-white/70 text-saukhya-text hover:border-saukhya-pink/35",
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      custom={4}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-3 grid grid-cols-2 gap-2"
                    >
                      <Button
                        size="sm"
                        className="h-9 px-2 text-[10px] tracking-[0.14em]"
                        onClick={handleAddToBag}
                      >
                        Add To Bag
                      </Button>
                      <ButtonLink
                        href={href}
                        variant="outline"
                        size="sm"
                        className="h-9 px-2 text-[10px] tracking-[0.14em]"
                        onClick={handleProductView}
                      >
                        View
                      </ButtonLink>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showMetaBelow && (
          <div
            className={cn(
              "mt-auto flex flex-col bg-white px-3.5 pb-3.5 pt-3 md:px-4 md:pb-4 md:pt-3.5",
              equalMetaHeight && "min-h-[132px] md:min-h-[140px]",
            )}
          >
            <div className="flex items-center gap-0.5 text-saukhya-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <IconStar key={index} filled className="h-3 w-3" />
              ))}
            </div>
            <Link href={href} onClick={handleProductView} className="mt-2 block">
              <h3
                className={cn(
                  "line-clamp-2 text-[13px] font-semibold leading-snug text-saukhya-text md:text-sm",
                  equalMetaHeight && "min-h-[2.5rem] md:min-h-[2.75rem]",
                )}
              >
                {product.productName}
              </h3>
            </Link>
            <p
              className={cn(
                "mt-1 truncate text-xs text-saukhya-muted",
                equalMetaHeight && "min-h-4",
              )}
            >
              {product.subCategoryName || (equalMetaHeight ? "\u00A0" : "Saukhya")}
            </p>
            <div
              className={cn(
                "mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
                equalMetaHeight && "mt-auto pt-0.5",
              )}
            >
              <span className="text-[15px] font-semibold tabular-nums text-saukhya-text md:text-base">
                {formatPrice(product.finalAmount)}
              </span>
              {onOffer && (
                <span className="text-sm text-saukhya-muted line-through">
                  {formatPrice(product.originalAmount)}
                </span>
              )}
            </div>
            <div className="mt-2.5 flex gap-1.5">
              {["#ec3988", "#c9a96e", "#1f1a1c", "#fff8fb"].map((color) => (
                <span
                  key={color}
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
