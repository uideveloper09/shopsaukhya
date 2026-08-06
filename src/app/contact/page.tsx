import type { Metadata } from "next";
import { CONTACT_PAGE } from "@/constants/content-pages";
import { ContactPageView } from "@/components/pages/contact-page-view";

export const metadata: Metadata = {
  title: CONTACT_PAGE.metaTitle,
  description: CONTACT_PAGE.metaDescription,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageView />;
}
