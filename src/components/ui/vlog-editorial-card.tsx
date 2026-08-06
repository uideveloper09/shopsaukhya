"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { VlogCard } from "@/types/storefront";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { cn } from "@/lib/utils";
import { IconPlay } from "@/components/ui/icons";

const ease = [0.22, 1, 0.36, 1] as const;

interface VlogEditorialCardProps {
  vlog: VlogCard;
  variant?: "featured" | "stacked" | "grid";
  readMinutes?: number;
  priority?: boolean;
  className?: string;
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
      {category}
    </span>
  );
}

function CategoryBadgeLight({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-saukhya-gold">
      {category}
    </span>
  );
}

function ReadLink({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-saukhya-pink transition-colors group-hover:text-saukhya-maroon",
        className,
      )}
    >
      Read story
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </span>
  );
}

export function VlogEditorialCard({
  vlog,
  variant = "grid",
  readMinutes = 4,
  priority = false,
  className,
}: VlogEditorialCardProps) {
  const href = `/blog/${vlog.slug}`;

  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className={cn("group h-full", className)}
      >
        <Link href={href} className="relative block h-full min-h-[420px] overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md shadow-[0_20px_56px_rgba(92,34,56,0.14)] lg:min-h-[520px]">
          <Image
            src={vlog.imageUrl}
            alt={vlog.title}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/80" />

          <div
            aria-hidden
            className="absolute left-0 top-0 h-24 w-24 border-l border-t border-saukhya-gold/40"
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-0 h-20 w-20 border-b border-r border-saukhya-gold/35"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
            <CategoryBadge category={vlog.category} />

            <h3
              className="mt-4 max-w-xl text-2xl font-medium leading-snug text-white md:text-3xl lg:text-[2rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {vlog.title}
            </h3>

            <p className="mt-3 max-w-lg line-clamp-2 text-sm leading-relaxed text-white/82 md:text-[15px]">
              {vlog.excerpt}
            </p>

            <div className="mt-5 flex items-center justify-between gap-4">
              <ReadLink className="text-white group-hover:text-white/90" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                {readMinutes} min read
              </span>
            </div>
          </div>

          <span className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-saukhya-pink group-hover:border-saukhya-pink">
            <IconPlay className="ml-0.5 h-4 w-4" />
          </span>
        </Link>
      </motion.article>
    );
  }

  if (variant === "stacked") {
    return (
      <motion.article
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease }}
        className={cn("group h-full", className)}
      >
        <Link
          href={href}
          className="flex h-full min-h-[140px] overflow-hidden rounded-saukhya-lg border border-saukhya-border/80 bg-[#faf7f5] shadow-saukhya-soft transition-shadow duration-300 hover:shadow-saukhya-hover"
        >
          <div className="relative w-[38%] shrink-0 overflow-hidden sm:w-[42%]">
            <Image
              src={vlog.imageUrl}
              alt={vlog.title}
              fill
              sizes="180px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-saukhya-maroon/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
            <FashionPatternTexture variant="card" />

            <div className="relative z-10 flex flex-1 flex-col justify-center">
              <CategoryBadgeLight category={vlog.category} />
              <h3
                className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-saukhya-text transition-colors group-hover:text-saukhya-maroon md:text-base"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {vlog.title}
              </h3>
              <p className="mt-2 line-clamp-2 hidden text-xs leading-relaxed text-saukhya-muted sm:block">
                {vlog.excerpt}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <ReadLink />
                <span className="text-[10px] uppercase tracking-wider text-saukhya-muted">
                  {readMinutes} min
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      className={cn("group h-full", className)}
    >
      <Link
        href={href}
        className="flex h-full flex-col overflow-hidden rounded-saukhya-lg border border-saukhya-border/70 bg-[#faf7f5] shadow-saukhya-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-saukhya-hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vlog.imageUrl}
            alt={vlog.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-saukhya-maroon">
              {vlog.category}
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col overflow-hidden p-5">
          <FashionPatternTexture variant="card" />

          <div className="relative z-10 flex flex-1 flex-col">
            <h3
              className="line-clamp-2 text-base font-medium leading-snug text-saukhya-text transition-colors group-hover:text-saukhya-maroon"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {vlog.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-saukhya-muted">
              {vlog.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-saukhya-border/60 pt-4">
              <ReadLink />
              <span className="text-[10px] uppercase tracking-wider text-saukhya-muted">
                {readMinutes} min
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
