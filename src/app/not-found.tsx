import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/constants/brand";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `This page isn't in the ${BRAND.name} collection. Return home to explore curated Indian wear.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[72vh] w-full items-center justify-center overflow-hidden floral-decoration">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,57,136,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(201,169,110,0.12),transparent_50%)]"
      />

      <div className="container-saukhya relative z-10 py-16 md:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
            {BRAND.name}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rotate-45 bg-saukhya-maroon"
            />
            <p
              className="font-serif text-[6.5rem] leading-none font-medium tracking-[0.08em] text-saukhya-maroon md:text-[8.5rem]"
              aria-hidden
            >
              404
            </p>
            <span
              aria-hidden
              className="inline-block h-2 w-2 rotate-45 bg-saukhya-maroon"
            />
          </div>

          <div
            aria-hidden
            className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-saukhya-gold to-transparent"
          />

          <h1 className="mt-8 font-serif text-3xl font-medium tracking-tight text-saukhya-text md:text-4xl">
            This style wandered off
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-saukhya-muted md:text-base">
            The page you&apos;re looking for isn&apos;t in our collection. Head
            home and continue exploring curated Indian wear made for everyday
            ease.
          </p>

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <ButtonLink href="/" size="lg" className="w-full sm:w-auto">
              Back to Home
            </ButtonLink>
            <Link
              href="/#bestsellers-heading"
              className="inline-flex items-center justify-center rounded-saukhya-md border border-saukhya-maroon/20 px-8 py-3.5 text-sm font-medium tracking-widest text-saukhya-maroon uppercase transition-colors duration-250 hover:border-saukhya-pink/40 hover:text-saukhya-pink"
            >
              Browse Styles
            </Link>
          </div>

          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-saukhya-muted/80">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </main>
  );
}
