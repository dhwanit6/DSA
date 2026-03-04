import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MDXComponents } from "@/components/MDXComponents";
import { ChapterChecklistControls } from "@/components/chapter-checklist-controls";
import { ChapterProgressControls } from "@/components/chapter-progress-controls";
import { getChapterChecklist } from "@/lib/chapter-checklists";
import { getAllChapterMeta, getAllSlugs, getChapterBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getPracticeEstimateMinutes(category: string): number {
  if (category === "Learning Path") return 60;
  if (category === "Interview") return 45;
  if (category === "Topics") return 50;
  return 30;
}

function getAdjacentChapters(slug: string) {
  const ordered = getAllChapterMeta();
  const index = ordered.findIndex((chapter) => chapter.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) return { title: "Not Found" };

  return {
    title: `${chapter.title} - DSA Guide`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const readMinutes = Math.max(8, Math.ceil(chapter.content.length / 1000));
  const practiceMinutes = getPracticeEstimateMinutes(chapter.category);
  const checklist = getChapterChecklist(slug);
  const { previous, next } = getAdjacentChapters(slug);
  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${chapter.title} striver neetcode`)}`;

  return (
    <div className="max-w-[760px] mx-auto px-6 py-10 lg:py-16">
      <header className="mb-9">
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
          <span className="font-semibold uppercase tracking-widest text-muted-fg">{chapter.category}</span>
          <span className="text-muted-fg/40">|</span>
          <span className="text-muted-fg">~{readMinutes} min read</span>
          <span className="text-muted-fg/40">+</span>
          <span className="text-muted-fg">~{practiceMinutes} min practice</span>
        </div>

        <h1 className="text-2xl lg:text-4xl font-bold tracking-tight mb-3">{chapter.title}</h1>

        <p className="text-base text-muted-fg leading-relaxed max-w-2xl mb-5">{chapter.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <ChapterProgressControls slug={slug} />
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-fg hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </header>

      <ChapterChecklistControls slug={slug} items={checklist} />

      <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-strong:text-foreground">
        <MDXRemote
          source={chapter.content.replace(/^#\s+.+\n+/, "")}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          components={MDXComponents}
        />
      </article>

      <section className="mt-12 p-5 border border-border rounded-xl bg-surface-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-3">Still Stuck?</p>
        <div className="space-y-2 text-sm text-foreground/90">
          <p>
            1. Watch a focused explanation: <a href={youtubeSearch} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Find a Striver/NeetCode walkthrough</a>
          </p>
          <p>
            2. Step down difficulty: revisit <Link href="/problems" className="text-primary hover:underline underline-offset-4">Tier 1 core problems</Link>
          </p>
          <p>
            3. Re-implement from template: <Link href="/code-templates" className="text-primary hover:underline underline-offset-4">Code Templates</Link>
          </p>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
        {previous ? (
          <Link
            href={`/${previous.slug}`}
            className="rounded-lg border border-border p-4 hover:border-foreground/30 transition-colors"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-1">Previous</p>
            <p className="text-sm font-medium">{previous.title}</p>
          </Link>
        ) : (
          <div className="rounded-lg border border-border/40 p-4 opacity-60">
            <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-1">Previous</p>
            <p className="text-sm">Start of guide</p>
          </div>
        )}

        {next ? (
          <Link
            href={`/${next.slug}`}
            className="rounded-lg border border-border p-4 hover:border-foreground/30 transition-colors sm:text-right"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-1">Next</p>
            <p className="text-sm font-medium">{next.title}</p>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="rounded-lg border border-border p-4 hover:border-foreground/30 transition-colors sm:text-right"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-1">Next</p>
            <p className="text-sm font-medium">Go to Dashboard</p>
          </Link>
        )}
      </footer>
    </div>
  );
}
