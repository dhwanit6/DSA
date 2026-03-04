import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const SITE_URL = "https://dhwanit6.github.io/DSA";

export const metadata: Metadata = {
  title: {
    default: "DSA Guide - The Free Comprehensive Study Plan",
    template: "%s - DSA Guide",
  },
  description:
    "A complete, free DSA interview preparation guide. 120 curated problems, 30 deep-dive chapters, crash-course plans, and built-in progress tracking. No paywall, no login.",
  keywords: [
    "DSA",
    "interview preparation",
    "LeetCode",
    "coding interview",
    "data structures",
    "algorithms",
    "FAANG",
    "placement preparation",
    "competitive programming",
  ],
  authors: [{ name: "Dhwanit" }],
  creator: "Dhwanit",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DSA Guide",
    title: "DSA Guide - The Free Comprehensive Study Plan",
    description:
      "120 curated problems, 30 chapters, crash-course plans, and progress tracking. Free. No login required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSA Guide - The Free Comprehensive Study Plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Guide - The Free Comprehensive Study Plan",
    description:
      "120 curated problems, 30 chapters, crash-course plans, and progress tracking. Free. No login required.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0 lg:ml-0 flex flex-col">
            <main className="flex-1 min-w-0">{children}</main>
            <footer className="py-6 px-6 text-center border-t border-border/40">
              <p className="text-xs text-muted-fg/60 tracking-wide">
                made with <span className="text-red-400/80">&#9829;</span> by{" "}
                <span className="text-muted-fg/80 font-medium">Dhwanit</span>
              </p>
            </footer>
          </div>
        </div>
        <div className="watermark-layer" aria-hidden="true">
          <div className="watermark-grid">
            {Array.from({ length: 132 }).map((_, index) => (
              <span key={index} className="watermark-word">
                dhwanit
              </span>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
