"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Soft swatch for newsletter background */
const NEWSLETTER_FABRIC = "/fabric/muslin.png";

type FashionPatternVariant = "newsletter" | "card";

interface FashionPatternTextureProps {
  className?: string;
  fabricSrc?: string;
  variant?: FashionPatternVariant;
}

const VARIANT_CONFIG: Record<
  FashionPatternVariant,
  { fabric: string; imageClass: string; overlay: ReactNode }
> = {
  newsletter: {
    fabric: NEWSLETTER_FABRIC,
    imageClass: "scale-110 object-cover opacity-[0.34] blur-[0.3px]",
    overlay: (
      <>
        <div className="absolute inset-0 bg-[#fff0f3]/62" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff0f3]/40 via-transparent to-[#fff0f3]/55" />
      </>
    ),
  },
  card: {
    fabric: NEWSLETTER_FABRIC,
    imageClass: "scale-110 object-cover opacity-[0.26] blur-[0.2px]",
    overlay: (
      <>
        <div className="absolute inset-0 bg-white/76" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-[#faf7f5]/45" />
      </>
    ),
  },
};

export function FashionPatternTexture({
  className,
  fabricSrc,
  variant = "newsletter",
}: FashionPatternTextureProps) {
  const config = VARIANT_CONFIG[variant];
  const src = fabricSrc ?? config.fabric;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={variant === "card" ? "320px" : "400px"}
        className={config.imageClass}
      />
      {config.overlay}
    </div>
  );
}
