# Phase 0 — C++ Fluency Sprint [Weeks 1-3]

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

## Ready for Phase 1?

You're ready to move on when you can do **all** of these without looking anything up:

- Write a function that reads input, sorts a vector, and prints it — under 2 minutes.
- Use `unordered_map` to count character frequencies in a string.
- Implement a min-heap using `priority_queue` with a custom comparator.
- Use `lower_bound` on a sorted array to find the first element ≥ a target.
- Pass containers by reference and explain why it matters for performance.

If any of these feel shaky, spend one more day drilling. Don't carry language friction into Phase 1 — it will slow everything down.

---

**Next → [Phase 1: Core DSA Foundations](./phase-1-foundations.md)**
