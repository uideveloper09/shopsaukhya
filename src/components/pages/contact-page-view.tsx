"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { CDN_BASE } from "@/constants/brand";
import { CONTACT_PAGE } from "@/constants/content-pages";
import { FOOTER_LINKS } from "@/constants/footer";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/ui/app-link";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";

function cdn(path: string) {
  return path.startsWith("http") ? path : `${CDN_BASE}${path}`;
}

export function ContactPageView() {
  const content = CONTACT_PAGE;
  const [sent, setSent] = useState(false);

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
    <main className="w-full floral-decoration">
      <section className="section-padding relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,57,136,0.07),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(201,169,110,0.1),transparent_45%)]"
        />

        <div className="container-saukhya relative">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal from="left" className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-saukhya-gold">
                {content.kicker}
              </p>
              <h1
                className="mt-4 max-w-2xl text-[2rem] font-medium leading-[1.2] tracking-tight text-saukhya-maroon md:text-4xl lg:text-[2.65rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {content.title}
              </h1>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-saukhya-gold via-saukhya-pink/50 to-transparent" />
              <p className="mt-6 max-w-xl text-base leading-[1.8] text-saukhya-muted md:text-[17px]">
                {content.intro}
              </p>
            </Reveal>

            <Reveal from="right" delay={0.08} className="lg:col-span-5">
              <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-saukhya-soft ring-1 ring-black/[0.04]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={cdn(content.supportCard.image)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 35vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-5 py-5 md:px-6">
                  <p
                    className="text-lg font-medium text-saukhya-text"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {content.supportCard.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-saukhya-muted">
                    {content.supportCard.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-saukhya-border/70 bg-white/70 py-10 md:py-14">
        <div className="container-saukhya">
          <RevealStagger
            className="grid gap-6 md:grid-cols-3"
            stagger={0.07}
          >
            {content.channels.map((channel, index) => (
              <RevealItem key={channel.title} index={index}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="block h-full border border-saukhya-border/80 bg-saukhya-warm/40 px-5 py-6 transition-colors hover:border-saukhya-pink/30 hover:bg-white"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-gold">
                    {channel.title}
                  </p>
                  <p className="mt-3 text-base font-medium text-saukhya-text md:text-lg">
                    {channel.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-saukhya-muted">
                    {channel.copy}
                  </p>
                </a>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-saukhya">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal from="left" className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="border border-saukhya-border/80 bg-white/90 p-5 shadow-saukhya-soft md:p-8"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-saukhya-pink">
                  {content.form.kicker}
                </p>
                <h2
                  className="mt-3 text-2xl font-medium text-saukhya-maroon md:text-3xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {content.form.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-saukhya-muted md:text-base">
                  {content.form.copy}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted">
                      Full name
                    </span>
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full rounded-saukhya-sm border border-saukhya-border bg-saukhya-warm/50 px-4 py-3 text-sm text-saukhya-text outline-none transition focus:border-saukhya-pink/40 focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted">
                      Email address
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-saukhya-sm border border-saukhya-border bg-saukhya-warm/50 px-4 py-3 text-sm text-saukhya-text outline-none transition focus:border-saukhya-pink/40 focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted">
                      Phone number
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="10 digit mobile number"
                      className="w-full rounded-saukhya-sm border border-saukhya-border bg-saukhya-warm/50 px-4 py-3 text-sm text-saukhya-text outline-none transition focus:border-saukhya-pink/40 focus:bg-white"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted">
                      Subject
                    </span>
                    <input
                      name="subject"
                      required
                      placeholder="Order help, product question, collaboration..."
                      className="w-full rounded-saukhya-sm border border-saukhya-border bg-saukhya-warm/50 px-4 py-3 text-sm text-saukhya-text outline-none transition focus:border-saukhya-pink/40 focus:bg-white"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-saukhya-muted">
                      Message
                    </span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help"
                      className="w-full resize-y rounded-saukhya-sm border border-saukhya-border bg-saukhya-warm/50 px-4 py-3 text-sm text-saukhya-text outline-none transition focus:border-saukhya-pink/40 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button type="submit" size="lg">
                    Send Message
                  </Button>
                  {sent && (
                    <p className="text-sm text-saukhya-muted">
                      Opening your email app…
                    </p>
                  )}
                </div>
              </form>
            </Reveal>

            <Reveal from="right" delay={0.08} className="lg:col-span-5">
              <aside
                className="flex h-full flex-col gap-6 border border-saukhya-border/80 bg-saukhya-warm-alt/80 p-5 md:p-7"
                aria-label="How Saukhya can help"
              >
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-saukhya-gold">
                    How we help
                  </p>
                  <h2
                    className="mt-3 text-xl font-medium text-saukhya-text md:text-2xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Support that stays calm and clear
                  </h2>
                </div>

                <ul className="space-y-5">
                  {content.help.map((item) => (
                    <li
                      key={item.title}
                      className="border-t border-saukhya-border/70 pt-5 first:border-t-0 first:pt-0"
                    >
                      <p className="text-sm font-medium text-saukhya-text">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-saukhya-muted">
                        {item.copy}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto space-y-3 border-t border-saukhya-border/70 pt-6">
                  <AppLink
                    href={`tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, "")}`}
                    className="block text-sm font-medium text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                  >
                    Call {FOOTER_LINKS.contact.phone}
                  </AppLink>
                  <AppLink
                    href={`mailto:${FOOTER_LINKS.contact.email}`}
                    className="block text-sm font-medium text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                  >
                    {FOOTER_LINKS.contact.email}
                  </AppLink>
                </div>
              </aside>
            </Reveal>
          </div>

          <Reveal from="bottom" delay={0.1} className="mt-12 md:mt-16">
            <div className="overflow-hidden border border-saukhya-border/80 bg-white">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-saukhya-border/70 px-5 py-4 md:px-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-saukhya-gold">
                    Studio base
                  </p>
                  <p className="mt-1 text-sm text-saukhya-text md:text-base">
                    {FOOTER_LINKS.contact.address}
                  </p>
                </div>
                <a
                  href={FOOTER_LINKS.contact.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-saukhya-maroon transition-colors hover:text-saukhya-pink"
                >
                  Open in Maps →
                </a>
              </div>
              <iframe
                title={`${FOOTER_LINKS.contact.mapQuery} map`}
                src={FOOTER_LINKS.contact.mapEmbedUrl}
                className="h-64 w-full border-0 md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
