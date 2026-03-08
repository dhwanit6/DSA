import Link from "next/link";
import { getAllChapterMeta } from "@/lib/content";

const FEEDBACK_URL = "https://github.com/dhwanit6/DSA/issues/new/choose";

const QUICK_START_ROWS = [
  {
    label: "Complete beginner, never solved LeetCode",
    href: "/phase-0-cpp",
    action: "Phase 0 - C++ and Memory",
  },
  {
    label: "Know one language, but weak in DSA",
    href: "/phase-1-foundations",
    action: "Phase 1 - Foundations",
  },
  {
    label: "Some DSA done, placements 3+ months away",
    href: "/phase-2-intermediate",
    action: "Phase 2 - Intermediate",
  },
  {
    label: "DSA is decent, but DBMS/OS/CN rounds feel weak",
    href: "/cs-fundamentals-roadmap",
    action: "CS Fundamentals Roadmap",
  },
  {
    label: "Interview in under 4 weeks",
    href: "/crash-plans",
    action: "Crash-Course Plan",
  },
  {
    label: "Revising for top product companies",
    href: "/phase-3-advanced",
    action: "Phase 3 - Advanced",
  },
] as const;

export default function HomePage() {
  const chapterCount = getAllChapterMeta().length;

  return (
    <main className="min-h-screen">
      <div className="max-w-[960px] mx-auto px-6 py-16 lg:py-24">
        <header className="mb-16 lg:mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-6">
            Interview Prep System
          </p>

          <h1 className="text-4xl lg:text-[56px] font-bold tracking-tight leading-[1.08] mb-6 max-w-3xl">
            Stop stitching together random prep.
            <br />
            <span className="text-muted-fg">Run one roadmap for DSA, CS fundamentals, and interview rounds.</span>
          </h1>

          <p className="text-base lg:text-lg text-muted-fg max-w-2xl leading-relaxed mb-8">
            Built for engineering students targeting internships and placements in India, Europe, and the US. You get a
            clear sequence for coding, DBMS, OS, networks, concurrency, design, and interview execution, plus 120 curated
            problems and weighted progress tracking that reflects real effort.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/start-here"
              className="inline-flex items-center px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Here
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-surface-1 transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              href="/cs-fundamentals-roadmap"
              className="inline-flex items-center px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-surface-1 transition-colors"
            >
              CS Fundamentals
            </Link>
            <Link
              href="/planner"
              className="inline-flex items-center px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-surface-1 transition-colors"
            >
              Weekly Planner
            </Link>
          </div>
        </header>

        <section className="mb-14 lg:mb-16">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-sm font-semibold">Pick Your Starting Point</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-sm text-muted-fg mb-5">
            Read one row, click once, and start. No quiz needed.
          </p>

          <div className="border border-border rounded-xl overflow-hidden bg-surface-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  <th className="px-4 py-3 font-semibold text-muted-fg">I am...</th>
                  <th className="px-4 py-3 font-semibold text-muted-fg">Go here</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_START_ROWS.map((row) => (
                  <tr key={row.href} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-foreground/90">{row.label}</td>
                    <td className="px-4 py-3">
                      <Link href={row.href} className="text-primary hover:underline underline-offset-4">
                        {row.action}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14 lg:mb-16">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-sm font-semibold">Day 1 (Exact Tasks)</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="p-5 lg:p-6 border border-border rounded-xl bg-surface-1">
            <p className="text-sm text-muted-fg mb-5">
              One day, one small win. This is enough to begin.
            </p>
            <div className="space-y-3 text-sm">
              <p>
                1. Read <Link href="/start-here" className="text-primary hover:underline underline-offset-4">Start Here</Link> and decide whether you are on the internship, full-time, or crash lane.
              </p>
              <p>
                2. Open the <Link href="/dashboard" className="text-primary hover:underline underline-offset-4">Dashboard</Link> and lock your daily hours plus next chapter.
              </p>
              <p>
                3. Solve your first 3 problems from the <Link href="/problems" className="text-primary hover:underline underline-offset-4">Problem Set</Link>.
              </p>
              <p>
                4. Open the <Link href="/planner" className="text-primary hover:underline underline-offset-4">Weekly Planner</Link> and follow today&apos;s 3 tasks.
              </p>
              <p>
                5. Once Phase 2 is stable, enter the <Link href="/cs-fundamentals-roadmap" className="text-primary hover:underline underline-offset-4">CS Fundamentals Roadmap</Link> for DBMS, OS, networks, concurrency, and design.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="p-4 border border-border rounded-lg bg-surface-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">Problems</p>
              <p className="text-2xl font-bold">120</p>
              <p className="text-muted-fg mt-1">Curated for interviews</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-surface-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">Chapters</p>
              <p className="text-2xl font-bold">{chapterCount}</p>
              <p className="text-muted-fg mt-1">Concept + interview prep</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-surface-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">Cost</p>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-muted-fg mt-1">No paywall, no login</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">Soft Publish Feedback</p>
            <p className="text-sm text-muted-fg leading-relaxed mb-4">
              If a chapter feels confusing, a tracker feels wrong, or a flow breaks, send it as an issue. Right now the priority is removing friction, not expanding scope.
            </p>
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-surface-2 transition-colors"
            >
              Report Feedback
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
