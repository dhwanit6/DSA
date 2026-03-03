# 🔄 Sorting Algorithms — When and Why Each Matters

> Most DSA guides assume you know sorting. Interviewers TEST it. Know when each sort is optimal.

---

## The 5 Sorts You Must Know Cold

### 1. Merge Sort — The Divide-and-Conquer Foundation

```cpp
void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    // merge sorted halves
    vector<int> temp;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r)
        temp.push_back(arr[i] <= arr[j] ? arr[i++] : arr[j++]);
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= r) temp.push_back(arr[j++]);
    for (int k = 0; k < temp.size(); k++)
        arr[l + k] = temp[k];
}
```

| Property | Value |
|---|---|
| Time (all cases) | O(N log N) |
| Space | O(N) — needs auxiliary array |
| Stable? | ✅ Yes |
| **When asked** | "Count inversions" (count swaps during merge), "merge K sorted arrays" |

---

### 2. Quick Sort — The Partition Master

```cpp
int partition(vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi];  // last element as pivot
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) swap(arr[i++], arr[j]);
    }
    swap(arr[i], arr[hi]);
    return i;  // pivot's final position
}

void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}
```

| Property | Value |
|---|---|
| Time (average) | O(N log N) |
| Time (worst: sorted input + bad pivot) | O(N²) — fix with random pivot |
| Space | O(log N) — recursion stack |
| Stable? | ❌ No |
| **When asked** | "Kth largest element" (Quick Select), "Sort Colors / Dutch National Flag" (3-way partition) |

**Quick Select** — finding kth element in O(N) average:
```cpp
// Reuse partition(). If pivot index == k, done.
// If pivot < k → recurse right. If pivot > k → recurse left.
```

---

### 3. Heap Sort — When You Need In-Place O(N log N)

Uses a max-heap built in-place. Repeatedly extract max to the end.

| Property | Value |
|---|---|
| Time | O(N log N) all cases |
| Space | O(1) — in-place |
| Stable? | ❌ No |
| **When asked** | Rarely standalone. Know it exists. Used internally by `priority_queue`. |

---

### 4. Counting Sort — When Values Are Bounded

```cpp
void countingSort(vector<int>& arr, int maxVal) {
    vector<int> count(maxVal + 1, 0);
    for (int x : arr) count[x]++;
    int idx = 0;
    for (int v = 0; v <= maxVal; v++)
        while (count[v]-- > 0) arr[idx++] = v;
}
```

| Property | Value |
|---|---|
| Time | O(N + K) where K = range of values |
| Space | O(K) |
| **When asked** | "Sort array with values 0-100", "Sort Colors" (special case: K=3), "Frequency sort" |

---

### 5. Radix Sort — When You Need O(N) on Large Ranges

Sorts digit by digit using counting sort as subroutine. O(D × (N + K)) where D = digits.

**When asked:** Very rarely. Know it exists for "sort 1 million 32-bit integers in O(N)."

---

## Decision Matrix — Which Sort to Use

| Constraint | Best Sort | Why |
|---|---|---|
| General purpose | `sort()` (introsort) | Built-in, O(N log N), optimized |
| Need stability | Merge Sort or `stable_sort()` | Preserves equal-element order |
| Small range of values (0-1000) | Counting Sort | O(N+K) beats O(N log N) |
| Nearly sorted data | Insertion Sort | O(N) best case |
| Memory-constrained | Heap Sort | O(1) extra space |
| Find Kth element only | Quick Select | O(N) average, don't sort everything |
| Linked list | Merge Sort | No random access needed |
| External sort (huge file) | Merge Sort (external) | Merge sorted chunks from disk |

---

## Custom Comparators — The Interview Skill

```cpp
// Sort intervals by end time (greedy problems)
sort(intervals.begin(), intervals.end(),
     [](const auto& a, const auto& b) { return a[1] < b[1]; });

// Sort by frequency, then by value
sort(arr.begin(), arr.end(), [&](int a, int b) {
    return freq[a] != freq[b] ? freq[a] > freq[b] : a < b;
});
```

**Pitfall:** Your comparator MUST define strict weak ordering. `(a,b)` and `(b,a)` cannot both return true. `(a,a)` must return false. Violating this causes undefined behavior in C++.

---

**Next → [Phase 1: Foundations](../phases/phase-1-foundations.md)**
