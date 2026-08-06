"use client";

import { useEffect } from "react";

const VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";

/**
 * Hard-lock page zoom across the whole site (pinch, ctrl+wheel, keyboard).
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
      document.documentElement.setAttribute("data-zoom-locked", "true");
    };

    lockViewport();

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    // iOS Safari gesture zoom
    document.addEventListener("gesturestart", prevent, { passive: false });
    document.addEventListener("gesturechange", prevent, { passive: false });
    document.addEventListener("gestureend", prevent, { passive: false });

    // Multi-touch pinch on any section
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    // Desktop trackpad / mouse zoom
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    // Keyboard zoom shortcuts
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (
        event.key === "+" ||
        event.key === "-" ||
        event.key === "=" ||
        event.key === "_" ||
        event.key === "0" ||
        event.code === "NumpadAdd" ||
        event.code === "NumpadSubtract"
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });

    const visualViewport = window.visualViewport;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    const onViewportChange = () => {
      if (!visualViewport) return;
      if (Math.abs(visualViewport.scale - 1) <= 0.001) return;

      lockViewport();
      // Some browsers need a second meta write to snap scale back
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        meta.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        );
        requestAnimationFrame(lockViewport);
        document.documentElement.style.width = "100%";
        document.body.style.width = "100%";
      }, 0);
    };

    visualViewport?.addEventListener("resize", onViewportChange);
    visualViewport?.addEventListener("scroll", onViewportChange);
    window.addEventListener("orientationchange", lockViewport);
    window.addEventListener("resize", lockViewport);

    return () => {
      clearTimeout(resetTimer);
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      visualViewport?.removeEventListener("resize", onViewportChange);
      visualViewport?.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("orientationchange", lockViewport);
      window.removeEventListener("resize", lockViewport);
    };
  }, []);

  return null;
}
