# Progress Tracker & Spaced Repetition System

> Copy this template to a Google Sheet or Notion page. Update it daily. It is the single most important tool in your preparation system.

---

## Why This System Works

Human memory follows the forgetting curve — without review, you forget ~70% of new material within a week. The spaced repetition schedule (Day 3 → Day 7 → Day 21) is based on memory consolidation research. Problems reviewed at these intervals move from short-term to long-term memory with ~80% retention.

This is why two students who solve the same 300 problems can have completely different results: one reviewed strategically, the other didn't.

---

## Google Sheets Setup

Create a sheet with these exact columns:

| Column | Name | What to Put |
|---|---|---|
| A | Problem Name | e.g., "Two Sum" |
| B | Platform + Number | e.g., "LC 1" |
| C | Topic | e.g., "Arrays", "Graphs", "DP" |
| D | Pattern | e.g., "Hash Map", "Sliding Window" |
| E | Difficulty | Easy / Medium / Hard |
| F | Date Solved | e.g., "2026-03-15" |
| G | My Rating (1-5) | How well you felt you understood it |
| H | Review Day 3 | Date (auto-calculate: F + 3) |
| I | Review Day 7 | Date (auto-calculate: F + 7) |
| J | Review Day 21 | Date (auto-calculate: F + 21) |
| K | D3 Done? | or blank |
| L | D7 Done? | or blank |
| M | D21 Done? | or blank |
| N | Owned? | Y / N (can you solve cold in < 25 min?) |
| O | Key Insight | One sentence — the core idea |

**Auto-calculate review dates in Sheets:** In H2 type `=F2+3`, in I2 type `=F2+7`, in J2 type `=F2+21`

**Filter for today's reviews:** Add a filter on columns H, I, J where value = TODAY()

---

## Rating Scale

| Rating | Meaning |
|---|---|
| 1 | Had no idea. Needed to read solution fully. |
| 2 | Partial idea. Needed significant hints. |
| 3 | Got the approach but had implementation bugs. |
| 4 | Solved it but slower than ideal or missed an edge case. |
| 5 | Solved cleanly in good time. Fully understand it. |

Aim for Rating 4+ before marking "Owned? = Y"

---

## The Review Protocol

On review days, open the problem with NO reference to your previous solution.

- **Day 3 review:** Can you remember the core approach? Solve it from scratch. If you get stuck after 15 minutes, look at your Patterns Journal entry (KEY INSIGHT only) — not the full solution.
- **Day 7 review:** Can you solve it in < 25 minutes with clean code? If not, re-read your full journal entry and try again.
- **Day 21 review:** Final validation. Solve it in < 20 minutes. If yes → "Owned = Y." If no → reset review cycle, add another Day 21 review.

---

## Weekly Stats Tracker (Optional)

Add a second sheet with these stats to track momentum:

| Week | Problems Solved | Reviews Completed | New Topics | Contest Attempted | Contest Result |
|---|---|---|---|---|---|
| Week 1 | | | | | |
| Week 2 | | | | | |
| ... | | | | | |

---

## Monthly Milestones Checklist

- [ ] **Month 1:** 50 problems solved. C++ STL fluent. Easy LeetCode in < 15 min.
- [ ] **Month 2:** 100 problems. Recursion/backtracking template automatic. First Pramp session done.
- [ ] **Month 3:** 150 problems. Trees and basic graphs solid. First LeetCode Weekly Contest attempted.
- [ ] **Month 4-5:** 200 problems. Internship OA mocks started (2/week timed).
- [ ] **Month 6:** 250 problems. Greedy + Basic DP done. **Internship season.**
- [ ] **Month 7-8:** 300 problems. Full DP patterns done. CF Div.3 A-C consistent.
- [ ] **Month 9-10:** 350 problems. CSES 150+ done. LeetCode 2000+ rating.
- [ ] **Month 11-12:** 400 problems. Advanced DS done. CF Specialist+.
- [ ] **Month 13-15:** System design basics solid. 2 mock interviews/week.
- [ ] **Month 16-18:** **Full-time placement season.** 3 mocks/week. Company-specific prep final 2 weeks.

---

## Notion Alternative

If you prefer Notion over Google Sheets, create a database with:
- **Properties:** Name, Platform, Topic, Pattern, Difficulty, Date Solved, Rating, Owned
- **Views:**
  - "Review Today" — filtered by calculated review date = today
  - "By Topic" — grouped by Topic for targeted review
  - "Not Owned" — filtered by Owned = No, sorted by Date Solved (oldest first)

---

## The Hardest Part

Maintaining the tracker for 18 months is harder than solving the problems.

On the days you don't feel like updating it — update it anyway. The tracking system creates accountability. Accountability creates consistency. Consistency creates placement offers.

The data you collect also becomes extremely valuable in mock interviews when asked: *"How have you been preparing?"* Being able to say *"I've solved 380 problems across all topics, reviewed each three times using spaced repetition, and my average solve time for Mediums has gone from 45 minutes to 22 minutes"* is a different signal than *"I've been doing LeetCode."*
