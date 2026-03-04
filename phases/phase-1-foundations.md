# Phase 1 — Core DSA Foundations [Weeks 4-12]

> Follow Striver's A2Z Sheet as your primary spine. The order below is cognitively sequenced — do not reorder.

---

## How to Learn Each Topic (The 5-Step Process)

1. **Watch/Read** (30 min): One video or article on the concept. No coding. Understand the WHY, not the code.
2. **Solve 2 Easy** (30 min): Apply the concept immediately. These should feel straightforward.
3. **Solve 2-3 Medium** (60-90 min): This is where learning happens. 30 min struggle minimum before hints.
4. **Journal** (10 min): Write a 3-sentence entry in your [Patterns Journal](../topics/patterns-journal-template.md): What pattern? What clue triggered it? What's reusable?
5. **Move On Test**: Can you solve a medium from this topic WITHOUT any hints in < 25 min? If yes, move on. If no, solve 2 more mediums.

> **Do not skip Step 4.** Students who skip journaling solve 40% more problems to reach the same understanding.

---

## Week 4-5: Arrays, Strings, Math

- **Prefix sums** — `prefix[i] = prefix[i-1] + nums[i]`, range sum = `prefix[r] - prefix[l-1]` in O(1)
- **Difference arrays** — range update: add at `l`, subtract at `r+1`, take cumulative sum
- **Sliding Window FIXED** — max sum of k-size subarray in O(N)
- **Sliding Window VARIABLE** — longest/shortest subarray satisfying condition (two pointers + condition check)
- **Two Pointers on sorted** — 3Sum, Container With Most Water
- **Kadane's Algorithm** — `maxSoFar = max(num, maxSoFar+num); ans = max(ans, maxSoFar)`
- **Merge Sort** from scratch — the "split, recurse left, recurse right, merge" pattern
- **Modular arithmetic** — `(a+b)%m`, `(a*b)%m`, binary exponentiation for `a^n mod m` in O(log n)

**Key Problems:** LC 53, LC 238, LC 42, LC 3, LC 76, LC 560

**Worked Example — Variable Sliding Window (LC 3: Longest Substring Without Repeating Characters)**

> **Problem:** Given string `"abcabcbb"`, find the length of the longest substring without repeating characters.

> **Brute Force thinking:** Check every possible substring. For each starting index, expand until a repeat. O(N²) — too slow for N = 50,000.

> **Key insight:** When you find a repeat at position `j`, you don't need to restart from `i+1`. You can shrink the window from the left until the repeat is removed. This is the variable sliding window pattern.

> **The mechanics:**
> - Maintain a window `[left, right]` and a set of characters in the window
> - Expand `right`: if `s[right]` is not in the set, add it, update max length
> - If `s[right]` IS in the set: remove `s[left]` from set, move `left` forward. Repeat until no conflict.
> - Every character enters and leaves the window at most once → O(N) total


---

## Week 6: Binary Search — A Universe of Its Own

> Binary Search is not just "find element in sorted array." It is a way of thinking about any monotone decision function.

- **Classic BS** — sorted array, find target. Know BOTH variants: `lo<=hi` (exact) and `lo<hi` (boundary)
- **lower_bound vs upper_bound** — first ≥ target vs first > target
- **BS on Answer** — "Is X achievable?" in O(N) + answer is monotone → binary search on X
- **Rotated arrays, peak element, 2D matrix search**

**Paradigm-shifting problems:** LC 875 (Koko), LC 1011 (Ship Packages), LC 1482 (Bouquets)

---

## Week 7-8: Recursion & Backtracking

> If you rush past recursion, every subsequent topic will be harder. Spend EXTRA time here. Draw the recursion tree for every problem.

**The 3-step template:** CHOOSE → EXPLORE → UN-CHOOSE

- **Subsets** — include/exclude each element. 2^N possibilities
- **Permutations** — swap-and-recurse or visited array. N! possibilities
- **Combinations** — fix first, recurse on rest. Avoid duplicates by index ≥ current

**Must-solve:** LC 78, 90, 46, 39, 40, 51, 37, 79

---

## Week 9-10: Linked Lists, Stacks & Queues

- Implement singly and doubly linked list from scratch
- **Floyd's Cycle Detection** — fast=2, slow=1. Entry point: reset slow to head, both move 1
- **Reverse linked list** — iteratively (prev/curr/next) AND recursively. Both until automatic
- **Monotonic Stack** — "next greater element" pattern. O(N) amortized
- **LRU Cache** — unordered_map + doubly linked list. O(1) get/put. Asked constantly at Amazon

**Key problems:** LC 23, LC 739, LC 146

---

## Week 11-12: Binary Trees & BSTs

> The universal tree template: "What do I need from left subtree? From right? How do I combine for current node?" This solves ~80% of tree problems.

- ALL traversals — inorder, preorder, postorder, level-order — both recursive AND iterative
- Height, diameter, max path sum, balanced check, LCA
- BST: insertion, deletion, kth smallest, validate BST
- **Morris traversal** — O(1) space tree traversal. Asked as "can you do it without extra space?"

**Key problems:** LC 124, LC 297, LC 105, LC 230

---

## Ready for Phase 2?

Before moving on, verify you can do **all four** of these. Time yourself — no hints, no editorial.

1. **Arrays:** Solve a new LC Medium involving prefix sums or sliding window in under 25 minutes.
2. **Stacks:** Given a monotonic stack problem you haven't seen, recognize the pattern within 5 minutes of reading the problem.
3. **Recursion:** Write a backtracking solution (e.g. Subsets, Permutations) from scratch without looking at a template.
4. **Trees:** Solve a tree problem requiring post-order DFS (e.g. diameter, path sum) in under 20 minutes.

If you pass 3 of 4, move on. If you fail 2 or more, spend one more week on your weakest area before proceeding.

---

**Next → [Phase 2: Intermediate Mastery](./phase-2-intermediate.md)**
