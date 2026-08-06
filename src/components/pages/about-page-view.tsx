import Image from "next/image";
import { CDN_BASE } from "@/constants/brand";
import { ABOUT_PAGE } from "@/constants/content-pages";
import { ButtonLink } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

function cdn(path: string) {
  return path.startsWith("http") ? path : `${CDN_BASE}${path}`;
}

export function AboutPageView() {
  const content = ABOUT_PAGE;

  return (
    <main className="w-full floral-decoration">
      <section className="section-padding relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,57,136,0.07),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(201,169,110,0.1),transparent_45%)]"
        />

        <div className="container-saukhya relative">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal from="left" className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
                {content.kicker}
              </p>
              <h1
                className="mt-4 max-w-2xl text-[2rem] font-medium leading-[1.2] tracking-tight text-saukhya-maroon md:text-4xl lg:text-[2.75rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {content.title}
              </h1>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-saukhya-gold via-saukhya-pink/50 to-transparent" />
              <p className="mt-6 max-w-xl text-base leading-[1.8] text-saukhya-muted md:text-[17px]">
                {content.intro}
              </p>
            </Reveal>

            <Reveal from="right" delay={0.08} className="lg:col-span-5">
              <div
                className="overflow-hidden rounded-[1.25rem] bg-white shadow-saukhya-soft ring-1 ring-black/[0.04]"
                aria-label="Saukhya brand promise"
              >
                <div className="grid grid-cols-2 gap-1 bg-saukhya-warm-alt p-1">
                  {content.signature.images.map((image) => (
                    <div
                      key={image.src}
                      className="relative aspect-[3/4] overflow-hidden first:rounded-l-[1rem] last:rounded-r-[1rem]"
                    >
                      <Image
                        src={cdn(image.src)}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 45vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="px-5 py-5 md:px-6 md:py-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
                    Brand promise
                  </p>
                  <p
                    className="mt-2 text-lg font-medium text-saukhya-text md:text-xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {content.signature.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-saukhya-muted">
                    {content.signature.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-saukhya-border/70 bg-white/70 py-12 md:py-16">
        <div className="container-saukhya">
          <RevealStagger
            className="grid gap-8 md:grid-cols-3 md:gap-10"
            stagger={0.08}
          >
            {content.values.map((value, index) => (
              <RevealItem key={value.title} index={index}>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-gold">
                  0{index + 1}
                </p>
                <h2
                  className="mt-3 text-xl font-medium text-saukhya-text md:text-2xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {value.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-saukhya-muted md:text-[15px]">
                  {value.copy}
                </p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-saukhya">
          <Reveal
            from="bottom"
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-pink">
              {content.pointOfView.kicker}
            </p>
            <h2
              className="mt-4 text-2xl font-medium leading-snug text-saukhya-maroon md:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {content.pointOfView.title}
            </h2>
            <p className="mt-5 text-base leading-[1.8] text-saukhya-muted md:text-[17px]">
              {content.pointOfView.copy}
            </p>
          </Reveal>

          <RevealStagger
            className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3"
            delay={0.1}
            stagger={0.06}
          >
            {content.craftSteps.map((step, index) => (
              <RevealItem key={step} index={index}>
                <div className="flex h-full flex-col items-center gap-3 border border-saukhya-border/80 bg-white/80 px-4 py-6 text-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saukhya-maroon text-xs font-medium text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-saukhya-text">
                    {step}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/shop" size="lg">
              Shop The Collection
            </ButtonLink>
            <AppLink
              href="/contact"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
            >
              Contact Us →
            </AppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
