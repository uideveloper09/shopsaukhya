"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/storefront";
import {
  cn,
  extractFabricFromProduct,
  formatPrice,
  getAvailableSizes,
  getProductCardImage,
  getProductHref,
} from "@/lib/utils";
import { trackRecentlyViewed } from "@/lib/recently-viewed";
import { IconHeart, IconStar } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  showQuickAdd?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  showQuickAdd = true,
  className,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = has(product.productCode);
  const sizes = getAvailableSizes(product.objSizes);
  const fabric = extractFabricFromProduct(product);
  const imageUrl = getProductCardImage(product);
  const href = getProductHref(product);

  const handleAddToBag = () => {
    const size = selectedSize ?? sizes[0];
    if (size) addItem(product.productCode, size);
  };

  const handleProductView = () => {
    trackRecentlyViewed(product);
  };

  return (
    <article
      className={cn("group relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSelectedSize(null);
      }}
    >
      <div className="relative overflow-hidden rounded-saukhya-lg bg-white shadow-saukhya-soft">
        <Link href={href} className="block" onClick={handleProductView}>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.productName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-300",
                hovered && "scale-105",
              )}
            />
            {product.discountPercent > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-saukhya-pink px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                {Math.round(product.discountPercent)}% Off
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={() => toggle(product.productCode)}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors",
            isWishlisted ? "text-saukhya-pink" : "text-saukhya-muted hover:text-saukhya-pink",
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <IconHeart filled={isWishlisted} className="h-4 w-4" />
        </button>

        {showQuickAdd && variant === "default" && (
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-0 bottom-0 z-10 rounded-b-saukhya-lg bg-white p-4 shadow-saukhya-card"
              >
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-saukhya-muted">
                  Quick Add
                </p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[36px] rounded-md border px-2 py-1 text-xs transition-colors",
                        selectedSize === size
                          ? "border-saukhya-pink bg-saukhya-pink/5 text-saukhya-pink"
                          : "border-saukhya-border hover:border-saukhya-pink/40",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="mb-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-saukhya-muted">
                  <span>Fabric: {fabric}</span>
                  <span>Fit: Regular</span>
                  <span>Length: Standard</span>
                  <span>Sleeve: Full</span>
                </div>
                {product.discountLabel && (
                  <p className="mb-2 text-[11px] text-saukhya-success">
                    {product.discountLabel}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={handleAddToBag}>
                    Add To Bag
                  </Button>
                  <Link
                    href={href}
                    onClick={handleProductView}
                    className="flex flex-1 items-center justify-center rounded-saukhya-md border border-saukhya-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-saukhya-pink/40"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-0.5 text-saukhya-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} filled className="h-3 w-3" />
          ))}
        </div>
        <Link href={href} onClick={handleProductView}>
          <h3 className="line-clamp-1 text-sm font-medium transition-colors hover:text-saukhya-pink">
            {product.productName}
          </h3>
        </Link>
        <p className="text-xs text-saukhya-muted">{product.subCategoryName}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{formatPrice(product.finalAmount)}</span>
          {product.discountPercent > 0 && (
            <span className="text-sm text-saukhya-muted line-through">
              {formatPrice(product.originalAmount)}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 pt-1">
          {["#ec3988", "#c9a96e", "#1f1a1c", "#fff8fb"].map((color) => (
            <span
              key={color}
              className="h-3.5 w-3.5 rounded-full border border-saukhya-border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
