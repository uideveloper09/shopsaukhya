"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PAGE_READY_EVENT } from "@/components/motion/reveal";

/**
 * On client route changes (not the first paint), keep the boot loader off
 * and re-signal page-ready so section reveals still animate.
 */
export function SoftNavigation() {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }

    document.documentElement.classList.remove("saukhya-loading");
    window.dispatchEvent(new Event(PAGE_READY_EVENT));
  }, [pathname]);

  return null;
}
