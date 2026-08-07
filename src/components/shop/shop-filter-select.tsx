"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@/components/ui/icons";

export type ShopFilterOption = {
  value: string;
  label: string;
};

type ShopFilterSelectProps = {
  label: string;
  value: string;
  options: ShopFilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ShopFilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
}: ShopFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();
  const reduceMotion = useReducedMotion();

  const selected = options.find((option) => option.value === value);
  const active = Boolean(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(240, Math.max(120, available));

    if (openUp) {
      setMenuStyle({
        top: "auto",
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: Math.min(rect.width, window.innerWidth - 16),
        maxHeight,
      });
      return;
    }

    setMenuStyle({
      top: rect.bottom + 4,
      bottom: "auto",
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      width: Math.min(rect.width, window.innerWidth - 16),
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative block">
      <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex min-h-11 w-full items-center gap-2 border bg-[#faf6f4] px-3.5 py-2.5 text-left text-sm outline-none transition",
          "hover:border-saukhya-pink/40 hover:bg-white",
          "focus-visible:border-saukhya-pink focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-saukhya-pink/25",
          open && "border-saukhya-pink bg-white ring-1 ring-saukhya-pink/25",
          active
            ? "border-saukhya-pink/50 text-saukhya-maroon"
            : "border-saukhya-maroon/20 text-saukhya-text",
        )}
      >
        <span
          className={cn("min-w-0 flex-1 truncate", !selected && "text-saukhya-muted")}
          style={selected ? { fontFamily: "var(--font-serif)" } : undefined}
        >
          {selected?.label ?? placeholder}
        </span>
        <IconChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-saukhya-gold transition-transform duration-300",
            open ? "-rotate-90" : "rotate-90",
          )}
        />
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={menuRef}
                  id={listId}
                  role="listbox"
                  aria-labelledby={triggerId}
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={menuStyle}
                  className="fixed z-[80] overflow-hidden border border-saukhya-border/60 bg-[#fffdfc] shadow-[0_18px_40px_rgba(31,26,28,0.14)]"
                >
                  <div
                    className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/45 to-transparent"
                    aria-hidden
                  />
                  <ul className="max-h-[inherit] overflow-y-auto overscroll-contain py-1.5 scrollbar-none">
                    {options.map((option) => {
                      const isActive = option.value === value;
                      return (
                        <li key={option.value || "all"} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              onChange(option.value);
                              setOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-[#f7f1ee] text-saukhya-maroon"
                                : "text-saukhya-muted hover:bg-[#faf6f4] hover:text-saukhya-text",
                            )}
                          >
                            <span
                              className="truncate"
                              style={
                                isActive
                                  ? { fontFamily: "var(--font-serif)" }
                                  : undefined
                              }
                            >
                              {option.label}
                            </span>
                            {isActive ? (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rotate-45 bg-saukhya-gold"
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
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
