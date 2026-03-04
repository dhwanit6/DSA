import Link from "next/link";
import { getChaptersByCategory } from "@/lib/content";

export default function HomePage() {
  const categories = getChaptersByCategory();

  return (
    <main className="min-h-screen">
      <div className="max-w-[960px] mx-auto px-6 py-16 lg:py-28">
        {/* Hero — tight, purposeful */}
        <header className="mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-6">
            Open-Source Study Plan
          </p>
          <h1 className="text-4xl lg:text-[56px] font-bold tracking-tight leading-[1.08] mb-5">
            Master DSA.<br />
            <span className="text-muted-fg">The right way.</span>
          </h1>
          <p className="text-base lg:text-lg text-muted-fg max-w-lg leading-relaxed mb-8">
            A structured, free guide designed for students and engineers. 120 curated problems, 29 deep-dive chapters, and built-in progress tracking.
          </p>
          <div className="flex gap-3">
            <Link href="/start-here" className="inline-flex items-center px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Start reading
            </Link>
            <Link href="/problems" className="inline-flex items-center px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-surface-1 transition-colors">
              Problem set
            </Link>
          </div>
        </header>

        {/* Curriculum — compact grid */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Curriculum</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {Object.entries(categories).map(([category, chapters]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-3 text-foreground">{category}</h3>
                <div className="space-y-1">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/${chapter.slug}`}
                      className="block py-1 text-[13px] text-muted-fg hover:text-foreground transition-colors"
                    >
                      {chapter.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Numbers — understated */}
        <section className="py-12 border-t border-b border-border">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">120</p>
              <p className="text-[11px] text-muted-fg mt-1">Curated Problems</p>
            </div>
            <div>
              <p className="text-2xl font-bold">29</p>
              <p className="text-[11px] text-muted-fg mt-1">Chapters</p>
            </div>
            <div>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-[11px] text-muted-fg mt-1">Forever</p>
            </div>
          </div>
        </section>
      </div>

      <footer className="max-w-[960px] mx-auto px-6 py-10 flex justify-between items-center text-xs text-muted-fg">
        <span>DSA Guide · Open Source</span>
        <div className="flex gap-6">
          <Link href="/start-here" className="hover:text-foreground transition-colors">Start</Link>
          <Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Progress</Link>
        </div>
      </footer>
    </main>
  );
}
