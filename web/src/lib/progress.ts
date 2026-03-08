import { CHAPTER_MAP, CHAPTER_TOTAL, getOrderedChapterMeta, type ChapterConfig } from "@/lib/chapters";

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
  completedEffortPoints: number;
  totalEffortPoints: number;
  remainingEffortPoints: number;
  estimatedHoursLeft: number;
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
  remainingEffortPoints: number;
  remainingStudyHours: number;
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

const CS_FUNDAMENTALS_SLUGS = [
  "cs-fundamentals-roadmap",
  "dbms-sql",
  "operating-systems",
  "computer-networks",
  "concurrency-multithreading",
  "system-design-primer",
  "lld-ood-design",
  "estimation-mental-problems",
] as const;

const TRACK_ROADMAPS: Record<TrackPreference, string[]> = {
  undecided: [
    "start-here",
    "progress-tracker",
    "two-tracks",
    "phase-0-cpp",
    "phase-1-foundations",
    "cs-fundamentals-roadmap",
  ],
  internship: [
    "start-here",
    "progress-tracker",
    "two-tracks",
    "phase-0-cpp",
    "phase-1-foundations",
    "phase-2-intermediate",
    "mechanics",
    "oa-strategy",
    "cs-fundamentals-roadmap",
    "dbms-sql",
    "operating-systems",
    "computer-networks",
    "concurrency-multithreading",
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
    "cs-fundamentals-roadmap",
    "dbms-sql",
    "operating-systems",
    "computer-networks",
    "concurrency-multithreading",
    "system-design-primer",
    "lld-ood-design",
    "estimation-mental-problems",
    "mock-sessions",
    "company-specific",
    "behavioral",
    "final-review",
  ],
  crash: [
    "start-here",
    "progress-tracker",
    "two-tracks",
    "crash-plans",
    "mechanics",
    "oa-strategy",
    "cs-fundamentals-roadmap",
    "dbms-sql",
    "operating-systems",
    "computer-networks",
    "concurrency-multithreading",
    "mock-sessions",
    "company-specific",
    "behavioral",
    "final-review",
  ],
};

type SegmentDef = { id: string; title: string; href: string; slugs: string[] };

const SEGMENT_DEFINITIONS: Record<string, SegmentDef> = {
  onboarding: {
    id: "onboarding",
    title: "Onboarding",
    href: "/start-here",
    slugs: ["start-here", "progress-tracker", "two-tracks"],
  },
  phase0: { id: "phase0", title: "Phase 0", href: "/phase-0-cpp", slugs: ["phase-0-cpp"] },
  phase1: { id: "phase1", title: "Phase 1", href: "/phase-1-foundations", slugs: ["phase-1-foundations"] },
  phase2: { id: "phase2", title: "Phase 2", href: "/phase-2-intermediate", slugs: ["phase-2-intermediate"] },
  phase3: { id: "phase3", title: "Phase 3", href: "/phase-3-advanced", slugs: ["phase-3-advanced"] },
  crash: { id: "crash", title: "Crash Plan", href: "/crash-plans", slugs: ["crash-plans"] },
  "cs-fundamentals": {
    id: "cs-fundamentals",
    title: "CS Fundamentals",
    href: "/cs-fundamentals-roadmap",
    slugs: [...CS_FUNDAMENTALS_SLUGS],
  },
  interview: {
    id: "interview",
    title: "Interview",
    href: "/mechanics",
    slugs: ["mechanics", "oa-strategy", "mock-sessions", "company-specific", "behavioral", "final-review"],
  },
};

const CS_FUNDAMENTALS_BREAKDOWN: ReadonlyArray<SegmentDef> = [
  { id: "fund-dbms", title: "DBMS", href: "/dbms-sql", slugs: ["dbms-sql"] },
  { id: "fund-os", title: "OS", href: "/operating-systems", slugs: ["operating-systems"] },
  { id: "fund-networks", title: "Networks", href: "/computer-networks", slugs: ["computer-networks"] },
  { id: "fund-concurrency", title: "Concurrency", href: "/concurrency-multithreading", slugs: ["concurrency-multithreading"] },
  {
    id: "fund-design",
    title: "Design",
    href: "/system-design-primer",
    slugs: ["system-design-primer", "lld-ood-design", "estimation-mental-problems"],
  },
];

const CATEGORY_EFFORT_POINTS: Record<ChapterConfig["category"], number> = {
  "Learning Path": 2.5,
  Interview: 2.25,
  "CS Fundamentals": 3.75,
  Topics: 2.5,
  Reference: 1.5,
};

