"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FABRIC_CARDS, FABRIC_SECTION } from "@/constants/fabric";
import { FabricCard } from "@/components/ui/fabric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import "swiper/css";

export function FabricSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="section-padding bg-white" aria-labelledby="fabric-heading">
      <div className="container-saukhya">
        <SectionHeading
          id="fabric-heading"
          title={FABRIC_SECTION.title}
          subtitle={FABRIC_SECTION.subtitle}
        />
      </div>

      <Reveal from="right" distance={40} delay={0.05} className="relative mt-8 w-full md:mt-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={FABRIC_CARDS.length > 3}
          loopAdditionalSlides={FABRIC_CARDS.length}
          slidesPerGroup={1}
          speed={800}
          spaceBetween={0}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 0 },
            1024: { slidesPerView: 4, spaceBetween: 0 },
            1280: { slidesPerView: 4, spaceBetween: 0 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay?.start();
          }}
          className="fabric-carousel !w-full !overflow-hidden"
        >
          {FABRIC_CARDS.map((fabric) => (
            <SwiperSlide key={fabric.id} className="!box-border !p-0">
              <FabricCard fabric={fabric} variant="carousel" className="h-full w-full" />
            </SwiperSlide>
          ))}
        </Swiper>

        {FABRIC_CARDS.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:left-5"
              aria-label="Previous fabrics"
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-saukhya-soft transition-transform hover:scale-105 md:right-5"
              aria-label="Next fabrics"
            >
              <IconChevronRight />
            </button>
          </>
        )}
      </Reveal>
    </section>
  );
}
