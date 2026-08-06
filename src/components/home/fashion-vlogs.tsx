"use client";

import Link from "next/link";
import { VLOG_CARDS } from "@/constants/editorial";
import { SectionHeading } from "@/components/ui/section-heading";
import { VlogEditorialCard } from "@/components/ui/vlog-editorial-card";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

const READ_MINUTES = [6, 5, 4, 5, 3] as const;

export function FashionVlogs() {
  const [featured, ...rest] = VLOG_CARDS;
  const stacked = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <section
      className="section-padding overflow-hidden bg-saukhya-warm-alt floral-decoration"
      aria-labelledby="vlogs-heading"
    >
      <div className="container-saukhya">
        <SectionHeading
          id="vlogs-heading"
          title="Fashion Vlogs"
          subtitle="Style guides, fabric tips, and editorial inspiration from the Saukhya studio"
        />

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal from="left" distance={40} className="lg:col-span-7">
            <VlogEditorialCard
              vlog={featured}
              variant="featured"
              readMinutes={READ_MINUTES[0]}
              priority
            />
          </Reveal>

          <RevealStagger
            className="flex flex-col gap-5 lg:col-span-5"
            delay={0.08}
            stagger={0.1}
          >
            {stacked.map((vlog, index) => (
              <RevealItem key={vlog.id} from="right" index={index} distance={32}>
                <VlogEditorialCard
                  vlog={vlog}
                  variant="stacked"
                  readMinutes={READ_MINUTES[index + 1]}
                  className="flex-1"
                />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        {grid.length > 0 && (
          <RevealStagger
            className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            delay={0.05}
            stagger={0.08}
          >
            {grid.map((vlog, index) => (
              <RevealItem key={vlog.id} index={index}>
                <VlogEditorialCard
                  vlog={vlog}
                  variant="grid"
                  readMinutes={READ_MINUTES[index + 3] ?? 4}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        )}

        <Reveal from="bottom" distance={24} delay={0.1} className="mt-8 flex justify-center md:mt-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 border border-saukhya-maroon/20 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-saukhya-maroon shadow-saukhya-soft transition-all hover:border-saukhya-pink/30 hover:text-saukhya-pink"
          >
            Explore all stories
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
