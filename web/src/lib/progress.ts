import { CHAPTER_MAP, CHAPTER_TOTAL, getOrderedChapterMeta } from "@/lib/chapters";

export const TOTAL_CHAPTERS = CHAPTER_TOTAL;
export const TOTAL_PROBLEMS = 120;

const STORAGE_KEY = "dsa-guide-progress-v2";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type TrackPreference = "undecided" | "internship" | "full-time" | "crash";

export interface ProgressProfile {
  track: TrackPreference;
  dailyHours: number;
}

export interface ProgressState {
  version: 2;
  readChapters: string[];
  solvedProblems: string[];
  revisionMarks: string[];
  completedChecklistItems: string[];
  plannerTaskCompletions: string[];
  profile: ProgressProfile;
  activityDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  chaptersRead: number;
  problemsSolved: number;
  overallPercent: number;
}

export interface DashboardNudge {
  title: string;
  link: string;
}

export interface PhasePathProgressItem {
  id: string;
  title: string;
  href: string;
  completed: number;
  total: number;
  percent: number;
}

export interface CompletionForecast {
  daysToFinish: number;
  pacePerDay: number;
  projectedDateIso: string;
}

export interface WeeklyPlannerDay {
  dateIso: string;
  label: string;
  focus: string;
  tasks: string[];
}

export interface WeeklyPlanner {
  summary: string;
  days: WeeklyPlannerDay[];
}

export interface TrackOption {
  id: TrackPreference;
  label: string;
  description: string;
}

export const TRACK_OPTIONS: TrackOption[] = [
  { id: "internship", label: "Internship", description: "Faster cycle focused on OA + interview execution." },
  { id: "full-time", label: "Full-Time", description: "Depth-first track with advanced topics and long runway." },
  { id: "crash", label: "Crash", description: "Emergency mode for < 4 months timeline." },
  { id: "undecided", label: "Undecided", description: "Start guided onboarding before choosing a lane." },
];

const TRACK_LABELS: Record<TrackPreference, string> = {
  undecided: "Undecided",
  internship: "Internship Track",
  "full-time": "Full-Time Track",
  crash: "Crash Track",
};

const TRACK_ROADMAPS: Record<TrackPreference, string[]> = {
  undecided: ["start-here", "progress-tracker", "two-tracks", "phase-0-cpp", "phase-1-foundations"],
  internship: [
    "start-here",
    "progress-tracker",
    "two-tracks",
    "phase-0-cpp",
    "phase-1-foundations",
    "phase-2-intermediate",
    "mechanics",
    "oa-strategy",
    "mock-sessions",
    "company-specific",
    "behavioral",
    "final-review",
  ],
  "full-time": [
    "start-here",
    "progress-tracker",
    "two-tracks",
    "phase-0-cpp",
    "phase-1-foundations",
    "phase-2-intermediate",
    "phase-3-advanced",
    "mechanics",
    "oa-strategy",
    "system-design-primer",
    "lld-ood-design",
    "estimation-mental-problems",
    "mock-sessions",
    "company-specific",
    "behavioral",
    "final-review",
  ],
  crash: ["start-here", "two-tracks", "crash-plans", "mechanics", "oa-strategy", "mock-sessions", "final-review"],
};

const PHASE_SEGMENTS: ReadonlyArray<{ id: string; title: string; href: string; slugs: string[] }> = [
  {
    id: "onboarding",
    title: "Onboarding",
    href: "/start-here",
    slugs: ["start-here", "progress-tracker", "two-tracks"],
  },
  { id: "phase0", title: "Phase 0", href: "/phase-0-cpp", slugs: ["phase-0-cpp"] },
  { id: "phase1", title: "Phase 1", href: "/phase-1-foundations", slugs: ["phase-1-foundations"] },
  { id: "phase2", title: "Phase 2", href: "/phase-2-intermediate", slugs: ["phase-2-intermediate"] },
  {
    id: "interview",
    title: "Interview",
    href: "/mechanics",
    slugs: ["mechanics", "oa-strategy", "mock-sessions", "final-review"],
  },
];

