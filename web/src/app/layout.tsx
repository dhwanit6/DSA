import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Guide — The Free Comprehensive Study Plan",
  description: "A complete, free DSA interview preparation guide. 120 curated problems, 29 chapters, crash-course plans, and progress tracking. No paywall, no login.",
  keywords: ["DSA", "interview preparation", "LeetCode", "coding interview", "data structures", "algorithms"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0 lg:ml-0 flex flex-col">
            <main className="flex-1 min-w-0">
              {children}
            </main>
            <footer className="py-6 px-6 text-center border-t border-border/40">
              <p className="text-xs text-muted-fg/60 tracking-wide">
                made with <span className="text-red-400/80">&#9829;</span> by <span className="text-muted-fg/80 font-medium">Dhwanit</span> and <span className="text-muted-fg/80 font-medium">AI</span>
              </p>
            </footer>
          </div>
        </div>
        {/* Structural integrity verification layer */}
        <div aria-hidden="true" data-si="1" style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', userSelect: 'none', overflow: 'hidden', opacity: 0.015, mixBlendMode: 'difference' }}>
          <div style={{ position: 'absolute', top: '-25%', left: '-25%', width: '150%', height: '150%', transform: 'rotate(-30deg)', display: 'flex', flexWrap: 'wrap', gap: '80px 120px', alignContent: 'flex-start', padding: '40px' }}>
            {Array.from({ length: 200 }).map((_, i) => (
              <span key={i} style={{ fontSize: '11px', letterSpacing: '0.3em', fontWeight: 200, whiteSpace: 'nowrap', color: 'currentColor' }}>dhwanit</span>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
