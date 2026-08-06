"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export const PAGE_READY_EVENT = "saukhya:page-ready";

/** Enter from this edge toward center. */
export type RevealFrom = "left" | "right" | "top" | "bottom";

const SIDE_CYCLE: RevealFrom[] = ["left", "right", "top", "bottom"];

const DISTANCE = 48;

export function offsetFor(from: RevealFrom, distance = DISTANCE) {
  switch (from) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "top":
      return { x: 0, y: -distance };
    case "bottom":
      return { x: 0, y: distance };
  }
}

export function sideForIndex(index: number): RevealFrom {
  return SIDE_CYCLE[index % SIDE_CYCLE.length];
}

export function usePageReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("saukhya-loading")) {
      setReady(true);
      return;
    }

    const onReady = () => setReady(true);
    window.addEventListener(PAGE_READY_EVENT, onReady);
    return () => window.removeEventListener(PAGE_READY_EVENT, onReady);
  }, []);

  return ready;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Prefer `from` for four-side entrances. Legacy x/y still work if `from` omitted. */
  from?: RevealFrom;
  y?: number;
  x?: number;
  distance?: number;
  once?: boolean;
} & Omit<
  HTMLMotionProps<"div">,
  "children" | "initial" | "animate" | "whileInView" | "ref"
>;

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  from,
  y,
  x,
  distance = DISTANCE,
  once = true,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = usePageReady();
  const inView = useInView(ref, {
    once,
    amount: 0.12,
    margin: "0px 0px -6% 0px",
  });
  const reduceMotion = useReducedMotion();
  const show = ready && inView;

  const offset = from
    ? offsetFor(from, distance)
    : { x: x ?? 0, y: y ?? distance };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={
        show
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{ duration, delay, ease: REVEAL_EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type RevealStaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
};

export function RevealStagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
}: RevealStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = usePageReady();
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -5% 0px",
  });
  const reduceMotion = useReducedMotion();
  const show = ready && inView;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  from,
  index = 0,
  distance = 36,
}: {
  children: ReactNode;
  className?: string;
  from?: RevealFrom;
  /** Used to auto-cycle left → right → top → bottom when `from` is omitted. */
  index?: number;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();
  const side = from ?? sideForIndex(index);
  const offset = offsetFor(side, distance);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.55, ease: REVEAL_EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
