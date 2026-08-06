"use client";

import { motion } from "framer-motion";
import { TRUST_ITEMS } from "@/constants/trust-items";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { TrustIcon } from "@/components/ui/icons";

export function TrustStrip() {
  return (
    <section
      className="relative overflow-hidden border-y border-saukhya-border bg-[#faf7f5] py-4 md:py-5"
      aria-label="Trust features"
    >
      <FashionPatternTexture variant="card" />

      <div className="container-saukhya relative z-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex flex-col items-center gap-2 rounded-saukhya-md px-3 py-2 text-center transition-shadow hover:shadow-saukhya-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saukhya-pink/5 text-saukhya-pink">
                <TrustIcon name={item.icon} />
              </span>
              <h3 className="text-xs font-medium uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-[11px] text-saukhya-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