const CORE_PHASE_SEGMENTS: ReadonlyArray<{ id: string; title: string; href: string; slugs: string[] }> = [
  { id: "phase0", title: "Phase 0", href: "/phase-0-cpp", slugs: ["phase-0-cpp"] },
  { id: "phase1", title: "Phase 1", href: "/phase-1-foundations", slugs: ["phase-1-foundations"] },
  { id: "phase2", title: "Phase 2", href: "/phase-2-intermediate", slugs: ["phase-2-intermediate"] },
  { id: "phase3", title: "Phase 3", href: "/phase-3-advanced", slugs: ["phase-3-advanced"] },
];

const ORDERED_SLUGS = getOrderedChapterMeta().map((chapter) => chapter.slug);
const CHAPTER_ORDER_INDEX = new Map(ORDERED_SLUGS.map((slug, index) => [slug, index]));
const CHAPTER_SLUGS = new Set(Object.keys(CHAPTER_MAP));

const DEFAULT_PROGRESS: ProgressState = createDefaultProgress();
let progressSnapshot: ProgressState = DEFAULT_PROGRESS;
let isHydrated = false;
const listeners = new Set<() => void>();

function createDefaultProgress(): ProgressState {
  const now = new Date().toISOString();
  return {
    version: 2,
    readChapters: [],
    solvedProblems: [],
    revisionMarks: [],
    completedChecklistItems: [],
    plannerTaskCompletions: [],
    profile: {
      track: "undecided",
      dailyHours: 2,
    },
    activityDates: [],
    createdAt: now,
    updatedAt: now,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toUniqueArray(values: string[]): string[] {
  return Array.from(new Set(values));
}

function sortChapterSlugs(values: string[]): string[] {
  return [...values].sort((a, b) => {
    const ia = CHAPTER_ORDER_INDEX.get(a) ?? Number.MAX_SAFE_INTEGER;
    const ib = CHAPTER_ORDER_INDEX.get(b) ?? Number.MAX_SAFE_INTEGER;
    if (ia === ib) return a.localeCompare(b);
    return ia - ib;
  });
}

function sortLexicographic(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function clampDailyHours(value: number): number {
  if (Number.isNaN(value)) return 2;
  return Math.min(8, Math.max(1, Number(value.toFixed(1))));
}

function normalizeTrack(track: unknown): TrackPreference {
  if (track === "internship" || track === "full-time" || track === "crash" || track === "undecided") {
    return track;
  }
  return "undecided";
}

function parseLocalIsoDate(value: string): Date | null {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function formatLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayIsoDate(): string {
  return formatLocalIsoDate(new Date());
}

function addDays(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function markActivity(progress: ProgressState): ProgressState {
  const today = getTodayIsoDate();
  if (progress.activityDates.includes(today)) return progress;
  const activityDates = [...progress.activityDates, today].slice(-365);
  return { ...progress, activityDates };
}

function stampUpdatedAt(progress: ProgressState): ProgressState {
  return { ...progress, updatedAt: new Date().toISOString() };
}

function migrateProgress(raw: unknown): ProgressState {
  if (!isRecord(raw)) return createDefaultProgress();

  const now = new Date().toISOString();
  const profileRecord = isRecord(raw.profile) ? raw.profile : {};
  const legacyTrack = raw.track;
  const legacyHours = raw.dailyHours;

  const track = normalizeTrack(profileRecord.track ?? legacyTrack);
  const dailyHoursRaw = profileRecord.dailyHours ?? legacyHours;
  const dailyHours = typeof dailyHoursRaw === "number" ? clampDailyHours(dailyHoursRaw) : 2;

  const readChapters = sortChapterSlugs(
    toUniqueArray(normalizeStringArray(raw.readChapters)).filter((slug) => CHAPTER_SLUGS.has(slug)),
  );
  const solvedProblems = sortLexicographic(toUniqueArray(normalizeStringArray(raw.solvedProblems)));
  const revisionMarks = sortLexicographic(toUniqueArray(normalizeStringArray(raw.revisionMarks)));
  const completedChecklistItems = sortLexicographic(
    toUniqueArray(
      normalizeStringArray(
        raw.completedChecklistItems ?? raw.completedChecklist ?? raw.completedChecklistIds,
      ),
    ),
  );
  const plannerTaskCompletions = sortLexicographic(
    toUniqueArray(normalizeStringArray(raw.plannerTaskCompletions)),
  );
  const activityDates = sortLexicographic(
    toUniqueArray(normalizeStringArray(raw.activityDates)).filter((isoDate) => /^\d{4}-\d{2}-\d{2}$/.test(isoDate)),
  );

  return {
    version: 2,
    readChapters,
    solvedProblems,
    revisionMarks,
    completedChecklistItems,
    plannerTaskCompletions,
    profile: { track, dailyHours },
    activityDates,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : now,
  };
}

function readFromStorage(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return createDefaultProgress();
    const parsed = JSON.parse(serialized) as unknown;
    return migrateProgress(parsed);
  } catch {
    return createDefaultProgress();
  }
}

function persistToStorage(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore local storage failures (private mode, quota, etc.)
  }
}

function ensureHydrated(): void {
  if (isHydrated || typeof window === "undefined") return;
  progressSnapshot = readFromStorage();
  isHydrated = true;
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function commit(
  mutator: (current: ProgressState) => ProgressState,
  options: { recordActivity?: boolean } = {},
): void {
  ensureHydrated();
  const current = progressSnapshot;
  const candidate = mutator(current);
  if (candidate === current) return;

  const withActivity = options.recordActivity === false ? candidate : markActivity(candidate);
  const next = stampUpdatedAt(withActivity);
  progressSnapshot = next;
  persistToStorage(next);
  emit();
}

function toggleInArray(values: string[], value: string): string[] {
  const next = new Set(values);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return Array.from(next);
}

function normalizeProblemArray(values: string[]): string[] {
  return sortLexicographic(toUniqueArray(values));
}

function checklistKey(slug: string, itemId: string): string {
  return `${slug}::${itemId}`;
}

function normalizePlannerTaskId(taskIndex: number, taskText?: string): string {
  if (!taskText) return `task-${taskIndex}`;
  const normalized = taskText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return normalized || `task-${taskIndex}`;
}

function plannerTaskKey(dateIso: string, taskIndex: number, taskText?: string): string {
  return `${dateIso}::${normalizePlannerTaskId(taskIndex, taskText)}`;
}

function getRoadmap(track: TrackPreference): string[] {
  const path = TRACK_ROADMAPS[track] ?? TRACK_ROADMAPS.undecided;
  return path.filter((slug) => CHAPTER_SLUGS.has(slug));
}

function getNextUnreadFromRoadmap(progress: ProgressState): string | null {
  const read = new Set(progress.readChapters);
  const roadmap = getRoadmap(progress.profile.track);
  for (const slug of roadmap) {
    if (!read.has(slug)) return slug;
  }
  for (const slug of ORDERED_SLUGS) {
    if (!read.has(slug)) return slug;
  }
  return null;
}

function percent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
}

function getDailyProblemTarget(hours: number, track: TrackPreference): number {
  const base = hours <= 1.5 ? 2 : hours <= 2.5 ? 3 : hours <= 3.5 ? 4 : 5;
  if (track === "crash") return base + 1;
  return base;
}

function getDailyReviewTarget(problemTarget: number): number {
  return Math.max(1, Math.floor(problemTarget / 2));
}

function getDailyReadMinutes(hours: number): number {
  return Math.max(20, Math.min(60, Math.round(hours * 18)));
}

function getWeakPhaseId(progress: ProgressState): "phase0" | "phase1" | "phase2" | "phase3" | null {
  const weak = getWeakestCorePhase(progress);
  if (!weak) return null;
  if (weak.id === "phase0" || weak.id === "phase1" || weak.id === "phase2" || weak.id === "phase3") {
    return weak.id;
  }
  return null;
}

function getWeakPhaseSkillLabel(phaseId: string | null): string {
  if (phaseId === "phase0") return "C++ implementation speed and STL fluency";
  if (phaseId === "phase1") return "core patterns (arrays, binary search, recursion, trees)";
  if (phaseId === "phase2") return "graphs, greedy, and dynamic programming";
  if (phaseId === "phase3") return "advanced structures and hard-problem modeling";
  return "your active chapter's primary pattern";
}

function getTrackPracticeLine(
  track: TrackPreference,
  problemTarget: number,
  weakPhaseId: string | null,
  solvedCount: number,
): string {
  const skillLabel = getWeakPhaseSkillLabel(weakPhaseId);
  if (track === "full-time") {
    return `Solve ${problemTarget} problems with depth focus on ${skillLabel}; include at least 2 medium/hard attempts.`;
  }
  if (track === "crash") {
    return `Solve ${problemTarget} interview-priority problems on ${skillLabel} under strict timer blocks.`;
  }
  if (track === "internship") {
    if (solvedCount < 35) {
      return `Solve ${problemTarget} Tier 1 problems for speed, then 1 medium on ${skillLabel}.`;
    }
    return `Solve ${problemTarget} problems focused on ${skillLabel}; include at least 1 Tier 2 medium.`;
  }
  return `Solve ${Math.max(2, problemTarget - 1)} Tier 1 problems and finalize your track choice in dashboard.`;
}

function getFocusSpecificTask(
  focus: string,
  track: TrackPreference,
  problemTarget: number,
  weakPhaseId: string | null,
  reviewTarget: number,
  revisionBacklog: number,
): string {
  const skillLabel = getWeakPhaseSkillLabel(weakPhaseId);
  if (focus === "Concept Build") {
    return `Write one short note on ${skillLabel}, then solve ${Math.max(2, problemTarget - 1)} problems without rushing.`;
  }
  if (focus === "Pattern Practice") {
    return `Do ${problemTarget} pattern-focused problems and tag each with its trigger before coding.`;
  }
  if (focus === "Speed Drill") {
    return `Run a 60-minute speed block: ${Math.max(2, problemTarget - 1)} medium attempts on ${skillLabel}.`;
  }
  if (focus === "Revision Loop") {
    if (revisionBacklog > 0) {
      return `Clear ${Math.min(revisionBacklog, reviewTarget + 1)} items from revision backlog, then re-solve 1 weak problem cold.`;
    }
    return `Revise ${reviewTarget} recently solved problems and mark any shaky ones for follow-up.`;
  }
  if (focus === "Timed Session") {
    if (track === "crash") return "Run a full OA-style 90-minute session (3 problems) and log mistakes.";
    return "Run one 45-minute timed interview problem and debrief with 3 concrete improvements.";
  }
  if (focus === "Mock + Debrief") {
    return "Complete one mock interview and write a debrief with communication, complexity, and testing gaps.";
  }
  return "Review this week, set next week's chapter targets, and lock your study slots in calendar.";
}

export function subscribeProgress(listener: () => void): () => void {
  ensureHydrated();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProgressSnapshot(): ProgressState {
  ensureHydrated();
  return progressSnapshot;
}

export function getProgressServerSnapshot(): ProgressState {
  return DEFAULT_PROGRESS;
}

// Test helper: resets singleton state for deterministic unit tests.
export function __unsafeResetProgressForTests(seed?: ProgressState): void {
  progressSnapshot = seed ?? createDefaultProgress();
  isHydrated = true;
  listeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressSnapshot));
    } catch {
      // Ignore storage errors in tests.
    }
  }
}

