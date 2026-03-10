import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { withBasePath } from "@/lib/site";
import "./globals.css";

const SITE_URL = "https://dhwanit6.github.io/DSA";
const FEEDBACK_URL = "https://github.com/dhwanit6/DSA/issues/new/choose";

export const metadata: Metadata = {
  title: {
    default: "DSA Guide - DSA, CS Fundamentals, and Interview Prep",
    template: "%s - DSA Guide",
  },
  description:
    "A free interview prep system for DSA, DBMS, OS, computer networks, concurrency, design, and placement rounds. 120 curated problems, structured chapters, planner, and weighted progress tracking.",
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
    title: "DSA Guide - DSA, CS Fundamentals, and Interview Prep",
    description:
      "DSA, CS fundamentals, design, and interview prep in one free roadmap with planner and progress tracking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSA Guide - DSA, CS Fundamentals, and Interview Prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Guide - DSA, CS Fundamentals, and Interview Prep",
    description:
      "DSA, CS fundamentals, design, and interview prep in one free roadmap with planner and progress tracking.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico"), type: "image/x-icon" },
      { url: withBasePath("/icon.png"), type: "image/png" },
    ],
    shortcut: withBasePath("/favicon.ico"),
    apple: withBasePath("/apple-icon.png"),
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
              <p className="mt-2 text-xs text-muted-fg/60">
                <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Report a bug or chapter issue
                </a>
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
