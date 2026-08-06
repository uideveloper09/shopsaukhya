"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND } from "@/constants/brand";
import { PAGE_READY_EVENT } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 650;
const BOOT_KEY = "saukhya:booted";

export function InitialPageLoader() {
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Soft route changes keep the layout mounted; if we remount anyway,
    // skip the branded loader so it never feels like a full page reload.
    if (sessionStorage.getItem(BOOT_KEY) === "1") {
      document.documentElement.classList.remove("saukhya-loading");
      window.dispatchEvent(new Event(PAGE_READY_EVENT));
      setMounted(false);
      return;
    }

    const started = performance.now();
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const beginExit = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));

      startTimer = setTimeout(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          setExiting(true);
          sessionStorage.setItem(BOOT_KEY, "1");
          window.dispatchEvent(new Event(PAGE_READY_EVENT));
        });
      }, wait);
    };

    document.documentElement.classList.add("saukhya-loading");

    if (document.readyState === "complete") {
      beginExit();
    } else {
      window.addEventListener("load", beginExit, { once: true });
    }

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      window.removeEventListener("load", beginExit);
      document.documentElement.classList.remove("saukhya-loading");
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "saukhya-initial-loader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-saukhya-warm",
        exiting && "is-exiting",
      )}
      aria-busy={!exiting}
      aria-live="polite"
      role="status"
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.propertyName !== "opacity") return;
        if (!exiting) return;
        document.documentElement.classList.remove("saukhya-loading");
        setMounted(false);
      }}
    >
      <div
        className={cn(
          "saukhya-loader-logo px-6",
          exiting && "is-frozen",
        )}
      >
        <Image
          src={BRAND.logoUrl}
          alt={`${BRAND.name} — ${BRAND.tagline}`}
          width={220}
          height={68}
          priority
          className="saukhya-loader-logo-img mx-auto h-12 w-auto object-contain md:h-14"
        />
      </div>
    </div>
  );
}