// Test helper: forces next getProgressSnapshot() call to hydrate from storage.
export function __unsafeRehydrateProgressForTests(): void {
  isHydrated = false;
}

export function toggleChapterRead(slug: string): void {
  if (!CHAPTER_SLUGS.has(slug)) return;

  commit((current) => {
    const toggled = toggleInArray(current.readChapters, slug);
    const readChapters = sortChapterSlugs(toggled);
    if (
      readChapters.length === current.readChapters.length &&
      readChapters.every((value, index) => value === current.readChapters[index])
    ) {
      return current;
    }
    return { ...current, readChapters };
  });
}

export function toggleProblem(problemId: string): void {
  commit((current) => {
    const solved = new Set(current.solvedProblems);
    const revision = new Set(current.revisionMarks);

    if (solved.has(problemId)) {
      solved.delete(problemId);
      revision.delete(problemId);
    } else {
      solved.add(problemId);
    }

    const solvedProblems = normalizeProblemArray(Array.from(solved));
    const revisionMarks = normalizeProblemArray(Array.from(revision));

    if (
      solvedProblems.length === current.solvedProblems.length &&
      solvedProblems.every((value, index) => value === current.solvedProblems[index]) &&
      revisionMarks.length === current.revisionMarks.length &&
      revisionMarks.every((value, index) => value === current.revisionMarks[index])
    ) {
      return current;
    }

    return { ...current, solvedProblems, revisionMarks };
  });
}

