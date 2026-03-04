# Algorithm Cheatsheets — Last-Minute Quick Reference

> Print these. Review 30 minutes before your interview. Each section is a self-contained 1-page reference.

---

## Arrays & Strings

| Technique | Time | Space | When to Use |
|---|---|---|---|
| Two Pointers (sorted) | O(N) | O(1) | Pair sum, container, remove duplicates |
| Two Pointers (fast/slow) | O(N) | O(1) | Cycle detection, middle of linked list |
| Sliding Window (fixed) | O(N) | O(1) | Max sum of size K |
| Sliding Window (variable)| O(N) | O(K) | Longest/shortest subarray with condition |
| Prefix Sum | O(N) build | O(N) | Range sum queries, subarray sum = K |
| Kadane's | O(N) | O(1) | Maximum subarray sum |
| Hash Map frequency | O(N) | O(N) | Anagrams, duplicates, two sum |
| Sort + Two Pointers | O(N log N) | O(1) | 3Sum, closest pair |

**Corner cases:** Empty array, single element, all same, all negative, integer overflow on sum.

---

## Binary Search

```cpp
// Standard Binary Search Template
// Use lo < hi for boundary searches
int search(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (condition(mid)) hi = mid;    // mid might be answer
        else lo = mid + 1;              // need bigger
    }
    return lo; 
}
```

**Key variants to know:**

- **lower_bound** — First element &ge; target: `if (arr[mid] >= target) hi = mid`
- **upper_bound** — First element &gt; target: `if (arr[mid] > target) hi = mid`
- **BS on Answer** — Minimize/Maximize a value: `lo = min`, `hi = max`, then binary search the answer space
- **BS on Real Numbers** — Float precision: `while (hi - lo > 1e-6)`
- **Rotated Array** — Compare `arr[mid]` with `arr[hi]` to determine which half is sorted

**Corner cases:** Array of size 1. Target at boundaries. Target not present. Overflow in `lo + hi`.

---

## Recursion & Backtracking

```cpp
// Template: CHOOSE → EXPLORE → UN-CHOOSE
void backtrack(result, current, choices, int start) {
    if (complete) { result.push_back(current); return; }
    for (int i = start; i < choices.size(); i++) {
        current.push_back(choices[i]);     // CHOOSE
        backtrack(result, current, choices, i + 1); // EXPLORE
        current.pop_back();                // UN-CHOOSE
    }
}
```

**Know these variations well:**

- **Subsets** — `start = i + 1`. Dedup: sort + skip `nums[i] == nums[i-1]`
- **Permutations** — Use `visited[]`. Dedup: sort + skip visited same value
- **Combinations (k)** — `start = i + 1`, prune when `n - k + 1`
- **Unlimited reuse** — Use `i` instead of `i + 1` (don't advance the start)

---

## Linked Lists

| Operation | Key Technique |
|---|---|
| Reverse | `prev/curr/next` three-pointer swap |
| Find middle | Fast (2 steps) + Slow (1 step) |
| Detect cycle | Floyd's: fast moves 2, slow moves 1 |
| Merge two sorted | Dummy head + compare-and-advance |
| Remove nth from end | Two pointers, n-gap apart |

**Corner cases:** Empty list, single node, cycle, duplicates at head/tail.

---

## Trees

```cpp
// Universal DFS template for trees:
int solve(Node* node) {
    if (!node) return 0;
    int left = solve(node->left);
    int right = solve(node->right);
    return combine(left, right, node->val);
}
```

**Traversal orders:**

- **Inorder** (Left → Root → Right): Stack, push all lefts, pop, go right
- **Preorder** (Root → Left → Right): Stack, push right then left
- **Postorder** (Left → Right → Root): Two stacks or reverse of modified preorder
- **Level Order**: Queue + level size tracking

**Common problem patterns:**

- **Height/Depth** — `1 + max(left_h, right_h)`
- **Diameter** — `left_h + right_h` at each node
- **Path Sum** — Pass remaining sum down, check at leaf
- **LCA** — If both sides return non-null, root is LCA
- **Validate BST** — Pass `(min, max)` range down recursively
- **Serialize** — Preorder + null markers

**Corner cases:** Null tree, single node, skewed tree, negative values.

---

## Graphs

| Algorithm | Purpose | Time | Key Use Case |
|---|---|---|---|
| BFS | Shortest path (unweighted) | O(V+E) | Level-order, min steps |
| DFS | Explore all paths | O(V+E) | Cycle detection, topo sort |
| Dijkstra | Shortest path (weighted) | O(E log V) | GPS, routing |
| Bellman-Ford | Negative weights | O(V×E) | Detect negative cycles |
| Topo Sort | Ordering | O(V+E) | Dependencies |
| Union-Find | Components | O(α(N)) | Kruskal's, grouping |

---

## Dynamic Programming

**Think of DP as "careful brute force." Define the state, then find the recurrence.**

| Pattern | State | Recurrence |
|---|---|---|
| **Linear** | `dp[i]` | `dp[i] = f(dp[i-1], dp[i-2])` |
| **0/1 Knapsack** | `dp[i][w]` | `max(include, exclude)` |
| **Unbounded** | `dp[w]` | `dp[w] = max(dp[w], dp[w-wt]+val)` |
| **LCS** | `dp[i][j]` | Match: `dp[i-1][j-1]+1` |
| **LIS** | `dp[i]` | `max(dp[j]+1) for j < i` |

---

## Heaps & Priority Queues

**Max Heap (C++):** `priority_queue<int> pq;` — largest element on top.

**Min Heap (C++):** `priority_queue<int, vector<int>, greater<int>> pq;` — smallest on top.

**Two Heaps pattern:** Use a max heap for the lower half and a min heap for the upper half. This is the key idea behind "Find Median from Data Stream."

---

## Bit Manipulation

| Operation | Code | What It Does |
|---|---|---|
| Check bit i | `n & (1 << i)` | Is bit i set? |
| Set bit i | `n \| (1 << i)` | Turn on bit i |
| Clear bit i | `n & ~(1 << i)` | Turn off bit i |
| Toggle bit i | `n ^ (1 << i)` | Flip bit i |
| Lowest set bit | `n & (-n)` | Isolate rightmost 1 |
| Clear lowest bit | `n & (n-1)` | Remove rightmost 1 |
| Power of 2 | `n > 0 && !(n & (n-1))` | Only one bit set |

**XOR properties:** `a ^ a = 0`, `a ^ 0 = a`. This is the key to "Single Number."

---

**Next → [Code Templates](./code-templates.md)**
