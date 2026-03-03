# 🔧 Phase 0 — C++ Fluency Sprint [Weeks 1-3]

> Be honest: C++ mastery is not achieved in 3 weeks. This phase gives you FUNCTIONAL fluency — enough to solve problems without fighting the language.

---

## Non-Negotiable STL Mastery

### Sequence Containers
- `vector` — resize, reserve, push_back, emplace_back, size vs capacity
- `deque` — push_front/push_back both O(1)
- `array` — fixed-size, stack-allocated

### Associative Containers
- `map` — O(log N) ordered, balanced BST internally
- `unordered_map` — O(1) average, O(N) worst case (hash collision)
- `set`, `multiset`, `unordered_set`

### Adapters
- `stack`, `queue`
- `priority_queue` — max-heap default. Min-heap: `priority_queue<int, vector<int>, greater<int>>`

### Algorithms
- `sort()` with lambda comparator
- `lower_bound()`, `upper_bound()`, `binary_search()`
- `next_permutation()`, `accumulate()`, `max_element()`
- `reverse()`, `unique()`, `count()`

### Pairs, Tuples, Strings
- `make_pair`, `tie()`, structured bindings with `auto&`
- Sorting by second element: custom comparator
- `substr`, `find`, `stoi`, `to_string`, `getline`

---

## C++ Pitfalls That Kill Candidates

| Pitfall | Why It Kills You | Fix |
|---|---|---|
| **Integer overflow** | `int` max is ~2×10⁹. Summing 10⁵ numbers each 10⁹ = overflow | ALWAYS use `long long` for sums/products. `(long long)a * b` |
| **unordered_map worst case** | Adversarial inputs → O(N) per operation | Use `map` (O(log N)) when in doubt during OAs |
| **Vector erase in loop** | `erase()` is O(N) — inside a loop = O(N²) | Build a new result vector instead |
| **Modifying container while iterating** | Undefined behavior in C++ | Collect indices first, then modify |
| **VLA (variable-length arrays)** | `int arr[N]` with N from input — not standard C++ | Use `vector<int>(N)` always |

---

## Primary Resources
- [Striver C++ STL playlist](https://www.youtube.com/@takeUforward) — 3 hours, covers everything above
- [cppreference.com](https://en.cppreference.com/w/) — The authoritative C++ reference. Bookmark it.

---

**Next → [Phase 1: Core DSA Foundations](./phase-1-foundations.md)**
