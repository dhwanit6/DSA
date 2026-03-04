# Phase 0 - C++ Fluency Sprint (3 Weeks)

> Goal of Phase 0: remove language friction so Phase 1 is about DSA thinking, not syntax panic.

---

## 1) Who Should Do This Fully

- You are new to C++.
- You can reason on paper but get blocked by STL syntax.
- You hesitate when choosing `map` vs `unordered_map`, or heap/set variants.

If you already solve Easy + some Medium in C++ smoothly, skim this chapter and jump to the readiness gate.

---

## 2) Outcome You Must Reach

By the end of Phase 0, you should be able to:

1. Write your base C++ template in under 2 minutes.
2. Use core STL containers without looking up syntax.
3. Explain complexity choices while coding.
4. Avoid common WA/TLE C++ mistakes.
5. Enter [Phase 1](./phase-1-foundations.md) with confidence.

---

## 3) Day 1 Setup (Exact Order)

1. Install local toolchain: `g++` or `clang++` + VSCode/CLion.
2. Create one reusable `main.cpp` template with:
   - Fast I/O setup
   - Input helpers
   - Small local test loop
3. Complete the 5 micro-drills below in one sitting.

### The 5 Day 1 Micro-Drills

1. Read `N`, read array, print sorted array.
2. Build character frequency map with `unordered_map<char, int>`.
3. Use `lower_bound` and print first index `>= target`.
4. Build min-heap using `priority_queue` and pop all values.
5. Sort vector of pairs by second value with lambda comparator.

If Day 1 feels rough, repeat it tomorrow. Do not rush to Week 2.

---

## 4) Weekly Roadmap

| Week | Focus | Daily Block (90-120 min) | Exit Signal |
|---|---|---|---|
| 1 | C++ survival: syntax + STL basics | 25m concept + 45m drills + 20m re-write | No syntax freeze on basic array/hash tasks |
| 2 | STL for interviews | 20m concept + 50m drills + 20m dry-run explanation | Confident with map/set/heap + bounds |
| 3 | Timed coding loop | 45m timed problem + 20m bug review + 20m rewrite | Can code cleanly and explain tradeoffs |

---

## 5) Non-Negotiable STL Checklist

### Sequence

- `vector`: `push_back`, `reserve`, `resize`, `size`, `capacity`
- `deque`
- `array`

### Associative

- `map`, `unordered_map`
- `set`, `unordered_set`, `multiset`

### Adapters

- `stack`, `queue`
- `priority_queue` (max and min variants)

### Algorithms

- `sort`, `binary_search`, `lower_bound`, `upper_bound`
- `reverse`, `max_element`, `accumulate`, `unique`, `next_permutation`

---

## 6) High-Frequency C++ Mistakes

| Mistake | Why it hurts | Fix |
|---|---|---|
| Integer overflow | Silent wrong answer | Use `long long` for sum/product heavy logic |
| Erasing while iterating carelessly | Hidden bugs or quadratic behavior | Use iterator-safe erase or rebuild result |
| Blind `unordered_map` usage | Worst-case degradation in edge inputs | Use `map` if order or stability matters |
| Mutating container during traversal | Undefined behavior traps | Collect changes first, apply later |
| Variable-length arrays | Non-standard C++ | Use `vector<int> arr(n)` |

---

## 7) Readiness Gate (Pass Before Phase 1)

You pass Phase 0 only when all are true:

- [ ] Sort input and print result in under 2 minutes.
- [ ] Build min-heap and explain push/pop complexity.
- [ ] Write frequency-map solution from memory.
- [ ] Use `lower_bound` correctly with iterator/index explanation.
- [ ] Explain pass-by-reference and when to avoid copies.

If 1-2 checks fail: add 2 focused days in Week 3 loop.  
If 3+ checks fail: repeat Week 2 and Week 3.

---

## 8) Next Chapter

1. Standard path: [Phase 1: Foundations](./phase-1-foundations.md)
2. Short timeline path: [Crash Plans](./crash-plans.md)
