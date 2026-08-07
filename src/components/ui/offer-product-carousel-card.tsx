"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types/storefront";
import { useCardReveal } from "@/hooks/use-card-reveal";
import {
  isProductOnOffer,
  isProductTrending,
} from "@/lib/product-flags";
import {
  cn,
  formatPrice,
  getProductCardImage,
  getProductHref,
} from "@/lib/utils";
import { trackRecentlyViewed } from "@/lib/recently-viewed";
import { IconArrowTiltRight } from "@/components/ui/icons";

const luxurySpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 1,
};

const easeLuxury = [0.16, 1, 0.3, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easeLuxury, delay: 0.12 + i * 0.07 },
  }),
};

interface OfferProductCarouselCardProps {
  product: Product;
  variant?: "hero" | "default";
  priority?: boolean;
}

export function OfferProductCarouselCard({
  product,
  variant = "hero",
  priority = false,
}: OfferProductCarouselCardProps) {
  const { ref, showSheet, hoverBinders, handleTapAction } =
    useCardReveal<HTMLAnchorElement>();

  const isHero = variant === "hero";
  const imageUrl = getProductCardImage(product);
  const href = getProductHref(product);
  const trending = isProductTrending(product);
  const onOffer = isProductOnOffer(product);
  const discountPercent = Math.round(product.discountPercent ?? 0);

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={`${product.productName}, ${formatPrice(product.finalAmount)}`}
      aria-expanded={showSheet}
      className="group block h-full w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saukhya-pink/40 focus-visible:ring-offset-2"
      onClick={(event) =>
        handleTapAction(event, () => trackRecentlyViewed(product))
      }
      {...hoverBinders}
    >
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden bg-[#f5f0ee]",
          isHero ? "rounded-none" : "rounded-saukhya-lg shadow-saukhya-soft",
        )}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: showSheet ? 1.06 : 1,
            filter: showSheet ? "brightness(0.92)" : "brightness(1)",
          }}
          transition={{ duration: 0.7, ease: easeLuxury }}
        >
          <Image
            src={imageUrl}
            alt={product.productName}
            fill
            priority={priority}
            sizes={
              isHero
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                : "(max-width: 640px) 45vw, 20vw"
            }
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: showSheet ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(15,10,12,0.18)_100%)]"
        />

        <motion.div
          initial={false}
          animate={{ opacity: showSheet ? 0.2 : 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] bg-gradient-to-t from-black/60 via-black/18 to-transparent"
        />

        {(trending || onOffer) && (
          <div className="absolute left-3 top-3 z-30 flex flex-wrap gap-1.5">
            {trending && (
              <span className="rounded-full bg-saukhya-gold/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
                Trending
              </span>
            )}
            {onOffer && (
              <span className="rounded-full bg-saukhya-pink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm">
                {discountPercent > 0 ? `${discountPercent}% Off` : "Offer"}
              </span>
            )}
          </div>
        )}

        <motion.div
          initial={false}
          animate={{
            opacity: showSheet ? 0 : 1,
            y: showSheet ? 14 : 0,
          }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-10 md:px-5 md:pb-5"
        >
          <h3 className="line-clamp-1 text-sm font-medium tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[15px]">
            {product.productName}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-semibold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:text-lg">
              {formatPrice(product.finalAmount)}
            </span>
            {onOffer && (
              <span className="text-xs text-white/70 line-through drop-shadow-sm">
                {formatPrice(product.originalAmount)}
              </span>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showSheet && (
            <motion.div
              key="sheet"
              initial={{ y: "100%", opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={luxurySpring}
              className="absolute inset-x-0 bottom-0 z-20 overflow-hidden"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.55, ease: easeLuxury, delay: 0.05 }}
                className="h-[2px] origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/80 to-saukhya-gold"
              />

              <div className="relative border-t border-white/60 bg-gradient-to-b from-white/97 via-saukhya-warm/98 to-saukhya-warm shadow-[0_-20px_60px_rgba(31,26,28,0.14)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute -top-8 left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-full bg-saukhya-pink/10 blur-2xl" />

                <div className="relative px-5 py-5 md:px-6 md:py-6">
                  <motion.p
                    custom={0}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="text-[10px] font-medium uppercase tracking-[0.28em] text-saukhya-gold"
                  >
                    {product.subCategoryName}
                  </motion.p>

                  <motion.h3
                    custom={1}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-2 line-clamp-2 font-medium leading-[1.35] tracking-tight text-saukhya-text md:text-[18px]"
                  >
                    {product.productName}
                  </motion.h3>

                  <motion.div
                    custom={2}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 flex items-end justify-between gap-3"
                  >
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-saukhya-muted">
                        Offer Price
                      </p>
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-xl font-semibold tabular-nums text-saukhya-pink md:text-2xl">
                          {formatPrice(product.finalAmount)}
                        </span>
                        {onOffer && (
                          <span className="text-sm text-saukhya-muted line-through">
                            {formatPrice(product.originalAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    {onOffer && discountPercent > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-saukhya-muted">
                          You Save
                        </p>
                        <p className="mt-0.5 text-lg font-semibold tabular-nums text-saukhya-gold">
                          {discountPercent}%
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {onOffer && product.discountLabel && (
                    <motion.p
                      custom={3}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-3 inline-flex items-center gap-2 text-[11px] italic tracking-wide text-saukhya-gold/90"
                    >
                      <span className="h-px w-4 bg-saukhya-gold/60" />
                      {product.discountLabel}
                    </motion.p>
                  )}

                  <motion.div
                    custom={4}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-5 flex items-center gap-3"
                  >
                    <span
                      className={cn(
                        "rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors duration-500",
                        showSheet ? "bg-saukhya-pink" : "bg-saukhya-text",
                      )}
                    >
                      Discover
                    </span>

                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 shadow-sm transition-all duration-300",
                        showSheet
                          ? "translate-x-0.5 border-saukhya-pink/40 text-saukhya-pink"
                          : "border-saukhya-gold/40 text-saukhya-text",
                      )}
                    >
                      <motion.span
                        animate={{ x: showSheet ? [0, 3, 0] : 0 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.6,
                        }}
                      >
                        <IconArrowTiltRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}
