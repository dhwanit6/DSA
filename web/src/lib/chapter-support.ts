import type { ChapterConfig } from "@/lib/chapters";

export interface CuratedVideo {
  title: string;
  href: string;
  note: string;
}

export interface SupportLink {
  label: string;
  href: string;
  note: string;
}

export interface ChapterSupportPack {
  title: string;
  summary: string;
  mustKnow: string[];
  vivaQuestions: string[];
  miniDrills: string[];
  recommendedVideos: CuratedVideo[];
  recoveryLinks: SupportLink[];
  sourceNote?: string;
}

type SupportPackKey =
  | "planning"
  | "cpp"
  | "dsa-core"
  | "interview-execution"
  | "behavioral"
  | "fundamentals-roadmap"
  | "dbms"
  | "os"
  | "networks"
  | "concurrency"
  | "system-design"
  | "lld"
  | "estimation";

const COMMUNITY_SOURCE_NOTE =
  "External picks are curated from community recommendations reviewed in March 2026.";

const VIDEOS = {
  striverA2z: {
    title: "Striver A2Z DSA Kickoff",
    href: "https://www.youtube.com/watch?v=EAR7De6Goz4",
    note: "Best when you need a single structured roadmap instead of random problem hopping.",
  },
  striverComplexity: {
    title: "Striver Time and Space Complexity",
    href: "https://www.youtube.com/watch?v=FPu9Uld7W-E",
    note: "Use this when your solution is working but your complexity explanation sounds weak.",
  },
  neetcodeChannel: {
    title: "NeetCode Channel",
    href: "https://www.youtube.com/@NeetCodeIO",
    note: "Strong for clean pattern explanations and interview-style walkthroughs.",
  },
  luvStl: {
    title: "Luv C++ STL Playlist",
    href: "https://www.youtube.com/playlist?list=PLRNVk3SBwool9PhP6vxR2J96Nojjol8WI",
    note: "Best when STL syntax or container choice is slowing you down.",
  },
  exponentChannel: {
    title: "Exponent Interview Channel",
    href: "https://www.youtube.com/@ExponentTV",
    note: "Useful for coding, system design, and behavioral interview simulations.",
  },
  interviewingIoChannel: {
    title: "interviewing.io Channel",
    href: "https://www.youtube.com/@interviewingio",
    note: "Good for watching strong and weak candidate behavior side by side.",
  },
  dbmsQueries: {
    title: "Ankit Bansal SQL Interview Playlist",
    href: "https://www.youtube.com/playlist?list=PLBTZqjSKn0IeKBQDjLmzisazhqQy4iGkb",
    note: "Use this for timed SQL writing and query deconstruction.",
  },
  dbmsTheory: {
    title: "Ankit Bansal DBMS Theory Playlist",
    href: "https://www.youtube.com/playlist?list=PLBTZqjSKn0IcaE2Xhl4w4Jep8P7Y0KgYu",
    note: "Best for ACID, indexing, normalization, and transaction answers.",
  },
  osCore: {
    title: "Neso Academy Operating Systems Playlist",
    href: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O",
    note: "Strong for process/thread, memory, deadlock, and paging viva prep.",
  },
  osScheduling: {
    title: "Neso Academy CPU Scheduling Playlist",
    href: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRitWSE_AyyySWfhRgyA-rHk",
    note: "Use this when scheduling or context-switch answers still feel fuzzy.",
  },
  networksGateSmashers: {
    title: "Gate Smashers Computer Networks Playlist",
    href: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
    note: "Best for end-to-end request flow, TCP/UDP, and interview viva language.",
  },
  networksNeso: {
    title: "Neso Academy Computer Networks Playlist",
    href: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqzJT87LsdQKYZBC93ezDo",
    note: "Good second pass when you need cleaner fundamentals reinforcement.",
  },
  concurrencyJenkov: {
    title: "Jenkov Java Concurrency Playlist",
    href: "https://www.youtube.com/playlist?list=PLTjRvDozrdlxEIuOBZkMAK5uiqp8rHUax",
    note: "Clear coverage of race conditions, locks, and thread coordination.",
  },
  concurrencyVisual: {
    title: "Visual Threading and Concurrency Explanation",
    href: "https://www.youtube.com/watch?v=3VtGCpiYwoc",
    note: "Use this when you conceptually understand locks but cannot visualize the failure.",
  },
  concurrencyGary: {
    title: "Gary Explains: Multithreading",
    href: "https://youtu.be/Tn0u-IIBmtc?si=RC9KKtbZp8fuU-kV",
    note: "Helpful for a compact refresher before a backend round.",
  },
  bytebytegoPrimer: {
    title: "ByteByteGo System Design Basics",
    href: "https://www.youtube.com/watch?v=UC5xf8FbdJc",
    note: "Best when you need a clean interview framing before doing your own design drill.",
  },
  helloInterviewDesign: {
    title: "Hello Interview System Design Walkthrough",
    href: "https://www.youtube.com/watch?v=i7twT3x5yv8",
    note: "Useful for seeing how assumptions, APIs, and tradeoffs are sequenced.",
  },
  gkcsChannel: {
    title: "Gaurav Sen / GKCS Channel",
    href: "https://www.youtube.com/@gkcs",
    note: "Good for deeper intuition around bottlenecks and distributed tradeoffs.",
  },
  lldPlaylist: {
    title: "Low Level Design Playlist",
    href: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnuSO9eYHfH7q7nxw4_7qBtN",
    note: "Solid for entity extraction, interfaces, and design walkthrough practice.",
  },
} as const;

