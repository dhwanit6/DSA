# 📋 Algorithm Cheatsheets — Last-Minute Quick Reference

> Print these. Review 30 minutes before your interview. Each section is a self-contained 1-page reference.

---

## Arrays & Strings

| Technique | Time | Space | When to Use |
|---|---|---|---|
| Two Pointers (sorted) | O(N) | O(1) | Pair sum, container, remove duplicates |
| Two Pointers (fast/slow) | O(N) | O(1) | Cycle detection, middle of linked list |
| Sliding Window (fixed) | O(N) | O(1) | Max sum of size K |
| Sliding Window (variable) | O(N) | O(K) | Longest/shortest subarray with condition |
| Prefix Sum | O(N) build, O(1) query | O(N) | Range sum queries, subarray sum = K |
| Kadane's | O(N) | O(1) | Maximum subarray sum |
| Hash Map frequency | O(N) | O(N) | Anagrams, duplicates, two sum |
| Sort + Two Pointers | O(N log N) | O(1) | 3Sum, closest pair |

**Corner cases:** Empty array, single element, all same, all negative, integer overflow on sum.

---

## Binary Search

```
Pattern: lo < hi (boundary search)
    mid = lo + (hi - lo) / 2
    condition(mid) true  → hi = mid    (mid might be answer)
    condition(mid) false → lo = mid + 1 (need bigger)
    return lo  → first position where condition is true
```

| Variant | What It Finds | Key Line |
|---|---|---|
| `lower_bound` | First ≥ target | `if (arr[mid] >= target) hi = mid` |
| `upper_bound` | First > target | `if (arr[mid] > target) hi = mid` |
| BS on Answer | Min/max feasible value | `if (canAchieve(mid)) hi = mid` |
| Rotated Array | Min element / search target | Compare `arr[mid]` with `arr[hi]` |

**Corner cases:** Array of size 1. Target at boundaries. Target not present. Overflow in `lo + hi`.

---

## Recursion & Backtracking

```
Template: CHOOSE → EXPLORE → UN-CHOOSE

backtrack(result, current, choices, start):
    if complete: result.add(copy of current); return
    for i = start to end:
        current.add(choices[i])          // CHOOSE
        backtrack(result, current, choices, i+1)  // EXPLORE
        current.removeLast()             // UN-CHOOSE
```

| Problem Type | `start` param | Dedup Strategy |
|---|---|---|
| Subsets | `i + 1` | Sort + skip `nums[i] == nums[i-1]` |
| Permutations | use `visited[]` | Sort + skip visited same value |
| Combinations (k) | `i + 1`, stop at `n-k+1` | Natural from start param |
| Unlimited reuse | `i` (not `i+1`) | Avoid re-sorting |

---

## Linked Lists

| Operation | Key Technique |
|---|---|
| Reverse | `prev/curr/next` three-pointer swap |
| Find middle | Fast (2 steps) + Slow (1 step) |
| Detect cycle | Floyd's: fast=2, slow=1. Entry: reset slow to head, both move 1 |
| Merge two sorted | Dummy head + compare-and-advance |
| Remove nth from end | Two pointers, n-gap apart |

**Corner cases:** Empty list, single node, cycle, duplicates at head/tail.

---

## Trees

```
Universal template:
    solve(node):
        if !node: return base_case
        left = solve(node.left)
        right = solve(node.right)
        return combine(left, right, node.val)
```

| Traversal | Order | Iterative Tool |
|---|---|---|
| Inorder | Left → Root → Right | Stack (push all lefts, pop, go right) |
| Preorder | Root → Left → Right | Stack (push right then left) |
| Postorder | Left → Right → Root | Two stacks OR reverse of modified preorder |
| Level Order | Level by level | Queue + level size tracking |

| Problem Pattern | Key Insight |
|---|---|
| Height/Depth | `1 + max(left_h, right_h)` |
| Diameter | `left_h + right_h` at each node, track global max |
| Path Sum | Pass remaining sum down, check at leaf |
| LCA | If both sides return non-null, current node is LCA |
| Validate BST | Pass `(min, max)` range down |
| Serialize | Preorder + null markers, deserialize with queue |

**Corner cases:** Null tree, single node, skewed (all left/right), negative values.

---

## Graphs

