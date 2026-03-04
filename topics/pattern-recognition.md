# Pattern Recognition — How to Identify Which Algorithm to Use

> Knowing *how* algorithms work is half the job. Knowing *when* to use them is the other half — and most guides never teach it.

---

## The Core Skill

Pattern recognition is the ability to read a problem statement and map it to a known algorithmic approach in under 30 seconds. This is what separates candidates who solve Hard problems from those who can only solve problems they have seen before.

It is a learnable skill. It is built by studying the **triggers** — the specific words, constraints, and structures in problem statements that signal each approach.

---

## Pattern Trigger Dictionary

### Sliding Window

**Triggers:**
- "longest/shortest subarray/substring with condition..."
- "maximum sum of k consecutive elements"
- "minimum window containing all characters"
- Input is a sequence (array or string) and you need a contiguous range

**What to ask yourself:** *Is there a condition on a contiguous portion of the input that I can maintain as I slide a window?*

**Examples:** LC 3, LC 76, LC 424, LC 209, LC 567

---

### Two Pointers

Three distinct sub-patterns — know which applies:

**Sub-pattern A — Opposite Ends (sorted array, shrink toward center)**  
Triggers: "find pair with target sum in sorted array", "container with most water"  
Examples: LC 1 (variant), LC 11, LC 15

**Sub-pattern B — Fast/Slow (same direction, different speeds)**  
Triggers: "detect cycle", "find middle of linked list", "find duplicate number in array"  
Examples: LC 142, LC 287, Floyd's Cycle

**Sub-pattern C — Two Arrays (traverse two sequences simultaneously)**  
Triggers: "merge two sorted arrays", "is subsequence", "compare two sequences"  
Examples: LC 88, LC 392, LC 977

---

### Binary Search

**Triggers:**
- Array is sorted (obvious)
- "find minimum X such that condition(X) is true" — binary search on answer
- "find peak/valley element"
- The answer space is monotone: if X works, X-1 works (or vice versa)
- Constraint: N ≤ 10^9 (you cannot iterate — must be O(log N))

**The Binary Search on Answer template:**
```
Is there a monotone function f(x) where:
- f(small) = false, f(large) = true (or vice versa)?
→ Binary search on x, not on the array
```
Examples: LC 875 (Koko), LC 1011 (ship packages), LC 1482 (bouquets)

---

### Prefix Sum

**Triggers:**
- "sum of subarray from index i to j" — many times
- "count subarrays with sum equal to k"
- Range queries on a static array
- "difference array" for range update problems

**Formula:** `rangeSum(i, j) = prefix[j] - prefix[i-1]` in O(1) after O(N) preprocessing

Examples: LC 560, LC 238, LC 303

---

### Hash Map / Hash Set

**Triggers:**
- "find if X exists" — need O(1) lookup
- "count frequency of elements"
- "find first non-repeating element"
- "two sum" pattern — what do I need to complete this?
- Remove duplicates with order preservation

---

### Stack / Monotonic Stack

**Triggers:**
- "next greater element" / "previous smaller element"
- "largest rectangle in histogram"
- Matching brackets, parentheses, nested structures
- "temperature when it gets warmer"

**The monotonic stack insight:** Maintain a stack where elements are always increasing (or always decreasing). When a new element violates the order, pop until the order is restored. Each pop = "found the answer for that element."

Examples: LC 739, LC 84, LC 496, LC 42

---

### BFS (Breadth-First Search)

**Triggers:**
- **Shortest path in an unweighted graph** — BFS guarantees shortest path
- "minimum number of steps/moves to reach target"
- Level-by-level processing needed
- Multi-source BFS: multiple starting points simultaneously
- "minimum transformations" (Word Ladder pattern)

**The hidden graph recognition:** If a problem has "states" and "transitions between states," it is a graph problem. BFS finds the minimum transitions. Examples: Word Ladder (LC 127) — letters are states, one-letter changes are edges.

---

### DFS (Depth-First Search)

**Triggers:**
- "all paths from source to target"
- Connected components, flood fill
- Cycle detection (especially directed graphs)
- Topological sorting
- Explore all possibilities (used with backtracking)

---

### Topological Sort

**Triggers:**
- "tasks with prerequisites"
- "course must be taken before course"
- Dependencies between items
- "is there a valid ordering?"
- Directed Acyclic Graph implied

**Two implementations:** Kahn's Algorithm (BFS-based, detects cycles naturally) and DFS-based (add to result on exit). Know both.

Examples: LC 207, LC 210, LC 269

---

### Union-Find (DSU)

**Triggers:**
- "are X and Y in the same group/component?"
- Dynamic connectivity — edges added over time
- "minimum edges to make graph connected"
- Kruskal's MST
- "redundant connection" (LC 684)

---

### Dijkstra's Algorithm

**Triggers:**
- "shortest path in a weighted graph" (non-negative weights only)
- Minimum cost to travel between nodes
- "network delay time"

**When NOT Dijkstra:** Negative weights → Bellman-Ford. All pairs → Floyd-Warshall.

---

### Dynamic Programming

**The hardest pattern to recognize. Use this flowchart:**

