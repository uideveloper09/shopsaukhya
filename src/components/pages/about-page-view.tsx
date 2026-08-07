"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CDN_BASE } from "@/constants/brand";
import { ABOUT_PAGE } from "@/constants/content-pages";
import { ButtonLink } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconArrowTiltRight } from "@/components/ui/icons";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

const ease = [0.22, 1, 0.36, 1] as const;

function cdn(path: string) {
  return path.startsWith("http") ? path : `${CDN_BASE}${path}`;
}

export function AboutPageView() {
  const content = ABOUT_PAGE;
  const reduceMotion = useReducedMotion();
  const heroImage = content.signature.images[0];
  const secondaryImage = content.signature.images[1];

  return (
    <main className="w-full overflow-x-clip bg-saukhya-warm">
      {/* Hero — one composition, brand-forward */}
      <section className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[88vh] lg:min-h-[92vh]">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <Image
            src={cdn(heroImage.src)}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%]"
          />
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#1f1a1c]/78 via-[#5c2238]/55 to-[#1f1a1c]/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#1f1a1c]/70 via-transparent to-[#1f1a1c]/20"
        />

        <div className="container-saukhya relative z-10 flex min-h-[70vh] flex-col justify-end pb-10 pt-24 md:min-h-[88vh] md:pb-20 md:pt-32 lg:min-h-[92vh]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-2xl"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-saukhya-gold md:text-[11px] md:tracking-[0.36em]">
              {content.kicker}
            </p>
            <h1
              className="mt-4 text-[1.85rem] font-medium leading-[1.15] tracking-tight text-white sm:text-[2.15rem] md:mt-5 md:text-5xl lg:text-[3.4rem] lg:leading-[1.12]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {content.title}
            </h1>
            <motion.div
              aria-hidden
              className="mt-6 h-px origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/70 to-transparent"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.45 }}
            />
            <p className="mt-6 max-w-xl text-base leading-[1.85] text-white/85 md:text-[17px]">
              {content.intro}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
                Shop The Collection
              </ButtonLink>
              <AppLink
                href="/contact"
                className="group inline-flex min-h-11 items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 transition-colors hover:text-saukhya-gold sm:justify-start"
              >
                Talk to us
                <IconArrowTiltRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px" />
              </AppLink>
            </div>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 text-[10px] uppercase tracking-[0.32em] text-white/55 md:mt-16"
          >
            Embrace Tranquility
          </motion.p>
        </div>
      </section>

      {/* Values — editorial strip, not card grid */}
      <section className="relative overflow-hidden bg-white section-padding">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-saukhya-pink/[0.04] blur-3xl"
        />
        <div className="container-saukhya">
          <SectionHeading
            title="How we design"
            subtitle="Quiet luxury, made wearable"
          />

          <RevealStagger
            className="grid gap-0 md:grid-cols-3"
            stagger={0.12}
            delay={0.08}
          >
            {content.values.map((value, index) => (
              <RevealItem key={value.title} index={index}>
                <article
                  className={`group relative px-2 py-8 text-center md:px-8 md:py-4 ${
                    index > 0
                      ? "border-t border-saukhya-border/70 md:border-t-0 md:border-l"
                      : ""
                  }`}
                >
                  <motion.span
                    className="inline-block text-[11px] font-medium tracking-[0.28em] text-saukhya-pink"
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                  >
                    0{index + 1}
                  </motion.span>
                  <h3
                    className="mt-4 text-2xl font-medium text-saukhya-text transition-colors group-hover:text-saukhya-maroon"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {value.title}
                  </h3>
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-saukhya-muted md:text-[15px]">
                    {value.copy}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Point of view — same composition as home About */}
      <section
        className="section-padding overflow-hidden bg-saukhya-warm-alt"
        aria-labelledby="point-of-view-heading"
      >
        <div className="container-saukhya">
          <SectionHeading
            id="point-of-view-heading"
            title={content.pointOfView.kicker}
            subtitle="Luxury Indian fashion rooted in tranquility, craftsmanship, and ease"
          />

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-20">
            <Reveal from="left" distance={44} className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md px-1 lg:max-w-none lg:px-0">
                <div
                  aria-hidden
                  className="absolute -bottom-3 -left-3 h-full w-full rounded-tl-[2rem] rounded-br-[2rem] border border-saukhya-gold/35 bg-saukhya-gold/5 sm:-bottom-5 sm:-left-5"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md shadow-[0_24px_64px_rgba(92,34,56,0.12)]">
                  <Image
                    src={cdn(secondaryImage.src)}
                    alt={secondaryImage.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>

                <Reveal
                  from="bottom"
                  distance={20}
                  delay={0.2}
                  className="absolute -bottom-3 right-3 z-10 bg-white/95 px-3 py-2.5 shadow-[0_8px_32px_rgba(31,26,28,0.08)] backdrop-blur-sm sm:-bottom-4 sm:right-4 sm:px-4 sm:py-3 md:right-6 md:px-5"
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

            <Reveal
              from="right"
              distance={44}
              delay={0.08}
              className="lg:col-span-7"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-saukhya-pink">
                Our Story
              </p>

              <h3
                className="mt-4 text-[1.4rem] font-medium leading-[1.35] tracking-tight text-saukhya-text sm:text-[1.65rem] md:text-3xl lg:text-[2rem] lg:leading-[1.3]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {content.pointOfView.title}
              </h3>

              <div className="mt-6 h-px w-14 bg-gradient-to-r from-saukhya-gold via-saukhya-pink/60 to-transparent" />

              <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-saukhya-muted md:text-[17px]">
                {content.pointOfView.copy}
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-saukhya-muted md:text-base">
                {content.signature.copy}
              </p>

              <RevealStagger
                className="mt-8 grid gap-6 border-y border-saukhya-border/80 py-7 md:mt-10 md:grid-cols-3 md:py-8"
                delay={0.1}
                stagger={0.08}
              >
                {content.values.map((value, index) => (
                  <RevealItem key={value.title} index={index} distance={24}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-gold">
                      0{index + 1}
                    </p>
                    <h4 className="mt-2 text-sm font-medium text-saukhya-text md:text-[15px]">
                      {value.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-saukhya-muted md:text-sm">
                      {value.copy}
                    </p>
                  </RevealItem>
                ))}
              </RevealStagger>

              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <ButtonLink
                  href="/shop"
                  size="lg"
                  className="w-full rounded-sm bg-saukhya-maroon shadow-[0_8px_24px_rgba(92,34,56,0.22)] hover:bg-saukhya-maroon/90 hover:shadow-[0_12px_32px_rgba(92,34,56,0.28)] sm:w-auto"
                >
                  Shop The Collection
                </ButtonLink>
                <AppLink
                  href="/contact"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-maroon transition-colors hover:text-saukhya-pink sm:justify-start"
                >
                  Talk to us
                  <IconArrowTiltRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px" />
                </AppLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Craft journey */}
      <section className="border-t border-saukhya-border/60 bg-[#fff9fb] section-padding">
        <div className="container-saukhya">
          <SectionHeading
            title="From cloth to closet"
            subtitle="A slower way to make clothes"
          />

          <div className="relative mx-auto mt-4 max-w-4xl md:mt-6">
            <div
              aria-hidden
              className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-saukhya-gold via-saukhya-pink/40 to-transparent md:left-1/2 md:-translate-x-px"
            />
            <ul className="space-y-10 md:space-y-14">
              {content.craftSteps.map((step, index) => {
                const fromRight = index % 2 === 1;
                return (
                  <Reveal
                    key={step}
                    from={fromRight ? "right" : "left"}
                    delay={index * 0.06}
                  >
                    <li
                      className={`relative flex items-start gap-4 md:items-center md:gap-0 ${
                        fromRight ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saukhya-maroon text-xs font-medium text-white shadow-[0_8px_24px_rgba(92,34,56,0.28)] md:absolute md:left-1/2 md:-translate-x-1/2">
                        {index + 1}
                      </span>
                      <div
                        className={`min-w-0 flex-1 pt-0.5 ${
                          fromRight
                            ? "md:pl-12 md:pt-0 md:text-left"
                            : "md:pr-12 md:pt-0 md:text-right"
                        }`}
                      >
                        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-pink">
                          Step {index + 1}
                        </p>
                        <p
                          className="mt-2 text-lg font-medium leading-snug text-saukhya-text md:text-xl"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {step}
                        </p>
                      </div>
                      <div className="hidden flex-1 md:block" />
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <Reveal from="bottom" delay={0.15} className="mt-16 text-center">
            <ButtonLink href="/shop" size="lg">
              Explore Styles
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