| Algorithm | Purpose | Time | Key Use Case |
|---|---|---|---|
| BFS | Shortest path (unweighted) | O(V+E) | Level-order, min steps |
| DFS | Explore all paths, connected components | O(V+E) | Cycle detection, topo sort |
| Dijkstra | Shortest path (weighted, non-negative) | O(E log V) | GPS, network routing |
| Bellman-Ford | Shortest path (negative weights) | O(V×E) | Detect negative cycles |
| Topo Sort (Kahn's) | Ordering with dependencies | O(V+E) | Course schedule, build order |
| Union-Find (DSU) | Connected components, cycle detection | O(α(N)) | MST (Kruskal's), grouping |
| Kruskal's MST | Minimum spanning tree | O(E log E) | Network design |
| Tarjan's | Bridges, articulation points, SCCs | O(V+E) | Critical connections |

```
BFS template:
    queue.push(start); visited[start] = true
    while queue not empty:
        node = queue.pop()
        for neighbor in adj[node]:
            if !visited[neighbor]:
                visited[neighbor] = true
                queue.push(neighbor)
```

**Corner cases:** Disconnected graph, self-loops, duplicate edges, single node.

---

## Dynamic Programming (Pattern Taxonomy)

| Pattern | State | Recurrence | Classic Problems |
|---|---|---|---|
| **Linear** | `dp[i]` | `dp[i] = f(dp[i-1], dp[i-2])` | Climbing Stairs, House Robber |
| **0/1 Knapsack** | `dp[i][w]` | `max(include, exclude)` | Partition Equal Subset, Target Sum |
| **Unbounded Knapsack** | `dp[w]` | `dp[w] = max(dp[w], dp[w-wt]+val)` | Coin Change, Rod Cutting |
| **LCS** | `dp[i][j]` | Match: `dp[i-1][j-1]+1`, else `max(skip)` | Edit Distance, Longest Common Subseq |
| **LIS** | `dp[i]` or patience sort | `dp[i] = max(dp[j]+1) for j<i, a[j]<a[i]` | Russian Doll Envelopes |
| **Interval** | `dp[i][j]` | `min over k of (dp[i][k] + dp[k+1][j] + cost)` | Burst Balloons, MCM |
| **Grid** | `dp[i][j]` | `f(dp[i-1][j], dp[i][j-1])` | Unique Paths, Min Path Sum |
| **Tree** | `dp[node]` | `dp[node] = f(dp[children])` | House Robber III, max path sum |
| **Bitmask** | `dp[mask][i]` | `dp[mask|bit][j] = dp[mask][i] + cost` | TSP, Partition into subsets |
| **Digit** | `dp[pos][tight][sum]` | Digit-by-digit build | Count numbers with digit sum K |

**DP debugging:** If WA → check base case. If TLE → check if states are truly O(N²) or actually O(N³). If MLE → can you reduce to 1D?

---

## Heaps & Priority Queues

| Use Case | Heap Type | Pattern |
|---|---|---|
| K largest | Min-heap of size K | Push all; if size > K, pop (smallest leaves) |
| K smallest | Max-heap of size K | Push all; if size > K, pop (largest leaves) |
| Merge K sorted | Min-heap of K elements | Pop min, push next from same list |
| Running median | Max-heap (lower half) + Min-heap (upper half) | Balance sizes after each insert |
| Top K frequent | Map frequency + min-heap of size K | O(N log K) |

---

## Bit Manipulation

| Operation | Code | What It Does |
|---|---|---|
| Check bit i | `n & (1 << i)` | Is bit i set? |
| Set bit i | `n | (1 << i)` | Turn on bit i |
| Clear bit i | `n & ~(1 << i)` | Turn off bit i |
| Toggle bit i | `n ^ (1 << i)` | Flip bit i |
| Lowest set bit | `n & (-n)` | Isolate rightmost 1 |
| Clear lowest set bit | `n & (n-1)` | Remove rightmost 1 (used in popcount) |
| Is power of 2 | `n > 0 && (n & (n-1)) == 0` | Only one bit set |
| Count set bits | `__builtin_popcount(n)` | Number of 1s |

**XOR properties:** `a ^ a = 0`, `a ^ 0 = a`, associative + commutative → "find single number".

---

## String Algorithms

| Algorithm | Time | Purpose |
|---|---|---|
| KMP | O(N+M) | Pattern matching with failure function |
| Rabin-Karp | O(N+M) avg | Pattern matching with hash (rolling hash) |
| Trie | O(L) per op | Prefix search, autocomplete |
| Manacher's | O(N) | Longest palindromic substring |
| Z-Algorithm | O(N) | All occurrences of pattern (alternative to KMP) |

---

**Next → [Code Templates](./code-templates.md)**
