import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/content/site-config";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/** Wide cinematic display face for the homepage film titles. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.titleDefault,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.seo.titleDefault,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    siteName: siteConfig.tradingName,
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.titleDefault,
    description: siteConfig.seo.description,
  },
  icons: {
    icon: [{ url: "/brand/fortitier-logo-icon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/brand/fortitier-logo-icon.jpg" }],
  },
  manifest: "/site.webmanifest",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#3B1902" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GH"
      className={`${ibmPlexSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${archivo.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-on-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-on-primary"
        >
          Skip to content
        </a>
        <Navbar />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
