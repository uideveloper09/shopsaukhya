"use client";

import { useState } from "react";
import Image from "next/image";
import { CDN_BASE } from "@/constants/brand";
import { HOME_FAQ_ITEMS } from "@/constants/faq";
import { IconArrowTiltRight, IconHeart } from "@/components/ui/icons";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";

const WHY_SHOP_IMAGE = `${CDN_BASE}/ProductImg/16/optimized/8df4f032-471c-476d-842b-98a70ada71cf_2-detail.jpg`;

function FaqPlusIcon({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-saukhya-pink/25 text-saukhya-pink transition-all duration-300",
        open && "rotate-45 border-saukhya-pink bg-saukhya-pink/5",
      )}
      aria-hidden
    >
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1v12M1 7h12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function SectionDiamond({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-saukhya-gold",
        className,
      )}
    />
  );
}

function NewsletterFloralIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      aria-hidden
      className={cn("text-saukhya-pink/40", className)}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M108 228c-2-18 6-34 18-46 8-8 12-18 10-30-8 4-16 2-22-6-4 10-12 16-22 16 2 12-2 24-10 32 8-2 16-2 24 2 6-8 14-12 22-10-2 10 2 20 8 28 4-10 10-18 18-22-6-8-8-18-4-28"
          strokeWidth="1.1"
        />
        <path d="M98 118v110M118 132v96" strokeWidth="1" />
        <path d="M72 156c10-6 20-6 30 0M84 188c8 5 16 5 24 0" strokeWidth="0.9" />
        <circle cx="98" cy="98" r="10" strokeWidth="1" />
        <circle cx="72" cy="118" r="8" strokeWidth="1" />
        <circle cx="128" cy="112" r="9" strokeWidth="1" />
        <circle cx="88" cy="72" r="7" strokeWidth="1" />
      </g>
    </svg>
  );
}

function NewsletterPanel() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <Reveal
      from="right"
      distance={36}
      delay={0.12}
      className="relative flex h-full flex-col justify-center overflow-hidden rounded-[1.25rem] bg-[#fff0f3] px-6 py-10 sm:px-7 sm:py-11 lg:px-8 lg:py-12"
      aria-labelledby="newsletter-heading"
    >
      <FashionPatternTexture />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 z-[1] h-56 w-44 -translate-y-1/2 opacity-70 lg:h-64 lg:w-48"
      >
        <NewsletterFloralIllustration className="h-full w-full" />
      </div>

      <div className="relative z-10">
        <h2
          id="newsletter-heading"
          className="text-[1.55rem] font-medium leading-tight text-saukhya-maroon md:text-[1.65rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Stay in the loop
        </h2>
        <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-saukhya-maroon/85">
          Subscribe for style updates, offers and inspiration.
        </p>

        <form onSubmit={handleSubscribe} className="mt-7">
          <div className="flex overflow-hidden rounded-lg border border-saukhya-border/60 bg-white shadow-[0_2px_12px_rgba(92,34,56,0.06)]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-saukhya-maroon outline-none placeholder:text-saukhya-maroon/35"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="flex w-12 shrink-0 items-center justify-center bg-saukhya-pink text-white transition-colors hover:bg-saukhya-pink-hover"
              aria-label="Subscribe"
            >
              <IconArrowTiltRight className="h-4 w-4" />
            </button>
          </div>

          <Button type="submit" size="lg" className="mt-4 w-full rounded-lg">
            Join Saukhya
          </Button>
        </form>

        <ButtonLink
          href="/wishlist"
          variant="outline"
          size="lg"
          className="mt-3 w-full rounded-lg"
        >
          <span className="inline-flex items-center gap-2">
            <IconHeart className="h-4 w-4" />
            View Wishlist
          </span>
        </ButtonLink>
      </div>
    </Reveal>
  );
}

export function WhyShopSection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <section
      className="section-padding bg-[#fffcfb]"
      aria-labelledby="why-shop-heading"
    >
      <div className="container-saukhya">
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,0.88fr)] lg:gap-5">
          {/* Left — text + image in one cream block */}
          <Reveal
            from="left"
            distance={40}
            className="overflow-hidden rounded-2xl bg-[#faf7f5] shadow-[0_4px_24px_rgba(31,26,28,0.05)]"
          >
            <div className="grid min-h-[380px] grid-cols-1 sm:grid-cols-[1.08fr_0.92fr]">
              <div className="flex flex-col justify-center px-7 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saukhya-pink">
                  Why Shop With Saukhya?
                </p>
                <h2
                  id="why-shop-heading"
                  className="mt-4 text-[1.55rem] font-medium leading-[1.28] text-saukhya-maroon md:text-[1.7rem] lg:text-[1.85rem] lg:leading-[1.26]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Easy Indian wear for bright days, soft evenings, and everyday
                  celebrations.
                </h2>
                <p className="mt-5 text-[13px] leading-[1.8] text-saukhya-muted md:text-sm md:leading-[1.85]">
                  At Saukhya, every piece begins with exceptional fabric.
                  Thoughtfully designed for softness, ease and versatility, our
                  collections are made to be worn often, loved deeply, and lived
                  in comfortably.
                </p>
              </div>

              <div className="relative min-h-[280px] bg-[#faf7f5] sm:min-h-full">
                <Image
                  src={WHY_SHOP_IMAGE}
                  alt="Elira Cotton Kurta Set — Saukhya Indian wear"
                  fill
                  sizes="(max-width: 640px) 100vw, 28vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            from="bottom"
            distance={36}
            delay={0.08}
            className="relative flex flex-col justify-center overflow-hidden rounded-[1.25rem] border border-[#e6e0dc] bg-[#faf7f5] px-6 py-8 shadow-[0_8px_32px_rgba(31,26,28,0.04)] sm:px-7 sm:py-9 lg:px-8 lg:py-10"
          >
            <FashionPatternTexture variant="card" />

            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <SectionDiamond className="bg-saukhya-maroon" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-saukhya-maroon">
                  Questions
                </p>
              </div>

              {HOME_FAQ_ITEMS.map((item) => {
                const isOpen = openFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className="border-b border-[#eeeae7] last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 py-[18px] text-left transition-colors hover:text-saukhya-maroon md:py-5"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[13px] font-semibold leading-snug text-saukhya-text md:text-sm">
                        {item.question}
                      </span>
                      <FaqPlusIcon open={isOpen} />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-[18px] text-[13px] leading-relaxed text-saukhya-muted md:pb-5 md:text-sm">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Far right — newsletter */}
          <NewsletterPanel />
        </div>
      </div>
    </section>
  );
}
