import type { Metadata } from "next";
import { Newsreader, Outfit } from "next/font/google";
import { company } from "@/lib/content";
import { defaultDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} | Solar Distribution, Guwahati`,
    template: `%s | ${company.name}`,
  },
  description: defaultDescription,
  keywords: [
    "S-Cube Mercantile",
    "solar distributor Guwahati",
    "solar panels Assam",
    "Adani Solar",
    "Waaree",
    "Luminous",
    "Microtek",
    "Tata Power Solar",
  ],
  authors: [{ name: company.name }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: company.name,
    title: `${company.name} | Solar Distribution, Guwahati`,
    description: defaultDescription,
    images: [{ url: "/images/hero.jpg", alt: company.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | Solar Distribution, Guwahati`,
    description: defaultDescription,
    images: ["/images/hero.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "YfZD_jFF4b0oZn-OMGkpy0-FZDCt7oIaTdEPNvcNNqI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
