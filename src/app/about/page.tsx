import type { Metadata } from "next";
import { ABOUT_PAGE } from "@/constants/content-pages";
import { AboutPageView } from "@/components/pages/about-page-view";

export const metadata: Metadata = {
  title: ABOUT_PAGE.metaTitle,
  description: ABOUT_PAGE.metaDescription,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageView />;
}
