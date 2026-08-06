import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
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

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-saukhya-md font-medium transition-all duration-250 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-saukhya-md font-medium transition-all duration-250",
        variants[variant ?? "primary"],
        sizes[size ?? "md"],
        className,
      )}
    >
      {children}
    </a>
  );
}
