"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { cn, toAppHref } from "@/lib/utils";

type LinkProps = ComponentProps<typeof Link>;

function isExternalHref(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("//")
  );
}

/**
 * Soft-navigates internal routes via the App Router.
 * Absolute same-origin / legacy hash URLs are normalized first.
 */
export function AppLink({
  href,
  className,
  children,
  onClick,
  ...rest
}: Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const normalized = toAppHref(href);

  if (isExternalHref(normalized)) {
    return (
      <a
        href={normalized}
        className={className}
        rel={normalized.startsWith("http") ? "noopener noreferrer" : undefined}
        onClick={
          onClick as ((event: MouseEvent<HTMLAnchorElement>) => void) | undefined
        }
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={normalized}
      className={cn(className)}
      prefetch
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
}