const CHAPTER_EFFORT_OVERRIDES: Partial<Record<string, number>> = {
  "start-here": 2,
  "progress-tracker": 1.5,
  "two-tracks": 1.5,
  "phase-0-cpp": 5,
  "phase-1-foundations": 7,
  "phase-2-intermediate": 8,
  "phase-3-advanced": 7,
  mechanics: 3,
  "oa-strategy": 3,
  "cs-fundamentals-roadmap": 2.5,
  "dbms-sql": 4.5,
  "operating-systems": 4.5,
  "computer-networks": 4.25,
  "concurrency-multithreading": 4.5,
  "system-design-primer": 4.5,
  "lld-ood-design": 4,
  "estimation-mental-problems": 3,
  "mock-sessions": 3.5,
  "company-specific": 2,
  behavioral: 2.5,
  "final-review": 2,
  "post-placement": 1.5,
  "complexity-analysis": 3,
  "pattern-recognition": 3,
  "sorting-algorithms": 2.5,
  "debugging-testing": 2.5,
  "ai-era-mastery": 2,
  cheatsheets: 1.25,
  "code-templates": 1.5,
  "language-flexibility": 1.5,
  "common-mistakes": 1.5,
  "patterns-journal-template": 1.25,
  "mental-game": 1.5,
  resources: 1.5,
  "crash-plans": 2.5,
};

const PROBLEM_EFFORT_POINTS = 0.6;
const EFFORT_POINT_HOURS = 0.75;

const CORE_PHASE_SEGMENTS: ReadonlyArray<SegmentDef> = [
  SEGMENT_DEFINITIONS.phase0,
  SEGMENT_DEFINITIONS.phase1,
  SEGMENT_DEFINITIONS.phase2,
  SEGMENT_DEFINITIONS.phase3,
];

const ORDERED_SLUGS = getOrderedChapterMeta().map((chapter) => chapter.slug);
const CHAPTER_ORDER_INDEX = new Map(ORDERED_SLUGS.map((slug, index) => [slug, index]));
const CHAPTER_SLUGS = new Set(Object.keys(CHAPTER_MAP));
const TOTAL_CHAPTER_EFFORT_POINTS = roundToTenths(
  ORDERED_SLUGS.reduce((sum, slug) => sum + getChapterEffortPoints(slug), 0),
);
const TOTAL_LIBRARY_EFFORT_POINTS = roundToTenths(TOTAL_CHAPTER_EFFORT_POINTS + TOTAL_PROBLEMS * PROBLEM_EFFORT_POINTS);

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

function getRelevantPathSegments(track: TrackPreference): SegmentDef[] {
  if (track === "full-time") {
    return [
      SEGMENT_DEFINITIONS.onboarding,
      SEGMENT_DEFINITIONS.phase0,
      SEGMENT_DEFINITIONS.phase1,
      SEGMENT_DEFINITIONS.phase2,
      SEGMENT_DEFINITIONS.phase3,
      SEGMENT_DEFINITIONS["cs-fundamentals"],
      SEGMENT_DEFINITIONS.interview,
    ];
  }
  if (track === "internship") {
    return [
      SEGMENT_DEFINITIONS.onboarding,
      SEGMENT_DEFINITIONS.phase0,
      SEGMENT_DEFINITIONS.phase1,
      SEGMENT_DEFINITIONS.phase2,
      SEGMENT_DEFINITIONS["cs-fundamentals"],
      SEGMENT_DEFINITIONS.interview,
    ];
  }
  if (track === "crash") {
    return [
      SEGMENT_DEFINITIONS.onboarding,
      SEGMENT_DEFINITIONS.crash,
      SEGMENT_DEFINITIONS["cs-fundamentals"],
      SEGMENT_DEFINITIONS.interview,
    ];
  }
  return [
    SEGMENT_DEFINITIONS.onboarding,
    SEGMENT_DEFINITIONS.phase0,
    SEGMENT_DEFINITIONS.phase1,
    SEGMENT_DEFINITIONS["cs-fundamentals"],
    SEGMENT_DEFINITIONS.interview,
  ];
}

