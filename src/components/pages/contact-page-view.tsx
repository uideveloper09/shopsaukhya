"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CDN_BASE } from "@/constants/brand";
import { CONTACT_PAGE } from "@/constants/content-pages";
import { FOOTER_LINKS } from "@/constants/footer";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconArrowTiltRight } from "@/components/ui/icons";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import {
  normalizeContactPayload,
  validateContactPayload,
  type ContactFormErrors,
  type ContactSubmitResult,
} from "@/lib/contact-form";

const ease = [0.22, 1, 0.36, 1] as const;

function cdn(path: string) {
  return path.startsWith("http") ? path : `${CDN_BASE}${path}`;
}

const fieldClass =
  "w-full rounded-none border border-saukhya-maroon/20 bg-[#faf6f4] px-3.5 py-3 text-sm text-saukhya-text outline-none transition placeholder:text-saukhya-muted/80 focus:border-saukhya-pink focus:bg-white focus:ring-1 focus:ring-saukhya-pink/25";

const fieldErrorClass =
  "w-full rounded-none border border-red-400/70 bg-[#fff6f6] px-3.5 py-3 text-sm text-saukhya-text outline-none transition placeholder:text-saukhya-muted/80 focus:border-saukhya-pink focus:bg-white focus:ring-1 focus:ring-saukhya-pink/25";

function FieldErrorTooltip({ message }: { message: string }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 2, scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
      className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-20 max-w-[min(100%,18rem)]"
    >
      <span
        aria-hidden
        className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 bg-[#5c2238]"
      />
      <p className="relative rounded-sm bg-[#5c2238] px-3 py-2 text-[11px] leading-snug text-white shadow-[0_10px_24px_rgba(92,34,56,0.28)]">
        {message}
      </p>
    </motion.div>
  );
}

type HeroImage = { src: string; alt: string };

interface ContactPageViewProps {
  bannerImage?: HeroImage;
  heroImages?: HeroImage[];
}

