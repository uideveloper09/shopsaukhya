"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { usePrefersHover } from "@/hooks/use-prefers-hover";

/**
 * Desktop: hover opens the reveal sheet.
 * Mobile/touch: first tap opens the sheet; second tap proceeds (navigate).
 */
export function useCardReveal<T extends HTMLElement = HTMLElement>() {
  const prefersHover = usePrefersHover();
  const [active, setActive] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (prefersHover || !active) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [active, prefersHover]);

  const hoverBinders = prefersHover
    ? {
        onMouseEnter: () => setActive(true),
        onMouseLeave: () => setActive(false),
        onFocus: () => setActive(true),
        onBlur: () => setActive(false),
      }
    : {};

  const handleTapAction = useCallback(
    (event: MouseEvent, onProceed?: () => void) => {
      if (prefersHover) {
        onProceed?.();
        return true;
      }

      if (!active) {
        event.preventDefault();
        event.stopPropagation();
        setActive(true);
        return false;
      }

      onProceed?.();
      return true;
    },
    [active, prefersHover],
  );

  return {
    ref: ref as RefObject<T>,
    showSheet: active,
    prefersHover,
    hoverBinders,
    handleTapAction,
    setActive,
  };
}
