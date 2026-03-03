# 🎯 Mock Interview Scripts — 5 Structured Practice Sessions

> The gap between "knowing DSA" and "performing in an interview" is practice under simulation. These scripts turn solo practice into real preparation.

---

## How to Use These Scripts

**With a partner (ideal):**
- One person plays interviewer, reads the script verbatim
- Other person solves. No IDE — paper or whiteboard only
- After 45 minutes, debrief using the evaluation rubric below

**Solo (still valuable):**
1. Set a timer for 45 minutes. No distractions. Phone in another room.
2. Open the problem. Do NOT look at it beforehand.
3. Talk out loud the entire time. Record yourself (phone audio is fine).
4. After finishing, play back the recording. Score yourself on the rubric.
5. The playback is where 80% of the learning happens — you'll hear dead silences, unclear explanations, and missed edge cases you didn't notice in real-time.

---

## Self-Evaluation Rubric

Score each dimension **1-5** after every session:

| Dimension | 1 (Failing) | 3 (Passing) | 5 (Strong Hire) |
|---|---|---|---|
| **Communication** | Silent for 2+ min stretches. Jumped to code without explaining. | Explained approach before coding. Some silent gaps. | Constant narration. Clear reasoning. Interviewer always knew what you were doing. |
| **Problem Solving** | Couldn't find an approach. Or jumped to solution without showing journey. | Found brute force. Identified optimization direction. | Brute force → bottleneck → optimization → clean implementation. Showed full journey. |
| **Code Quality** | Variables named x, y. No edge case handling. Messy structure. | Readable code. Some edge cases handled. | Clean names, helper functions extracted, edge cases at top, consistent style. |
| **Testing** | Said "I think it works" and stopped. | Traced through one example. | Traced given example + edge case + tricky case. Found own bug during testing. |

**Target:** Score ≥ 3 on all 4 dimensions before your first real interview. Score ≥ 4 before FAANG interviews.

---

## Session 1: Arrays + Sliding Window (Warm-Up)

**Problem:** [Minimum Window Substring — LC 76](https://leetcode.com/problems/minimum-window-substring/) (Hard)

**Interviewer script:**
- 0:00 — "Given two strings s and t, find the minimum window in s that contains all characters of t. If no such window exists, return empty string."
- Give example: `s = "ADOBECODEBANC"`, `t = "ABC"` → `"BANC"`
- If candidate immediately starts coding: "Before you code, can you walk me through your approach?"
- At 15:00 if stuck: "What data structure could help you track which characters you've seen?"
- At 25:00 if stuck: "Could a sliding window with two pointers work here? What would you track?"
- After correct solution: "What's the time complexity? Can you test it with `s = "a"`, `t = "a"`? What about `t = "aa"`, `s = "a"`?"

**What this session tests:** Variable sliding window, hash map for frequency tracking, edge cases with duplicates.

---

## Session 2: Trees + Recursion (Core Skill)

**Problem:** [Binary Tree Maximum Path Sum — LC 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) (Hard)

**Interviewer script:**
- 0:00 — "Given a binary tree, find the maximum path sum. A path is any sequence of nodes from some starting node to any node in the tree along parent-child connections."
- Key clarification: "The path doesn't have to go through the root. It can start and end at any node."
- Give example: `[-10, 9, 20, null, null, 15, 7]` → `42` (15 → 20 → 7)
- If candidate uses global variable: that's fine, but ask "Could you do this without a global variable?"
- After solution: "Trace through the tree `[2, -1]`. What does your function return?"

**What this session tests:** Recursive thinking, distinguishing "value returned to parent" vs "value used to update global answer" — the core tree DP insight.

---

## Session 3: Graphs + BFS (FAANG Favorite)

**Problem:** [Word Ladder — LC 127](https://leetcode.com/problems/word-ladder/) (Hard)

**Interviewer script:**
- 0:00 — "Given two words (beginWord and endWord) and a word list, find the shortest transformation sequence length. Each transformed word must exist in the word list. Only one letter can change at a time."
- Give example: `beginWord = "hit"`, `endWord = "cog"`, `wordList = ["hot","dot","dog","lot","log","cog"]` → `5`
- If candidate uses DFS: "DFS would work but would it give the shortest path? What guarantees shortest?"
- At 20:00 if stuck: "Could you model this as a graph problem? What are the nodes? What are the edges?"
- Follow-up: "Your current approach builds the adjacency list in O(N²×L). Can you optimize to O(N×L×26)?"

**What this session tests:** Graph modeling from a non-obvious problem. BFS for shortest path. Optimization of adjacency construction.

---

## Session 4: Dynamic Programming (The Filter Round)

**Problem:** [Edit Distance — LC 72](https://leetcode.com/problems/edit-distance/) (Medium)

**Interviewer script:**
- 0:00 — "Given two words word1 and word2, return the minimum number of operations to convert word1 to word2. You can insert, delete, or replace a character."
- Give example: `"horse"` → `"ros"` → `3`
- If candidate immediately writes recurrence: "Before the recurrence, can you explain WHY this is a DP problem? What are the overlapping subproblems?"
- After O(M×N) solution: "Can you optimize the space? Do you really need the full 2D table?"
- Follow-up: "Trace through `word1 = "a"`, `word2 = "b"`. Now trace `word1 = ""`, `word2 = "abc"`."

**What this session tests:** State definition in DP, ability to explain WHY recurrence is correct (not just write it), space optimization.

---

## Session 5: Full FAANG Simulation (45 Minutes, No Help)

**Problem:** [Trapping Rain Water — LC 42](https://leetcode.com/problems/trapping-rain-water/) (Hard)

**Interviewer script:**
- 0:00 — "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining."
- Give ONLY the example: `[0,1,0,2,1,0,1,3,2,1,2,1]` → `6`. No further hints.
- 0:03 — If candidate hasn't asked clarifying questions: note this as a communication weakness
- 0:08 — If candidate hasn't stated brute force: this is a red flag
- 0:20 — If candidate is still discussing approach and hasn't started coding: "Let's start implementing what you have"
- 0:35 — If code isn't complete: "Let's wrap up the implementation and test what we have"
- After completion: "You used O(N) space. Is there a way to do this in O(1) space?" (Two-pointer approach)

**Evaluation checkpoints:**
- [ ] Asked at least one clarifying question
- [ ] Stated brute force first (O(N²) — for each bar, find max left and max right)
- [ ] Identified the optimization (prefix max arrays OR two pointers)
- [ ] Clean code with meaningful variable names
- [ ] Tested with given example AND at least one edge case
- [ ] Discussed time and space complexity without being asked

---

## Post-Session Debrief Template

After each session, write:

```
Date: ___
Problem: ___
Scores: Communication __/5 | Problem Solving __/5 | Code Quality __/5 | Testing __/5

What went well:
-

What went wrong:
-

If I did this again, I would:
-
```

---

## Recommended Schedule

| Week Before Interview | Sessions/Week | Focus |
|---|---|---|
| 8+ weeks out | 1/week | Get comfortable with the format. Solo is fine. |
| 4-8 weeks out | 2/week | One solo, one with partner. Mix topics. |
| 2-4 weeks out | 3/week | All with partners. Include company-specific problems. |
| Final week | 1/day (light) | Known problems only. Build confidence, not new skills. |

---

**Next → [Debugging & Testing](../topics/debugging-testing.md)**
