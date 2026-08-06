import { cn } from "@/lib/utils";

function SectionDiamond({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-[7px] w-[7px] shrink-0 rotate-45 bg-saukhya-maroon md:h-2 md:w-2",
        className,
      )}
    />
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
  showDiamonds?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  id,
  showDiamonds = true,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        isCenter ? "text-center" : "text-left",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 md:gap-4",
          isCenter ? "justify-center" : "justify-start",
        )}
      >
        {showDiamonds && <SectionDiamond />}

        <h2 id={id} className="section-title">
          {title}
        </h2>

        {showDiamonds && <SectionDiamond />}
      </div>

      {subtitle && (
        <p className={cn("section-subtitle", !isCenter && "mx-0 text-left")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