export function toggleRevisionMark(problemId: string): void {
  commit((current) => {
    const revisionMarks = normalizeProblemArray(toggleInArray(current.revisionMarks, problemId));
    if (
      revisionMarks.length === current.revisionMarks.length &&
      revisionMarks.every((value, index) => value === current.revisionMarks[index])
    ) {
      return current;
    }
    return { ...current, revisionMarks };
  });
}

export function setTrackPreference(track: TrackPreference): void {
  commit(
    (current) => {
      if (current.profile.track === track) return current;
      return { ...current, profile: { ...current.profile, track } };
    },
    { recordActivity: false },
  );
}

export function setDailyHours(hours: number): void {
  const nextHours = clampDailyHours(hours);
  commit(
    (current) => {
      if (current.profile.dailyHours === nextHours) return current;
      return { ...current, profile: { ...current.profile, dailyHours: nextHours } };
    },
    { recordActivity: false },
  );
}

export function toggleChecklistItem(slug: string, itemId: string): void {
  if (!slug || !itemId) return;
  const key = checklistKey(slug, itemId);

  commit((current) => {
    const completedChecklistItems = normalizeProblemArray(toggleInArray(current.completedChecklistItems, key));
    if (
      completedChecklistItems.length === current.completedChecklistItems.length &&
      completedChecklistItems.every((value, index) => value === current.completedChecklistItems[index])
    ) {
      return current;
    }
    return { ...current, completedChecklistItems };
  });
}

