# 📐 Complexity Analysis — As a Skill, Not a Label

> Most guides mention Big-O. None teach you how to **derive** it. Interviewers test derivation, not labeling.

---

## Why This Matters

After you write a solution, an interviewer will ask: *"What is the time and space complexity?"*  
The weak answer: *"It's O(N log N)."*  
The strong answer: *"The outer loop runs N times. Each iteration does a heap push which is O(log K). So total time is O(N log K). Space is O(K) for the heap."*

That is the difference between labeling and deriving. Interviewers explicitly evaluate the latter.

---

## Part 1: Time Complexity — How to Derive It

### The 4-Step Process

1. **Identify the dominant operation** — the one that runs most often
2. **Count how many times it runs** as a function of input size N
3. **Drop constants and lower-order terms**
4. **State the worst case**

### Common Patterns — Know All of These

| Code Pattern | Complexity | Why |
|---|---|---|
| Single loop 0..N | O(N) | N iterations |
| Nested loops 0..N, 0..N | O(N²) | N × N iterations |
| Loop that halves each time | O(log N) | log₂(N) halvings |
| Loop 0..N, inner halves | O(N log N) | N × log N |
| Recursion with 2 branches, no overlap | O(2^N) | Binary tree of calls |
| Recursion with memoization, N states | O(N) or O(N²) | Each state computed once |
| BFS/DFS on a graph | O(V + E) | Visit every vertex and edge once |
| Merge sort | O(N log N) | log N levels, N work per level |

### The Master Theorem (For Recursive Functions)

For T(N) = a·T(N/b) + f(N):

```
If f(N) = O(N^c) where c < log_b(a)  →  T(N) = O(N^(log_b a))
If f(N) = O(N^c) where c = log_b(a)  →  T(N) = O(N^c · log N)
If f(N) = O(N^c) where c > log_b(a)  →  T(N) = O(f(N))
```

**Practical shortcuts you must memorize:**

| Recurrence | Solution | Example |
|---|---|---|
| T(N) = 2T(N/2) + O(N) | O(N log N) | Merge Sort |
| T(N) = 2T(N/2) + O(1) | O(N) | Tree height |
| T(N) = T(N-1) + O(N) | O(N²) | Insertion Sort |
| T(N) = T(N-1) + O(1) | O(N) | Factorial |

### Amortized Analysis — The One Everyone Gets Wrong

**Vector push_back is O(1) amortized, not O(N).** Why?

Doubling happens rarely. Over N push_backs: total work = N + N/2 + N/4 + ... = 2N = O(N). Per operation: O(1) amortized.

**Why this matters in interviews:**  
- `unordered_map` operations are O(1) average, O(N) worst case (hash collision)
- Stack/queue using two vectors: each element pushed and popped at most once total → O(1) amortized per operation

---

## Part 2: Space Complexity — The Underrated Half

Space complexity = maximum memory used at any point during execution.

### What to Count

- Explicit data structures you create (hash maps, arrays, trees)
- The **call stack** in recursive solutions — this is the most commonly forgotten

### Recursive Call Stack Space

```cpp
// Recursive DFS on a tree of height H
void dfs(TreeNode* node) {     // Each call uses O(1) stack frame
    if (!node) return;
    dfs(node->left);
    dfs(node->right);
}
// Space complexity: O(H) where H = tree height
// Worst case (skewed tree): O(N)
// Best case (balanced tree): O(log N)
```

```cpp
// Recursive fibonacci with memoization
int fib(int n, vector<int>& memo) {
    // memo array: O(N) space
    // Call stack depth: O(N) in worst case
    // Total space: O(N)
}
```

### Space Complexity Table for Common Structures

| Structure | Space |
|---|---|
| Array of size N | O(N) |
| Hash map with N entries | O(N) |
| BFS queue (max width of graph) | O(W) where W = max width |
| DFS stack (depth of recursion) | O(H) where H = max depth |
| Adjacency list for graph (V vertices, E edges) | O(V + E) |
| DP table N×M | O(N·M), often optimizable to O(N) or O(1) |

### Space Optimization — A Common Follow-up Question

When an interviewer asks *"can you reduce the space complexity?"*, these are the standard techniques:

- **2D DP → 1D:** If dp[i][j] only depends on dp[i-1][...], keep only one row
- **Explicit stack → iterative:** Convert DFS recursion to iterative with an explicit stack
- **In-place algorithms:** Dutch National Flag, two-pointer reversal
- **Morris Traversal:** Tree traversal in O(1) space by temporarily modifying the tree

---

## Part 3: Worst vs Average vs Best Case

Interviewers sometimes ask all three. Know the difference.

| Algorithm | Best | Average | Worst |
|---|---|---|---|
| QuickSort | O(N log N) | O(N log N) | O(N²) — sorted input |
| MergeSort | O(N log N) | O(N log N) | O(N log N) — always |
| Binary Search | O(1) | O(log N) | O(log N) |
| Hash Map lookup | O(1) | O(1) | O(N) — all keys collide |
| BFS/DFS | O(V+E) | O(V+E) | O(V+E) |

> **Interview tip:** When you say O(N log N), clarify: "This is average case. Worst case for QuickSort is O(N²) on sorted input, which is why production implementations use IntroSort (hybrid QuickSort/HeapSort)."

---

## Part 4: The 30-Second Complexity Check

Before submitting any solution in an interview or OA, run through this:

```
1. What is N? (the primary input variable)
2. How many nested loops? Each adds a factor of N.
3. Is there recursion? Depth × work per level.
4. Any sorting? That's O(N log N).
5. Any hash map operations? Usually O(1), but state O(1) average.
6. What auxiliary space am I creating?
7. Is there a call stack? Its depth is part of space complexity.
```

---

## Practice: Derive These Before Reading the Answer

<details>
<summary>1. Two Sum with hash map</summary>

**Time:** O(N) — one pass through the array, each hash map operation is O(1) average  
**Space:** O(N) — hash map stores at most N entries

</details>

<details>
<summary>2. Merge Sort</summary>

**Time:** T(N) = 2T(N/2) + O(N) → Master Theorem case 2 → O(N log N)  
**Space:** O(N) for the merge temporary array + O(log N) for call stack = O(N)

</details>

<details>
<summary>3. DFS on a binary tree of N nodes</summary>

**Time:** O(N) — visit every node exactly once  
**Space:** O(H) call stack where H = height. Balanced: O(log N). Skewed: O(N).

</details>

<details>
<summary>4. Sliding window maximum (monotonic deque)</summary>

**Time:** O(N) — each element pushed and popped at most once (amortized O(1) per element)  
**Space:** O(K) — deque holds at most K elements at any time

</details>

<details>
<summary>5. Dijkstra's algorithm</summary>

**Time:** O((V + E) log V) — each vertex extracted from heap once (O(log V)), each edge relaxed once triggers possible heap push (O(log V))  
**Space:** O(V + E) for graph + O(V) for distances + O(V) for heap = O(V + E)

</details>

---

**Next → [Phase 0: C++ Mastery Sprint](../phases/phase-0-cpp.md)**
