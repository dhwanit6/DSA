import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { getChapterBySlug, getAllSlugs } from "@/lib/content";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const chapter = getChapterBySlug(slug);
    if (!chapter) return { title: "Not Found" };
    return {
        title: `${chapter.title} — DSA Guide`,
        description: chapter.description,
    };
}

import { MDXComponents } from "@/components/MDXComponents";

export default async function ChapterPage({ params }: PageProps) {
    const { slug } = await params;
    const chapter = getChapterBySlug(slug);
    if (!chapter) notFound();

    return (
        <div className="max-w-[720px] mx-auto px-6 py-10 lg:py-16">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">
                        {chapter.category}
                    </span>
                    <span className="text-muted-fg/30">·</span>
                    <span className="text-[11px] text-muted-fg">
                        {Math.ceil(chapter.content.length / 1000)} min read
                    </span>
                </div>

                <h1 className="text-2xl lg:text-4xl font-bold tracking-tight mb-3">
                    {chapter.title}
                </h1>

                <p className="text-base text-muted-fg leading-relaxed max-w-xl">
                    {chapter.description}
                </p>
            </div>

            <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-strong:text-foreground">
                <MDXRemote
                    source={chapter.content.replace(/^#\s+.+\n+/, "")}
                    options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                    components={MDXComponents}
                />
            </article>

            <footer className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-fg">DSA Guide</span>
                <Link
                    href="/dashboard"
                    className="text-xs font-medium text-muted-fg hover:text-foreground transition-colors"
                >
                    Back to Dashboard →
                </Link>
            </footer>
        </div>
    );
}
