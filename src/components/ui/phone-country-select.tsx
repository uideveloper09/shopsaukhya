"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PHONE_COUNTRIES,
  getPhoneCountry,
  type PhoneCountry,
} from "@/lib/phone-countries";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@/components/ui/icons";

function flagUrl(iso: string, width = 40) {
  return `https://flagcdn.com/w${width}/${iso.toLowerCase()}.png`;
}

function CountryFlag({
  iso,
  name,
  className,
  priority = false,
}: {
  iso: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // Tiny flag assets from flagcdn; plain img avoids next/image remote config.
    <img
      src={flagUrl(iso)}
      alt=""
      width={20}
      height={15}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(
        "h-[14px] w-[20px] shrink-0 object-cover shadow-[0_0_0_1px_rgba(31,26,28,0.08)]",
        className,
      )}
      title={name}
    />
  );
}

type PhoneCountrySelectProps = {
  value: string;
  onChange: (iso: string, country: PhoneCountry) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onOpenChange?: (open: boolean) => void;
  hasError?: boolean;
  /** Borderless trigger for use inside a shared phone field shell. */
  embedded?: boolean;
  className?: string;
};

export function PhoneCountrySelect({
  value,
  onChange,
  onFocus,
  onBlur,
  onOpenChange,
  hasError,
  embedded = false,
  className,
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();
  const reduceMotion = useReducedMotion();

  const selected = getPhoneCountry(value);

  const setMenuOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    setOpen((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      if (resolved !== prev) onOpenChange?.(resolved);
      return resolved;
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = Math.min(280, window.innerWidth - 16);
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(280, Math.max(140, available));
    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - menuWidth - 8),
    );

    if (openUp) {
      setMenuStyle({
        top: "auto",
        bottom: window.innerHeight - rect.top + 4,
        left,
        width: menuWidth,
        maxHeight,
      });
      return;
    }

    setMenuStyle({
      top: rect.bottom + 4,
      bottom: "auto",
      left,
      width: menuWidth,
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
      setMenuOpen(false);
      onBlur?.();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
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
  }, [open, onBlur]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <input type="hidden" name="phoneCountry" value={selected.iso} />
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Country code ${selected.name}`}
        onFocus={onFocus}
        onClick={() => {
          setMenuOpen((prev) => !prev);
          onFocus?.();
        }}
        className={cn(
          "flex h-full min-h-[46px] items-center gap-2 px-2.5 py-3 text-left text-xs outline-none transition-[background-color] sm:gap-2.5 sm:px-3 sm:text-sm",
          embedded
            ? cn(
                // Fixed width stops the number field from jumping when dial codes change length.
                "w-[7.75rem] shrink-0 border-0 bg-transparent sm:w-[8.5rem]",
                "hover:bg-black/[0.02]",
                "focus-visible:bg-transparent focus-visible:ring-0",
              )
            : cn(
                "min-w-[7.75rem] border border-r-0 bg-[#f3eeeb] sm:min-w-[8.5rem]",
                "hover:bg-[#efe8e4]",
                "focus-visible:border-saukhya-pink focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-saukhya-pink/25",
                open &&
                  "z-[1] border-saukhya-pink bg-white ring-1 ring-saukhya-pink/25",
                hasError
                  ? "border-red-400/70 bg-[#fff6f6]"
                  : "border-saukhya-maroon/20",
              ),
        )}
      >
        <CountryFlag iso={selected.iso} name={selected.name} priority />
        <span className="min-w-0 flex-1 truncate font-medium tracking-wide text-saukhya-text">
          {selected.iso}{" "}
          <span className="text-saukhya-muted">+{selected.dial}</span>
        </span>
        <IconChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-saukhya-gold transition-transform duration-300",
            open ? "-rotate-90" : "rotate-90",
          )}
          aria-hidden
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
                  className="fixed z-[90] overflow-hidden border border-saukhya-border/60 bg-[#fffdfc] shadow-[0_18px_40px_rgba(31,26,28,0.14)]"
                >
                  <div
                    className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/45 to-transparent"
                    aria-hidden
                  />
                  <ul className="max-h-[inherit] overflow-y-auto overscroll-contain py-1.5">
                    {PHONE_COUNTRIES.map((country) => {
                      const isActive = country.iso === selected.iso;
                      return (
                        <li key={country.iso} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => {
                              onChange(country.iso, country);
                              // Focus trigger before closing so the shared shell
                              // never drops its active state for a frame.
                              triggerRef.current?.focus();
                              setMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-[#f7f1ee] text-saukhya-maroon"
                                : "text-saukhya-muted hover:bg-[#faf6f4] hover:text-saukhya-text",
                            )}
                          >
                            <CountryFlag
                              iso={country.iso}
                              name={country.name}
                            />
                            <span className="min-w-0 flex-1 truncate">
                              <span
                                className="font-medium text-saukhya-text"
                                style={
                                  isActive
                                    ? { fontFamily: "var(--font-serif)" }
                                    : undefined
                                }
                              >
                                {country.iso}
                              </span>
                              <span className="ml-1.5 text-saukhya-muted">
                                +{country.dial}
                              </span>
                            </span>
                            <span className="hidden truncate text-[11px] text-saukhya-muted/80 sm:inline">
                              {country.name}
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
