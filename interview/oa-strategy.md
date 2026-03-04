# Online Assessment (OA) Strategy — The First Real Gate

> Most students' FIRST technical barrier is not a live interview — it is a proctored OA. Failing the OA means you never get to use your DSA skills. This chapter teaches OA-specific strategy.

---

## OA Platforms: What Each One Is

| Platform | Used By | Format | Key Difference |
|---|---|---|---|
| **HackerRank** | Amazon, Goldman Sachs, Uber, Adobe | 2-4 problems, 90-120 min, webcam+screen share | Partial credit based on test cases. Brute force that passes 6/10 > nothing |
| **CodeSignal GCA** | Meta, Robinhood, Instacart, Zoom | 4 problems in 70 min, standardized, reusable score | Score is permanent on your profile and shared across companies |
| **Codility** | Various mid-size companies | 2-3 problems, 30-90 min | Similar to HR, partial credit, less proctored |
| **Company Portal** | Google, Microsoft, Apple | Varies — often simpler than expected | Usually easier than LC contests. Focus on clean code over clever tricks |

---

## The 5-Rule OA Survival Playbook

**Rule 1: SCAN ALL PROBLEMS FIRST (2 minutes).** Read every problem before solving any. Start with the easiest — not the first. Problem order does not equal difficulty order.

**Rule 2: NEVER SUBMIT WITHOUT TESTING.** Run your code against custom test cases: empty input, single element, maximum constraints.

**Rule 3: PARTIAL CREDIT IS REAL.** Getting 7/10 on one problem and 0/10 on another is WORSE than 5/10 on both. Write a correct brute force first, submit, then optimize.

**Rule 4: KNOW YOUR COMPLEXITY FROM CONSTRAINTS.**

| N (input size) | Implied Algorithm |
|---|---|
| N ≤ 10 | Brute force, bitmask |
| N ≤ 100 | O(N²) or O(N³) |
| N ≤ 1,000 | O(N²) acceptable |
| N ≤ 10,000 | O(N²) borderline — aim for O(N log N) |
| N ≤ 100,000 | O(N log N) — sorting, binary search, heap, BFS |
| N ≤ 1,000,000 | O(N) — hash map, sliding window, prefix sum |
| N ≤ 10⁹ | O(log N) or O(1) — binary search on answer, math |

**Rule 5: PRACTICE THE EXACT PLATFORM.** Take at least one timed practice test on the same platform with webcam on before the real OA.

---

## Edge Cases to ALWAYS Check

→ See the complete [Edge Case Generation Guide](../topics/debugging-testing.md) — universal edge cases + type-specific tables.

---

**Next → [Company-Specific Preparation](./company-specific.md)**
