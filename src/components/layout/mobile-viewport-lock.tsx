"use client";

import { useEffect } from "react";

const LOCKED_VIEWPORT =
  "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";

const OPEN_VIEWPORT =
  "width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover";

const MOBILE_QUERY = "(max-width: 1023px), (hover: none) and (pointer: coarse)";

/**
 * Lock pinch/page zoom on mobile only.
 * Desktop keeps browser zoom in / zoom out (Ctrl/Cmd + wheel, +/-).
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

    const media = window.matchMedia(MOBILE_QUERY);
    const listeners: Array<() => void> = [];

    const clearListeners = () => {
      while (listeners.length) listeners.pop()?.();
    };

    const setViewport = (content: string, locked: boolean) => {
      meta.setAttribute("content", content);
      if (locked) {
        document.documentElement.setAttribute("data-zoom-locked", "true");
      } else {
        document.documentElement.removeAttribute("data-zoom-locked");
      }
    };

    const applyMobileLock = () => {
      clearListeners();
      setViewport(LOCKED_VIEWPORT, true);

      const prevent = (event: Event) => {
        event.preventDefault();
      };

      document.addEventListener("gesturestart", prevent, { passive: false });
      document.addEventListener("gesturechange", prevent, { passive: false });
      document.addEventListener("gestureend", prevent, { passive: false });
      listeners.push(() => {
        document.removeEventListener("gesturestart", prevent);
        document.removeEventListener("gesturechange", prevent);
        document.removeEventListener("gestureend", prevent);
      });

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length > 1) event.preventDefault();
      };
      const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) event.preventDefault();
      };
      document.addEventListener("touchstart", onTouchStart, { passive: false });
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      listeners.push(() => {
        document.removeEventListener("touchstart", onTouchStart);
        document.removeEventListener("touchmove", onTouchMove);
      });

      const visualViewport = window.visualViewport;
      let resetTimer: ReturnType<typeof setTimeout> | undefined;

      const onViewportChange = () => {
        if (!visualViewport) return;
        if (Math.abs(visualViewport.scale - 1) <= 0.001) return;

        setViewport(LOCKED_VIEWPORT, true);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          meta.setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
          );
          requestAnimationFrame(() => setViewport(LOCKED_VIEWPORT, true));
          document.documentElement.style.width = "100%";
          document.body.style.width = "100%";
        }, 0);
      };

      const onOrientationOrResize = () => setViewport(LOCKED_VIEWPORT, true);

      visualViewport?.addEventListener("resize", onViewportChange);
      visualViewport?.addEventListener("scroll", onViewportChange);
      window.addEventListener("orientationchange", onOrientationOrResize);
      window.addEventListener("resize", onOrientationOrResize);
      listeners.push(() => {
        clearTimeout(resetTimer);
        visualViewport?.removeEventListener("resize", onViewportChange);
        visualViewport?.removeEventListener("scroll", onViewportChange);
        window.removeEventListener("orientationchange", onOrientationOrResize);
        window.removeEventListener("resize", onOrientationOrResize);
      });
    };

    const applyDesktopOpen = () => {
      clearListeners();
      setViewport(OPEN_VIEWPORT, false);
    };

    const sync = () => {
      if (media.matches) applyMobileLock();
      else applyDesktopOpen();
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      clearListeners();
      document.documentElement.removeAttribute("data-zoom-locked");
    };
  }, []);

  return null;
}
