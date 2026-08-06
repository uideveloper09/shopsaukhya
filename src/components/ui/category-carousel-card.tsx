"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SectionFilter } from "@/types/storefront";
import { useCardReveal } from "@/hooks/use-card-reveal";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

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

interface CategoryCarouselCardProps {
  category: SectionFilter;
  priority?: boolean;
  maxOfferPercent?: number;
  className?: string;
}

export function CategoryCarouselCard({
  category,
  priority = false,
  maxOfferPercent = 0,
  className,
}: CategoryCarouselCardProps) {
  const { ref, showSheet, hoverBinders, handleTapAction } =
    useCardReveal<HTMLElement>();

  const hasOffer = maxOfferPercent > 0;
  const href = `/shop/${category.slug}`;

  return (
    <article
      ref={ref}
      className={cn("group relative", className)}
      aria-expanded={showSheet}
      {...hoverBinders}
    >
      <div className="relative overflow-hidden rounded-[10px] bg-[#f5f0ee] shadow-saukhya-soft ring-1 ring-black/[0.04] transition-shadow duration-500 group-hover:shadow-saukhya-hover group-hover:ring-saukhya-gold/25">
        <Link
          href={href}
          className="block"
          onClick={(event) => handleTapAction(event)}
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
              {category.imageUrl && (
                <Image
                  src={category.imageUrl}
                  alt={category.label}
                  fill
                  priority={priority}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              )}
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: showSheet ? 1 : 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(15,10,12,0.16)_100%)]"
            />

            <motion.div
              initial={false}
              animate={{ opacity: showSheet ? 0.15 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t from-black/65 via-black/22 to-transparent"
            />
          </div>
        </Link>

        <motion.div
          initial={false}
          animate={{ opacity: showSheet ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute left-3 top-3 z-30 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 md:left-3.5 md:top-3.5"
        >
          <span className="rounded-full bg-saukhya-gold/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
            Collection
          </span>
          {hasOffer && (
            <span className="rounded-full bg-saukhya-pink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm">
              Up to {Math.round(maxOfferPercent)}% Off
            </span>
          )}
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            opacity: showSheet ? 0 : 1,
            y: showSheet ? 12 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-5 pt-12 md:px-5 md:pb-6"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
            Shop
          </p>
          <h3 className="mt-1 line-clamp-1 font-medium tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[15px]">
            {category.label}
          </h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/85">
            Explore collection
          </p>
        </motion.div>

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
                    Shop by Category
                  </motion.p>

                  <motion.h3
                    custom={1}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-1 line-clamp-1 text-[13px] font-medium leading-snug text-saukhya-text"
                  >
                    {category.label}
                  </motion.h3>

                  {hasOffer && (
                    <motion.p
                      custom={2}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-saukhya-pink"
                    >
                      Up to {Math.round(maxOfferPercent)}% off
                    </motion.p>
                  )}

                  <motion.div
                    custom={3}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-3 grid grid-cols-2 gap-2"
                  >
                    <ButtonLink
                      href={href}
                      size="sm"
                      className="h-9 px-2 text-[10px] tracking-[0.14em]"
                    >
                      Explore
                    </ButtonLink>
                    <Link
                      href={href}
                      className="flex h-9 items-center justify-center rounded-saukhya-md border border-saukhya-border bg-white/70 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-saukhya-text backdrop-blur-[2px] transition-colors hover:border-saukhya-pink/40 hover:text-saukhya-pink"
                    >
                      View All
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
