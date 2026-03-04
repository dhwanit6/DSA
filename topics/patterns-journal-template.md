# Patterns Journal Template

> The patterns journal is the single most underused tool in DSA preparation. Most guides mention it. None show you what a good entry actually looks like.

---

## Why This Works

The journal forces you to *own* an insight rather than recognizing it when you see it. There is a critical difference:

- **Recognition:** Seeing the problem → "Oh, I've seen this before" → look up solution
- **Ownership:** Reading the problem → "This triggers pattern X because of Y" → solve from first principles

The journal builds ownership. Ownership is what survives under interview pressure.

---

## The Template

Copy this for every problem you solve:

```
=== PROBLEM: [Name] | [Platform + Number] ===

PATTERN: [Name of the pattern]

TRIGGER WORDS: [What in the problem statement made you think of this pattern?]

KEY INSIGHT: [The single most important thing to understand. One sentence.]

TEMPLATE / CODE SKELETON:
[Write the core 5-10 lines that form the heart of the solution]

COMPLEXITY:
Time: O(?)  →  Why: [derive it, don't just state it]
Space: O(?) →  Why: [include call stack if recursive]

DISGUISES: [How might this same pattern appear in a different problem?]

MISTAKE I MADE / EDGE CASE: [What tripped you up?]

REVIEW DATES: [ ] Day 3  [ ] Day 7  [ ] Day 21
```

---

## Real Example Entries

### Entry 1: Sliding Window Variable Size

```
=== PROBLEM: Longest Substring Without Repeating Characters | LC 3 ===

PATTERN: Sliding Window — Variable Size

TRIGGER WORDS: "longest substring" + "without repeating" = maintain a valid window
of maximum size where no duplicates exist.

KEY INSIGHT: Expand right pointer always. Shrink left pointer ONLY when the window
violates the condition (duplicate found). Track answer at every valid state.

TEMPLATE:
    unordered_map<char, int> freq;
    int left = 0, ans = 0;
    for (int right = 0; right < s.size(); right++) {
        freq[s[right]]++;
        while (freq[s[right]] > 1) {   // condition violated
            freq[s[left]]--;
            left++;
        }
        ans = max(ans, right - left + 1);
    }

COMPLEXITY:
Time: O(N)  →  Each character enters and exits the window at most once.
Space: O(min(N, 26)) →  Character frequency map, bounded by alphabet size.

DISGUISES:
- "Longest subarray with at most K distinct elements" → same pattern, change condition
- "Minimum window substring" → same pattern, shrink when condition IS met
- "Fruit into baskets" → exact same problem, different framing

MISTAKE I MADE: Forgot to update the answer BEFORE shrinking. Update at every valid
state (after expanding), not only when you exit the loop.

REVIEW DATES: [x] Day 3  [x] Day 7  [ ] Day 21
```

---

### Entry 2: Binary Search on Answer

```
=== PROBLEM: Koko Eating Bananas | LC 875 ===

PATTERN: Binary Search on Answer

TRIGGER WORDS: "minimum speed such that Koko can finish in H hours" →
asking for minimum X that satisfies a condition. The condition is monotone:
if speed K works, then K+1 also works. Binary search on K.

KEY INSIGHT: When asked for "minimum/maximum X that satisfies condition(X)"
and condition is monotone (once true, stays true as X increases), binary
search on X directly — not on the array.

TEMPLATE:
    auto canFinish = [&](int speed) {
        long long hours = 0;
        for (int pile : piles) hours += (pile + speed - 1) / speed;
        return hours <= h;
    };
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(mid)) hi = mid;   // mid works, try smaller
        else lo = mid + 1;              // mid fails, need bigger
    }
    return lo;

COMPLEXITY:
Time: O(N log M)  →  binary search over M = max pile size, each check is O(N)
Space: O(1)

DISGUISES:
- "Minimum days to make M bouquets" (LC 1482) → same structure
- "Capacity to ship packages in D days" (LC 1011) → same structure
- "Minimum time to repair cars" → same structure
- Rule: ANY "find minimum/maximum X satisfying a checkable monotone condition"

MISTAKE I MADE: Used hi = hi/2 instead of hi = mid when condition is true.
The correct update is hi = mid (not mid-1) because mid itself might be the answer.

REVIEW DATES: [x] Day 3  [ ] Day 7  [ ] Day 21
```

---

### Entry 3: DP — 0/1 Knapsack

```
=== PROBLEM: Partition Equal Subset Sum | LC 416 ===

PATTERN: Dynamic Programming — 0/1 Knapsack (boolean variant)

TRIGGER WORDS: "partition array into two equal sum subsets" →
can we select a subset that sums to total/2? Each element used at most once.
Classic 0/1 knapsack.

KEY INSIGHT: Reduce to: "Is there a subset of nums that sums to target = sum/2?"
dp[j] = true if we can achieve sum j using elements seen so far.
Traverse j from right to left to avoid using the same element twice.

TEMPLATE:
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 != 0) return false;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {   // RIGHT TO LEFT — critical
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];

COMPLEXITY:
Time: O(N × target)  →  N items, each processed for target+1 states
Space: O(target)  →  1D DP array (optimized from 2D)

DISGUISES:
- "Target Sum" (LC 494) → same idea, count instead of boolean
- "Last Stone Weight II" (LC 1049) → reduce to partition
- "Count subsets with given difference" → knapsack count variant
- Any problem: "select items, each at most once, to achieve target" = 0/1 knapsack

MISTAKE I MADE: Iterated j from LEFT to RIGHT. This allows the same element
to be used multiple times (= unbounded knapsack). For 0/1, ALWAYS right to left.

REVIEW DATES: [ ] Day 3  [ ] Day 7  [ ] Day 21
```

---

## How to Use the Journal in Practice

**During a problem:**  
Solve it first. Do not open the journal during solving.

**Immediately after solving (5 minutes):**  
Fill in the template. Focus on: What was the trigger? What was the key insight? What mistake did you almost make?

**On review days (Day 3, Day 7, Day 21):**  
Read only the TRIGGER WORDS and KEY INSIGHT. Then close the journal and try to reconstruct the solution from scratch. If you can't, read the code skeleton. If you still can't, re-solve the problem.

**The review goal:**  
By Day 21, you should be able to reconstruct the core logic in 2 minutes from just reading the trigger words.

---

## What a Bad Journal Entry Looks Like

```
Sliding Window — for subarray problems
```

This is useless. It tells you nothing about when to use it, how to implement it, or what mistakes to avoid. The trigger words are missing. The key insight is missing. The disguises are missing.

---

## Tracking Your Journal

Keep a master index in your [Progress Tracker](../tracking/progress-tracker.md).  
Suggested columns: Problem | Pattern | Date | Review 3 | Review 7 | Review 21 | Owned? (Y/N)
