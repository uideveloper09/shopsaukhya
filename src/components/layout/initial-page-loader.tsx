"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND } from "@/constants/brand";
import { PAGE_READY_EVENT } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 650;
const BOOT_KEY = "saukhya:booted";

/** Survives soft remounts within the same JS realm (client navigations). */
let bootCompleted = false;

function markBooted() {
  bootCompleted = true;
  try {
    sessionStorage.setItem(BOOT_KEY, "1");
  } catch {
    /* private mode */
  }
  document.documentElement.classList.remove("saukhya-loading");
  document.documentElement.dataset.saukhyaBooted = "1";
  window.dispatchEvent(new Event(PAGE_READY_EVENT));
}

function alreadyBooted() {
  if (bootCompleted) return true;
  try {
    if (sessionStorage.getItem(BOOT_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  return document.documentElement.dataset.saukhyaBooted === "1";
}

/**
 * First hard load only. Soft App Router navigations must never show this again.
 */
export function InitialPageLoader() {
  // Always false on first paint so remounts during client navigation never flash a full-screen loader.
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (alreadyBooted()) {
      markBooted();
      return;
    }

    const started = performance.now();
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    document.documentElement.classList.add("saukhya-loading");
    setShow(true);

    const beginExit = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));

      startTimer = setTimeout(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          setExiting(true);
          markBooted();
        });
      }, wait);
    };

    if (document.readyState === "complete") {
      beginExit();
    } else {
      window.addEventListener("load", beginExit, { once: true });
    }

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      window.removeEventListener("load", beginExit);
    };
  }, []);

  if (!show) return null;

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
        setShow(false);
      }}
    >
      <div className={cn("saukhya-loader-logo px-6", exiting && "is-frozen")}>
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
