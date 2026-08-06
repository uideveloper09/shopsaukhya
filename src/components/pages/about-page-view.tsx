"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CDN_BASE } from "@/constants/brand";
import { ABOUT_PAGE } from "@/constants/content-pages";
import { ButtonLink } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
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
    <main className="w-full overflow-x-hidden bg-saukhya-warm">
      {/* Hero — one composition, brand-forward */}
      <section className="relative min-h-[88vh] w-full overflow-hidden md:min-h-[92vh]">
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

        <div className="container-saukhya relative z-10 flex min-h-[88vh] flex-col justify-end pb-14 pt-28 md:min-h-[92vh] md:pb-20 md:pt-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-saukhya-gold">
              {content.kicker}
            </p>
            <h1
              className="mt-5 text-[2.35rem] font-medium leading-[1.12] tracking-tight text-white md:text-5xl lg:text-[3.4rem]"
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
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/shop" size="lg">
                Shop The Collection
              </ButtonLink>
              <AppLink
                href="/contact"
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 transition-colors hover:text-saukhya-gold"
              >
                Talk to us →
              </AppLink>
            </div>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 text-[10px] uppercase tracking-[0.32em] text-white/55 md:mt-16"
          >
            Embrace Tranquility
          </motion.p>
        </div>
      </section>

      {/* Values — editorial strip, not card grid */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-saukhya-pink/[0.04] blur-3xl"
        />
        <div className="container-saukhya">
          <Reveal from="top" className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
              How we design
            </p>
            <h2
              className="mt-4 text-3xl font-medium text-saukhya-maroon md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Quiet luxury, made wearable
            </h2>
          </Reveal>

          <RevealStagger
            className="mt-14 grid gap-0 md:grid-cols-3"
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

      {/* Point of view + imagery */}
      <section className="relative overflow-hidden section-padding floral-decoration">
        <div className="container-saukhya">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal from="left" className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <motion.div
                  aria-hidden
                  className="absolute -bottom-6 -left-6 h-full w-full border border-saukhya-gold/40"
                  initial={reduceMotion ? false : { opacity: 0, x: -12, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease, delay: 0.2 }}
                />
                <div className="relative aspect-[4/5] overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.04 }
                    }
                    transition={{ duration: 0.8, ease }}
                  >
                    <Image
                      src={cdn(secondaryImage.src)}
                      alt={secondaryImage.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute -bottom-5 right-4 bg-white px-5 py-4 shadow-saukhya-soft md:right-6"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.35 }}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
                    Brand promise
                  </p>
                  <p
                    className="mt-1 text-base font-medium text-saukhya-maroon"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {content.signature.title}
                  </p>
                </motion.div>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.1} className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-pink">
                {content.pointOfView.kicker}
              </p>
              <h2
                className="mt-4 max-w-xl text-[1.85rem] font-medium leading-[1.25] text-saukhya-maroon md:text-4xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {content.pointOfView.title}
              </h2>
              <div className="mt-5 h-px w-14 bg-gradient-to-r from-saukhya-gold to-transparent" />
              <p className="mt-6 max-w-xl text-base leading-[1.85] text-saukhya-muted md:text-[17px]">
                {content.pointOfView.copy}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-saukhya-muted md:text-base">
                {content.signature.copy}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Craft journey */}
      <section className="border-t border-saukhya-border/60 bg-[#fff9fb] py-16 md:py-24">
        <div className="container-saukhya">
          <Reveal from="bottom" className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
              From cloth to closet
            </p>
            <h2
              className="mt-4 text-3xl font-medium text-saukhya-maroon md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A slower way to make clothes
            </h2>
          </Reveal>

          <div className="relative mx-auto mt-14 max-w-4xl">
            <div
              aria-hidden
              className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-saukhya-gold via-saukhya-pink/40 to-transparent md:left-1/2 md:-translate-x-px"
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
                      className={`relative flex items-start gap-5 md:items-center md:gap-0 ${
                        fromRight ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-1 ${fromRight ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}
                      >
                        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-pink">
                          Step {index + 1}
                        </p>
                        <p
                          className="mt-2 text-lg font-medium text-saukhya-text md:text-xl"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {step}
                        </p>
                      </div>
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saukhya-maroon text-xs font-medium text-white shadow-[0_8px_24px_rgba(92,34,56,0.28)] md:absolute md:left-1/2 md:-translate-x-1/2">
                        {index + 1}
                      </span>
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
