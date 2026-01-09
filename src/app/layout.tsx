import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import DevAmazonWarning from "@/components/DevAmazonWarning";
import PageViewTracker from "@/components/PageViewTracker";
import { getSiteUrl } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FixFlicks | Tiny videos. Real fixes.",
    template: "%s | FixFlicks",
  },
  description: "Tiny videos. Real fixes. Curated fix kits for renters and busy homes.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "FixFlicks | Tiny videos. Real fixes.",
    description: "Curated fix kits with fast, renter-safe steps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixFlicks | Tiny videos. Real fixes.",
    description: "Curated fix kits with fast, renter-safe steps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <DevAmazonWarning show={process.env.NODE_ENV === "development" && !process.env.AMAZON_ASSOCIATE_TAG} />
        <PageViewTracker />
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
