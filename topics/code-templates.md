# 🔧 Code Templates — Annotated, Production-Ready C++ Snippets

> Copy-paste ready. Battle-tested in Codeforces, LeetCode, and CSES. Each template includes a "Why this works" annotation so you can modify it, debug it, and explain it in an interview.

---

## 1. Disjoint Set Union (DSU / Union-Find)

```cpp
struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank_[a] < rank_[b]) swap(a, b);
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }
};
```

**Why this works:** Each element starts as its own parent. `find()` walks up the parent chain to the root. **Path compression** (`parent[x] = find(parent[x])`) flattens the tree during `find`, making future lookups nearly O(1). **Union by rank** always attaches the shorter tree under the taller one, keeping depth logarithmic. Together, these give O(α(N)) amortized — practically O(1). To adapt: add a `size[]` array if you need component sizes; change `unite` to union by size instead of rank.

---

## 2. Segment Tree (Point Update + Range Query)

```cpp
struct SegTree {
    int n;
    vector<long long> tree;
    SegTree(int n) : n(n), tree(4 * n, 0) {}

    void update(int node, int start, int end, int idx, long long val) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2*node, start, mid, idx, val);
        else update(2*node+1, mid+1, end, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    long long query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
    }

    void update(int idx, long long val) { update(1, 0, n-1, idx, val); }
    long long query(int l, int r) { return query(1, 0, n-1, l, r); }
};
```

**Why this works:** The array is conceptually a complete binary tree stored in a flat array. Node `i` has children `2*i` and `2*i+1`. Each leaf corresponds to one array element; internal nodes store the aggregate (sum here) of their children. `4*n` size guarantees enough space. **To adapt for min/max/gcd:** change `tree[2*node] + tree[2*node+1]` to `min(...)`, `max(...)`, or `__gcd(...)`, and change the identity return value (0 for sum, INT_MAX for min, 0 for gcd).

---

## 3. Fenwick Tree (Binary Indexed Tree)

```cpp
struct BIT {
    vector<long long> tree;
    int n;
    BIT(int n) : n(n), tree(n + 1, 0) {}
    void update(int i, long long delta) { for (++i; i <= n; i += i & (-i)) tree[i] += delta; }
    long long query(int i) { long long s = 0; for (++i; i > 0; i -= i & (-i)) s += tree[i]; return s; }
    long long query(int l, int r) { return query(r) - (l ? query(l-1) : 0); }
};
```

**Why this works:** `i & (-i)` isolates the lowest set bit, which determines how many elements each node is responsible for. `update` propagates upward by adding the lowest bit; `query` accumulates downward by removing it. This gives O(log N) for both operations. Simpler than Segment Tree but ONLY supports prefix queries — no arbitrary range min/max. **0-indexed externally, 1-indexed internally** (the `++i` handles this).

---

## 4. Dijkstra's Algorithm

```cpp
vector<long long> dijkstra(int src, const vector<vector<pair<int,int>>>& adj) {
    int n = adj.size();
    vector<long long> dist(n, LLONG_MAX);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;  // lazy deletion — critical for correctness
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

**Why this works:** Min-heap always processes the unvisited node with smallest distance. The `if (d > dist[u]) continue` line is **lazy deletion** — since we can't decrease-key in `priority_queue`, we push duplicates and skip stale ones. Without this line, the algorithm is still correct but O(E log E) instead of O(E log V). **Does NOT work with negative edges** — use Bellman-Ford for that.

---

## 5. Topological Sort (Kahn's Algorithm)

```cpp
vector<int> topoSort(int n, const vector<vector<int>>& adj) {
    vector<int> indegree(n, 0), order;
    for (int u = 0; u < n; u++)
        for (int v : adj[u]) indegree[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indegree[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--indegree[v] == 0) q.push(v);
    }
    return order;  // if order.size() < n, cycle exists
}
```

**Why this works:** Start with nodes that have no prerequisites (indegree 0). Process them, remove their edges (decrement neighbors' indegree), and add newly-zero-indegree nodes. If all nodes are processed, the graph is a DAG. If `order.size() < n`, a cycle exists — this is the simplest cycle detection for directed graphs. **Use this over DFS-based topo sort** when you also need cycle detection.

---

## 6. Sliding Window — Variable Size

```cpp
// Longest subarray/substring satisfying condition
int slidingWindowVariable(vector<int>& nums) {
    int left = 0, ans = 0;
    // maintain state (e.g., unordered_map<int,int> freq;)
    for (int right = 0; right < nums.size(); right++) {
        // expand: add nums[right] to window state
        while (/* condition violated */) {
            // shrink: remove nums[left] from state
            left++;
        }
        ans = max(ans, right - left + 1);
    }
    return ans;
}
```

**Why this works:** Two pointers define a window `[left, right]`. `right` always moves forward (never backwards), and `left` only moves forward to restore the condition. This means each element is added and removed at most once — total O(N) despite the nested loop. **The key insight:** the `while` loop is NOT nested in the way you'd think — across all iterations of the outer `for`, the inner `while` executes at most N times total.

---

## 7. Binary Search — Lower Bound Pattern

```cpp
// Find first position where condition(mid) is true
// Precondition: condition is false for [lo..k-1], true for [k..hi]
int binarySearch(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (condition(mid)) hi = mid;   // mid might be answer, try smaller
        else lo = mid + 1;              // mid too small, need bigger
    }
    return lo;  // first position where condition is true
}
```

**Why this works:** This is the "left boundary" pattern. It finds the FIRST position where a monotone condition becomes true. `lo + (hi - lo) / 2` prevents integer overflow (unlike `(lo + hi) / 2`). The loop invariant is: answer is always in `[lo, hi]`. When `lo == hi`, we've found it. **For "last position where condition is true":** flip the logic — check `!condition(mid)` and return `lo - 1`.

---

## 8. Backtracking Skeleton

```cpp
void backtrack(vector<vector<int>>& result, vector<int>& current,
               vector<int>& nums, int start) {
    result.push_back(current);  // or check if complete first
    for (int i = start; i < nums.size(); i++) {
        // CHOOSE
        current.push_back(nums[i]);
        // EXPLORE
        backtrack(result, current, nums, i + 1);  // i+1 for subsets, i for unlimited reuse
        // UN-CHOOSE
        current.pop_back();
    }
}
```

**Why this works:** The CHOOSE → EXPLORE → UN-CHOOSE pattern ensures every possibility is explored exactly once. The `start` parameter prevents duplicates by ensuring we only pick elements after the current position. **Adapt:** For permutations, use a `visited[]` array instead of `start`. For combinations with duplicates, add `if (i > start && nums[i] == nums[i-1]) continue;` after sorting.

---

## 9. LCA (Binary Lifting)

```cpp
struct LCA {
    int LOG;
    vector<vector<int>> up;
    vector<int> depth;