export function isChecklistItemComplete(progress: ProgressState, slug: string, itemId: string): boolean {
  return progress.completedChecklistItems.includes(checklistKey(slug, itemId));
}

export function togglePlannerTask(dateIso: string, taskIndex: number, taskText?: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) return;
  if (taskIndex < 0) return;

  const key = plannerTaskKey(dateIso, taskIndex, taskText);
  const legacyKey = plannerTaskKey(dateIso, taskIndex);
  commit((current) => {
    const base = current.plannerTaskCompletions.filter((entry) => entry !== legacyKey || legacyKey === key);
    const plannerTaskCompletions = normalizeProblemArray(toggleInArray(base, key));
    if (
      plannerTaskCompletions.length === current.plannerTaskCompletions.length &&
      plannerTaskCompletions.every((value, index) => value === current.plannerTaskCompletions[index])
    ) {
      return current;
    }
    return { ...current, plannerTaskCompletions };
  });
}

export function isPlannerTaskComplete(
  progress: ProgressState,
  dateIso: string,
  taskIndex: number,
  taskText?: string,
): boolean {
  const primary = plannerTaskKey(dateIso, taskIndex, taskText);
  const legacy = plannerTaskKey(dateIso, taskIndex);
  return progress.plannerTaskCompletions.includes(primary) || progress.plannerTaskCompletions.includes(legacy);
}