export function ContactPageView({
  bannerImage,
  heroImages = [],
}: ContactPageViewProps) {
  const content = CONTACT_PAGE;
  const reduceMotion = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error">("ok");
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [focused, setFocused] = useState<string | null>(null);

  const banner: HeroImage =
    bannerImage ?? heroImages[0] ?? content.fashionStrip[1];
  const thumbs = (heroImages.length ? heroImages : content.fashionStrip).slice(
    0,
    3,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const payload = normalizeContactPayload({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    });

    const localErrors = validateContactPayload(payload);
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      setStatusTone("error");
      setStatusMessage("Please check the highlighted fields.");
      setSent(false);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setStatusMessage(null);
    setSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ContactSubmitResult;

      if (!res.ok || !data.success) {
        setFieldErrors(data.errors ?? {});
        setStatusTone("error");
        setStatusMessage(
          data.message ||
            "We could not send your message right now. Please try again.",
        );
        return;
      }

      if (data.delivery === "mailto" && data.mailto) {
        window.location.href = data.mailto;
      } else {
        formEl.reset();
      }

      setStatusTone("ok");
      setStatusMessage(
        data.message || "Thank you. Your message has been sent.",
      );
      setSent(true);
    } catch {
      setStatusTone("error");
      setStatusMessage(
        "We could not send your message right now. Please try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full overflow-x-hidden bg-saukhya-warm">
      {/* Full-bleed image banner with overlay design */}
      <section className="relative min-h-[48vh] w-full overflow-hidden md:min-h-[52vh]">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.7, ease }}
        >
          <Image
            src={cdn(banner.src)}
            alt={banner.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_22%]"
          />
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#1a1216]/82 via-[#5c2238]/55 to-[#1a1216]/28"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#120e10]/80 via-[#120e10]/15 to-[#120e10]/35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/55 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-8 top-8 border border-white/10 md:inset-x-12 md:bottom-10 md:top-10"
        />

        <div className="container-saukhya relative z-10 flex min-h-[48vh] flex-col justify-end pb-8 pt-20 md:min-h-[52vh] md:pb-10 md:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.15 }}
              className="max-w-2xl lg:col-span-7"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-saukhya-gold" />
                <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-saukhya-gold">
                  Saukhya · {content.kicker}
                </p>
              </div>
              <h1
                className="mt-5 text-[2.2rem] font-medium leading-[1.12] tracking-tight text-white md:text-[3rem] lg:text-[3.35rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {content.title}
              </h1>
              <motion.div
                aria-hidden
                className="mt-6 h-px w-24 origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/70 to-transparent"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.95, ease, delay: 0.4 }}
              />
              <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-white/82 md:text-base">
                {content.intro}
              </p>
              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.28em] text-white/50">
                Fit · Fabric · Size · Order care
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.35 }}
              className="lg:col-span-5 lg:justify-self-end"
            >
              <div className="border border-white/15 bg-white/[0.08] p-4 backdrop-blur-[6px] md:p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-saukhya-gold">
                  Trending now
                </p>
                <div className="mt-4 flex gap-3">
                  {thumbs.map((thumb, index) => (
                    <motion.div
                      key={`${thumb.src}-${index}`}
                      className="relative aspect-[3/4] flex-1 overflow-hidden bg-white/10 ring-1 ring-white/20"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.65,
                        ease,
                        delay: 0.45 + index * 0.08,
                      }}
                    >
                      <Image
                        src={cdn(thumb.src)}
                        alt={thumb.alt}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="relative pb-6 pt-8 md:pb-8 md:pt-10">
        <div className="container-saukhya">
          <RevealStagger
            className="grid gap-3 md:grid-cols-3 md:gap-4"
            stagger={0.1}
          >
            {content.channels.map((channel, index) => (
              <RevealItem key={channel.title} index={index}>
                <motion.a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4, transition: { duration: 0.35, ease } }
                  }
                  className="group block bg-white px-5 py-6 shadow-saukhya-soft ring-1 ring-black/[0.04] transition-shadow hover:shadow-saukhya-hover md:px-6 md:py-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
                      {channel.title}
                    </p>
                    <span
                      aria-hidden
                      className="text-saukhya-pink/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-saukhya-pink"
                    >
                      <IconArrowTiltRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p
                    className="mt-4 text-lg font-medium text-saukhya-text md:text-xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {channel.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-saukhya-muted">
                    {channel.copy}
                  </p>
                </motion.a>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Form + help — premium editorial correspondence */}
      <section className="relative overflow-hidden border-t border-saukhya-border/30 py-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#faf4f1_0%,#f6ebe7_48%,#f3e4df_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-10 h-72 w-72 bg-[radial-gradient(circle,rgba(201,169,110,0.14),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 bg-[radial-gradient(circle,rgba(92,34,56,0.07),transparent_70%)]"
        />

        <div className="container-saukhya relative">
          <SectionHeading
            title={content.form.kicker}
            subtitle={content.form.copy}
          />

          <div className="relative overflow-hidden border border-saukhya-border/50 bg-white/70 shadow-[0_24px_60px_rgba(92,34,56,0.06)] backdrop-blur-[2px]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 border border-saukhya-gold/15 md:inset-4"
            />

            <div className="relative grid lg:grid-cols-12">
              <Reveal from="left" className="lg:col-span-7">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative px-6 py-8 md:px-10 md:py-11 lg:px-12 lg:py-12"
                >
                  <div className="flex items-end justify-between gap-4">
                    <SectionHeading
                      align="left"
                      title={content.form.title}
                      className="mb-0"
                    />
                    <p className="hidden shrink-0 pb-1 text-right text-[10px] uppercase tracking-[0.22em] text-saukhya-muted/70 sm:block">
                      Reply in
                      <br />
                      business hours
                    </p>
                  </div>

                  <div className="relative z-0 mt-9 grid gap-8 sm:grid-cols-2">
                    {(
                      [
                        {
                          name: "name",
                          label: "Full name",
                          placeholder: "Your name",
                          full: true,
                          required: true,
                        },
                        {
                          name: "email",
                          label: "Email address",
                          placeholder: "you@example.com",
                          type: "email",
                          required: true,
                        },
                        {
                          name: "phone",
                          label: "Phone number",
                          placeholder: "10 digit mobile number",
                          type: "tel",
                        },
                        {
                          name: "subject",
                          label: "Subject",
                          placeholder:
                            "Order help, product question, collaboration...",
                          full: true,
                          required: true,
                        },
                      ] as const
                    ).map((field) => {
                      const required =
                        "required" in field ? Boolean(field.required) : false;
                      const error = fieldErrors[field.name];

                      return (
                        <div
                          key={field.name}
                          className={`relative ${"full" in field && field.full ? "sm:col-span-2" : ""}`}
                        >
                          <label className="mb-2 inline-flex items-start gap-1">
                            <span
                              className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                                focused === field.name
                                  ? "text-saukhya-pink"
                                  : error
                                    ? "text-red-600"
                                    : "text-saukhya-maroon/70"
                              }`}
                            >
                              {field.label}
                            </span>
                            {required ? (
                              <span
                                aria-hidden
                                className="-mt-0.5 text-[12px] font-semibold leading-none text-saukhya-pink"
                              >
                                *
                              </span>
                            ) : null}
                            <span className="sr-only">
                              {required ? "required" : "optional"}
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              name={field.name}
                              type={"type" in field ? field.type : "text"}
                              required={required}
                              aria-required={required}
                              placeholder={field.placeholder}
                              aria-invalid={Boolean(error)}
                              className={error ? fieldErrorClass : fieldClass}
                              onFocus={() => setFocused(field.name)}
                              onBlur={() => setFocused(null)}
                              onChange={() => {
                                if (!error) return;
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  delete next[field.name];
                                  return next;
                                });
                              }}
                            />
                            <AnimatePresence>
                              {error ? (
                                <FieldErrorTooltip
                                  key={`${field.name}-error`}
                                  message={error}
                                />
                              ) : null}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}

                    <div className="relative sm:col-span-2">
                      <label className="mb-2 inline-flex items-start gap-1">
                        <span
                          className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                            focused === "message"
                              ? "text-saukhya-pink"
                              : fieldErrors.message
                                ? "text-red-600"
                                : "text-saukhya-maroon/70"
                          }`}
                        >
                          Message
                        </span>
                        <span
                          aria-hidden
                          className="-mt-0.5 text-[12px] font-semibold leading-none text-saukhya-pink"
                        >
                          *
                        </span>
                        <span className="sr-only">required</span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          required
                          aria-required
                          rows={4}
                          placeholder="Tell us how we can help"
                          aria-invalid={Boolean(fieldErrors.message)}
                          className={`${fieldErrors.message ? fieldErrorClass : fieldClass} min-h-[120px] resize-y`}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          onChange={() => {
                            if (!fieldErrors.message) return;
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.message;
                              return next;
                            });
                          }}
                        />
                        <AnimatePresence>
                          {fieldErrors.message ? (
                            <FieldErrorTooltip
                              key="message-error"
                              message={fieldErrors.message}
                            />
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-5 border-t border-saukhya-border/50 pt-8">
                    <Button type="submit" size="lg" disabled={submitting}>
                      {submitting ? "Sending…" : "Send Message"}
                    </Button>
                    <AnimatePresence>
                      {statusMessage && (
                        <motion.p
                          key={statusMessage}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-sm ${
                            statusTone === "error"
                              ? "text-red-600"
                              : sent
                                ? "text-saukhya-maroon"
                                : "text-saukhya-muted"
                          }`}
                        >
                          {statusMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </Reveal>

              <Reveal from="right" delay={0.1} className="lg:col-span-5">
                <aside
                  className="relative h-full overflow-hidden bg-[#5c2238] px-6 py-8 text-white md:px-9 md:py-11 lg:px-10 lg:py-12"
                  aria-label="How Saukhya can help"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saukhya-gold/15 blur-2xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/50 to-transparent"
                  />

                  <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
                    How we help
                  </p>
                  <h3
                    className="mt-3 max-w-xs text-2xl font-medium leading-snug text-white md:text-[1.85rem]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Support that stays calm and clear
                  </h3>
                  <p className="mt-4 text-sm leading-[1.8] text-white/70">
                    {content.supportCard.copy}
                  </p>

                  <ul className="mt-9 space-y-0">
                    {content.help.map((item, index) => (
                      <motion.li
                        key={item.title}
                        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.55,
                          ease,
                          delay: 0.08 * index,
                        }}
                        className="border-t border-white/15 py-5"
                      >
                        <div className="flex gap-4">
                          <span
                            className="shrink-0 text-2xl font-medium text-saukhya-gold/80"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            0{index + 1}
                          </span>
                          <div>
                            <p className="text-[15px] font-medium tracking-wide text-white">
                              {item.title}
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                              {item.copy}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-6 space-y-3 border-t border-white/15 pt-7">
                    <AppLink
                      href={`tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, "")}`}
                      className="block text-sm font-medium tracking-wide text-white/90 transition-colors hover:text-saukhya-gold"
                    >
                      Call {FOOTER_LINKS.contact.phone}
                    </AppLink>
                    <AppLink
                      href={`mailto:${FOOTER_LINKS.contact.email}`}
                      className="block text-sm font-medium tracking-wide text-white/90 transition-colors hover:text-saukhya-gold"
                    >
                      {FOOTER_LINKS.contact.email}
                    </AppLink>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16 md:pb-24">
        <div className="container-saukhya">
          <Reveal from="bottom">
            <div className="overflow-hidden bg-white shadow-saukhya-soft ring-1 ring-black/[0.04]">
              <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5 md:px-8 md:py-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-saukhya-gold">
                    Studio base
                  </p>
                  <p
                    className="mt-2 text-xl font-medium text-saukhya-maroon md:text-2xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {FOOTER_LINKS.contact.address}
                  </p>
                </div>
                <a
                  href={FOOTER_LINKS.contact.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                >
                  Open in Maps
                  <IconArrowTiltRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px" />
                </a>
              </div>
              <div className="relative h-64 md:h-[22rem]">
                <iframe
                  title={`${FOOTER_LINKS.contact.mapQuery} map`}
                  src={FOOTER_LINKS.contact.mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