    void dfs(int v, int p, int d, const vector<vector<int>>& adj) {
        up[v][0] = p;
        depth[v] = d;
        for (int j = 1; j < LOG; j++)
            up[v][j] = up[up[v][j-1]][j-1];
        for (int u : adj[v])
            if (u != p) dfs(u, v, d+1, adj);
    }

    int query(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int j = 0; j < LOG; j++)
            if ((diff >> j) & 1) u = up[u][j];
        if (u == v) return u;
        for (int j = LOG-1; j >= 0; j--)
            if (up[u][j] != up[v][j]) { u = up[u][j]; v = up[v][j]; }
        return up[u][0];
    }
};
```

**Why this works:** `up[v][j]` stores the 2^j-th ancestor of node `v`. Built using DP: `up[v][j] = up[up[v][j-1]][j-1]` (the 2^j-th ancestor = the 2^(j-1)-th ancestor of the 2^(j-1)-th ancestor). To find LCA: first equalize depths using binary representation of the depth difference, then jump both nodes upward in decreasing powers of 2 until they meet. O(log N) per query after O(N log N) preprocessing.

---

## 10. Monotonic Stack

```cpp
// Next Greater Element for each index
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // stores indices, values are decreasing
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
```

**Why this works:** The stack maintains indices in decreasing order of their values. When we encounter a value greater than the stack top, that value IS the next greater element for the stack top. Each element is pushed and popped at most once — O(N) total. **Adapt:** For "next smaller," flip `<` to `>`. For "previous greater," iterate right-to-left. For circular arrays, iterate `0..2N-1` using `i % n`.

---

## 11. KMP String Matching

```cpp
vector<int> kmpSearch(const string& text, const string& pattern) {
    string combined = pattern + "#" + text;
    int n = combined.size();
    vector<int> lps(n, 0), matches;
    for (int i = 1; i < n; i++) {
        int j = lps[i-1];
        while (j > 0 && combined[i] != combined[j]) j = lps[j-1];
        if (combined[i] == combined[j]) j++;
        lps[i] = j;
        if (j == pattern.size()) matches.push_back(i - 2 * pattern.size());
    }
    return matches;
}
```

**Why this works:** The `#` separator ensures pattern and text don't interfere. The `lps` (longest proper prefix-suffix) array tracks how much of the pattern matches at each position. When `lps[i] == pattern.size()`, we've found a complete match. The `while` loop backtracks using previously computed `lps` values, avoiding re-scanning characters. O(N+M) total. **The `#` trick** avoids writing separate prefix-function computation — simpler and less error-prone.

---

## 12. Matrix Exponentiation

```cpp
using Matrix = vector<vector<long long>>;
const long long MOD = 1e9 + 7;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++) if (A[i][k])
            for (int j = 0; j < n; j++)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
    return C;
}

Matrix matpow(Matrix A, long long p) {
    int n = A.size();
    Matrix result(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) result[i][i] = 1;  // identity
    while (p > 0) {
        if (p & 1) result = multiply(result, A);
        A = multiply(A, A);
        p >>= 1;
    }
    return result;
}
```

**Why this works:** Any linear recurrence (like Fibonacci: `f(n) = f(n-1) + f(n-2)`) can be expressed as matrix multiplication: `[f(n), f(n-1)] = M^(n-1) × [f(1), f(0)]`. Binary exponentiation computes `M^n` in O(K³ log N) where K is matrix size (usually 2-3). The `if (A[i][k])` optimization skips zero multiplications — significant for sparse matrices. **Use case:** computing N-th term of linear recurrence with N up to 10^18.

---

**Next → [Estimation & Mental Problems](./estimation-mental-problems.md)**
