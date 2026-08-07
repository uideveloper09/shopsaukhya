"use client";

import Image from "next/image";
import { CDN_BASE } from "@/constants/brand";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { IconArrowTiltRight } from "@/components/ui/icons";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

const PILLARS = [
  {
    title: "Mindful Craft",
    description: "Consciously made in small batches",
  },
  {
    title: "Breathable Fabrics",
    description: "Cotton, linen & organza",
  },
  {
    title: "Artisan Detail",
    description: "Hand-finished embellishments",
  },
] as const;

export function AboutSection() {
  return (
    <section
      className="section-padding overflow-hidden bg-saukhya-warm-alt"
      aria-labelledby="about-heading"
    >
      <div className="container-saukhya">
        <SectionHeading
          id="about-heading"
          title="About Saukhya"
          subtitle="Luxury Indian fashion rooted in tranquility, craftsmanship, and ease"
        />

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <Reveal from="left" distance={44} className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -bottom-5 -left-5 h-full w-full rounded-tl-[2rem] rounded-br-[2rem] border border-saukhya-gold/35 bg-saukhya-gold/5"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md shadow-[0_24px_64px_rgba(92,34,56,0.12)]">
                <Image
                  src={`${CDN_BASE}/Banner/bahaar-slider-desktop-2.png`}
                  alt="Saukhya lifestyle — Bahaar Collection"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              <Reveal
                from="bottom"
                distance={20}
                delay={0.2}
                className="absolute -bottom-4 right-4 z-10 bg-white/95 px-4 py-3 shadow-[0_8px_32px_rgba(31,26,28,0.08)] backdrop-blur-sm md:right-6 md:px-5"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
                  Our Philosophy
                </p>
                <p
                  className="mt-1 text-sm font-medium text-saukhya-maroon md:text-base"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Embrace Tranquility
                </p>
              </Reveal>
            </div>
          </Reveal>

          <Reveal from="right" distance={44} delay={0.08} className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-saukhya-pink">
              Our Story
            </p>

            <h3
              className="mt-4 text-[1.65rem] font-medium leading-[1.35] tracking-tight text-saukhya-text md:text-3xl lg:text-[2rem] lg:leading-[1.3]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Easy Indian wear for bright days, soft evenings, and everyday
              celebrations.
            </h3>

            <div className="mt-6 h-px w-14 bg-gradient-to-r from-saukhya-gold via-saukhya-pink/60 to-transparent" />

            <p className="mt-6 max-w-xl text-base leading-[1.8] text-saukhya-muted md:text-[17px]">
              Saukhya — meaning tranquility — is a luxury Indian fashion brand
              rooted in mindful craftsmanship. Each piece blends breathable fabrics
              with contemporary silhouettes for the modern woman who values comfort
              and elegance in equal measure.
            </p>
            <p className="mt-4 max-w-xl text-base leading-[1.8] text-saukhya-muted">
              From hand-embroidered pearls on cotton kurta sets to airy organza
              tops, every creation tells a story of artisanal detail and effortless
              grace.
            </p>

            <RevealStagger
              className="mt-10 grid gap-6 border-y border-saukhya-border/80 py-8 sm:grid-cols-3"
              delay={0.1}
              stagger={0.08}
            >
              {PILLARS.map((pillar, index) => (
                <RevealItem key={pillar.title} index={index} distance={24}>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-gold">
                    0{index + 1}
                  </p>
                  <h4 className="mt-2 text-sm font-medium text-saukhya-text md:text-[15px]">
                    {pillar.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-saukhya-muted md:text-sm">
                    {pillar.description}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink
                href="/about"
                size="lg"
                className="rounded-sm bg-saukhya-maroon shadow-[0_8px_24px_rgba(92,34,56,0.22)] hover:bg-saukhya-maroon/90 hover:shadow-[0_12px_32px_rgba(92,34,56,0.28)]"
              >
                Discover Our Story
              </ButtonLink>
              <AppLink
                href="/shop"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
              >
                Shop The Collection
                <IconArrowTiltRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px" />
              </AppLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
