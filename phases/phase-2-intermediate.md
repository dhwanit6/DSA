# Phase 2 — Intermediate Mastery [Weeks 13-24]

---

## Week 13-15: Graphs — 30% of All FAANG Rounds

> Graphs appear in 30% of FAANG coding rounds. Maximum time investment here is justified.

### Core Concepts
- **Representations:** adjacency list (`vector<vector<pair<int,int>>>`) for sparse, matrix for dense
- **BFS** — queue-based, shortest path in unweighted graph, layer-by-layer
- **DFS** — recursive/iterative, connected components, path finding, cycle detection
- **Topological Sort** — Kahn's (BFS, detects cycle) AND DFS-based (add on exit). Know both
- **Cycle Detection** — directed: white/gray/black coloring; undirected: parent tracking
- **Dijkstra** — min-heap with `{dist, node}`. O((V+E) log V). Non-negative weights only
- **Bellman-Ford** — relax all edges V-1 times. O(VE). Handles negative weights
- **Floyd-Warshall** — O(V³). All-pairs. `dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])`
- **Union-Find (DSU)** — path compression + union by rank. Nearly O(1) amortized
- **MST** — Prim's (min-heap greedy) and Kruskal's (sort edges + DSU)

**Graph Resource:** [William Fiset](https://www.youtube.com/@WilliamFiset-videos) — best free graph theory course

**Key problems:** LC 200, 207, 210, 127, 787, 547, 1192

---

## Week 16-18: Greedy — Learn This BEFORE DP

> The old guide had Greedy AFTER DP. That was wrong. Understanding why greedy FAILS on certain problems is the motivation for DP.

- **Greedy test:** "Can I construct a counterexample where a greedy choice forces a worse global outcome?" If yes → use DP
- **Activity Selection** — sort by END time, greedily pick non-overlapping
- **Jump Game I & II** (LC 55, 45)
- **Minimum Arrows** (LC 452), **Gas Station** (LC 134), **Task Scheduler** (LC 621)

---

## Week 19-22: Dynamic Programming — The Game Changer

> Every DP problem: (1) Define STATE (2) Write RECURRENCE (3) BASE CASES (4) Optimize space

### Learning Order (Do NOT skip or reorder)
1. **1D DP** — Fibonacci, Climbing Stairs (LC 70), House Robber I & II (LC 198, 213)
2. **2D Grid DP** — Unique Paths (LC 62), Min Path Sum (LC 64)
3. **0/1 Knapsack** — `dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]]+val[i])`
4. **Unbounded Knapsack** — Coin Change (LC 322), Coin Change II (LC 518)
5. **Subset Sum / Partition** — LC 416, LC 494
6. **Subsequence DP** — LCS (LC 1143), LIS (LC 300 — O(N²) AND O(N log N)), Edit Distance (LC 72)
7. **String DP** — Palindrome Partitioning (LC 131), Wildcard Matching (LC 44)
8. **DP on Trees** — Tree knapsack, diameter, max path sum revisited

**Worked Example — 1D DP (LC 198: House Robber)**

> **Problem:** Given array `[2, 7, 9, 3, 1]`, find the maximum sum of non-adjacent elements.

> **Step 1 — Define the state:** `dp[i]` = maximum money you can rob from houses `0..i`.

> **Step 2 — Write the recurrence:** At house `i`, you have two choices: rob it (take `nums[i] + dp[i-2]`) or skip it (take `dp[i-1]`). So: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`.

> **Step 3 — Base cases:** `dp[0] = nums[0]` (rob the only house). `dp[1] = max(nums[0], nums[1])` (rob the better of the first two).

> **Step 4 — Trace through:** `dp = [2, 7, 11, 11, 12]`. Answer: 12.

> **Step 5 — Space optimization:** `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`. Replace the array with two variables. O(1) space.

> This pattern — define state, write recurrence, identify base cases, optimize space — is the universal DP framework. Every DP variant below follows the same 4 steps.

9. **Interval DP** — Burst Balloons (LC 312) — the hardest and most important

→ See the [DP Pattern Taxonomy Table](../topics/cheatsheets.md) for a consolidated reference of all 10 patterns with recurrences.

**Best DP Resource:** [Aditya Verma](https://www.youtube.com/@adityaverma3398) — best DP playlist on the internet

---

## Week 23-24: Heaps, Tries & Bit Manipulation

### Heaps
- Min-heap: `priority_queue<int, vector<int>, greater<int>>`
- **Top K pattern:** min-heap of size K → O(N log K)
- **Two-heap pattern for median:** max-heap (lower half) + min-heap (upper half)

### Tries
- `TrieNode`: `array<TrieNode*, 26> children; bool isEnd = false`
- Insert O(L), Search O(L), StartsWith O(L)
- Applications: autocomplete, word search, longest common prefix

### Bit Manipulation
- Check bit k: `(n >> k) & 1`
- Set bit k: `n | (1 << k)`
- Count bits: `__builtin_popcount(n)` or Kernighan's: `while(n) { n &= n-1; count++; }`
- XOR tricks: `a^a=0`, `a^0=a`. Single Number (LC 136)
- Power of 2: `n && !(n & (n-1))`

---

## Ready for Phase 3?

Phase 3 covers advanced topics (segment trees, advanced DP, string algorithms). You only need Phase 3 if you're targeting top-tier companies or competitive programming. For most placements, Phases 1-2 + solid interview prep is sufficient.

Move to Phase 3 when you can:

1. **Graphs:** Model a non-obvious word problem as a graph and choose the right algorithm (BFS vs. Dijkstra vs. Topo Sort) within 5 minutes.
2. **DP:** Given a new problem, identify whether it needs DP and which pattern (linear, knapsack, interval, grid) applies — within 10 minutes.
3. **Greedy:** Explain why a greedy approach fails for the 0/1 Knapsack problem but works for Activity Selection.
4. **Overall:** You've solved 150+ problems total, with at least 80 Mediums.

If you're interviewing in less than 4 weeks, skip Phase 3 entirely and go straight to [Interview Mechanics](../interview/mechanics.md) and [Mock Sessions](../interview/mock-sessions.md).

---

**Next → [Phase 3: Advanced Mastery](./phase-3-advanced.md)**
