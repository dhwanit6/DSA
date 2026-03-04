"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
    slug: string;
    title: string;
}

interface NavSection {
    label: string;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        label: "Learning Path",
        items: [
            { slug: "start-here", title: "Start Here" },
            { slug: "phase-0-cpp", title: "C++ & Memory" },
            { slug: "phase-1-foundations", title: "Fundamentals" },
            { slug: "phase-2-intermediate", title: "Intermediate" },
            { slug: "phase-3-advanced", title: "Advanced" },
        ],
    },
    {
        label: "Methodology",
        items: [
            { slug: "two-tracks", title: "The Two Tracks" },
            { slug: "mechanics", title: "Interview Mechanics" },
            { slug: "oa-strategy", title: "OA Strategies" },
            { slug: "company-specific", title: "Specific Companies" },
        ],
    },
    {
        label: "Concepts",
        items: [
            { slug: "complexity-analysis", title: "Complexity" },
            { slug: "sorting-algorithms", title: "Sorting" },
            { slug: "system-design-primer", title: "System Design" },
            { slug: "lld-ood-design", title: "Patterns" },
        ],
    },
    {
        label: "Reference",
        items: [
            { slug: "cheatsheets", title: "Cheatsheets" },
            { slug: "code-templates", title: "Code Templates" },
            { slug: "mental-game", title: "Mindset" },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border lg:hidden"
                aria-label="Toggle menu"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {mobileOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-72 bg-surface-1 border-r border-border overflow-y-auto transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:sticky lg:top-0`}
            >
                <div className="p-8 pb-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div className="w-7 h-7 rounded-md bg-surface-2 border border-border flex items-center justify-center overflow-hidden">
                            <Image src="/logo.png" alt="DSA Guide Logo" width={28} height={28} priority />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-foreground">DSA Guide</span>
                    </Link>
                    <ThemeToggle />
                </div>

                <nav className="p-6">
                    <div className="space-y-1 mb-8">
                        <Link
                            href="/problems"
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/problems"
                                ? "bg-surface-2 text-foreground"
                                : "text-muted-fg hover:text-foreground hover:bg-surface-2/50"
                                }`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Practice Problems
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/dashboard"
                                ? "bg-surface-2 text-foreground"
                                : "text-muted-fg hover:text-foreground hover:bg-surface-2/50"
                                }`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            My Progress
                        </Link>
                    </div>

                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label} className="mb-6">
                            <h3 className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-fg/60 mb-1">
                                {section.label}
                            </h3>
                            <div className="space-y-px">
                                {section.items.map((item) => {
                                    const href = `/${item.slug}`;
                                    const active = pathname === href;
                                    return (
                                        <Link
                                            key={item.slug}
                                            href={href}
                                            className={`flex items-center px-4 py-1.5 rounded-md text-[13px] transition-all ${active
                                                ? "text-foreground font-semibold"
                                                : "text-muted-fg hover:text-foreground"
                                                }`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
