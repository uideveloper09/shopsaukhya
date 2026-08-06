"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/storefront";
import { CDN_BASE } from "@/constants/brand";
import { formatPrice, getProductCardImage, getProductHref } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { IconPlay } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";

interface WatchAndBuyProps {
  featuredProduct?: Product;
}

export function WatchAndBuy({ featuredProduct }: WatchAndBuyProps) {
  const [playing, setPlaying] = useState(false);

  const product = featuredProduct;
  const imageUrl = product
    ? getProductCardImage(product)
    : `${CDN_BASE}/Banner/bahaar-slider-desktop-3.png`;

  return (
    <section className="section-padding bg-saukhya-warm-alt" aria-labelledby="watch-buy-heading">
      <div className="container-saukhya">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal from="left" distance={40} className="relative">
            <div className="relative aspect-video overflow-hidden rounded-saukhya-lg shadow-saukhya-soft">
              {playing ? (
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Saukhya fashion video"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src={`${CDN_BASE}/Banner/bahaar-slider-desktop-1.png`}
                    alt="Watch Saukhya collection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
                    aria-label="Play video"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-saukhya-pink shadow-saukhya-hover transition-transform hover:scale-105">
                      <IconPlay />
                    </span>
                  </button>
                </>
              )}
            </div>
          </Reveal>

          <Reveal from="right" distance={40} delay={0.08}>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-saukhya-pink">
              Shop The Look
            </p>
            <h2 id="watch-buy-heading" className="editorial-title mt-3">
              Watch & Buy
            </h2>
            <p className="mt-4 text-saukhya-muted">
              See our Bahaar Collection come to life — then shop the featured
              look directly from the runway to your wardrobe.
            </p>

            {product && (
              <div className="relative mt-8 flex gap-4 overflow-hidden rounded-saukhya-lg bg-[#faf7f5] p-4 shadow-saukhya-soft ring-1 ring-black/[0.04]">
                <FashionPatternTexture variant="card" />
                <div className="relative z-10 flex w-full gap-4">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-saukhya-sm">
                    <Image
                      src={imageUrl}
                      alt={product.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-xs text-saukhya-muted">{product.subCategoryName}</p>
                    <h3 className="font-medium">{product.productName}</h3>
                    <p className="mt-1 text-saukhya-pink">{formatPrice(product.finalAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="inline-flex items-center justify-center rounded-saukhya-md bg-saukhya-pink px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white shadow-saukhya-soft transition-all hover:bg-saukhya-pink-hover"
              >
                Watch Now
              </button>
              {product && (
                <ButtonLink href={getProductHref(product)} variant="outline">
                  Buy Now
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
