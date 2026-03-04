"use client";

import { useEffect, useState } from "react";
import { getStats, getCurrentStreak, getDashboardNudge } from "@/lib/progress";
import Link from "next/link";

function getMilestoneMessage(solved: number): string | null {
    if (solved >= 100) return "100 problems. You're in the top 1% of candidates who actually follow through. The interview won't surprise you.";
    if (solved >= 75) return "75 problems down. You're building real pattern instinct now. Most Mediums should feel familiar.";
    if (solved >= 50) return "50 problems. You've crossed the point where quitting would be a waste. The hard part is behind you.";
    if (solved >= 25) return "25 problems solved. You're past the point where most people quit. Keep going.";
    if (solved >= 10) return "First 10 done. The habit is forming. Consistency beats intensity.";
    return null;
}

export default function DashboardPage() {
    const [stats, setStats] = useState({
        problemsSolved: 0,
        chaptersRead: 0,
        streak: 0,
        toBeRevised: 0
    });
    const [nudge, setNudge] = useState<{ title: string; link: string; type: string } | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("dsa-mastery-progress");
        let revisionCount = 0;
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                revisionCount = parsed.revisionMarks?.length || 0;
            } catch (e) { }
        }

        setStats({
            ...getStats(),
            streak: getCurrentStreak(),
            toBeRevised: revisionCount
        });
        setNudge(getDashboardNudge());
    }, []);

    const totalProblems = 120;
    const totalChapters = 29;
    const milestone = getMilestoneMessage(stats.problemsSolved);

    return (
        <div className="max-w-[960px] mx-auto px-6 py-10 lg:py-16">
            {/* Header */}
            <header className="mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-4">Dashboard</p>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">My Progress</h1>
                <p className="text-base text-muted-fg leading-relaxed max-w-xl">
                    Consistency matters more than speed. Stay steady and the intuition will follow.
                </p>
            </header>

            {/* Milestone */}
            {milestone && (
                <div className="mb-8 p-4 border border-border/60 rounded-lg bg-surface-1/50">
                    <p className="text-sm text-foreground/80 italic">{milestone}</p>
                </div>
            )}

            {/* Next Step */}
            {nudge && (
                <Link
                    href={nudge.link}
                    className="block mb-10 p-5 bg-surface-1 border border-border rounded-lg hover:border-foreground/20 transition-colors group"
                >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">Next step</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                        {nudge.title}
                    </p>
                </Link>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {[
                    { label: "Chapters Read", val: stats.chaptersRead, total: totalChapters },
                    { label: "Problems Solved", val: stats.problemsSolved, total: totalProblems },
                    { label: "Needs Revision", val: stats.toBeRevised, total: null },
                    { label: "Streak", val: stats.streak, total: null, suffix: " days" },
                ].map((stat) => (
                    <div key={stat.label} className="p-5 bg-surface-1 border border-border rounded-lg">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-3">{stat.label}</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold">{stat.val}</span>
                            {stat.total && <span className="text-xs text-muted-fg">/ {stat.total}</span>}
                            {stat.suffix && <span className="text-xs text-muted-fg">{stat.suffix}</span>}
                        </div>
                        {stat.total && (
                            <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-foreground/50 transition-all duration-1000 rounded-full"
                                    style={{ width: `${(stat.val / (stat.total || 1)) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-sm font-semibold">Quick Links</h2>
                    <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { title: "Cheatsheets", href: "/cheatsheets", desc: "Quick-reference guides for each topic." },
                        { title: "Code Templates", href: "/code-templates", desc: "Annotated C++ snippets for common patterns." },
                        { title: "Mental Game", href: "/mental-game", desc: "Burnout prevention and focus strategies." },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="p-5 bg-surface-1 border border-border rounded-lg hover:border-foreground/20 transition-colors group"
                        >
                            <h4 className="text-sm font-semibold mb-1 group-hover:text-foreground transition-colors">{item.title}</h4>
                            <p className="text-xs text-muted-fg leading-relaxed">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

