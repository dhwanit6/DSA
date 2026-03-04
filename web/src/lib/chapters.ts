export interface ChapterConfig {
  title: string;
  description: string;
  category: "Learning Path" | "Interview" | "Topics" | "Reference";
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
  "crash-plans": {
    title: "Crash-Course Plans",
    description: "4-week, 8-week, 16-week paths for late starters",
    category: "Learning Path",
    order: 30,
    path: "phases/crash-plans.md",
  },
  "two-tracks": {
    title: "The Two Tracks",
    description: "Internship prep vs full-time - different strategies",
    category: "Interview",
    order: 3,
    path: "interview/two-tracks.md",
  },
  "mechanics": {
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
  "company-specific": {
    title: "Company-Specific Prep",
    description: "Google / Amazon / Microsoft / Indian product",
    category: "Interview",
    order: 12,
    path: "interview/company-specific.md",
  },
  "behavioral": {
    title: "Behavioral Guide",
    description: "STAR+, LPs, questions to ask, 8 story templates",
    category: "Interview",
    order: 13,
    path: "interview/behavioral.md",
  },
  "mock-sessions": {
    title: "Mock Sessions",
    description: "5 scripted practice sessions with evaluation rubric",
    category: "Interview",
    order: 10,
    path: "interview/mock-sessions.md",
  },
  "final-review": {
    title: "Final Review",
    description: "3-day checklist + interview morning routine",
    category: "Interview",
    order: 11,
    path: "interview/final-review.md",
  },
  "post-placement": {
    title: "Post-Placement",
    description: "Offer letters, first 90 days, DSA maintenance mode",
    category: "Interview",
    order: 14,
    path: "interview/post-placement.md",
  },
  "complexity-analysis": {
    title: "Complexity Analysis",
    description: "Big-O as a skill, recurrence relations, space complexity",
    category: "Topics",
    order: 15,
    path: "topics/complexity-analysis.md",
  },
  "pattern-recognition": {
    title: "Pattern Recognition",
    description: "How to identify which algorithm to use",
    category: "Topics",
    order: 16,
    path: "topics/pattern-recognition.md",
  },
  "sorting-algorithms": {
    title: "Sorting Algorithms",
    description: "5 sorts with code, decision matrix, comparators",
    category: "Topics",
    order: 17,
    path: "topics/sorting-algorithms.md",
  },
  "system-design-primer": {
    title: "System Design Primer",
    description: "Schemas, API design, walkthroughs, estimation math",
    category: "Topics",
    order: 26,
    path: "topics/system-design-primer.md",
  },
  "lld-ood-design": {
    title: "LLD & OOD Design",
    description: "SOLID, patterns, full problem walkthroughs",
    category: "Topics",
    order: 27,
    path: "topics/lld-ood-design.md",
  },
  "estimation-mental-problems": {
    title: "Estimation & Mental Problems",
    description: "MapReduce, HyperLogLog, back-of-envelope math",
    category: "Topics",
    order: 28,
    path: "topics/estimation-mental-problems.md",
  },
  "ai-era-mastery": {
    title: "AI-Era Interview Mastery",
    description: "AI-copilot interview format and drills",
    category: "Topics",
    order: 29,
    path: "topics/ai-era-mastery.md",
  },
  "debugging-testing": {
    title: "Debugging & Testing",
    description: "5-step protocol, edge case generation, GDB basics",
    category: "Topics",
    order: 18,
    path: "topics/debugging-testing.md",
  },
  "cheatsheets": {
    title: "Algorithm Cheatsheets",
    description: "Quick references + DP taxonomy",
    category: "Reference",
    order: 19,
    path: "topics/cheatsheets.md",
  },
  "code-templates": {
    title: "Code Templates",
    description: "12 annotated C++ snippets",
    category: "Reference",
    order: 20,
    path: "topics/code-templates.md",
  },
  "language-flexibility": {
    title: "Language Flexibility",
    description: "C++ / Python / Java mappings and pitfalls",
    category: "Reference",
    order: 21,
    path: "topics/language-flexibility.md",
  },
  "common-mistakes": {
    title: "Common Mistakes",
    description: "Top 20 preparation-killing mistakes with fixes",
    category: "Reference",
    order: 22,
    path: "topics/common-mistakes.md",
  },
  "patterns-journal-template": {
    title: "Patterns Journal",
    description: "What a good journal entry looks like",
    category: "Reference",
    order: 23,
    path: "topics/patterns-journal-template.md",
  },
  "mental-game": {
    title: "Mental Game",
    description: "Burnout recovery and consistency",
    category: "Reference",
    order: 24,
    path: "topics/mental-game.md",
  },
  "resources": {
    title: "Resources",
    description: "Resource stack, daily schedule, adjacent skills",
    category: "Reference",
    order: 25,
    path: "topics/resources.md",
  },
  "progress-tracker": {
    title: "Progress Tracker",
    description: "Spaced repetition and review system template",
    category: "Reference",
    order: 2,
    path: "tracking/progress-tracker.md",
  },
};

const CATEGORY_ORDER: ChapterConfig["category"][] = [
  "Learning Path",
  "Interview",
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
