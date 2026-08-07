import type { Metadata } from "next";
import { BRAND } from "@/constants/brand";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `This page isn't in the ${BRAND.name} collection. Return home to explore curated Indian wear.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[min(72vh,100svh)] w-full items-center justify-center overflow-x-clip floral-decoration">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,57,136,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(201,169,110,0.12),transparent_50%)]"
      />

      <div className="container-saukhya relative z-10 px-4 py-12 sm:py-16 md:py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-saukhya-gold md:text-[11px] md:tracking-[0.32em]">
            {BRAND.name}
          </p>

          <div className="mt-5 flex items-center gap-2.5 sm:mt-6 sm:gap-4">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rotate-45 bg-saukhya-maroon sm:h-2 sm:w-2"
            />
            <p
              className="font-serif text-[4.25rem] leading-none font-medium tracking-[0.06em] text-saukhya-maroon sm:text-[5.5rem] md:text-[8.5rem] md:tracking-[0.08em]"
              aria-hidden
            >
              404
            </p>
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rotate-45 bg-saukhya-maroon sm:h-2 sm:w-2"
            />
          </div>

          <div
            aria-hidden
            className="mt-2 h-px w-16 bg-gradient-to-r from-transparent via-saukhya-gold to-transparent sm:w-24"
          />

          <h1 className="mt-6 font-serif text-[1.65rem] font-medium tracking-tight text-saukhya-text sm:mt-8 sm:text-3xl md:text-4xl">
            This style wandered off
          </h1>

          <p className="mt-3 max-w-md px-1 text-sm leading-relaxed text-saukhya-muted sm:mt-4 md:text-base">
            The page you&apos;re looking for isn&apos;t in our collection. Head
            home and continue exploring curated Indian wear made for everyday
            ease.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:items-center">
            <ButtonLink href="/" size="lg" className="w-full sm:w-auto">
              Back to Home
            </ButtonLink>
            <ButtonLink
              href="/#bestsellers-heading"
              variant="outline"
              size="lg"
              className="w-full border-saukhya-maroon/20 text-saukhya-maroon hover:border-saukhya-pink/40 hover:text-saukhya-pink sm:w-auto"
            >
              Browse Styles
            </ButtonLink>
          </div>

          <p className="mt-10 text-[10px] uppercase tracking-[0.24em] text-saukhya-muted/80 sm:mt-12 sm:text-[11px] sm:tracking-[0.28em]">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </main>
  );
}
