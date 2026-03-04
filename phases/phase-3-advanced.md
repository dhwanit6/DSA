# Phase 3 — Advanced Mastery [Weeks 25-40]

> Phase 3 is where top 10% becomes top 1%. This is intentionally uncomfortable.

---

## Week 25-27: Advanced Graph Algorithms

- **Strongly Connected Components** — Kosaraju's (two DFS passes) and Tarjan's (single DFS with low-link)
- **Articulation Points & Bridges** — Tarjan's bridge-finding. Critical for network reliability
- **Euler Path** — Hierholzer's algorithm. Reconstruct Itinerary (LC 332)
- **Geospatial structures** — QuadTree, Geohash for "nearest driver" problems (Uber/Google Maps)

---

## Week 28-30: Advanced Data Structures

> All follow the "split and recurse" pattern of merge sort.

- **Segment Tree** — build O(N), point update O(log N), range query O(log N). Implement from scratch
- **Segment Tree + Lazy Propagation** — range update in O(log N)
- **Fenwick Tree (BIT)** — simpler than seg tree. Prefix sum O(log N), update O(log N)
- **Sparse Table** — O(N log N) build, O(1) range minimum query. Static arrays only

**Reference:** [cp-algorithms.com](https://cp-algorithms.com/) — best algorithm reference that exists

---

## Week 31-33: Advanced Dynamic Programming

- **Bitmask DP** — `dp[mask]` where mask = bitmask of included elements. TSP: O(2^N × N²)
- **Digit DP** — count numbers with a property in [L, R]. "Tight constraint" concept
- **DP + Data Structures** — Segment Tree or BIT to speed up DP transitions O(N) → O(log N)
- **SOS DP (Sum over Subsets)** — for each mask, sum over all submasks. O(N × 2^N)

---

## Week 34-40: Competitive Programming Integration

- **Codeforces Div.2 contests** — participate LIVE every week
- **CSES Problem Set** — complete 180+ / 300 problems. Gold standard benchmark
- **LeetCode Weekly** — every Sunday. Target: consistently solve Q1-Q3
- **After every contest:** read editorial for EVERY problem, including ones you solved

### Codeforces Rating Calibration

| CF Rating | What It Indicates | Interview Readiness |
|---|---|---|
| < 1200 | Building fundamentals | Not ready for campus DSA rounds |
| 1200-1599 | Solid fundamentals | Internship-ready at many companies |
| 1600-1899 | Good graphs, DP | Strong for most campus placements |
| 1900-2199 | Advanced algorithms | Competitive for FAANG |
| 2200+ | Exceptional ability | FAANG strong hire signal |

> CF rating is a calibration tool, not a hiring criterion. Thousands get placed at Microsoft/Amazon with no CP background.

---

**Next → [Code Templates](../topics/code-templates.md)**
