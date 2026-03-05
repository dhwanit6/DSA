"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getTrackLabel,
  getWeeklyPlanner,
  getCompletionForecast,
  getCurrentStreak,
  getDashboardNudge,
  getPhasePathProgress,
  getProgressServerSnapshot,
  getProgressSnapshot,
  getRevisionCount,
  getStats,
  TOTAL_CHAPTERS,
  TOTAL_PROBLEMS,
  TRACK_OPTIONS,
  isPlannerTaskComplete,
  type TrackPreference,
  getWeakestCorePhase,
  setDailyHours,
  setTrackPreference,
  subscribeProgress,
  togglePlannerTask,
} from "@/lib/progress";

function getMilestoneMessage(solved: number): string | null {
  if (solved >= 100) return "100 problems solved. You now have pattern memory most candidates never build.";
  if (solved >= 75) return "75 done. Medium problems should start feeling familiar now.";
  if (solved >= 50) return "50 done. You are past the highest drop-off point.";
  if (solved >= 25) return "25 solved. Momentum is real now - protect it.";
  if (solved >= 10) return "First 10 done. Consistency is forming.";
  return null;
}

export default function DashboardPage() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const stats = getStats(progress);
  const streak = getCurrentStreak(progress);
  const revisionCount = getRevisionCount(progress);
  const nudge = getDashboardNudge(progress);
  const milestone = getMilestoneMessage(stats.problemsSolved);
  const phasePath = getPhasePathProgress(progress);
  const weakestPhase = getWeakestCorePhase(progress);
  const forecast = getCompletionForecast(progress);
  const weeklyPlan = getWeeklyPlanner(progress);
  const trackLabel = getTrackLabel(progress.profile.track);
  const todayPlan = weeklyPlan.days[0];
  const todayCompleted = todayPlan
    ? todayPlan.tasks.filter((task, index) => isPlannerTaskComplete(progress, todayPlan.dateIso, index, task)).length
    : 0;

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10 lg:py-16">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-4">Dashboard</p>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">My Progress</h1>
        <p className="text-base text-muted-fg leading-relaxed max-w-xl">
          Track your path, clear weak spots, and keep your daily rhythm steady.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-lg border border-border bg-surface-1 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">Track Setup</p>
          <p className="text-sm text-foreground/85 mb-4">
            Current: <span className="font-medium">{trackLabel}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {TRACK_OPTIONS.map((option) => {
              const active = progress.profile.track === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTrackPreference(option.id as TrackPreference)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-foreground/25 bg-surface-2"
                      : "border-border text-muted-fg hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs mt-1 leading-relaxed">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="daily-hours" className="text-xs text-muted-fg">
              Daily commitment: {progress.profile.dailyHours} hours
            </label>
            <input
              id="daily-hours"
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={progress.profile.dailyHours}
              onChange={(event) => setDailyHours(Number(event.target.value))}
              className="mt-2 w-full accent-foreground"
            />
            <p className="mt-2 text-xs text-muted-fg">Planner and task volume update automatically.</p>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-surface-1 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">This Week Snapshot</p>
          <p className="text-sm text-foreground/85 mb-4">{weeklyPlan.summary}</p>
          {todayPlan && (
            <div className="rounded-md border border-border bg-background/60 px-3 py-3 mb-4">
              <p className="font-medium text-foreground/90 mb-2">
                Today ({todayPlan.label}) - {todayPlan.focus}
              </p>
              <div className="space-y-2 text-xs text-muted-fg">
                {todayPlan.tasks.map((task, index) => {
                  const done = isPlannerTaskComplete(progress, todayPlan.dateIso, index, task);
                  return (
                    <label key={`${todayPlan.dateIso}-${task}`} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => togglePlannerTask(todayPlan.dateIso, index, task)}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-green-500"
                      />
                      <span className={done ? "line-through decoration-green-500/70 decoration-2" : ""}>
                        {index + 1}. {task}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-fg">
                {todayCompleted} / {todayPlan.tasks.length} tasks complete today
              </p>
            </div>
          )}
          <div className="space-y-2 text-xs text-muted-fg mb-5">
            {weeklyPlan.days.slice(1, 3).map((day) => (
              <p key={day.dateIso}>
                {day.label}: {day.focus}
              </p>
            ))}
          </div>
          <Link
            href="/planner"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-fg hover:text-foreground hover:border-foreground/25 transition-colors"
          >
            Open Full 7-Day Planner
          </Link>
        </div>
      </section>

      {milestone && (
        <div className="mb-8 p-4 border border-border/60 rounded-lg bg-surface-1/50">
          <p className="text-sm text-foreground/85">{milestone}</p>
        </div>
      )}

      <Link
        href={nudge.link}
        className="block mb-8 p-5 bg-surface-1 border border-border rounded-lg hover:border-foreground/20 transition-colors group"
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-2">Next Step</p>
        <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
          {nudge.title}
        </p>
      </Link>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Chapters Read", val: stats.chaptersRead, total: TOTAL_CHAPTERS },
          { label: "Problems Solved", val: stats.problemsSolved, total: TOTAL_PROBLEMS },
          { label: "Needs Revision", val: revisionCount, total: null },
          { label: "Streak", val: streak, total: null, suffix: " days" },
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
                  className="h-full bg-foreground/50 transition-all duration-700 rounded-full"
                  style={{ width: `${Math.min((stat.val / (stat.total || 1)) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-sm font-semibold">Phase Path</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {phasePath.map((phase) => (
            <div key={phase.id} className="p-4 rounded-lg border border-border bg-surface-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">{phase.title}</p>
              <p className="text-lg font-semibold mb-2">{phase.percent}%</p>
              <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-foreground/60 rounded-full transition-all duration-700"
                  style={{ width: `${phase.percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-fg">{phase.completed} / {phase.total} done</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-border bg-surface-1">
          <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">ETA</p>
          {forecast ? (
            <>
              <p className="text-xl font-semibold mb-1">{forecast.daysToFinish} days to finish</p>
              <p className="text-sm text-muted-fg">
                Based on your current pace of {forecast.pacePerDay.toFixed(1)} units/day.
              </p>
              <p className="text-xs text-muted-fg mt-2">Projected completion date: {forecast.projectedDateIso}</p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold mb-1">No estimate yet</p>
              <p className="text-sm text-muted-fg">Solve a few problems and the estimate will appear.</p>
            </>
          )}
        </div>

        <div className="p-5 rounded-lg border border-border bg-surface-1">
          <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-2">Weakest Core Phase</p>
          {weakestPhase ? (
            <>
              <p className="text-xl font-semibold mb-1">{weakestPhase.title}</p>
              <p className="text-sm text-muted-fg">Current completion: {weakestPhase.percent}%</p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold mb-1">Core phases stable</p>
              <p className="text-sm text-muted-fg">You are not currently behind on Phase 0-3.</p>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-sm font-semibold">Quick Links</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Start Here", href: "/start-here", desc: "Reset your plan in 10 minutes." },
            { title: "Problems", href: "/problems", desc: "Continue problem practice and revision." },
            { title: "Weekly Planner", href: "/planner", desc: "Get your auto-generated 7-day execution plan." },
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
