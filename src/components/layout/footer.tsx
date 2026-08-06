"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavigationData } from "@/types/storefront";
import { BRAND } from "@/constants/brand";
import { Logo } from "@/components/ui/logo";
import { FashionPatternTexture } from "@/components/ui/fashion-pattern-texture";
import { FOOTER_LINKS } from "@/constants/footer";
import { cn, getMenuHref } from "@/lib/utils";
import { TrustIcon, IconInstagram, IconFacebook } from "@/components/ui/icons";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

interface FooterProps {
  navigation: NavigationData;
}

export function Footer({ navigation }: FooterProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const shopLinks =
    navigation.footerMenus.length > 0
      ? navigation.footerMenus
          .filter((m) => m.menuType === "footer-shop")
          .map((m) => ({ label: m.menuName, href: getMenuHref(m.menuUrl) }))
      : FOOTER_LINKS.shop;

  const toggle = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  return (
    <footer className="relative w-full overflow-hidden bg-[#faf7f5]">
      <FashionPatternTexture variant="card" />

      <div className="relative z-10">
        <div className="border-b border-saukhya-border">
          <RevealStagger
            className="container-saukhya grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 md:py-5 lg:grid-cols-5"
            stagger={0.05}
          >
            {FOOTER_LINKS.promises.map((item, index) => (
              <RevealItem key={item.label} index={index} distance={24}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saukhya-pink/5 text-saukhya-pink">
                    <TrustIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        <Reveal from="bottom" distance={36} className="container-saukhya py-8">
          <FooterContactSection
            isOpen={openSection === "contact"}
            onToggle={() => toggle("contact")}
          />

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Logo size="md" />
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-saukhya-muted md:text-sm">
                {FOOTER_LINKS.description}
              </p>
              <div className="mt-4 flex gap-2.5">
                {FOOTER_LINKS.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-saukhya-border text-saukhya-muted transition-colors hover:border-saukhya-pink hover:text-saukhya-pink"
                    aria-label={s.label}
                  >
                    {s.icon === "instagram" ? (
                      <IconInstagram />
                    ) : (
                      <IconFacebook />
                    )}
                  </a>
                ))}
              </div>
            </div>

            <FooterColumn
              title="Shop"
              links={shopLinks}
              isOpen={openSection === "shop"}
              onToggle={() => toggle("shop")}
            />
            <FooterColumn
              title="Help"
              links={FOOTER_LINKS.help}
              isOpen={openSection === "help"}
              onToggle={() => toggle("help")}
            />
            <FooterColumn
              title="Policies"
              links={FOOTER_LINKS.policies}
              isOpen={openSection === "policies"}
              onToggle={() => toggle("policies")}
            />
          </div>
        </Reveal>

        <div className="border-t border-saukhya-border">
          <div className="container-saukhya flex flex-col items-center justify-between gap-4 py-6 lg:flex-row">
            <p className="text-xs text-saukhya-muted">
              {new Date().getFullYear()} Copyright By {BRAND.name}
            </p>
            <p className="text-xs text-saukhya-muted">
              Secure payments and COD accepted
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FOOTER_LINKS.paymentMethods.map((method) => (
                <span
                  key={method.id}
                  className={cn(
                    "rounded-md border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm",
                    method.className,
                  )}
                >
                  {method.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactIcon({ type }: { type: "phone" | "email" | "location" }) {
  const paths = {
    phone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
      />
    ),
    email: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    ),
    location: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </>
    ),
  };

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saukhya-pink/8 text-saukhya-pink">
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        {paths[type]}
      </svg>
    </span>
  );
}

function FooterContactSection({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { contact } = FOOTER_LINKS;
  const phoneHref = contact.phone.replace(/\s/g, "");

  return (
    <div className="border-b border-saukhya-border pb-6">
      <FooterToggle title="Contact" isOpen={isOpen} onToggle={onToggle} />

      <div
        className={cn(
          "grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-5",
          !isOpen && "hidden lg:grid",
          isOpen && "grid",
        )}
      >
        <div className="flex h-full flex-col rounded-[10px] bg-white/72 p-4 shadow-saukhya-soft ring-1 ring-black/[0.04] backdrop-blur-[2px] md:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-saukhya-maroon">
            Get in touch
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-saukhya-muted">
            Reach our team for styling help, order support, or store directions.
          </p>

          <ul className="mt-3 space-y-2.5">
            <li className="flex items-start gap-2.5">
              <ContactIcon type="phone" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-saukhya-muted">
                  Phone
                </p>
                <a
                  href={`tel:${phoneHref}`}
                  className="mt-0.5 block text-[13px] font-medium text-saukhya-text transition-colors hover:text-saukhya-pink"
                >
                  {contact.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <ContactIcon type="email" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-saukhya-muted">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-0.5 block text-[13px] font-medium text-saukhya-text transition-colors hover:text-saukhya-pink"
                >
                  {contact.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <ContactIcon type="location" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-saukhya-muted">
                  Location
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-saukhya-text">
                  {contact.address}
                </p>
              </div>
            </li>
          </ul>

          <a
            href={contact.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-saukhya-pink transition-colors hover:text-saukhya-maroon"
          >
            Get directions
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-[10px] shadow-saukhya-soft ring-1 ring-black/[0.04] lg:max-h-none">
          <div className="shrink-0 border-b border-saukhya-border/70 bg-white/80 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saukhya-maroon">
              Find us on map
            </p>
            <p className="mt-0.5 text-[11px] text-saukhya-muted">{contact.mapQuery}</p>
          </div>
          <div className="relative h-40 flex-1 bg-[#ece7e4] lg:min-h-0">
            <iframe
              title={`${contact.mapQuery} map`}
              src={contact.mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterToggle({
  title,
  isOpen,
  onToggle,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="mb-3 flex w-full items-center justify-between text-xs font-medium uppercase tracking-widest md:pointer-events-none md:cursor-default md:text-sm"
      onClick={onToggle}
    >
      {title}
      <span className="md:hidden">{isOpen ? "−" : "+"}</span>
    </button>
  );
}

function FooterColumn({
  title,
  links,
  isOpen,
  onToggle,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <FooterToggle title={title} isOpen={isOpen} onToggle={onToggle} />
      <ul className={cn("space-y-2 md:block", !isOpen && "hidden md:block")}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-saukhya-muted transition-colors hover:text-saukhya-pink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
