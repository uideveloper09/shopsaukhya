import { cn } from "@/lib/utils";

interface CarouselPartitionProps {
  className?: string;
  variant?: "hero" | "default";
}

export function CarouselPartition({
  className,
  variant = "hero",
}: CarouselPartitionProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center",
        isHero ? "w-5 md:w-7" : "w-4 md:w-5",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "w-px bg-gradient-to-b from-transparent via-saukhya-gold/30 to-saukhya-pink/20",
          isHero ? "h-6 md:h-8" : "h-4",
        )}
      />

      <span className="my-1 block h-1 w-1 rotate-45 rounded-sm bg-saukhya-gold/70" />

      <span
        className={cn(
          "relative w-px bg-gradient-to-b from-saukhya-pink/25 via-saukhya-gold/55 to-saukhya-pink/25",
          isHero ? "h-14 md:h-20 lg:h-24" : "h-10 md:h-14",
        )}
      >
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-saukhya-gold/40 bg-saukhya-warm" />
      </span>

      <span className="my-1 text-[9px] leading-none text-saukhya-pink/35">✦</span>

      <span className="my-0.5 block h-1 w-1 rotate-45 rounded-sm bg-saukhya-gold/70" />

      <span
        className={cn(
          "w-px bg-gradient-to-b from-saukhya-pink/20 via-saukhya-gold/30 to-transparent",
          isHero ? "h-6 md:h-8" : "h-4",
        )}
      />
    </div>
  );
}

interface CarouselSlideFrameProps {
  children: React.ReactNode;
  showPartition?: boolean;
  variant?: "hero" | "default";
}

export function CarouselSlideFrame({
  children,
  showPartition = true,
  variant = "hero",
}: CarouselSlideFrameProps) {
  return (
    <div className="flex h-full items-stretch">
      <div className="min-w-0 flex-1">{children}</div>
      {showPartition && <CarouselPartition variant={variant} />}
    </div>
  );
}
