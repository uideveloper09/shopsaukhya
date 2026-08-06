"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CDN_BASE } from "@/constants/brand";
import { CONTACT_PAGE } from "@/constants/content-pages";
import { FOOTER_LINKS } from "@/constants/footer";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

const ease = [0.22, 1, 0.36, 1] as const;

function cdn(path: string) {
  return path.startsWith("http") ? path : `${CDN_BASE}${path}`;
}

const fieldClass =
  "w-full border-0 border-b border-saukhya-border/80 bg-transparent px-0 py-3 text-sm text-saukhya-text outline-none transition placeholder:text-saukhya-muted/60 focus:border-saukhya-pink";

type CollageImage = { src: string; alt: string };

interface ContactPageViewProps {
  collageImages?: CollageImage[];
}

export function ContactPageView({ collageImages = [] }: ContactPageViewProps) {
  const content = CONTACT_PAGE;
  const reduceMotion = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const strip: CollageImage[] = [
    collageImages[0] ?? content.fashionStrip[0],
    collageImages[1] ?? content.fashionStrip[1],
    collageImages[2] ?? content.fashionStrip[2],
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      message,
    ].join("\n");

    const mailto = `mailto:info@shopsaukhya.com?subject=${encodeURIComponent(
      subject || "Saukhya enquiry",
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <main className="w-full overflow-x-hidden bg-saukhya-warm">
      {/* Premium editorial contact hero */}
      <section className="relative overflow-hidden border-b border-saukhya-border/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#f7f0ec_0%,#f3e8e4_42%,#efe2dc_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-[70%] w-[55%] bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.16),transparent_68%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-[65%] w-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,34,56,0.08),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saukhya-gold/50 to-transparent"
        />

        <div className="container-saukhya relative grid items-center gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-saukhya-gold/70" />
              <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-saukhya-gold">
                Saukhya · {content.kicker}
              </p>
            </div>
            <h1
              className="mt-5 max-w-lg text-[2.05rem] font-medium leading-[1.14] tracking-tight text-saukhya-maroon md:text-[2.65rem] lg:text-[2.85rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {content.title}
            </h1>
            <motion.div
              aria-hidden
              className="mt-6 h-px w-20 origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/55 to-transparent"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
            />
            <p className="mt-6 max-w-md text-[15px] leading-[1.85] text-saukhya-muted md:text-base">
              {content.intro}
            </p>
            <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.28em] text-saukhya-maroon/45">
              Fit · Fabric · Size · Order care
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease, delay: 0.12 }}
            className="relative mx-auto w-full max-w-md lg:col-span-7 lg:mx-0 lg:max-w-none lg:justify-self-end"
            aria-hidden
          >
            {/* Soft glow behind collage */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75),transparent_70%)] blur-2xl"
            />

            <div className="relative mx-auto h-[280px] w-full max-w-[380px] md:h-[340px] md:max-w-[440px] lg:ml-auto lg:mr-2">
              {/* Quiet gold frame */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 inset-y-3 z-0 border border-saukhya-gold/20"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 inset-y-5 z-0 border border-saukhya-gold/10"
              />

              {/* Back left */}
              <motion.div
                className="absolute left-0 top-8 z-[1] h-[72%] w-[40%]"
                initial={reduceMotion ? false : { opacity: 0, x: -18, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: -3.5 }}
                transition={{ duration: 0.75, ease, delay: 0.2 }}
              >
                <motion.div
                  className="h-full w-full overflow-hidden bg-[#f6f0ed] p-[3px] shadow-[0_18px_40px_rgba(92,34,56,0.1)]"
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={cdn(strip[1].src)}
                      alt={strip[1].alt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Front center — featured */}
              <motion.div
                className="absolute left-1/2 top-0 z-[3] h-[94%] w-[48%] -translate-x-1/2"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease, delay: 0.28 }}
              >
                <motion.div
                  className="h-full w-full overflow-hidden bg-white p-[4px] shadow-[0_28px_60px_rgba(92,34,56,0.18)]"
                  animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{
                    duration: 6.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={cdn(strip[0].src)}
                      alt={strip[0].alt}
                      fill
                      priority
                      sizes="220px"
                      className="object-cover object-[center_16%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5c2238]/30 via-transparent to-white/10" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Back right */}
              <motion.div
                className="absolute right-0 top-12 z-[2] h-[68%] w-[38%]"
                initial={reduceMotion ? false : { opacity: 0, x: 18, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 2.8 }}
                transition={{ duration: 0.75, ease, delay: 0.34 }}
              >
                <motion.div
                  className="h-full w-full overflow-hidden bg-[#f6f0ed] p-[3px] shadow-[0_18px_40px_rgba(92,34,56,0.1)]"
                  animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                  transition={{
                    duration: 5.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={cdn(strip[2].src)}
                      alt={strip[2].alt}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-end lg:pr-4">
              <span className="h-px w-8 bg-saukhya-gold/40" />
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-saukhya-gold">
                Trending now
              </p>
              <span className="h-px w-8 bg-saukhya-gold/40" />
            </div>
          </motion.div>
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
                      →
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

      {/* Form + help */}
      <section className="section-padding floral-decoration">
        <div className="container-saukhya">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal from="left" className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden bg-white px-5 py-8 shadow-saukhya-soft ring-1 ring-black/[0.03] md:px-10 md:py-12"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-saukhya-pink/[0.06]"
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }
                  }
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-pink">
                  {content.form.kicker}
                </p>
                <h2
                  className="mt-3 text-3xl font-medium text-saukhya-maroon md:text-4xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {content.form.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-saukhya-muted md:text-base">
                  {content.form.copy}
                </p>

                <div className="relative mt-10 grid gap-7 sm:grid-cols-2">
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
                  ).map((field) => (
                    <label
                      key={field.name}
                      className={`relative block ${"full" in field && field.full ? "sm:col-span-2" : ""}`}
                    >
                      <span
                        className={`mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                          focused === field.name
                            ? "text-saukhya-pink"
                            : "text-saukhya-muted"
                        }`}
                      >
                        {field.label}
                      </span>
                      <input
                        name={field.name}
                        type={"type" in field ? field.type : "text"}
                        required={"required" in field ? field.required : false}
                        placeholder={field.placeholder}
                        className={fieldClass}
                        onFocus={() => setFocused(field.name)}
                        onBlur={() => setFocused(null)}
                      />
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute bottom-0 left-0 h-px bg-saukhya-pink"
                        animate={{
                          scaleX: focused === field.name ? 1 : 0,
                        }}
                        style={{ originX: 0, width: "100%" }}
                        transition={{ duration: 0.35, ease }}
                      />
                    </label>
                  ))}

                  <label className="relative block sm:col-span-2">
                    <span
                      className={`mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                        focused === "message"
                          ? "text-saukhya-pink"
                          : "text-saukhya-muted"
                      }`}
                    >
                      Message
                    </span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help"
                      className={`${fieldClass} resize-y`}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                    />
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute bottom-0 left-0 h-px bg-saukhya-pink"
                      animate={{ scaleX: focused === "message" ? 1 : 0 }}
                      style={{ originX: 0, width: "100%" }}
                      transition={{ duration: 0.35, ease }}
                    />
                  </label>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Button type="submit" size="lg">
                    Send Message
                  </Button>
                  <AnimatePresence>
                    {sent && (
                      <motion.p
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-saukhya-muted"
                      >
                        Opening your email app…
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </Reveal>

            <Reveal from="right" delay={0.1} className="lg:col-span-5">
              <aside className="lg:sticky lg:top-28" aria-label="How Saukhya can help">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
                  How we help
                </p>
                <h2
                  className="mt-4 text-2xl font-medium text-saukhya-maroon md:text-3xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Support that stays calm and clear
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-saukhya-muted">
                  {content.supportCard.copy}
                </p>

                <ul className="mt-10 space-y-0">
                  {content.help.map((item, index) => (
                    <motion.li
                      key={item.title}
                      initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.55,
                        ease,
                        delay: 0.08 * index,
                      }}
                      className="border-t border-saukhya-border/70 py-5"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-saukhya-pink">
                        0{index + 1}
                      </p>
                      <p
                        className="mt-2 text-lg font-medium text-saukhya-text"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-saukhya-muted">
                        {item.copy}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 space-y-3 border-t border-saukhya-border/70 pt-8">
                  <AppLink
                    href={`tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, "")}`}
                    className="block text-sm font-medium tracking-wide text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                  >
                    Call {FOOTER_LINKS.contact.phone}
                  </AppLink>
                  <AppLink
                    href={`mailto:${FOOTER_LINKS.contact.email}`}
                    className="block text-sm font-medium tracking-wide text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                  >
                    {FOOTER_LINKS.contact.email}
                  </AppLink>
                </div>
              </aside>
            </Reveal>
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
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                >
                  Open in Maps →
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
