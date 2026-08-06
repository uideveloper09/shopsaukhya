"use client";

import { useEffect } from "react";

const VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover";

/**
 * Blocks mobile pinch / double-tap zoom and resets viewport if the browser
 * still changes scale (prevents the left-column + empty gutter layout).
 */
export function MobileViewportLock() {
  useEffect(() => {
    const meta =
      document.querySelector('meta[name="viewport"]') ??
      (() => {
        const el = document.createElement("meta");
        el.setAttribute("name", "viewport");
        document.head.appendChild(el);
        return el;
      })();

    const lockViewport = () => {
      meta.setAttribute("content", VIEWPORT_CONTENT);
    };

    lockViewport();

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture, {
      passive: false,
    });
    document.addEventListener("gesturechange", preventGesture, {
      passive: false,
    });
    document.addEventListener("gestureend", preventGesture, { passive: false });

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    const visualViewport = window.visualViewport;
    const onViewportChange = () => {
      if (!visualViewport) return;
      if (Math.abs(visualViewport.scale - 1) > 0.001) {
        lockViewport();
        // Nudge layout back to device width after forced browser zoom
        document.documentElement.style.width = "100%";
        document.body.style.width = "100%";
        window.scrollTo(0, window.scrollY);
      }
    };

    visualViewport?.addEventListener("resize", onViewportChange);
    visualViewport?.addEventListener("scroll", onViewportChange);
    window.addEventListener("orientationchange", lockViewport);

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchmove", onTouchMove);
      visualViewport?.removeEventListener("resize", onViewportChange);
      visualViewport?.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("orientationchange", lockViewport);
    };
  }, []);

  return null;
}
