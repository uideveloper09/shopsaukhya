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
  const [focused, setFocused] = useState<string | null>(null);

  const banner: HeroImage =
    bannerImage ?? heroImages[0] ?? content.fashionStrip[1];
  const thumbs = (heroImages.length ? heroImages : content.fashionStrip).slice(
    0,
    3,
  );

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
