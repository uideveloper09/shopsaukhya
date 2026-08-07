import Link from "next/link";
import { cn, toAppHref } from "@/lib/utils";
import { IconArrowTiltRight } from "@/components/ui/icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  /** Right-tilt arrow after the label. Default true. */
  showArrow?: boolean;
}

const variants = {
  primary:
    "bg-saukhya-pink text-white hover:bg-saukhya-pink-hover shadow-saukhya-soft",
  secondary:
    "bg-saukhya-gold/15 text-saukhya-text hover:bg-saukhya-gold/25",
  outline:
    "border border-saukhya-pink/30 text-saukhya-pink hover:bg-saukhya-pink/5",
  ghost: "text-saukhya-text hover:bg-saukhya-pink/5",
};

const sizes = {
  sm: "px-4 py-2 text-xs tracking-wide uppercase",
  md: "px-6 py-2.5 text-sm tracking-wide uppercase",
  lg: "px-8 py-3.5 text-sm tracking-widest uppercase",
};

const linkBase =
  "group inline-flex items-center justify-center gap-2 rounded-saukhya-md font-medium transition-all duration-250";

function isExternalHref(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("//")
  );
}

function ButtonLabel({
  children,
  showArrow = true,
  size = "md",
}: {
  children: React.ReactNode;
  showArrow?: boolean;
  size?: ButtonProps["size"];
}) {
  const iconClass =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-3.5 w-3.5" : "h-3.5 w-3.5";

  return (
    <>
      <span>{children}</span>
      {showArrow ? (
        <IconArrowTiltRight
          className={cn(
            iconClass,
            "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px",
          )}
        />
      ) : null}
    </>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  showArrow = true,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        linkBase,
        "disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <ButtonLabel showArrow={showArrow} size={size}>
        {children}
      </ButtonLabel>
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  showArrow = true,
  children,
  prefetch = true,
  onClick,
}: {
  href: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  showArrow?: boolean;
  children: React.ReactNode;
  prefetch?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const classes = cn(
    linkBase,
    variants[variant ?? "primary"],
    sizes[size ?? "md"],
    className,
  );
  const normalized = toAppHref(href);
  const label = (
    <ButtonLabel showArrow={showArrow} size={size}>
      {children}
    </ButtonLabel>
  );

  if (isExternalHref(normalized)) {
    return (
      <a
        href={normalized}
        className={classes}
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={normalized}
      className={classes}
      prefetch={prefetch}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
