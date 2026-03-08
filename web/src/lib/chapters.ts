export interface ChapterConfig {
  title: string;
  description: string;
  category: "Learning Path" | "Interview" | "CS Fundamentals" | "Topics" | "Reference";
  order: number;
  path: string;
}

export interface ChapterMeta {
  slug: string;
  title: string;
  description: string;
  category: ChapterConfig["category"];
  order: number;
}

export interface NavItem {
  slug: string;
  title: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const CHAPTER_MAP: Record<string, ChapterConfig> = {
  "start-here": {
    title: "Start Here",
    description: "Day 1 actions, mindset, the 4-dimension interview rubric",
    category: "Learning Path",
    order: 1,
    path: "phases/start-here.md",
  },
  "progress-tracker": {
    title: "Progress Tracker",
    description: "Spaced repetition and review system template",
    category: "Reference",
    order: 2,
    path: "tracking/progress-tracker.md",
  },
  "two-tracks": {
    title: "The Two Tracks",
    description: "Internship prep vs full-time - different strategies",
    category: "Interview",
    order: 3,
    path: "interview/two-tracks.md",
  },
  "phase-0-cpp": {
    title: "Phase 0: C++ Mastery",
    description: "STL deep dive, pitfalls that kill candidates",
    category: "Learning Path",
    order: 4,
    path: "phases/phase-0-cpp.md",
  },
  "phase-1-foundations": {
    title: "Phase 1: Foundations",
    description: "Arrays -> Trees (Weeks 4-12)",
    category: "Learning Path",
    order: 5,
    path: "phases/phase-1-foundations.md",
  },
  "phase-2-intermediate": {
    title: "Phase 2: Intermediate",
    description: "Graphs -> Bit Manipulation (Weeks 13-24)",
    category: "Learning Path",
    order: 6,
    path: "phases/phase-2-intermediate.md",
  },
  "phase-3-advanced": {
    title: "Phase 3: Advanced",
    description: "Advanced DS, DP, CP (Weeks 25-40)",
    category: "Learning Path",
    order: 7,
    path: "phases/phase-3-advanced.md",
  },
  mechanics: {
    title: "Interview Mechanics",
    description: "45-min framework, brute->optimize, stuck recovery",
    category: "Interview",
    order: 8,
    path: "interview/mechanics.md",
  },
  "oa-strategy": {
    title: "OA Strategy",
    description: "Platform guide, constraints table, partial credit",
    category: "Interview",
    order: 9,
    path: "interview/oa-strategy.md",
  },
  "cs-fundamentals-roadmap": {
    title: "CS Fundamentals Roadmap",
    description: "What US, European, and Indian interviews actually expect after DSA",
    category: "CS Fundamentals",
    order: 10,
    path: "fundamentals/cs-fundamentals-roadmap.md",
  },
  "dbms-sql": {
    title: "DBMS & SQL",
    description: "SQL, indexing, joins, transactions, normalization, and interview tradeoffs",
    category: "CS Fundamentals",
    order: 11,
    path: "fundamentals/dbms-sql.md",
  },
  "operating-systems": {
    title: "Operating Systems",
    description: "Processes, threads, memory, scheduling, synchronization, and deadlocks",
    category: "CS Fundamentals",
    order: 12,
    path: "fundamentals/operating-systems.md",
  },
  "computer-networks": {
    title: "Computer Networks",
    description: "DNS, TCP/UDP, HTTP, latency, load balancing, and request flow",
    category: "CS Fundamentals",
    order: 13,
    path: "fundamentals/computer-networks.md",
  },
  "concurrency-multithreading": {
    title: "Concurrency & Multithreading",
    description: "Race conditions, locks, semaphores, deadlocks, thread pools, and async tradeoffs",
    category: "CS Fundamentals",
    order: 14,
    path: "fundamentals/concurrency-multithreading.md",
  },
  "system-design-primer": {
    title: "System Design Primer",
    description: "Scale framing, APIs, data models, bottlenecks, and interview tradeoffs",
    category: "CS Fundamentals",
    order: 15,
    path: "topics/system-design-primer.md",
  },
  "lld-ood-design": {
    title: "LLD & OOD Design",
    description: "Objects, interfaces, responsibilities, and clean extension points",
    category: "CS Fundamentals",
    order: 16,
    path: "topics/lld-ood-design.md",
  },
  "estimation-mental-problems": {
    title: "Estimation & Mental Problems",
    description: "Back-of-envelope math, assumptions, and ambiguity handling",
    category: "CS Fundamentals",
    order: 17,
    path: "topics/estimation-mental-problems.md",
  },
  "mock-sessions": {
    title: "Mock Sessions",
    description: "5 scripted practice sessions with evaluation rubric",
    category: "Interview",
    order: 18,
    path: "interview/mock-sessions.md",
  },
  "company-specific": {
    title: "Company-Specific Prep",
    description: "US big tech, European product, and Indian product company differences",
    category: "Interview",
    order: 19,
    path: "interview/company-specific.md",
  },
  behavioral: {
    title: "Behavioral Guide",
    description: "STAR+, LPs, questions to ask, 8 story templates",
    category: "Interview",
    order: 20,
    path: "interview/behavioral.md",
  },
  "final-review": {
    title: "Final Review",
    description: "3-day checklist + interview morning routine",
    category: "Interview",
    order: 21,
    path: "interview/final-review.md",
  },
  "post-placement": {
    title: "Post-Placement",
    description: "Offer letters, first 90 days, DSA maintenance mode",
    category: "Interview",
    order: 22,
    path: "interview/post-placement.md",
  },
  "complexity-analysis": {
    title: "Complexity Analysis",
    description: "Big-O as a skill, recurrence relations, space complexity",
    category: "Topics",
    order: 23,
    path: "topics/complexity-analysis.md",
  },
  "pattern-recognition": {
    title: "Pattern Recognition",
    description: "How to identify which algorithm to use",
    category: "Topics",
    order: 24,
    path: "topics/pattern-recognition.md",
  },
  "sorting-algorithms": {
    title: "Sorting Algorithms",
    description: "5 sorts with code, decision matrix, comparators",
    category: "Topics",
    order: 25,
    path: "topics/sorting-algorithms.md",
  },
  "debugging-testing": {
    title: "Debugging & Testing",
    description: "5-step protocol, edge case generation, GDB basics",
    category: "Topics",
    order: 26,
    path: "topics/debugging-testing.md",
  },
  "ai-era-mastery": {
    title: "AI-Era Interview Mastery",
    description: "AI-copilot interview format and drills",
    category: "Topics",
    order: 27,
    path: "topics/ai-era-mastery.md",
  },
  cheatsheets: {
    title: "Algorithm Cheatsheets",
    description: "Quick references + DP taxonomy",
    category: "Reference",
    order: 28,
    path: "topics/cheatsheets.md",
  },
  "code-templates": {
    title: "Code Templates",
    description: "12 annotated C++ snippets",
    category: "Reference",
    order: 29,
    path: "topics/code-templates.md",
  },
  "language-flexibility": {
    title: "Language Flexibility",
    description: "C++ / Python / Java mappings and pitfalls",
    category: "Reference",
    order: 30,
    path: "topics/language-flexibility.md",
  },
  "common-mistakes": {
    title: "Common Mistakes",
    description: "Top 20 preparation-killing mistakes with fixes",
    category: "Reference",
    order: 31,
    path: "topics/common-mistakes.md",
  },
  "patterns-journal-template": {
    title: "Patterns Journal",
    description: "What a good journal entry looks like",
    category: "Reference",
    order: 32,
    path: "topics/patterns-journal-template.md",
  },
  "mental-game": {
    title: "Mental Game",
    description: "Burnout recovery and consistency",
    category: "Reference",
    order: 33,
    path: "topics/mental-game.md",
  },
  resources: {
    title: "Resources",
    description: "Resource stack, daily schedule, adjacent skills",
    category: "Reference",
    order: 34,
    path: "topics/resources.md",
  },
  "crash-plans": {
    title: "Crash-Course Plans",
    description: "4-week, 8-week, 16-week paths for late starters",
    category: "Learning Path",
    order: 35,
    path: "phases/crash-plans.md",
  },
};

const CATEGORY_ORDER: ChapterConfig["category"][] = [
  "Learning Path",
  "Interview",
  "CS Fundamentals",
  "Topics",
  "Reference",
];

export const CHAPTER_TOTAL = Object.keys(CHAPTER_MAP).length;

export function getOrderedChapterMeta(): ChapterMeta[] {
  return Object.entries(CHAPTER_MAP)
    .map(([slug, meta]) => ({
      slug,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      order: meta.order,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getSidebarSections(): NavSection[] {
  const ordered = getOrderedChapterMeta();

  return CATEGORY_ORDER.map((category) => ({
    label: category,
    items: ordered
      .filter((chapter) => chapter.category === category)
      .map((chapter) => ({ slug: chapter.slug, title: chapter.title })),
  }));
}