```
Does the problem ask for:
  COUNT of ways to achieve something?         → DP (count variant)
  MINIMUM/MAXIMUM of something?               → DP or Greedy
  IS IT POSSIBLE to achieve something?        → DP (boolean variant)
  ALL combinations/arrangements?             → Backtracking

Does the problem have:
  Overlapping subproblems?                   → DP (not pure recursion)
  Optimal substructure?                      → DP or Greedy

Can you define:
  A state that captures all relevant info?   → DP
  A recurrence: dp[i] depends on dp[i-1]?  → DP
```

**DP sub-patterns and their triggers:**

| Sub-pattern | Trigger Phrase |
|---|---|
| 1D DP | "rob houses in a row", "climb stairs", "decode ways" |
| 2D Grid DP | "minimum path in a grid", "unique paths with obstacles" |
| 0/1 Knapsack | "given items with weight/value, maximize value within capacity" |
| Unbounded Knapsack | "coin change — coins can be used unlimited times" |
| LCS | "longest common subsequence/substring of two strings" |
| LIS | "longest increasing subsequence" |
| Interval DP | "minimum cost to merge/burst ranges" |
| DP on Trees | "maximum independent set in a tree", "tree diameter" |
| Bitmask DP | "visit all cities once", "assign tasks to workers" |

---

### Greedy

**Triggers:**
- Sorting by a specific criterion leads to an obvious strategy
- "minimum number of intervals/slots/arrows"
- "activity selection" — maximize number of non-overlapping activities
- Jump Game patterns

**The test for greedy:** Can you prove that a locally optimal choice never forces a globally worse outcome? If yes, greedy. If no (you can construct a counterexample), use DP.

---

### Backtracking

**Triggers:**
- "find ALL solutions" (not just one or count)
- "generate all subsets/permutations/combinations"
- "can we place N queens", "solve this puzzle"

**The universal template:**
```
function backtrack(state, choices):
    if state is complete:
        add to results
        return
    for each choice in choices:
        make choice (modify state)
        backtrack(new state, remaining choices)
        undo choice (restore state)  ← this "undo" step is what makes it backtracking
```

---

### Heap / Priority Queue

**Triggers:**
- "find K largest/smallest elements"
- "find median in a stream"
- "merge K sorted lists/arrays"
- Greedy problems that need the current minimum or maximum efficiently

**The Top-K template:** Min-heap of size K. For each element: push to heap. If size > K, pop minimum. Remaining heap = K largest. O(N log K).

---

### Trie

**Triggers:**
- "autocomplete", "prefix matching"
- "find all words starting with..."
- "longest common prefix of a set of strings"
- Word search problems where you need to match against many patterns simultaneously

---

## The Hidden Graph Recognition Checklist

Many problems don't say "graph" but are graph problems. Ask:

1. Are there **entities** that can be connected? → Vertices
2. Are there **relationships** between entities? → Edges
3. Is the problem about **reachability**, **shortest path**, or **ordering**? → BFS/DFS/Topo

**Disguised graph problems:**
- "Transform string A to string B by changing one character at a time" → Word Ladder → BFS
- "N courses with prerequisites" → Course Schedule → Topological Sort
- "Cells in a grid can 'infect' neighbors" → Rotting Oranges → Multi-source BFS
- "Cities that can reach each other by roads" → Connected Components → DFS/Union-Find
- "Person A trusts Person B" → Trust graph → In-degree counting

---

## Quick-Reference: Constraint → Algorithm

This table is your first move when you see a problem. Read the constraints box *before* thinking about the solution.

| N = input size | Time Limit | Algorithm Complexity Required |
|---|---|---|
| N ≤ 10 | Any | Brute force, O(2^N), bitmask DP |
| N ≤ 20 | Any | O(2^N) DP, brute force with pruning |
| N ≤ 100 | Any | O(N³) — Floyd-Warshall, Matrix Chain DP |
| N ≤ 1,000 | Any | O(N²) — 2D DP, brute force nested loops |
| N ≤ 10,000 | Any | O(N² ) borderline — aim for O(N log N) |
| N ≤ 100,000 | 1-2 sec | O(N log N) — sorting, binary search, heap, BFS |
| N ≤ 1,000,000 | 1-2 sec | O(N) — hash map, sliding window, prefix sum |
| N ≤ 10^9 | Any | O(log N) or O(1) — binary search on answer, math |

---

## Recommended Videos

Pattern recognition is best learned by watching someone else think through problems. These channels explain the **why** behind pattern selection:

- **NeetCode — How I Would Learn DSA (if starting over)** (YouTube) — Covers the mental model for categorizing problems. Watch this once, then revisit after solving 50 problems.
- **Striver — Complete A2Z DSA Playlist** (YouTube, takeUforward) — Organized by pattern. Use the pattern-specific videos when you're stuck on a category.
- **Errichto — How to Practice Competitive Programming** (YouTube) — Advanced, but his approach to reading constraints → choosing algorithms is directly applicable to interviews.

---

**Next → [Phase 0: C++ Mastery Sprint](../phases/phase-0-cpp.md)**
