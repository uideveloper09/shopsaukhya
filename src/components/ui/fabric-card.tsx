"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { FabricCard as FabricCardType } from "@/types/storefront";
import { cn } from "@/lib/utils";
import { usePrefersHover } from "@/hooks/use-prefers-hover";
import { ButtonLink } from "@/components/ui/button";

interface FabricCardProps {
  fabric: FabricCardType;
  variant?: "default" | "carousel";
  className?: string;
}

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

export function FabricCard({ fabric, variant = "default", className }: FabricCardProps) {
  const prefersHover = usePrefersHover();
  const [hovered, setHovered] = useState(false);
  const isCarousel = variant === "carousel";
  const showSheet = prefersHover && hovered;
  const href = `/shop?fabric=${fabric.slug}`;

  const setActive = (active: boolean) => {
    if (prefersHover) setHovered(active);
  };

  return (
    <article
      className={cn("group relative w-full", className)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[#f5f0ee] transition-shadow duration-500 group-hover:shadow-saukhya-hover group-hover:ring-saukhya-gold/25",
          isCarousel
            ? "rounded-none shadow-none ring-0 group-hover:ring-0"
            : "rounded-[10px] shadow-saukhya-soft ring-1 ring-black/[0.04]",
        )}
      >
        <Link href={href} className="block">
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
                src={fabric.imageUrl}
                alt={`${fabric.name} fabric texture`}
                fill
                sizes={
                  isCarousel
                    ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    : "(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 16vw"
                }
                className="object-cover"
              />
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
          className="pointer-events-none absolute left-3 top-3 z-30 flex flex-wrap gap-1.5"
        >
          <span className="rounded-full bg-saukhya-gold/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
            Fabric
          </span>
          {fabric.season && (
            <span className="rounded-full bg-saukhya-pink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white shadow-sm">
              {fabric.season}
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
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-12 md:px-5 md:pb-5"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
            Our Fabrics
          </p>
          <h3 className="mt-1 line-clamp-1 font-medium tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[15px]">
            {fabric.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-[11px] uppercase tracking-[0.18em] text-white/85">
            {fabric.tagline}
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
                    Our Fabrics, Our Promise
                  </motion.p>

                  <motion.h3
                    custom={1}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-1 line-clamp-1 text-[13px] font-medium leading-snug text-saukhya-text"
                  >
                    {fabric.name}
                  </motion.h3>

                  <motion.div
                    custom={2}
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    className="mt-2 space-y-1.5"
                  >
                    <p className="line-clamp-2 text-[10px] leading-snug text-saukhya-muted">
                      {fabric.description}
                    </p>
                    <p className="text-[10px] capitalize text-saukhya-muted">
                      {fabric.season}
                      {fabric.care ? ` · ${fabric.care}` : ""}
                    </p>
                  </motion.div>

                  {fabric.benefits.length > 0 && (
                    <motion.div
                      custom={3}
                      variants={reveal}
                      initial="hidden"
                      animate="visible"
                      className="mt-2.5 flex flex-wrap gap-1"
                    >
                      {fabric.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="rounded-md border border-saukhya-border bg-white/70 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-saukhya-text"
                        >
                          {benefit}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <motion.div
                    custom={4}
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
                      View
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
