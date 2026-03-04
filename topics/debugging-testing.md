# Debugging & Testing — The Production Mindset Interviewers Reward

> "The candidate who finds their own bug while testing scores HIGHER than the candidate who wrote correct code without testing." — interviewing.io data

---

## Why This Chapter Exists

Meta's AI-copilot interview format tests whether you can navigate existing codebases and debug issues. Google evaluates "Testing" as one of 4 scoring dimensions. Amazon's bar raiser rounds frequently include intentionally ambiguous problems where edge case handling IS the test.

Most DSA guides teach you to solve problems. None teach you to prove your solution is correct, find your own bugs, or systematically generate edge cases.

---

## The 5-Step Debugging Protocol

When your code doesn't work (in practice or in an interview):

### Step 1: Read the Error (Don't Guess)
- **Segmentation fault:** You're accessing memory you don't own. Check: array out of bounds, null pointer dereference, stack overflow from infinite recursion
- **Wrong Answer (WA):** Your logic is wrong, not your syntax. Don't change random things — trace through a small input
- **Time Limit Exceeded (TLE):** Your algorithm is too slow. Check complexity against constraints
- **Runtime Error (RE):** Division by zero, integer overflow, stack overflow

### Step 2: Reproduce With the Smallest Input
Don't debug with `N = 10000`. Find the SMALLEST input that fails. If `[3, 1, 2]` produces wrong output, debug with `[3, 1, 2]`, not with 50 elements.

### Step 3: Trace By Hand
Draw the variable values at each step on paper. Compare what your code DOES vs what it SHOULD do. The divergence point is the bug.

### Step 4: Check the Usual Suspects

| Bug Pattern | How to Spot | Example |
|---|---|---|
| **Off-by-one** | Your loop runs one time too many or too few | `for(i=0; i<=n; i++)` when array has `n` elements (should be `i<n`) |
| **Integer overflow** | Sum or product exceeds `INT_MAX` (~2.1×10⁹) | `int sum = a * b` where both are 10⁵ — use `long long` |
| **Uninitialized variable** | Variable has garbage value | `int count;` without `= 0` |
| **Wrong comparison** | `=` instead of `==` in condition | `if (x = 5)` always true |
| **Missing base case** | Recursion never stops | Forgot `if (n == 0) return;` |
| **Modifying while iterating** | Container changes during loop | Erasing from vector while iterating forward |
| **Wrong sort comparator** | Sort doesn't establish strict weak ordering | `comp(a,b)` returns true for `a==b` → undefined behavior |

### Step 5: Fix ONE Thing at a Time
Don't rewrite your solution. Change one thing. Test. If it doesn't fix the bug, revert and try the next hypothesis.

---

## Edge Case Generation — The Systematic Approach

Before submitting ANY solution, mentally check these categories:

### Universal Edge Cases (Check for EVERY Problem)
- [ ] **Empty input:** `n = 0`, empty array, empty string
- [ ] **Single element:** `n = 1`
- [ ] **Two elements:** `n = 2` (smallest case where relationships exist)
- [ ] **All same:** `[5, 5, 5, 5]`
- [ ] **Already sorted / reverse sorted**
- [ ] **Negative numbers** (if input allows)
- [ ] **Maximum constraints** (`n = 10^5`, values = `10^9`) — check overflow

### Type-Specific Edge Cases

| Problem Type | Critical Edge Cases |
|---|---|
| **Arrays** | Single element. All same values. Sorted/reverse sorted. Contains duplicates. |
| **Strings** | Empty string. Single char. All same char. Palindrome. |
| **Trees** | Null tree. Single node. Skewed (all left or all right). Perfect balanced. |
| **Graphs** | Disconnected components. Single node. Self-loops. Cycles. |
| **DP** | `n = 0`, `n = 1`. Negative values in input. All zeroes. |
| **Binary Search** | Array of size 1. Target at beginning/end. Target not present. |
| **Sliding Window** | Window size > array size. Window size = 1. All elements satisfy/violate condition. |

---

## How to Test Your Solution in an Interview

The 3-pass testing protocol (takes < 3 minutes, saves you from "wrong answer" rejections):

### Pass 1: Trace the Given Example (1 min)
Walk through your code line-by-line with the interviewer's test case. This demonstrates meticulousness and often catches obvious bugs.

### Pass 2: Edge Case (30 sec)
Pick ONE edge case from the list above (usually empty input or single element) and trace through. If your code handles it, say so. If it breaks, fix it right there — finding your own bug scores HIGHER than perfect first-try.

### Pass 3: Stress Case (30 sec)
Think about the maximum constraints. Will your solution:
- Overflow with `10^9` values?
- TLE with `10^5` elements?
- Stack overflow with `10^4` recursion depth?

---

## Common C++ Runtime Errors Cheat Sheet

| Error | Cause | Fix |
|---|---|---|
| `Segmentation fault` | Array out of bounds, null pointer, infinite recursion | Check indices. Add base cases. Use `.at()` instead of `[]` for debugging. |
| `Stack overflow` | Recursion depth > ~10^4 | Convert to iterative, or increase stack size. |
| `floating point exception` | Division by zero (including `% 0`) | Add `if (divisor == 0)` guard. |
| `Wrong answer with correct logic` | Integer overflow in intermediate calculations | Cast to `long long` BEFORE multiplication: `(long long)a * b`. |
| `TLE with correct algorithm` | Hidden O(N) inside a loop, or slow I/O | Add `ios::sync_with_stdio(false); cin.tie(0);` at top. Check for unnecessary copies. |

---

## GDB Basics — 5 Commands That Cover 90% of Debugging

```bash
g++ -g -o solution solution.cpp    # compile with debug symbols
gdb ./solution                      # start debugger

# Inside GDB:
break main                         # set breakpoint at main
run                                # run program
next                               # execute next line (step over)
print variable_name                # inspect variable value
backtrace                          # show call stack (find where crash happened)
```

> You don't need to master GDB — but knowing these 5 commands helps you debug locally instead of submitting 10 wrong answers on LeetCode.

---

**Next → [Common Mistakes](./common-mistakes.md)**
