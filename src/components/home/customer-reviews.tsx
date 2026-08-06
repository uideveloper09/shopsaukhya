"use client";

import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Product, ProductReview } from "@/types/storefront";
import { resolveCustomerReviews } from "@/lib/customer-reviews";
import { CustomerReviewCard } from "@/components/ui/customer-review-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import "swiper/css";

interface CustomerReviewsProps {
  reviews?: ProductReview[];
  products?: Product[];
}

export function CustomerReviews({ reviews = [], products = [] }: CustomerReviewsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const displayReviews = useMemo(
    () => resolveCustomerReviews(reviews, products),
    [reviews, products],
  );

  if (!displayReviews.length) return null;

  return (
    <section
      className="section-padding bg-saukhya-warm-alt floral-decoration"
      aria-labelledby="reviews-heading"
    >
      <div className="container-saukhya">
        <SectionHeading
          id="reviews-heading"
          title="What Our Customers Say"
          subtitle="Real photos and videos from women who love Saukhya"
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
            {displayReviews.map((review, index) => (
              <SwiperSlide key={review.id} className="!h-auto">
                <CustomerReviewCard review={review} priority={index < 2} />
              </SwiperSlide>
            ))}
          </Swiper>

          {displayReviews.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute -left-1 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saukhya-border/80 bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:flex"
                aria-label="Previous reviews"
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute -right-1 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saukhya-border/80 bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:flex"
                aria-label="Next reviews"
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
