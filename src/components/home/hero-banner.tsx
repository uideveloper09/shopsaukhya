"use client";

import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Product } from "@/types/storefront";
import { buildHeroCarouselSlides } from "@/lib/hero-carousel";
import { getHeroCarouselProducts } from "@/lib/product-flags";
import { OfferProductCarouselCard } from "@/components/ui/offer-product-carousel-card";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import "swiper/css";
import "swiper/css/navigation";

interface HeroBannerProps {
  products: Product[];
}

export function HeroBanner({ products }: HeroBannerProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const carouselProducts = useMemo(
    () => getHeroCarouselProducts(products),
    [products],
  );

  const slides = useMemo(
    () => buildHeroCarouselSlides(carouselProducts),
    [carouselProducts],
  );

  if (!slides.length) return null;

  return (
    <Reveal from="top" distance={28} duration={0.7} className="relative w-full overflow-hidden">
      <section aria-label="Hero product carousel">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={slides.length > 2}
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 0 },
            1024: { slidesPerView: 3, spaceBetween: 0 },
            1280: { slidesPerView: 4, spaceBetween: 0 },
            1536: { slidesPerView: 5, spaceBetween: 0 },
          }}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          className="hero-carousel !w-full !overflow-hidden"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="!box-border !p-0">
              <OfferProductCarouselCard
                product={slide.product}
                variant="hero"
                priority={index < 4}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-saukhya-soft transition-transform hover:scale-105 md:left-6"
              aria-label="Previous slide"
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-saukhya-soft transition-transform hover:scale-105 md:right-6"
              aria-label="Next slide"
            >
              <IconChevronRight />
            </button>
          </>
        )}
      </section>
    </Reveal>
  );
}
