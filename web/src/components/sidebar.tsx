"use client";

import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { getSidebarSections, type NavItem } from "@/lib/chapters";
import { ThemeToggle } from "./theme-toggle";

const NAV_SECTIONS = getSidebarSections();
const FEEDBACK_URL = "https://github.com/dhwanit6/DSA/issues/new/choose";

interface SearchEntry extends NavItem {
  section: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchEntries = useMemo<SearchEntry[]>(
    () =>
      NAV_SECTIONS.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          section: section.label,
        })),
      ),
    [],
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchEntries, {
        keys: ["title", "slug", "section"],
        threshold: 0.35,
      }),
    [searchEntries],
  );

  const filteredSections = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return NAV_SECTIONS;

    const matchSlugs = new Set(fuse.search(trimmed).map((result) => result.item.slug));
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => matchSlugs.has(item.slug)),
    })).filter((section) => section.items.length > 0);
  }, [fuse, query]);

  const chapterCount = useMemo(
    () => filteredSections.reduce((sum, section) => sum + section.items.length, 0),
    [filteredSections],
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border lg:hidden"
        aria-label="Toggle menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-surface-1 border-r border-border overflow-y-auto transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0`}
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-md bg-surface-2 border border-border flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="DSA Guide Logo" width={28} height={28} priority />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">DSA Guide</span>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="p-6">
          <div className="space-y-1 mb-6">
            <Link
              href="/problems"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/problems"
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-fg hover:text-foreground hover:bg-surface-2/50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Practice Problems
            </Link>
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/dashboard"
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-fg hover:text-foreground hover:bg-surface-2/50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              My Progress
            </Link>
            <Link
              href="/planner"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/planner"
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-fg hover:text-foreground hover:bg-surface-2/50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Weekly Planner
            </Link>
          </div>

          <div className="mb-6">
            <label htmlFor="sidebar-search" className="sr-only">
              Search chapters
            </label>
            <input
              id="sidebar-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search chapters..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
            />
            <p className="mt-2 text-[11px] text-muted-fg">{chapterCount} chapter results</p>
          </div>

          <div className="mb-6 rounded-lg border border-border bg-background/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">Feedback</p>
            <p className="text-xs leading-relaxed text-muted-fg mb-3">
              Found a broken flow, weak chapter, or confusing step? Log it directly so the soft-publish pass stays grounded in real user friction.
            </p>
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-fg hover:text-foreground hover:border-foreground/25 transition-colors"
            >
              Give Feedback
            </a>
          </div>

          {filteredSections.length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-fg">No matching chapters.</p>
          ) : (
            filteredSections.map((section) => (
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
                        className={`flex items-center px-4 py-1.5 rounded-md text-[13px] transition-all ${
                          active ? "text-foreground font-semibold" : "text-muted-fg hover:text-foreground"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </nav>
      </aside>
    </>
  );
}
