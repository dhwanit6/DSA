# Language Flexibility — C++ / Python / Java Mappings

> This guide uses C++ as the primary language because of its STL performance and prevalence in competitive programming. However, most companies accept Python and Java. If you prefer another language, use this mapping.

---

## STL Equivalents

| Concept | C++ | Python | Java |
|---|---|---|---|
| **Dynamic Array** | `vector<int>` | `list` | `ArrayList<Integer>` |
| **Sorted Set** | `set<int>` | `from sortedcontainers import SortedList` | `TreeSet<Integer>` |
| **Hash Map** | `unordered_map<K,V>` | `dict` (built-in) | `HashMap<K,V>` |
| **Hash Set** | `unordered_set<T>` | `set` (built-in) | `HashSet<T>` |
| **Ordered Map** | `map<K,V>` | `from sortedcontainers import SortedDict` | `TreeMap<K,V>` |
| **Min-Heap** | `priority_queue<int, vector<int>, greater<int>>` | `import heapq; heapq.heappush(h, val)` | `PriorityQueue<Integer>` |
| **Max-Heap** | `priority_queue<int>` | `heapq.heappush(h, -val)` (negate trick) | `PriorityQueue<>(Collections.reverseOrder())` |
| **Stack** | `stack<int>` | `list` (use `.append()` / `.pop()`) | `Deque<Integer> = new ArrayDeque<>()` |
| **Queue** | `queue<int>` | `from collections import deque` | `Queue<Integer> = new LinkedList<>()` |
| **Deque** | `deque<int>` | `from collections import deque` | `Deque<Integer> = new ArrayDeque<>()` |
| **Sorting** | `sort(v.begin(), v.end())` | `list.sort()` or `sorted(list)` | `Collections.sort(list)` |
| **Binary Search** | `lower_bound(v.begin(), v.end(), target)` | `bisect.bisect_left(list, target)` | `Collections.binarySearch(list, target)` |
| **Pair** | `pair<int,int>` | `tuple` | `int[]` or custom class |
| **String↔Int** | `stoi()` / `to_string()` | `int()` / `str()` | `Integer.parseInt()` / `String.valueOf()` |
| **Infinity** | `INT_MAX` / `LLONG_MAX` | `float('inf')` | `Integer.MAX_VALUE` |
| **Bit count** | `__builtin_popcount(n)` | `bin(n).count('1')` | `Integer.bitCount(n)` |

---

## Language-Specific Pitfalls

### Python
- **Recursion limit:** Default is 1000. Set `sys.setrecursionlimit(10**5)` for tree/graph recursion. Even then, deep recursion is slow — prefer iterative for N > 10^4.
- **Speed:** Python is 10-50× slower than C++. Understand that O(N²) at N=10^4 might TLE in Python but pass in C++. You may need to optimize more aggressively.
- **Mutable defaults:** `def foo(lst=[])` shares the same list across calls. Use `def foo(lst=None)` with `lst = lst or []`.
- **Integer division:** `//` is floor division. `-7 // 2 = -4` (rounds toward negative infinity). Use `int(-7 / 2)` for truncation toward zero.
- **Shallow vs deep copy:** `b = a[:]` is shallow copy for 1D. For 2D: `b = [row[:] for row in a]` or `import copy; b = copy.deepcopy(a)`.

### Java
- **Autoboxing overhead:** `HashMap<Integer, Integer>` autoboxes every int. For performance-critical code, consider arrays.
- **String immutability:** String concatenation in a loop is O(N²). Use `StringBuilder`.
- **Comparator syntax:** `Arrays.sort(arr, (a, b) -> a[1] - b[1])` — careful with integer overflow in comparator. Use `Integer.compare(a[1], b[1])` instead.
- **No unsigned types:** Java has no unsigned int. For bit manipulation, use `>>> ` (unsigned right shift) instead of `>>`.

### When to Use Which

| Scenario | Recommended |
|---|---|
| Competitive programming | C++ (fastest execution, best STL for CP) |
| FAANG interviews (general) | C++ or Python (both widely accepted) |
| Quick prototyping/scripting | Python (least boilerplate) |
| Enterprise companies (TCS, Infosys) | Java (most common in Indian enterprise) |
| System design discussions | Language doesn't matter — focus on concepts |

---

**Next → [Resources](./resources.md)**