function getRelevantCorePhaseSegments(track: TrackPreference): SegmentDef[] {
  if (track === "full-time") return [...CORE_PHASE_SEGMENTS];
  if (track === "internship") return CORE_PHASE_SEGMENTS.filter((segment) => segment.id !== "phase3");
  if (track === "undecided") return CORE_PHASE_SEGMENTS.filter((segment) => segment.id === "phase0" || segment.id === "phase1");
  return [];
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

function roundToTenths(value: number): number {
  return Math.round(value * 10) / 10;
}

function getChapterEffortPoints(slug: string): number {
  const chapter = CHAPTER_MAP[slug];
  if (!chapter) return CATEGORY_EFFORT_POINTS.Reference;
  return CHAPTER_EFFORT_OVERRIDES[slug] ?? CATEGORY_EFFORT_POINTS[chapter.category];
}

function getCompletedChapterEffortPoints(progress: ProgressState): number {
  return roundToTenths(progress.readChapters.reduce((sum, slug) => sum + getChapterEffortPoints(slug), 0));
}

function getCompletedProblemEffortPoints(progress: ProgressState): number {
  return roundToTenths(progress.solvedProblems.length * PROBLEM_EFFORT_POINTS);
}

function getCompletedEffortPoints(progress: ProgressState): number {
  return roundToTenths(getCompletedChapterEffortPoints(progress) + getCompletedProblemEffortPoints(progress));
}

function getRemainingEffortPoints(progress: ProgressState): number {
  return roundToTenths(Math.max(0, TOTAL_LIBRARY_EFFORT_POINTS - getCompletedEffortPoints(progress)));
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

function getChapterExecutionTask(
  chapterSlug: string,
  track: TrackPreference,
  problemTarget: number,
  weakPhaseId: string | null,
  solvedCount: number,
): string {
  if (chapterSlug === "cs-fundamentals-roadmap") {
    return "Lock your fundamentals order and reserve 3 weekly slots: DBMS -> OS -> Networks -> Concurrency -> Design.";
  }
  if (chapterSlug === "dbms-sql") {
    return "Write 3 SQL queries today: one JOIN, one GROUP BY, and one subquery; explain one good index choice.";
  }
  if (chapterSlug === "operating-systems") {
    return "Answer 5 oral questions on process vs thread, stack vs heap, paging, context switch, and deadlock.";
  }
  if (chapterSlug === "computer-networks") {
    return "Explain one request end-to-end: DNS -> TCP/TLS -> HTTP -> server -> response, then compare TCP vs UDP.";
  }
  if (chapterSlug === "concurrency-multithreading") {
    return "Trace one race condition, fix it with a mutex or atomic, and explain one deadlock prevention rule.";
  }
  if (chapterSlug === "system-design-primer") {
    return "Run one 30-minute design drill: requirements, scale, APIs, data model, bottlenecks, and tradeoffs.";
  }
  if (chapterSlug === "lld-ood-design") {
    return "Model one LLD problem with entities, interfaces, responsibilities, and one end-to-end walkthrough.";
  }
  if (chapterSlug === "estimation-mental-problems") {
    return "Do 2 estimation drills and say every assumption, unit conversion, and sanity check out loud.";
  }
  return getTrackPracticeLine(track, problemTarget, weakPhaseId, solvedCount);
}

function getFundamentalsFocusTask(focus: string, chapterSlug: string, track: TrackPreference): string | null {
  if (chapterSlug === "cs-fundamentals-roadmap") {
    if (focus === "Concept Build") return "Write a one-page map of what your target market asks and what you will ignore for now.";
    if (focus === "Applied Practice") return "Map your target companies into three buckets: coding heavy, fundamentals heavy, or design heavy.";
    if (focus === "Speed Drill") return "Do a 15-minute rapid-fire round: ACID, process vs thread, TCP vs UDP, mutex vs semaphore.";
    if (focus === "Revision Loop") return "Re-read your roadmap and cut one low-value deep-dive topic from this month's plan.";
    if (focus === "Timed Session") return "Run a 25-minute mixed theory round across DBMS, OS, networks, and concurrency.";
  }
  if (chapterSlug === "dbms-sql") {
    if (focus === "Concept Build") return "Write one page on joins, indexes, ACID, isolation, and normalization using your own examples.";
    if (focus === "Applied Practice") return "Run a timed SQL set: 2 joins, 1 aggregation, 1 schema question.";
    if (focus === "Speed Drill") return "Do a 20-minute viva round: index selectivity, read committed, denormalization, clustered index.";
    if (focus === "Revision Loop") return "Re-write your weakest SQL query from memory and explain one bad index choice.";
    if (focus === "Timed Session") return "Run a 30-minute DBMS round: 10 minutes SQL, 10 minutes transactions, 10 minutes schema tradeoffs.";
  }
  if (chapterSlug === "operating-systems") {
    if (focus === "Concept Build") return "Write short answers for process vs thread, stack vs heap, virtual memory, and page fault.";
    if (focus === "Applied Practice") return "Practice 6 OS viva questions and force yourself to give one example per answer.";
    if (focus === "Speed Drill") return "Do a 15-minute OS rapid-fire block: context switch, deadlock, scheduling, paging, syscall.";
    if (focus === "Revision Loop") return "Re-explain deadlock and virtual memory without notes until the answer sounds natural.";
    if (focus === "Timed Session") return "Run a 25-minute OS theory round with short answers and one whiteboard example.";
  }
  if (chapterSlug === "computer-networks") {
    if (focus === "Concept Build") return "Draw the request path once: DNS, TCP/TLS, HTTP, load balancer, app, database, response.";
    if (focus === "Applied Practice") return "Practice 5 networking answers: DNS, TCP vs UDP, HTTP vs HTTPS, CDN, load balancer.";
    if (focus === "Speed Drill") return "Do a 15-minute networking rapid-fire block and keep each answer under 45 seconds.";
    if (focus === "Revision Loop") return "Rebuild the browser request flow from memory and fix any missing step.";
    if (focus === "Timed Session") return "Run a 25-minute request-flow round and answer follow-ups on latency, caching, and retries.";
  }
  if (chapterSlug === "concurrency-multithreading") {
    if (focus === "Concept Build") return "Write short answers for race condition, critical section, mutex, semaphore, deadlock, and thread pool.";
    if (focus === "Applied Practice") return "Sketch one thread-safe counter and one producer-consumer design in your main language.";
    if (focus === "Speed Drill") return "Do a 15-minute concurrency viva: mutex vs semaphore, async vs threads, starvation vs deadlock.";
    if (focus === "Revision Loop") return "Re-explain one race bug and one deadlock fix until both sound concrete and code-aware.";
    if (focus === "Timed Session") return "Run a 30-minute concurrency round with one coding-style example and one theory-style example.";
  }
  if (chapterSlug === "system-design-primer") {
    if (focus === "Concept Build") return "Write a reusable design skeleton: requirements, scale, APIs, data model, bottlenecks, tradeoffs.";
    if (focus === "Applied Practice") return "Do one compact service design and say why each component exists.";
    if (focus === "Speed Drill") return "Run a 20-minute design round and practice staying structured under time pressure.";
    if (focus === "Revision Loop") return "Review one previous design and tighten 3 weak tradeoffs.";
    if (focus === "Timed Session") return "Run one full 30-minute design interview and debrief the missing bottlenecks.";
  }
  if (chapterSlug === "lld-ood-design") {
    if (focus === "Concept Build") return "List entities, responsibilities, interfaces, and extension points before drawing classes.";
    if (focus === "Applied Practice") return "Solve one LLD problem with 20 minutes of modeling and 10 minutes of walkthrough.";
    if (focus === "Speed Drill") return "Do a 15-minute design sketch focused on responsibilities, not inheritance chains.";
    if (focus === "Revision Loop") return "Refactor one old LLD solution by splitting one God class into clear components.";
    if (focus === "Timed Session") return "Run a 30-minute LLD round and explain one extension without rewriting the core model.";
  }
  if (chapterSlug === "estimation-mental-problems") {
    if (focus === "Concept Build") return "Create a one-page sheet of unit conversions, rounded baselines, and common sanity checks.";
    if (focus === "Applied Practice") return "Do 3 short estimation drills and narrate every assumption before calculating.";
    if (focus === "Speed Drill") return "Run a 15-minute mental-math block with strict rounding and unit checks.";
    if (focus === "Revision Loop") return "Re-do yesterday's estimate from memory and tighten the final range.";
    if (focus === "Timed Session") return "Run a 25-minute estimation round: one QPS, one storage, one bandwidth question.";
  }
  if (track === "crash" && CHAPTER_MAP[chapterSlug]?.category === "CS Fundamentals" && focus === "Timed Session") {
    return "Run a 20-minute rapid-fire theory round and keep every answer under 45 seconds.";
  }
  return null;
}

function getFocusSpecificTask(
  focus: string,
  chapterSlug: string,
  track: TrackPreference,
  problemTarget: number,
  weakPhaseId: string | null,
  reviewTarget: number,
  revisionBacklog: number,
): string {
  if (focus === "Revision Loop" && revisionBacklog > 0) {
    return `Clear ${Math.min(revisionBacklog, reviewTarget + 1)} items from revision backlog, then re-solve 1 weak problem cold.`;
  }

  const fundamentalsTask = getFundamentalsFocusTask(focus, chapterSlug, track);
  if (fundamentalsTask) return fundamentalsTask;

  const skillLabel = getWeakPhaseSkillLabel(weakPhaseId);
  if (focus === "Concept Build") {
    return `Write one short note on ${skillLabel}, then solve ${Math.max(2, problemTarget - 1)} problems without rushing.`;
  }
  if (focus === "Applied Practice") {
    return `Do ${problemTarget} pattern-focused problems and tag each with its trigger before coding.`;
  }
  if (focus === "Speed Drill") {
    return `Run a 60-minute speed block: ${Math.max(2, problemTarget - 1)} medium attempts on ${skillLabel}.`;
  }
  if (focus === "Revision Loop") {
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
  const completedEffortPoints = getCompletedEffortPoints(progress);
  const totalEffortPoints = TOTAL_LIBRARY_EFFORT_POINTS;
  const remainingEffortPoints = roundToTenths(Math.max(0, totalEffortPoints - completedEffortPoints));
  return {
    chaptersRead,
    problemsSolved,
    overallPercent: percent(completedEffortPoints, totalEffortPoints),
    completedEffortPoints,
    totalEffortPoints,
    remainingEffortPoints,
    estimatedHoursLeft: roundToTenths(remainingEffortPoints * EFFORT_POINT_HOURS),
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
  return getRelevantPathSegments(progress.profile.track).map((segment) => {
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

export function getCsFundamentalsBreakdown(progress: ProgressState): PhasePathProgressItem[] {
  const read = new Set(progress.readChapters);
  return CS_FUNDAMENTALS_BREAKDOWN.map((segment) => {
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
  const phases = getRelevantCorePhaseSegments(progress.profile.track).map((segment) => {
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
  const completedEffortPoints = getCompletedEffortPoints(progress);
  if (completedEffortPoints < 6) return null;

  const remainingEffortPoints = getRemainingEffortPoints(progress);

  const sortedActivity = [...progress.activityDates].sort((a, b) => a.localeCompare(b));
  const firstActivityDate = sortedActivity[0] ? parseLocalIsoDate(sortedActivity[0]) : null;
  const startDate = firstActivityDate ?? new Date(progress.createdAt);
  if (Number.isNaN(startDate.getTime())) return null;

  const today = new Date();
  const elapsedDays = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY) + 1);
  const pacePerDay = roundToTenths(completedEffortPoints / elapsedDays);

  if (pacePerDay < 0.35) return null;
  if (remainingEffortPoints === 0) {
    return {
      daysToFinish: 0,
      pacePerDay,
      projectedDateIso: formatLocalIsoDate(today),
      remainingEffortPoints: 0,
      remainingStudyHours: 0,
    };
  }

  const daysToFinish = Math.max(1, Math.ceil(remainingEffortPoints / pacePerDay));
  const projected = addDays(today, daysToFinish);

  return {
    daysToFinish,
    pacePerDay,
    projectedDateIso: formatLocalIsoDate(projected),
    remainingEffortPoints,
    remainingStudyHours: roundToTenths(remainingEffortPoints * EFFORT_POINT_HOURS),
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
  const primaryChapterSlug = upcoming[0] ?? fallbackSlug;
  const primaryCategory = CHAPTER_MAP[primaryChapterSlug]?.category;
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  const dayFocus = [
    "Concept Build",
    "Applied Practice",
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
      getChapterExecutionTask(chapterSlug, track, problemTarget, weakPhaseId, solvedCount),
      getFocusSpecificTask(focus, chapterSlug, track, problemTarget, weakPhaseId, reviewTarget, revisionBacklog),
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
    summary:
      primaryCategory === "CS Fundamentals"
        ? `${getTrackLabel(track)} | ${dailyHours}h/day | target 1 fundamentals block/day + ${Math.max(1, problemTarget - 1)} maintenance problems | weak focus: ${getWeakPhaseSkillLabel(weakPhaseId)}`
        : `${getTrackLabel(track)} | ${dailyHours}h/day | target ${problemTarget} problems/day | weak focus: ${getWeakPhaseSkillLabel(weakPhaseId)}`,
    days,
  };
}
