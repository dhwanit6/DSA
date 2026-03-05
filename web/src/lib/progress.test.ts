import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __unsafeRehydrateProgressForTests,
  __unsafeResetProgressForTests,
  getChecklistCompletion,
  getCompletionForecast,
  getCurrentStreak,
  getDashboardNudge,
  getProgressSnapshot,
  getWeeklyPlanner,
  isChecklistItemComplete,
  isPlannerTaskComplete,
  toggleChecklistItem,
  togglePlannerTask,
  type ProgressState,
} from "@/lib/progress";

function makeState(partial: Partial<ProgressState> = {}): ProgressState {
  return {
    version: 2,
    readChapters: [],
    solvedProblems: [],
    revisionMarks: [],
    completedChecklistItems: [],
    plannerTaskCompletions: [],
    profile: { track: "internship", dailyHours: 2 },
    activityDates: [],
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    ...partial,
  };
}

describe("progress store + planner behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    __unsafeResetProgressForTests(makeState());
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("generates planner tasks using weak phase and backlog signals", () => {
    const progress = makeState({
      readChapters: ["start-here", "progress-tracker", "two-tracks", "phase-0-cpp", "phase-1-foundations"],
      solvedProblems: Array.from({ length: 28 }).map((_, index) => `p-${index}`),
      revisionMarks: ["p-1", "p-2", "p-3", "p-4"],
      profile: { track: "internship", dailyHours: 3 },
    });

    const planner = getWeeklyPlanner(progress, new Date("2026-03-10T00:00:00.000Z"));

    expect(planner.summary).toContain("weak focus: graphs, greedy, and dynamic programming");
    expect(planner.days).toHaveLength(7);
    expect(planner.days[0].tasks[0]).toContain("Phase 2: Intermediate");
    expect(planner.days[3].tasks[2]).toContain("Clear");
  });

  it("persists checklist state across forced re-hydration", () => {
    toggleChecklistItem("phase-0-cpp", "setup");
    let snapshot = getProgressSnapshot();
    expect(isChecklistItemComplete(snapshot, "phase-0-cpp", "setup")).toBe(true);
    expect(getChecklistCompletion(snapshot, "phase-0-cpp", ["setup", "stl-drills", "pass-gate"])).toBe(33);

    __unsafeRehydrateProgressForTests();
    snapshot = getProgressSnapshot();
    expect(isChecklistItemComplete(snapshot, "phase-0-cpp", "setup")).toBe(true);
  });

  it("migrates legacy planner task keys to stable text-based keys", () => {
    const dateIso = "2026-03-10";
    __unsafeResetProgressForTests(
      makeState({
        plannerTaskCompletions: [`${dateIso}::task-0`],
      }),
    );

    let snapshot = getProgressSnapshot();
    expect(isPlannerTaskComplete(snapshot, dateIso, 0, "Read Start Here for 30 minutes")).toBe(true);

    togglePlannerTask(dateIso, 0, "Read Start Here for 30 minutes");
    snapshot = getProgressSnapshot();
    expect(snapshot.plannerTaskCompletions).toContain(`${dateIso}::read-start-here-for-30-minutes`);
    expect(snapshot.plannerTaskCompletions).not.toContain(`${dateIso}::task-0`);

    togglePlannerTask(dateIso, 0, "Read Start Here for 30 minutes");
    snapshot = getProgressSnapshot();
    expect(isPlannerTaskComplete(snapshot, dateIso, 0, "Read Start Here for 30 minutes")).toBe(false);
  });

  it("computes streak and forecast deterministically", () => {
    const progress = makeState({
      readChapters: ["start-here", "progress-tracker", "two-tracks", "phase-0-cpp", "phase-1-foundations"],
      solvedProblems: Array.from({ length: 20 }).map((_, index) => `p-${index}`),
      activityDates: ["2026-03-08", "2026-03-09", "2026-03-10"],
      createdAt: "2026-03-01T00:00:00.000Z",
    });

    expect(getCurrentStreak(progress)).toBe(3);

    const forecast = getCompletionForecast(progress);
    expect(forecast).not.toBeNull();
    expect(forecast?.daysToFinish).toBeGreaterThan(0);
    expect(forecast?.pacePerDay).toBeGreaterThan(0);
  });

  it("returns a track-selection nudge when track is undecided", () => {
    const undecided = makeState({
      profile: { track: "undecided", dailyHours: 2 },
    });
    const nudge = getDashboardNudge(undecided);
    expect(nudge.link).toBe("/two-tracks");
  });
});
