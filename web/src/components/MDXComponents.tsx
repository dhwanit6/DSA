import React from "react";
import Link from "next/link";

function normalizeMdxHref(rawHref: string): string {
    const mdMatch = rawHref.match(/^(.*\/)?([^\/?#]+)\.md([?#].*)?$/);
    if (!mdMatch) return rawHref;
    const slug = mdMatch[2];
    const suffix = mdMatch[3] ?? "";
    return `/${slug}${suffix}`;
}

export const MDXComponents = {
    UnderTheHood: ({ children }: { children: React.ReactNode }) => (
        <div className="my-8 py-5 px-6 bg-surface-1 border border-border rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-3">
                Instructor&apos;s Note
            </p>
            <div className="text-sm leading-relaxed text-foreground/85">
                {children}
            </div>
        </div>
    ),

    Flashcard: ({ question, children }: { question: string; children: React.ReactNode }) => {
        return (
            <div className="my-6 border border-border rounded-lg overflow-hidden transition-colors hover:border-foreground/15">
                <details className="group">
                    <summary className="list-none cursor-pointer px-5 py-4 text-sm font-medium flex items-center justify-between hover:bg-surface-1 transition-colors">
                        <div className="flex items-center gap-2.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-fg shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <span className="text-foreground">{question}</span>
                        </div>
                        <span className="text-[11px] text-muted-fg group-open:hidden">Show</span>
                        <span className="text-[11px] text-muted-fg hidden group-open:inline">Hide</span>
                    </summary>
                    <div className="px-5 py-4 border-t border-border bg-surface-1/50 text-sm leading-relaxed text-foreground/80">
                        {children}
                    </div>
                </details>
            </div>
        );
    },

    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        let href = props.href || "";
        const isExternal = /^(https?:|mailto:|tel:)/i.test(href);
        const isHashLink = href.startsWith("#");
        const isHttp = /^https?:/i.test(href);

        if (!isExternal && !isHashLink) {
            href = normalizeMdxHref(href);
        }

        if (isExternal || isHashLink) {
            const externalProps = isHttp
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};

            return (
                <a
                    {...props}
                    href={href}
                    {...externalProps}
                    className="text-foreground underline decoration-border underline-offset-3 hover:decoration-foreground/50 transition-colors font-medium"
                />
            );
        }

        return (
            <Link
                href={href}
                className="text-foreground underline decoration-border underline-offset-3 hover:decoration-foreground/50 transition-colors font-medium"
            >
                {props.children}
            </Link>
        );
    },
};
