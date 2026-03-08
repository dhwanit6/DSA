"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getProgressServerSnapshot,
  getProgressSnapshot,
  getTrackLabel,
  getWeeklyPlanner,
  isPlannerTaskComplete,
  setDailyHours,
  setTrackPreference,
  subscribeProgress,
  togglePlannerTask,
  TRACK_OPTIONS,
  type TrackPreference,
} from "@/lib/progress";

export default function PlannerPage() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const plan = getWeeklyPlanner(progress);
  const trackLabel = getTrackLabel(progress.profile.track);

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-10 lg:py-16">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg mb-3">Weekly Planner</p>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">7-Day Execution Plan</h1>
        <p className="text-sm text-muted-fg max-w-2xl leading-relaxed">
          Auto-generated from your current track and daily hours. Keep this simple: complete the tasks for today, then
          return tomorrow.
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-border bg-surface-1 p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted-fg mb-2">Track: {trackLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {TRACK_OPTIONS.map((option) => {
                const active = progress.profile.track === option.id;
                return (
                  <button
                    key={option.id}
                    data-testid={`planner-track-option-${option.id}`}
                    type="button"
                    onClick={() => setTrackPreference(option.id as TrackPreference)}
                    className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                      active
                        ? "border-foreground/25 bg-surface-2 text-foreground"
                        : "border-border text-muted-fg hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    <p className="font-medium text-sm mb-1">{option.label}</p>
                    <p>{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="planner-hours" className="text-xs text-muted-fg">
              Daily study commitment: {progress.profile.dailyHours} hours
            </label>
            <input
              id="planner-hours"
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={progress.profile.dailyHours}
              onChange={(event) => setDailyHours(Number(event.target.value))}
              className="mt-2 w-full accent-foreground"
            />
            <p className="mt-3 text-sm text-foreground/85">{plan.summary}</p>
            <p className="mt-2 text-xs text-muted-fg">
              Tip: Keep the same hours for at least one full week before changing again.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {plan.days.map((day) => (
          <article key={day.dateIso} data-testid="planner-day-card" className="rounded-lg border border-border bg-surface-1 p-4">
            <p className="text-[11px] uppercase tracking-widest text-muted-fg mb-1">{day.label}</p>
            <h2 className="text-sm font-semibold mb-3">{day.focus}</h2>
            <div className="space-y-2 text-sm text-foreground/85">
              {day.tasks.map((task, index) => {
                const done = isPlannerTaskComplete(progress, day.dateIso, index, task);
                return (
                  <label
                    key={`${day.dateIso}-${task}`}
                    className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 transition-colors ${
                      done
                        ? "border-green-600/30 bg-green-500/10 text-foreground/75"
                        : "border-border bg-background/50 hover:border-foreground/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => togglePlannerTask(day.dateIso, index, task)}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-green-500"
                    />
                    <span className={done ? "line-through decoration-green-500/70 decoration-2" : ""}>
                      {index + 1}. {task}
                    </span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <footer className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-fg hover:text-foreground hover:border-foreground/25 transition-colors"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/problems"
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-fg hover:text-foreground hover:border-foreground/25 transition-colors"
        >
          Open Problems
        </Link>
      </footer>
    </div>
  );
}