export function getChecklistCompletion(progress: ProgressState, slug: string, itemIds: string[]): number {
  if (itemIds.length === 0) return 0;
  const completed = itemIds.filter((itemId) => isChecklistItemComplete(progress, slug, itemId)).length;
  return percent(completed, itemIds.length);
}

export function getTrackRoadmap(track: TrackPreference): string[] {
  return getRoadmap(track);
}

export function getTrackLabel(track: TrackPreference): string {
  return TRACK_LABELS[track];
}

export function getNextRecommendedChapter(progress: ProgressState): string | null {
  return getNextUnreadFromRoadmap(progress);
}

export function getStats(progress: ProgressState): ProgressStats {
  const chaptersRead = progress.readChapters.length;
  const problemsSolved = progress.solvedProblems.length;
  const totalUnits = TOTAL_CHAPTERS + TOTAL_PROBLEMS;
  const completedUnits = chaptersRead + problemsSolved;
  return {
    chaptersRead,
    problemsSolved,
    overallPercent: percent(completedUnits, totalUnits),
  };
}

export function getRevisionCount(progress: ProgressState): number {
  return progress.revisionMarks.length;
}

export function getCurrentStreak(progress: ProgressState): number {
  if (progress.activityDates.length === 0) return 0;

  const seen = new Set(progress.activityDates);
  const today = new Date();
  const todayIso = formatLocalIsoDate(today);
  let cursor = today;

  if (!seen.has(todayIso)) {
    const yesterday = addDays(today, -1);
    if (!seen.has(formatLocalIsoDate(yesterday))) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (seen.has(formatLocalIsoDate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getPhasePathProgress(progress: ProgressState): PhasePathProgressItem[] {
  const read = new Set(progress.readChapters);
  return PHASE_SEGMENTS.map((segment) => {
    const completed = segment.slugs.filter((slug) => read.has(slug)).length;
    return {
      id: segment.id,
      title: segment.title,
      href: segment.href,
      completed,
      total: segment.slugs.length,
      percent: percent(completed, segment.slugs.length),
    };
  });
}

export function getWeakestCorePhase(progress: ProgressState): PhasePathProgressItem | null {
  const read = new Set(progress.readChapters);
  const phases = CORE_PHASE_SEGMENTS.map((segment) => {
    const completed = segment.slugs.filter((slug) => read.has(slug)).length;
    return {
      id: segment.id,
      title: segment.title,
      href: segment.href,
      completed,
      total: segment.slugs.length,
      percent: percent(completed, segment.slugs.length),
    };
  });

  const incomplete = phases.filter((phase) => phase.percent < 100);
  if (incomplete.length === 0) return null;
  incomplete.sort((a, b) => a.percent - b.percent || a.title.localeCompare(b.title));
  return incomplete[0];
}

export function getDashboardNudge(progress: ProgressState): DashboardNudge {
  if (progress.profile.track === "undecided") {
    return {
      title: "Pick your track first (Internship / Full-Time / Crash) before adding more chapters.",
      link: "/two-tracks",
    };
  }

  const nextSlug = getNextUnreadFromRoadmap(progress);
  if (nextSlug) {
    return {
      title: `Continue with ${CHAPTER_MAP[nextSlug]?.title ?? nextSlug}.`,
      link: `/${nextSlug}`,
    };
  }

  if (progress.revisionMarks.length > 0) {
    return {
      title: `Revise ${Math.min(5, progress.revisionMarks.length)} marked problem(s) before adding new ones.`,
      link: "/problems",
    };
  }

  if (progress.solvedProblems.length < 120) {
    return {
      title: "Push problem velocity this week and complete your next 10 solves.",
      link: "/problems",
    };
  }

  return {
    title: "Run a full mock and lock final interview readiness.",
    link: "/final-review",
  };
}

export function getCompletionForecast(progress: ProgressState): CompletionForecast | null {
  const completedUnits = progress.readChapters.length + progress.solvedProblems.length;
  if (completedUnits < 5) return null;

  const totalUnits = TOTAL_CHAPTERS + TOTAL_PROBLEMS;
  const remainingUnits = Math.max(0, totalUnits - completedUnits);

  const sortedActivity = [...progress.activityDates].sort((a, b) => a.localeCompare(b));
  const firstActivityDate = sortedActivity[0] ? parseLocalIsoDate(sortedActivity[0]) : null;
  const startDate = firstActivityDate ?? new Date(progress.createdAt);
  if (Number.isNaN(startDate.getTime())) return null;

  const today = new Date();
  const elapsedDays = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY) + 1);
  const pacePerDay = completedUnits / elapsedDays;

  if (pacePerDay < 0.15) return null;
  if (remainingUnits === 0) {
    return {
      daysToFinish: 0,
      pacePerDay,
      projectedDateIso: formatLocalIsoDate(today),
    };
  }

  const daysToFinish = Math.max(1, Math.ceil(remainingUnits / pacePerDay));
  const projected = addDays(today, daysToFinish);

  return {
    daysToFinish,
    pacePerDay,
    projectedDateIso: formatLocalIsoDate(projected),
  };
}

export function getWeeklyPlanner(progress: ProgressState, startDate: Date = new Date()): WeeklyPlanner {
  const track = progress.profile.track;
  const dailyHours = progress.profile.dailyHours;
  const solvedCount = progress.solvedProblems.length;
  const revisionBacklog = progress.revisionMarks.length;
  const weakPhaseId = getWeakPhaseId(progress);
  const problemTarget = getDailyProblemTarget(dailyHours, track);
  const reviewTarget = getDailyReviewTarget(problemTarget);
  const readMinutes = getDailyReadMinutes(dailyHours);
  const roadmap = getRoadmap(track);
  const read = new Set(progress.readChapters);
  const upcoming = roadmap.filter((slug) => !read.has(slug));
  const fallbackSlug = getNextUnreadFromRoadmap(progress) ?? "final-review";
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  const dayFocus = [
    "Concept Build",
    "Pattern Practice",
    "Speed Drill",
    "Revision Loop",
    "Timed Session",
    "Mock + Debrief",
    "Weekly Reset",
  ] as const;

  const days: WeeklyPlannerDay[] = dayFocus.map((focus, index) => {
    const date = addDays(start, index);
    const dateIso = formatLocalIsoDate(date);
    const label = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);

    const chapterSlug = upcoming[index] ?? upcoming[upcoming.length - 1] ?? fallbackSlug;
    const chapterTitle = CHAPTER_MAP[chapterSlug]?.title ?? "Revision Chapter";
    const tasks: string[] = [
      `Read ${chapterTitle} for ${readMinutes} minutes and mark it complete.`,
      getTrackPracticeLine(track, problemTarget, weakPhaseId, solvedCount),
      getFocusSpecificTask(focus, track, problemTarget, weakPhaseId, reviewTarget, revisionBacklog),
    ];

    if (track === "undecided" && index === 0) {
      tasks.unshift("Pick your track on the dashboard before starting today's study block.");
    }

    if (index === 5) {
      tasks[2] = "Run one 45-minute mock interview and write 3 concrete fixes afterward.";
    }
    if (index === 6) {
      tasks[2] = `Close the week by revising ${reviewTarget + 1} problems and planning next week's chapter targets.`;
    }
    if (index === 2) {
      tasks.push("Log one pattern journal entry immediately after practice.");
    }

    return { dateIso, label, focus, tasks };
  });

  return {
    summary: `${getTrackLabel(track)} | ${dailyHours}h/day | target ${problemTarget} problems/day | weak focus: ${getWeakPhaseSkillLabel(weakPhaseId)}`,
    days,
  };
}
