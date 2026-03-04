# Interview Mechanics — The 45-Minute Framework + Stuck Recovery

> Compiled from common interviewer rubrics, public interview prep resources, and recurring patterns from candidate debriefs.

---

## The 45-Minute Interview Framework

Every coding interview has a natural time arc. Most candidates waste 15 minutes either rushing to code or thinking silently. Here is the exact framework used by successful FAANG candidates:

| Minutes | What You Should Be Doing | What NEVER to Do |
|---|---|---|
| **0-3** | **CLARIFY.** Ask about input constraints, edge cases, expected output for examples. Restate the problem in your own words. | Start coding immediately. Assuming anything without verifying. |
| **3-8** | **PLAN ALOUD.** State the brute-force approach first. Give its time complexity. Then think through optimizations. Tell the interviewer your approach before writing a single line. | Thinking silently. The interviewer cannot help you if they don't know where you are. |
| **8-30** | **CODE.** Write clean code narrating as you go. "I'm using an unordered_map here because I need O(1) lookup." Keep talking. | Coding silently. Optimizing prematurely. Changing approach without explaining why. |
| **30-35** | **TEST.** Trace through your code with the given example. Then with an edge case (empty input, single element, duplicate values). | Declaring "I think it works" without tracing. |
| **35-40** | **OPTIMIZE.** If your initial solution is suboptimal, discuss the improvement. State the new complexity. | Spending all time on the optimal — a correct brute force with identified optimization path scores better than an incomplete optimal solution. |
| **40-45** | **WRAP UP.** Discuss edge cases you handled, any limitations. Ask if the interviewer has questions about your approach. | Rushing to add features that were not asked for. |

---

## The Brute Force → Optimize Framework

> **This is the single most important interview technique that is never explicitly taught.** Every top candidate uses this flow. Interviewers are explicitly trained to reward it. Jumping to the optimal solution without showing this journey is a red flag.

### The 4-Step Flow

1. **STATE THE BRUTE FORCE IMMEDIATELY.** Don't be ashamed. "The naive approach is O(N²): for each element, scan the rest of the array." — This proves you understand the problem.

2. **ANALYZE THE BOTTLENECK.** "The bottleneck is this inner loop scanning for a duplicate each time." — This shows algorithmic thinking.

3. **IDENTIFY THE OPTIMIZATION.** "If I precompute and store what I've seen in a hash map, I eliminate the inner scan." — This is the key creative step.

4. **VERIFY THE IMPROVEMENT.** "This brings us from O(N²) time to O(N) time, with O(N) space." — This shows complexity fluency.

### Example — Two Sum (LC 1)

> **Brute Force:** "For each pair (i,j), check if nums[i]+nums[j]==target. O(N²) time, O(1) space."

> **Bottleneck:** "I'm re-scanning from j=0 for every i. Redundant."

> **Optimization:** "Store each number in a hash map. For each nums[i], check if target-nums[i] exists. O(1) lookup."

> **Final:** "O(N) time, O(N) space. Trade space for time." Then code it.

---

## When You Are Stuck — The Rescue Protocol

Getting stuck is expected. Interviewers are trained to watch what you do WHEN stuck. Here is the specific hierarchy:

| Step | What to Do | What to Say |
|---|---|---|
| **1. Draw it** | Write a concrete example. Trace through it "by hand." Notice your own process. | "Let me work through a small example to spot the pattern." |
| **2. Simplify** | Solve a simpler version: infinite→finite, negative→positive, 2D→1D. | "Let me solve the simpler version first where... then extend it." |
| **3. Exploit constraints** | Read the constraints box. Sorted? Distinct? K is small? Constraints tell you the intended algorithm. | "The fact that it's sorted hints at binary search or two-pointer." |
| **4. Pattern match** | Does this look like "shortest path"? "Count ways"? "Find peak/valley"? | "This is starting to look like a sliding window problem because..." |
| **5. Think out loud** | Narrate everything, even wrong paths. "I thought about X but that breaks because..." | Narrating wrong paths is NOT bad — it shows problem-solving process. |
| **6. Ask for a hint** | One hint request is fine. Three is a concern. | "I've tried X and Y. Could you point me in the right direction?" |

> **Never sit in silence for more than 2 minutes.** Silence is the worst option in an interview.

---

## Code Quality — The Silent Scorer

Interviewers silently evaluate your code against a quality rubric. Most candidates focus entirely on correctness and ignore quality.

| Rule | Bad Example | Good Example |
|---|---|---|
| **Meaningful names** | `int x, y, z, temp` | `int left, right, windowSum, maxLen` |
| **Edge cases at the TOP** | Logic first, check later or never | `if(nums.empty()) return -1;` — first line |
| **Helper functions** | 100-line function doing everything | `bool isValid(int x, int n)` extracted |
| **No magic numbers** | `if(i > 26)` | `const int ALPHA = 26; if(i > ALPHA)` |
| **Consistent style** | Mix of camelCase and snake_case | One convention throughout |
| **Overflow awareness** | `int sum = a + b` | `long long sum = (long long)a + b` |

---

## Testing Your Solution — The Step 90% Skip

Before saying "I'm done," ALWAYS trace through your solution explicitly. This is evaluated as part of the FAANG rubric.

1. **Trace the given example.** Walk through line by line with the interviewer watching.
2. **Test an edge case:** empty array, single element, all same elements, negative numbers.
3. **Test a "tricky" case:** duplicates, already sorted, reverse sorted.
4. **Check for integer overflow** on large inputs.

> The candidate who finds their own bug while testing scores HIGHER than the candidate who wrote correct code without testing. It shows production mindset.

---

**Next → [OA Strategy: The First Real Gate](./oa-strategy.md)**
