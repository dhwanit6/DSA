import { CHAPTER_MAP } from "@/lib/chapters";

export interface ChecklistItem {
  id: string;
  text: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "core-idea", text: "Write the core idea in 3 lines in your journal." },
  { id: "apply", text: "Apply this chapter to at least 2 problems or interview questions." },
  { id: "review", text: "Schedule a review checkpoint in 3 days." },
];

const CATEGORY_CHECKLISTS: Record<string, ChecklistItem[]> = {
  "Learning Path": [
    { id: "action", text: "Complete the action steps listed in this chapter." },
    { id: "practice", text: "Solve at least 3 problems tied to this phase." },
    { id: "review", text: "Write a short weekly review and next steps." },
  ],
  Interview: [
    { id: "script", text: "Practice the key script or framework out loud once." },
    { id: "mock", text: "Apply this chapter in one mock or OA simulation." },
    { id: "notes", text: "Write 3 mistakes to avoid next time." },
  ],
  "CS Fundamentals": [
    { id: "viva", text: "Answer 5 rapid-fire interview questions from this chapter out loud." },
    { id: "example", text: "Work through one concrete example or mini-case from this chapter." },
    { id: "tradeoff", text: "Write one tradeoff or failure mode you must remember in interviews." },
  ],
  Topics: [
    { id: "intuition", text: "Write the core intuition in your own words." },
    { id: "trigger", text: "List 2 triggers that signal this pattern." },
    { id: "problems", text: "Solve 2 problems using this topic." },
  ],
  Reference: [
    { id: "bookmark", text: "Bookmark this chapter for revision week." },
    { id: "annotate", text: "Add 3 personal notes or examples." },
    { id: "drill", text: "Use this reference once in a timed session." },
  ],
};

