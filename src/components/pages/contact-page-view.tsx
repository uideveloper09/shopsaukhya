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

export function ContactPageView() {
  const content = CONTACT_PAGE;
  const reduceMotion = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

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
      {/* Fashion editorial hero — compact lookbook strip + readable copy */}
      <section className="relative overflow-hidden border-b border-saukhya-border/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,57,136,0.06),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(201,169,110,0.1),transparent_50%)]"
        />

        <div className="container-saukhya relative grid items-center gap-7 py-8 md:gap-8 md:py-10 lg:grid-cols-12 lg:gap-10 lg:py-11">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
            className="lg:col-span-5"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-saukhya-gold">
              {content.kicker}
            </p>
            <h1
              className="mt-3 max-w-md text-[1.75rem] font-medium leading-[1.2] tracking-tight text-saukhya-maroon md:text-[2.2rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {content.title}
            </h1>
            <motion.div
              aria-hidden
              className="mt-4 h-px w-16 origin-left bg-gradient-to-r from-saukhya-gold via-saukhya-pink/50 to-transparent"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
            />
            <p className="mt-4 max-w-sm text-sm leading-[1.75] text-saukhya-muted md:text-[15px]">
              {content.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon/60">
              <span>Fit & fabric</span>
              <span aria-hidden>·</span>
              <span>Size guidance</span>
              <span aria-hidden>·</span>
              <span>Order care</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="lg:col-span-7"
            aria-hidden
          >
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {content.fashionStrip.map((shot, index) => (
                <motion.div
                  key={shot.src}
                  className={`relative overflow-hidden bg-[#f3ece9] ${
                    index === 1
                      ? "aspect-[3/4] -translate-y-2 md:-translate-y-3"
                      : "aspect-[3/4] translate-y-2 md:translate-y-3"
                  }`}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: index === 1 ? -10 : 0, transition: { duration: 0.35 } }
                  }
                >
                  <Image
                    src={cdn(shot.src)}
                    alt={shot.alt}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 1024px) 30vw, 18vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5c2238]/20 to-transparent" />
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-right text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-gold/90">
              Current edit looks
            </p>
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
