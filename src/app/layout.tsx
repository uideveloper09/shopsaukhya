import type { Metadata, Viewport } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InitialPageLoader } from "@/components/layout/initial-page-loader";
import { Providers } from "./providers";
import { storefrontApi } from "@/services/storefront-api";
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
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, catalogProducts] = await Promise.all([
    storefrontApi.navigation(),
    storefrontApi.products(),
  ]);

  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cormorant.variable} min-h-screen w-full overflow-x-hidden`}>
        <Providers>
          <InitialPageLoader />
          <Header navigation={navigation} products={catalogProducts} />
          {children}
          <Footer navigation={navigation} />
        </Providers>
      </body>
    </html>
  );
}
