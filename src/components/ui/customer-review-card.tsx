"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CustomerReviewDisplay } from "@/types/storefront";
import { isVideoFile } from "@/lib/customer-reviews";
import { cn } from "@/lib/utils";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { IconPlay, IconStar } from "@/components/ui/icons";

interface CustomerReviewCardProps {
  review: CustomerReviewDisplay;
  priority?: boolean;
  className?: string;
}

export function CustomerReviewCard({
  review,
  priority = false,
  className,
}: CustomerReviewCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const primaryMedia = review.media[0];
  const isVideo = primaryMedia?.type === "video";
  const thumbnail = primaryMedia?.thumbnailUrl ?? primaryMedia?.url ?? "";
  const activeMedia = review.media[activeMediaIndex] ?? primaryMedia;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  if (!primaryMedia) return null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-saukhya-lg bg-[#faf7f5] shadow-saukhya-soft ring-1 ring-black/[0.04]",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => {
            setActiveMediaIndex(0);
            setLightboxOpen(true);
          }}
          className="group/media relative aspect-[4/5] w-full overflow-hidden bg-[#f3eeeb]"
          aria-label={`View ${review.customerName}'s review ${isVideo ? "video" : "photo"}`}
        >
          <Image
            src={thumbnail}
            alt={`Review by ${review.customerName}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover/media:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

          {isVideo && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-saukhya-pink shadow-saukhya-soft transition-transform duration-300 group-hover/media:scale-105">
                <IconPlay className="ml-0.5 h-5 w-5" />
              </span>
            </span>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {isVideo ? "Video review" : "Customer photo"}
          </span>

          {review.media.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              +{review.media.length - 1} more
            </span>
          )}
        </button>

        <div className="relative flex flex-1 flex-col overflow-hidden p-4 md:p-5">
          <FashionPatternTexture variant="card" />

          <div className="relative z-10 flex flex-1 flex-col">
            <div className="mb-2 flex gap-0.5 text-saukhya-gold">
              {Array.from({ length: review.rating }).map((_, index) => (
                <IconStar key={index} filled className="h-3.5 w-3.5" />
              ))}
            </div>

            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-saukhya-muted">
              &ldquo;{review.reviewText}&rdquo;
            </p>

            {review.productName && (
              <p className="mt-2 line-clamp-1 text-[11px] font-medium text-saukhya-maroon/80">
                {review.productName}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3 border-t border-saukhya-border/70 pt-4">
              {review.customerAvatarUrl ? (
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={review.customerAvatarUrl}
                    alt={review.customerName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-saukhya-pink/10 text-sm font-medium text-saukhya-pink">
                  {review.customerName.charAt(0)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-saukhya-text">
                  {review.customerName}
                </p>
                {review.isVerified && (
                  <p className="text-[10px] uppercase tracking-[0.14em] text-saukhya-success">
                    Verified purchase
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {lightboxOpen && activeMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Customer review media"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-saukhya-text shadow-sm"
            aria-label="Close review media"
          >
            ✕
          </button>

          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-saukhya-lg bg-black shadow-saukhya-hover"
            onClick={(event) => event.stopPropagation()}
          >
            {activeMedia.type === "video" && isVideoFile(activeMedia.url) ? (
              <video
                src={activeMedia.url}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-full object-contain"
              />
            ) : (
              <div className="relative aspect-[4/5] w-full bg-black md:aspect-[3/4]">
                <Image
                  src={activeMedia.url}
                  alt={`Review media by ${review.customerName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>
            )}

            {review.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-black/80 p-3">
                {review.media.map((item, index) => (
                  <button
                    key={`${item.url}-${index}`}
                    type="button"
                    onClick={() => setActiveMediaIndex(index)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                      activeMediaIndex === index
                        ? "border-saukhya-pink"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={item.thumbnailUrl ?? item.url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {item.type === "video" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                        <IconPlay className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
