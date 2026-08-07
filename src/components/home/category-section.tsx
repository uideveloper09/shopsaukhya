"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Product, SectionFilter } from "@/types/storefront";
import { getCategoryMaxOfferPercent } from "@/lib/category-offers";
import { CategoryCarouselCard } from "@/components/ui/category-carousel-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconArrowTiltRight, IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import "swiper/css";

interface CategorySectionProps {
  filters: SectionFilter[];
  products?: Product[];
}

export function CategorySection({ filters, products = [] }: CategorySectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const displayFilters = filters
    .filter((filter) => filter.displayOnHome && filter.slug !== "all-styles")
    .sort((a, b) => a.position - b.position);

  if (!displayFilters.length) return null;

  return (
    <section
      className="section-padding bg-saukhya-warm-alt/60 floral-decoration"
      aria-labelledby="categories-heading"
    >
      <div className="container-saukhya relative">
        <Link
          href="/shop/all-styles"
          className="group absolute right-0 top-1 z-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
        >
          <span className="hidden h-px w-6 bg-saukhya-gold/60 sm:block" />
          <span className="hidden sm:inline">View All Collections</span>
          <span className="sm:hidden">View All</span>
          <IconArrowTiltRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px" />
        </Link>

        <SectionHeading
          id="categories-heading"
          title="Shop by Category"
          subtitle="Explore our curated styles — from kurta sets to co-ord sets"
        />

        <Reveal from="bottom" distance={40} delay={0.05} className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="!overflow-visible"
          >
            {displayFilters.map((category, index) => (
              <SwiperSlide key={category.filterCode} className="!h-auto">
                <CategoryCarouselCard
                  category={category}
                  priority={index < 3}
                  maxOfferPercent={getCategoryMaxOfferPercent(category, products)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {displayFilters.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute -left-1 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saukhya-border/80 bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:flex"
                aria-label="Previous categories"
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute -right-1 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saukhya-border/80 bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:flex"
                aria-label="Next categories"
              >
                <IconChevronRight />
              </button>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
