"use client";

import { TRUST_ITEMS } from "@/constants/trust-items";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { TrustIcon } from "@/components/ui/icons";
import { RevealStagger, RevealItem } from "@/components/motion/reveal";

export function TrustStrip() {
  return (
    <section
      className="relative overflow-hidden border-y border-saukhya-border bg-[#faf7f5] py-4 md:py-5"
      aria-label="Trust features"
    >
      <FashionPatternTexture variant="card" />

      <div className="container-saukhya relative z-10">
        <RevealStagger
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          stagger={0.05}
        >
          {TRUST_ITEMS.map((item, index) => (
            <RevealItem key={item.id} index={index} distance={28}>
              <div className="flex flex-col items-center gap-2 rounded-saukhya-md px-3 py-2 text-center transition-shadow hover:shadow-saukhya-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saukhya-pink/5 text-saukhya-pink">
                  <TrustIcon name={item.icon} />
                </span>
                <h3 className="text-xs font-medium uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] text-saukhya-muted">{item.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
