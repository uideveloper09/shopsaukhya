"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SHOP_SORT_OPTIONS,
  type ShopSortMode,
} from "@/constants/shop";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@/components/ui/icons";

type ShopSortDropdownProps = {
  value: ShopSortMode;
  onChange: (value: ShopSortMode) => void;
  className?: string;
};

export function ShopSortDropdown({
  value,
  onChange,
  className,
}: ShopSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const reduceMotion = useReducedMotion();
  const selected =
    SHOP_SORT_OPTIONS.find((option) => option.value === value) ??
    SHOP_SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative shrink-0 border-b border-saukhya-border/50 bg-[#ebe4e0]",
        className,
      )}
    >
      <button
        type="button"
        id="shop-sort"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#e6ded9] md:px-5"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-muted">
          Sort
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <span
            className="truncate text-sm text-saukhya-maroon"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {selected.label}
          </span>
          <IconChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-saukhya-gold transition-transform duration-300",
              open ? "-rotate-90" : "rotate-90",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="listbox"
            aria-labelledby="shop-sort"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-20 origin-top border border-saukhya-border/60 border-t-0 bg-[#fffdfc] shadow-[0_18px_40px_rgba(31,26,28,0.12)]"
          >
            <div
              className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/45 to-transparent"
              aria-hidden
            />
            <ul className="py-1.5">
              {SHOP_SORT_OPTIONS.map((option) => {
                const active = option.value === value;
                return (
                  <li key={option.value} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors md:px-5",
                        active
                          ? "bg-[#f7f1ee] text-saukhya-maroon"
                          : "text-saukhya-muted hover:bg-[#faf6f4] hover:text-saukhya-text",
                      )}
                    >
                      <span
                        style={
                          active
                            ? { fontFamily: "var(--font-serif)" }
                            : undefined
                        }
                      >
                        {option.label}
                      </span>
                      {active ? (
                        <span
                          className="h-1.5 w-1.5 rotate-45 bg-saukhya-gold"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