const CHECKLIST_BY_SLUG: Record<string, ChecklistItem[]> = {
  "start-here": [
    { id: "track", text: "Pick your track (Internship / Full-Time / Crash)." },
    { id: "calendar", text: "Block weekly study slots in calendar." },
    { id: "day1", text: "Complete all Day 1 tasks before moving on." },
  ],
  "two-tracks": [
    { id: "choose-track", text: "Finalize your track based on timeline." },
    { id: "read-order", text: "Save your exact chapter order for this track." },
    { id: "week-plan", text: "Start this week plan and log it on dashboard." },
  ],
  "phase-0-cpp": [
    { id: "setup", text: "Set up local C++ workflow and compile template." },
    { id: "stl-drills", text: "Complete the 5 Day 1 STL micro-drills." },
    { id: "pass-gate", text: "Pass all 5 readiness checks before Phase 1." },
  ],
  "phase-1-foundations": [
    { id: "week-focus", text: "Choose one week block and complete its key problems." },
    { id: "journal", text: "Write journal entry for each new pattern." },
    { id: "gate", text: "Attempt the phase gate without hints." },
  ],
  "phase-2-intermediate": [
    { id: "graphs", text: "Solve at least 3 graph + 2 DP medium problems this week." },
    { id: "greedy", text: "Explain one greedy-fails counterexample in notes." },
    { id: "advance-gate", text: "Pass intermediate gate before entering Phase 3." },
  ],
  "phase-3-advanced": [
    { id: "scope", text: "Select only advanced topics needed for your target companies." },
    { id: "depth", text: "Solve at least 2 advanced problems and write full reasoning." },
    { id: "integration", text: "Connect advanced topics back to interview use-cases." },
  ],
  "crash-plans": [
    { id: "timeline", text: "Pick one crash timeline (4/8/16 weeks) and commit." },
    { id: "daily-load", text: "Lock daily study hours to match chosen timeline." },
    { id: "weekly-mocks", text: "Schedule weekly mocks from Week 2 onward." },
  ],
  mechanics: [
    { id: "45-min-flow", text: "Practice one full 45-minute interview flow aloud." },
    { id: "stuck-protocol", text: "Apply the stuck-recovery protocol in one mock." },
    { id: "test-loop", text: "Trace one edge-case set before final answer in practice." },
  ],
  "oa-strategy": [
    { id: "scan-rule", text: "Practice 3 OAs using scan-all-problems-first rule." },
    { id: "constraints", text: "Map constraints to target complexity for each OA problem." },
    { id: "mock", text: "Run at least one timed OA simulation with webcam on." },
  ],
  "cs-fundamentals-roadmap": [
    { id: "market", text: "Choose your likely market mix: US, Europe, India, or mixed." },
    { id: "sequence", text: "Lock your order: DBMS -> OS -> Networks -> Concurrency -> Design." },
    { id: "slots", text: "Reserve 3 weekly fundamentals slots on dashboard or calendar." },
  ],
  "dbms-sql": [
    { id: "sql-set", text: "Write 5 SQL queries covering JOIN, GROUP BY, subquery, and window-free ranking logic." },
    { id: "index", text: "Explain one good index choice and one bad index choice for the same schema." },
    { id: "tx", text: "Practice a 60-second answer for ACID, isolation level tradeoffs, and normalization vs denormalization." },
  ],
  "operating-systems": [
    { id: "proc-thread", text: "Practice the process vs thread answer until it is crisp and example-driven." },
    { id: "memory", text: "Explain stack vs heap, paging, and context switch without hand-waving." },
    { id: "deadlock", text: "Trace one deadlock example and state at least 2 prevention strategies." },
  ],
  "computer-networks": [
    { id: "request-flow", text: "Narrate one browser request end-to-end: DNS -> TCP/TLS -> HTTP -> response." },
    { id: "transport", text: "Practice when to choose TCP vs UDP with one concrete product example each." },
    { id: "latency", text: "Explain how CDN, keep-alive, caching, and load balancing reduce latency." },
  ],
  "concurrency-multithreading": [
    { id: "race", text: "Trace one race condition and fix it using a mutex, semaphore, or atomic." },
    { id: "primitives", text: "Explain mutex vs semaphore vs monitor in interview language, not textbook language." },
    { id: "deadlock", text: "Practice the 4 deadlock conditions and one real prevention approach." },
  ],
  "mock-sessions": [
    { id: "schedule", text: "Schedule 2 mock sessions in your calendar this week." },
    { id: "record", text: "Record each mock and note 3 improvement points." },
    { id: "repeat", text: "Repeat one weak mock problem without hints." },
  ],
  "company-specific": [
    { id: "target-list", text: "Pick your top 5 companies and gather pattern frequency." },
    { id: "set-practice", text: "Solve at least 5 company-tagged questions this week." },
    { id: "debrief", text: "Write one-page debrief on recurring company pattern asks." },
  ],
  behavioral: [
    { id: "stories", text: "Prepare 8 STAR stories mapped to common behavioral prompts." },
    { id: "practice", text: "Practice each story aloud with 2-minute and 4-minute versions." },
    { id: "feedback", text: "Get feedback from a peer on clarity and impact." },
  ],
  "final-review": [
    { id: "checklist", text: "Complete all 3-day checklist items." },
    { id: "mock-last", text: "Run one final timed mock interview." },
    { id: "sleep", text: "Lock sleep and review-light routine before interview day." },
  ],
  "complexity-analysis": [
    { id: "complexity-table", text: "Create one personal complexity cheat table for core patterns." },
    { id: "trace", text: "Trace one nested-loop problem and derive its time complexity." },
    { id: "space", text: "For 3 solved problems, write both time and space complexity." },
  ],
  "pattern-recognition": [
    { id: "trigger-map", text: "Build a trigger map for 6 common problem statements." },
    { id: "blind-practice", text: "Solve 3 mixed problems and identify pattern before coding." },
    { id: "review-errors", text: "Review wrong pattern picks and write correction rules." },
  ],
  "system-design-primer": [
    { id: "flow", text: "Run the full 30-minute design flow once with a timer." },
    { id: "scale", text: "State 3 explicit scale assumptions before drawing components." },
    { id: "tradeoffs", text: "Write 3 tradeoffs and 2 bottlenecks for one design." },
  ],
  "lld-ood-design": [
    { id: "entities", text: "List entities, responsibilities, and boundaries before writing classes." },
    { id: "interfaces", text: "Define at least 2 interfaces or extension points." },
    { id: "walkthrough", text: "Walk one end-to-end use case through your design." },
  ],
  "estimation-mental-problems": [
    { id: "assumptions", text: "State assumptions before every calculation." },
    { id: "units", text: "Check units at every step to avoid order-of-magnitude mistakes." },
    { id: "range", text: "End each answer with a sanity-check range and main bottleneck." },
  ],
  cheatsheets: [
    { id: "bookmark", text: "Bookmark this chapter for final-week quick revision." },
    { id: "annotate", text: "Add 5 personal notes to templates you often forget." },
    { id: "drill", text: "Use cheatsheets before one timed mock this week." },
  ],
  "code-templates": [
    { id: "template-pack", text: "Prepare your personal template pack in local editor." },
    { id: "typing-speed", text: "Type each template once from memory." },
    { id: "adapt", text: "Adapt one template to a new problem without copy-paste." },
  ],
};

export function getChapterChecklist(slug: string): ChecklistItem[] {
  if (CHECKLIST_BY_SLUG[slug]) return CHECKLIST_BY_SLUG[slug];
  const category = CHAPTER_MAP[slug]?.category;
  if (category && CATEGORY_CHECKLISTS[category]) return CATEGORY_CHECKLISTS[category];
  return DEFAULT_CHECKLIST;
}
