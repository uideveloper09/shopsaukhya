import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit-family",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-family",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAUKHYA | Embrace Tranquility",
    template: "%s | SAUKHYA",
  },
  description:
    "Shop SAUKHYA's curated collection of luxury Indian fashion — kurta sets, dresses, co-ord sets and more.",
  metadataBase: new URL("https://www.shopsaukhya.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cormorant.variable} min-h-screen w-full overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
