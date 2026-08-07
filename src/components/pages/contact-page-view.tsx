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
  "w-full rounded-none border border-saukhya-maroon/20 bg-[#faf6f4] px-3.5 py-3 text-sm text-saukhya-text outline-none transition placeholder:text-saukhya-muted/80 focus:border-saukhya-pink focus:bg-white focus:ring-1 focus:ring-saukhya-pink/25";

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
          <Reveal from="top" className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-saukhya-gold/60" />
              <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-saukhya-gold">
                {content.form.kicker}
              </p>
              <span className="h-px w-8 bg-saukhya-gold/60" />
            </div>
            <h2
              className="mt-4 text-3xl font-medium text-saukhya-maroon md:text-[2.65rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A quieter way to reach us
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.85] text-saukhya-muted md:text-[15px]">
              {content.form.copy}
            </p>
          </Reveal>

          <div className="relative mt-10 overflow-hidden border border-saukhya-border/50 bg-white/70 shadow-[0_24px_60px_rgba(92,34,56,0.06)] backdrop-blur-[2px] md:mt-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 border border-saukhya-gold/15 md:inset-4"
            />

            <div className="relative grid lg:grid-cols-12">
              <Reveal from="left" className="lg:col-span-7">
                <form
                  onSubmit={handleSubmit}
                  className="relative px-6 py-8 md:px-10 md:py-11 lg:px-12 lg:py-12"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-saukhya-pink">
                        Enquiry
                      </p>
                      <h3
                        className="mt-2 text-2xl font-medium text-saukhya-maroon md:text-[1.85rem]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {content.form.title}
                      </h3>
                    </div>
                    <p className="hidden text-right text-[10px] uppercase tracking-[0.22em] text-saukhya-muted/70 sm:block">
                      Reply in
                      <br />
                      business hours
                    </p>
                  </div>

                  <div className="relative mt-9 grid gap-7 sm:grid-cols-2">
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
                        className={`block ${"full" in field && field.full ? "sm:col-span-2" : ""}`}
                      >
                        <span
                          className={`mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                            focused === field.name
                              ? "text-saukhya-pink"
                              : "text-saukhya-maroon/70"
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
                      </label>
                    ))}

                    <label className="block sm:col-span-2">
                      <span
                        className={`mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                          focused === "message"
                            ? "text-saukhya-pink"
                            : "text-saukhya-maroon/70"
                        }`}
                      >
                        Message
                      </span>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us how we can help"
                        className={`${fieldClass} min-h-[120px] resize-y`}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                      />
                    </label>
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-5 border-t border-saukhya-border/50 pt-8">
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
