import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/constants/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-7 w-auto md:h-8",
  md: "h-9 w-auto md:h-10",
  lg: "h-11 w-auto md:h-12",
};

export function Logo({ size = "md", className, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0", className)}
      aria-label={`${BRAND.name} — ${BRAND.tagline}`}
    >
      <Image
        src={BRAND.logoUrl}
        alt={`${BRAND.name} — ${BRAND.tagline}`}
        width={180}
        height={56}
        priority={priority}
        className={cn("object-contain object-left", sizeClasses[size])}
      />
    </Link>
  );
}