const SUPPORT_PACKS: Record<SupportPackKey, ChapterSupportPack> = {
  planning: {
    title: "Execution Reset",
    summary: "Use this when the chapter made sense while reading, but your next study move is still unclear.",
    mustKnow: [
      "Pick one track and protect it for 2 to 4 weeks before re-evaluating.",
      "Convert chapters into calendar blocks, not vague intentions.",
      "If overwhelmed, shrink scope first; do not add more resources.",
    ],
    vivaQuestions: [
      "What is your track, and why is it the right lane for your timeline?",
      "What is the next chapter you will finish this week?",
      "Which one weak area is currently blocking interview readiness most?",
      "How many focused study hours can you realistically protect each day?",
      "What will you deliberately ignore this month?",
    ],
    miniDrills: [
      "Write your next 14 days on paper: chapters, problem blocks, and one review slot.",
      "List your top 3 weak areas and assign each one a single next action.",
      "Open the planner and convert one abstract goal into 3 concrete tasks for tomorrow.",
    ],
    recommendedVideos: [VIDEOS.striverA2z, VIDEOS.neetcodeChannel],
    recoveryLinks: [
      { label: "Dashboard", href: "/dashboard", note: "Re-lock your track, daily hours, and next chapter." },
      { label: "Weekly Planner", href: "/planner", note: "Translate the chapter into a 7-day execution loop." },
      { label: "Start Here", href: "/start-here", note: "Reset the overall sequence if the plan still feels noisy." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  cpp: {
    title: "C++ And STL Rescue Pack",
    summary: "Use this when logic is fine but C++ syntax, STL choices, or memory behavior are slowing you down.",
    mustKnow: [
      "Know the default complexity and tradeoff of every STL container you use often.",
      "Prefer clarity with references, const correctness, and standard containers over clever syntax.",
      "If runtime bugs feel random, inspect ownership, mutation, and container invalidation first.",
    ],
    vivaQuestions: [
      "When do you prefer vector over list or deque?",
      "Why can unordered_map degrade badly in some cases?",
      "What is the difference between pass-by-value, reference, and const reference?",
      "When does lower_bound apply, and what complexity do you expect?",
      "What are the most common causes of overflow or dangling references in interview code?",
    ],
    miniDrills: [
      "Implement one stack, one queue, and one frequency map using STL without looking anything up.",
      "Rewrite a previous solution and replace any unnecessary copying with const references.",
      "Solve one easy problem while saying every container choice and complexity out loud.",
    ],
    recommendedVideos: [VIDEOS.luvStl, VIDEOS.striverA2z],
    recoveryLinks: [
      { label: "Code Templates", href: "/code-templates", note: "Reduce syntax friction and focus on logic first." },
      { label: "Language Flexibility", href: "/language-flexibility", note: "Tighten language-specific pitfalls before solving more." },
      { label: "Problems", href: "/problems", note: "Use a short easy block to make STL usage automatic." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  "dsa-core": {
    title: "Pattern Reinforcement Pack",
    summary: "Use this when the explanation felt clear but you still cannot turn it into a repeatable solving process.",
    mustKnow: [
      "State the trigger for the pattern before writing code.",
      "Complexity and edge-case reasoning are part of the answer, not cleanup afterward.",
      "Pattern memory is built by timed repetition plus short debriefs, not by passive reading.",
    ],
    vivaQuestions: [
      "What input clue would make you try two pointers or sliding window first?",
      "When is binary search on answer valid?",
      "What base case would break your recursion if you missed it?",
      "How do you decide between BFS and DFS for this problem family?",
      "What edge case is most likely to break your current solution?",
    ],
    miniDrills: [
      "Solve 2 easy and 1 medium problem from the same pattern family in one sitting.",
      "Take one solved problem and write a 5-line pattern trigger note for your journal.",
      "Re-run one old solution and force yourself to test 3 edge cases before submission.",
    ],
    recommendedVideos: [VIDEOS.striverA2z, VIDEOS.neetcodeChannel, VIDEOS.striverComplexity],
    recoveryLinks: [
      { label: "Problems", href: "/problems", note: "Drop into a short, focused pattern block immediately." },
      { label: "Patterns Journal", href: "/patterns-journal-template", note: "Convert this chapter into a reusable trigger note." },
      { label: "Dashboard", href: "/dashboard", note: "Use your weakest phase to decide what to practice next." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  "interview-execution": {
    title: "Interview Recovery Pack",
    summary: "Use this when you know the concept but interview pressure breaks your communication or timing.",
    mustKnow: [
      "Never skip the clarify -> brute -> optimize -> test loop.",
      "Silence reads as loss of control, so narrate what you are checking.",
      "A clean partial solution plus strong communication beats rushed, brittle code.",
    ],
    vivaQuestions: [
      "What do you do in the first 3 minutes of a coding round?",
      "When should you ask for a hint?",
      "What exactly do you say while moving from brute force to optimized?",
      "How do you test your answer before the interviewer tests it for you?",
      "What should your closing summary include in the final 2 minutes?",
    ],
    miniDrills: [
      "Run one 45-minute mock and force yourself to narrate every major step.",
      "Take one medium problem and practice only the first 8 minutes three times.",
      "Simulate an OA block with a strict timer and a written postmortem afterward.",
    ],
    recommendedVideos: [VIDEOS.exponentChannel, VIDEOS.interviewingIoChannel],
    recoveryLinks: [
      { label: "Planner", href: "/planner", note: "Turn this interview skill into a timed block this week." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Move from theory into deliberate simulation." },
      { label: "Dashboard", href: "/dashboard", note: "Check whether interview practice is actually on your weekly plan." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  behavioral: {
    title: "Behavioral Story Pack",
    summary: "Use this when your examples sound true but still feel unconvincing, vague, or too long.",
    mustKnow: [
      "Every story needs a metric, a clear personal action, and one reflection.",
      "Prepare 2-minute and 4-minute versions of the same story.",
      "If the story sounds like team effort only, the signal is weak.",
    ],
    vivaQuestions: [
      "What exactly was your role, and what did you personally decide or do?",
      "What metric changed, even if it was small?",
      "What constraint made the situation difficult?",
      "What would you do differently now?",
      "Which company value or leadership principle does this story map to?",
    ],
    miniDrills: [
      "Record one failure story in 2 minutes and remove every vague sentence.",
      "Take one ownership story and add numbers, dates, or concrete scope.",
      "Write one follow-up answer for conflict, impact, and learning from the same story.",
    ],
    recommendedVideos: [VIDEOS.exponentChannel, VIDEOS.interviewingIoChannel],
    recoveryLinks: [
      { label: "Behavioral Guide", href: "/behavioral", note: "Rebuild your story bank using STAR+." },
      { label: "Company-Specific Prep", href: "/company-specific", note: "Tailor the story emphasis to your target market." },
      { label: "Final Review", href: "/final-review", note: "Use the last-mile checklist before the actual round." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  "fundamentals-roadmap": {
    title: "CS Fundamentals Starter Pack",
    summary: "Use this when you know fundamentals matter, but you are unsure what order or depth is actually interview-relevant.",
    mustKnow: [
      "Train spoken answers, not only notes. Fundamentals are usually asked viva-style.",
      "Prioritize DBMS, OS, networks, and concurrency before deeper specialization.",
      "Use design and estimation as structured reasoning practice, not buzzword memorization.",
    ],
    vivaQuestions: [
      "Which fundamentals topics are highest priority for your target roles?",
      "What can you safely ignore this month because it is too deep for interviews?",
      "Can you explain one DBMS, OS, network, and concurrency concept in under 45 seconds each?",
      "Which topic currently feels the least stable when spoken out loud?",
      "What order will you follow over the next 4 weeks?",
    ],
    miniDrills: [
      "Write a one-page map: DBMS -> OS -> Networks -> Concurrency -> Design.",
      "Do a mixed 10-question viva round with one question from each fundamentals area.",
      "Pick one weak subject and schedule 3 focused blocks for it this week.",
    ],
    recommendedVideos: [VIDEOS.dbmsTheory, VIDEOS.osCore, VIDEOS.networksGateSmashers],
    recoveryLinks: [
      { label: "Dashboard", href: "/dashboard", note: "Use the fundamentals breakdown to choose the next weak subject." },
      { label: "DBMS & SQL", href: "/dbms-sql", note: "Start with the highest-frequency backend interview topic." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Mix fundamentals with coding and communication practice." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  dbms: {
    title: "DBMS And SQL Practice Pack",
    summary: "Use this when the chapter feels conceptually fine, but your SQL writing or database tradeoff answers still sound weak.",
    mustKnow: [
      "Be able to write joins, filters, grouping, and subqueries without autocomplete.",
      "Every index answer should mention selectivity, write cost, and actual query pattern.",
      "Isolation levels matter only when you can tie them to a concrete anomaly.",
    ],
    vivaQuestions: [
      "Why would an index help this query, and when would it not?",
      "What is the difference between normalization and denormalization in practice?",
      "What anomaly does read committed still allow?",
      "Why is SELECT * usually a weak choice in production code?",
      "How would you explain ACID with a payment or booking example?",
    ],
    miniDrills: [
      "Write one JOIN, one GROUP BY, and one subquery without using notes.",
      "Take one query and justify one good index and one bad index.",
      "Explain ticket booking oversell in terms of transactions and isolation.",
    ],
    recommendedVideos: [VIDEOS.dbmsQueries, VIDEOS.dbmsTheory],
    recoveryLinks: [
      { label: "CS Fundamentals Roadmap", href: "/cs-fundamentals-roadmap", note: "Re-anchor the sequence if you are studying too many theory topics at once." },
      { label: "Dashboard", href: "/dashboard", note: "Schedule another fundamentals block before this fades." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Test whether you can answer SQL and theory out loud under pressure." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  os: {
    title: "Operating Systems Practice Pack",
    summary: "Use this when you can recognize OS terms, but your spoken answers still feel textbook-heavy or vague.",
    mustKnow: [
      "Process vs thread answers must mention isolation, shared state, and cost tradeoffs.",
      "Virtual memory is about abstraction and isolation, not page-table trivia.",
      "Deadlock answers feel complete only when you add one concrete prevention strategy.",
    ],
    vivaQuestions: [
      "Why are threads cheaper than processes?",
      "What is the practical difference between stack and heap?",
      "Why does virtual memory exist?",
      "What happens during a context switch?",
      "How do you prevent deadlock in real code or systems design?",
    ],
    miniDrills: [
      "Explain process vs thread in under 45 seconds, then improve the answer once.",
      "Draw a simple paging/page-fault story for one running program.",
      "Say the 4 deadlock conditions, then give one prevention technique without notes.",
    ],
    recommendedVideos: [VIDEOS.osCore, VIDEOS.osScheduling],
    recoveryLinks: [
      { label: "CS Fundamentals Roadmap", href: "/cs-fundamentals-roadmap", note: "Stay on the high-ROI interview subset and avoid deep-kernel drift." },
      { label: "Dashboard", href: "/dashboard", note: "Lock one more OS viva slot this week." },
      { label: "Computer Networks", href: "/computer-networks", note: "Pair OS with request-flow reasoning to make answers feel applied." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  networks: {
    title: "Networks Practice Pack",
    summary: "Use this when you know the terms, but you cannot cleanly walk one browser request from start to finish.",
    mustKnow: [
      "Own the base request path before adding CDN, cache, or load balancer optimizations.",
      "TCP vs UDP answers must include reliability vs latency tradeoffs.",
      "HTTPS is HTTP over TLS, not just a vague 'secure version of HTTP.'",
    ],
    vivaQuestions: [
      "What happens after you type a URL into the browser?",
      "Where does DNS fit in the request path?",
      "Why is TCP reliable, and what does it cost?",
      "When is UDP the right choice even though delivery is not guaranteed?",
      "How do CDN and load balancer solve different problems?",
    ],
    miniDrills: [
      "Explain one full browser request path on paper with 7 to 8 steps.",
      "Give two TCP examples and two UDP examples, with one tradeoff each.",
      "Take one latency problem and propose 3 networking levers to reduce it.",
    ],
    recommendedVideos: [VIDEOS.networksGateSmashers, VIDEOS.networksNeso],
    recoveryLinks: [
      { label: "CS Fundamentals Roadmap", href: "/cs-fundamentals-roadmap", note: "Use the roadmap if you are mixing deep networking with interview basics." },
      { label: "Dashboard", href: "/dashboard", note: "Reserve another request-flow practice slot this week." },
      { label: "System Design Primer", href: "/system-design-primer", note: "Bridge networking concepts into architecture answers." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  concurrency: {
    title: "Concurrency Practice Pack",
    summary: "Use this when definitions feel familiar, but race conditions and coordination primitives still do not feel code-real.",
    mustKnow: [
      "Always explain the shared state and exact failure, not only the label 'race condition.'",
      "Mutex vs semaphore answers need a concrete use case, not textbook wording alone.",
      "Deadlock fixes should start with correctness and lock discipline before optimization.",
    ],
    vivaQuestions: [
      "Why is counter = counter + 1 unsafe across threads?",
      "When is a mutex clearer than a semaphore?",
      "How would you explain starvation vs deadlock?",
      "Why is a thread pool safer than one thread per request?",
      "What is the difference between async coordination and true parallel execution?",
    ],
    miniDrills: [
      "Write one thread-safe counter in your main language.",
      "Sketch producer-consumer with a bounded queue and name the coordination primitive you need.",
      "Take one deadlock example and remove it by lock ordering or reduced lock scope.",
    ],
    recommendedVideos: [VIDEOS.concurrencyJenkov, VIDEOS.concurrencyVisual, VIDEOS.concurrencyGary],
    recoveryLinks: [
      { label: "CS Fundamentals Roadmap", href: "/cs-fundamentals-roadmap", note: "Keep concurrency interview-scoped and avoid unnecessary deep dives." },
      { label: "Dashboard", href: "/dashboard", note: "Schedule another concurrency drill before the vocabulary fades." },
      { label: "LLD & OOD Design", href: "/lld-ood-design", note: "Use concurrency thinking inside object and service design problems." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  "system-design": {
    title: "System Design Practice Pack",
    summary: "Use this when you understand the components, but your 30-minute answer still feels like an unordered dump.",
    mustKnow: [
      "Requirements and scale come before architecture diagrams.",
      "Every component should be justified by a bottleneck or constraint.",
      "The interview signal is tradeoff clarity, not tool-name density.",
    ],
    vivaQuestions: [
      "What are the first 3 questions you ask before proposing components?",
      "Why do scale assumptions change the design shape?",
      "What bottleneck would you expect first in this design?",
      "Where would you cache, and what inconsistency would that introduce?",
      "What would you cut if the interviewer asked for a simpler version?",
    ],
    miniDrills: [
      "Run one 30-minute design drill using the exact chapter flow: requirements, scale, APIs, data model, bottlenecks, tradeoffs.",
      "Take one old design and justify every component in one sentence.",
      "Pick one bottleneck and propose 2 fixes plus the cost of each.",
    ],
    recommendedVideos: [VIDEOS.bytebytegoPrimer, VIDEOS.helloInterviewDesign, VIDEOS.gkcsChannel],
    recoveryLinks: [
      { label: "Dashboard", href: "/dashboard", note: "Reserve a full 30-minute design block, not a passive reading slot." },
      { label: "Estimation & Mental Problems", href: "/estimation-mental-problems", note: "Tighten your assumptions and scale math before the next design round." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Practice speaking through a design instead of only sketching it." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  lld: {
    title: "LLD And OOD Practice Pack",
    summary: "Use this when your design has classes on the page, but responsibilities and extension points still feel muddy.",
    mustKnow: [
      "Name entities and responsibilities before drawing inheritance trees.",
      "Interfaces should exist where behavior changes or dependencies should be swapped.",
      "A walkthrough is mandatory; otherwise the design stays decorative.",
    ],
    vivaQuestions: [
      "Why does this class exist, and what should not belong inside it?",
      "Where do you expect the design to change first?",
      "Why is composition better than inheritance here?",
      "What interface boundary makes testing or extension easier?",
      "Can you walk one request or use case through the design end to end?",
    ],
    miniDrills: [
      "Model one LLD problem in 20 minutes and speak the responsibilities of every class.",
      "Take one God-class design and split it into services, entities, and strategies.",
      "Add one extension point to an old design without rewriting the full model.",
    ],
    recommendedVideos: [VIDEOS.lldPlaylist, VIDEOS.exponentChannel],
    recoveryLinks: [
      { label: "System Design Primer", href: "/system-design-primer", note: "Rebuild the high-level flow before zooming into classes." },
      { label: "Dashboard", href: "/dashboard", note: "Lock one modeling drill and one walkthrough drill this week." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Pressure-test whether the design still sounds coherent aloud." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
  estimation: {
    title: "Estimation Practice Pack",
    summary: "Use this when your architecture discussion keeps collapsing because your scale assumptions or mental math are shaky.",
    mustKnow: [
      "Always state assumptions, units, and round numbers out loud.",
      "Rough but coherent math beats fake precision.",
      "Estimation is a communication skill as much as a calculation skill.",
    ],
    vivaQuestions: [
      "What baseline numbers do you assume for users, QPS, and storage?",
      "How do you sanity-check an answer that looks too large or too small?",
      "Why do unit mistakes break otherwise good design reasoning?",
      "What would you estimate first for a new product design problem?",
      "How would doubling traffic change your bottleneck story?",
    ],
    miniDrills: [
      "Do one QPS estimate, one storage estimate, and one bandwidth estimate in under 20 minutes.",
      "Take one design question and say every assumption before writing any number.",
      "Re-check an old estimate and fix one weak assumption or unit conversion.",
    ],
    recommendedVideos: [VIDEOS.bytebytegoPrimer, VIDEOS.gkcsChannel],
    recoveryLinks: [
      { label: "System Design Primer", href: "/system-design-primer", note: "Use estimation to strengthen the first 8 minutes of your design answer." },
      { label: "Dashboard", href: "/dashboard", note: "Schedule a short assumptions-and-math drill this week." },
      { label: "Mock Sessions", href: "/mock-sessions", note: "Practice speaking through your assumptions under time pressure." },
    ],
    sourceNote: COMMUNITY_SOURCE_NOTE,
  },
};

const PACK_BY_CATEGORY: Record<ChapterConfig["category"], SupportPackKey> = {
  "Learning Path": "planning",
  Interview: "interview-execution",
  "CS Fundamentals": "fundamentals-roadmap",
  Topics: "dsa-core",
  Reference: "planning",
};

const SLUG_PACK_OVERRIDES: Partial<Record<string, SupportPackKey>> = {
  "start-here": "planning",
  "progress-tracker": "planning",
  "two-tracks": "planning",
  "phase-0-cpp": "cpp",
  "phase-1-foundations": "dsa-core",
  "phase-2-intermediate": "dsa-core",
  "phase-3-advanced": "dsa-core",
  mechanics: "interview-execution",
  "oa-strategy": "interview-execution",
  "mock-sessions": "interview-execution",
  "company-specific": "behavioral",
  behavioral: "behavioral",
  "final-review": "behavioral",
  "post-placement": "behavioral",
  "cs-fundamentals-roadmap": "fundamentals-roadmap",
  "dbms-sql": "dbms",
  "operating-systems": "os",
  "computer-networks": "networks",
  "concurrency-multithreading": "concurrency",
  "system-design-primer": "system-design",
  "lld-ood-design": "lld",
  "estimation-mental-problems": "estimation",
  "complexity-analysis": "dsa-core",
  "pattern-recognition": "dsa-core",
  "sorting-algorithms": "dsa-core",
  "debugging-testing": "dsa-core",
  "ai-era-mastery": "interview-execution",
  cheatsheets: "dsa-core",
  "code-templates": "cpp",
  "language-flexibility": "cpp",
  "common-mistakes": "dsa-core",
  "patterns-journal-template": "dsa-core",
  "mental-game": "behavioral",
  resources: "planning",
  "crash-plans": "planning",
};

function normalizeCategory(category: string): ChapterConfig["category"] {
  if (
    category === "Learning Path" ||
    category === "Interview" ||
    category === "CS Fundamentals" ||
    category === "Topics" ||
    category === "Reference"
  ) {
    return category;
  }
  return "Reference";
}

export function getChapterSupport(slug: string, category: ChapterConfig["category"] | string): ChapterSupportPack {
  const normalizedCategory = normalizeCategory(category);
  const key = SLUG_PACK_OVERRIDES[slug] ?? PACK_BY_CATEGORY[normalizedCategory] ?? "planning";
  return SUPPORT_PACKS[key];
}
