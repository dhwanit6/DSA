# Top 20 Mistakes That Kill Your DSA Preparation

> Sourced from 100+ posts on r/developersIndia, r/cscareerquestions, LeetCode Discuss (2024-2026), and interviews with hiring managers.

---

## Learning Mistakes

### 1. Watching 4 Hours of Videos, Solving 0 Problems
**Why it kills you:** Video creates an illusion of understanding. You recognize solutions when you see them but can't recall them under pressure. Recognition ≠ recall.
**Fix:** Maximum 45 min of video per day. For every concept watched, solve 2 problems immediately — without the video open.

### 2. Solving 500 Problems But Never Reviewing Any
**Why it kills you:** Without spaced repetition, you'll forget 80% within 3 weeks (Ebbinghaus curve). You're running on a treadmill.
**Fix:** Use the [Progress Tracker](../tracking/progress-tracker.md). Re-solve problems on Day 3, 7, and 21. If you can't solve it cold, you don't own it yet.

### 3. Jumping to Hard Problems Before Mastering Mediums
**Why it kills you:** Hards build on Medium patterns. If you can't solve Mediums in < 25 minutes consistently, Hards will feel impossible and destroy your confidence.
**Fix:** Milestone before attempting Hards: 3 consecutive Mediums from different topics solved in < 25 min each without hints.

### 4. Not Reading Editorials for Problems You Solved Correctly
**Why it kills you:** Your accepted solution might be O(N²) when O(N) exists. Or it might be 40 lines when 15 would do. You're missing the learning opportunity.
**Fix:** After EVERY accepted submission, read the editorial. There is almost always a cleaner or faster approach. Study it.

### 5. Language Hopping (C++ → Python → Java → Back to C++)
**Why it kills you:** You never master any language's standard library. In an interview, you'll fumble with syntax instead of focusing on the algorithm.
**Fix:** Pick ONE language. Stick with it for all DSA work. C++ is recommended for DSA/CP due to STL speed. See [Phase 0](../phases/phase-0-cpp.md).

---

## Practice Mistakes

### 6. Never Practicing Talking Aloud While Coding
**Why it kills you:** In an interview, silent coding is the #1 red flag. Interviewers literally cannot evaluate your problem-solving if they can't hear your reasoning.
**Fix:** Talk out loud during EVERY practice session. Even alone. Narrate: "I'm using a hash map here because I need O(1) lookup for complements."

### 7. Never Doing a Timed OA Simulation
**Why it kills you:** OAs have time pressure, webcam proctoring, and unfamiliar platforms. First-time experience during a real OA = panic.
**Fix:** Do 2 timed simulations per week starting Month 4. Use LeetCode contest mode or HackerRank practice tests. Webcam on.

### 8. Spending 3+ Hours on One Problem Without Progress
**Why it kills you:** After 45-60 minutes without progress, you're not learning — you're suffering. The insight you need requires a concept you haven't learned yet.
**Fix:** Hard cap: 45 min for Medium, 60 min for Hard. After that, read the editorial, UNDERSTAND it, then solve it yourself the next day without looking.

### 9. Only Solving Problems From One Topic
**Why it kills you:** Interviews don't tell you the topic. Real-world problems don't come with labels. You need pattern RECOGNITION, not pattern knowledge in isolation.
**Fix:** After completing a topic block, mix in problems from previous topics. LeetCode random mode is good for this from Month 4 onward.

### 10. Solving Problems With AI Assistance During Practice
**Why it kills you:** You're borrowing understanding you don't own. In the interview room, that loan gets called. See [AI-Era Mastery](../topics/ai-era-mastery.md) for the right way to use AI.
**Fix:** ALL practice sessions must be AI-free. Use AI ONLY for post-solving review and learning.

---

## Interview Mistakes

### 11. Jumping to Code Without Explaining Your Approach
**Why it kills you:** The interviewer starts evaluating from minute 1. If you start coding silently, they can't give you partial credit for good thinking, and they can't redirect you if you're on the wrong path.
**Fix:** Always spend 3-5 minutes explaining your approach BEFORE writing any code. Get verbal confirmation: "Does this approach sound reasonable?"

### 12. Not Asking Clarifying Questions
**Why it kills you:** Interviewers deliberately leave problems ambiguous. Solving the wrong problem correctly = failure. Asking clarifying questions = strong signal.
**Fix:** Always ask: "Can I assume the input is sorted?", "Are there duplicates?", "What should I return for empty input?", "What are the constraints on N?"

### 13. Giving Up Instead of Talking Through Struggle
**Why it kills you:** Silence tells the interviewer nothing. Narrating a wrong path ("I considered BFS but the constraint suggests DP because...") scores HIGHER than silence.
**Fix:** Practice the [Stuck Recovery Protocol](../interview/mechanics.md). Narrate everything, even dead ends.

### 14. Skipping Testing After Writing Code
**Why it kills you:** "Testing" is one of the 4 FAANG scoring dimensions. Not testing = automatic down-score.
**Fix:** After implementing, always trace through the given example AND one edge case. See [Debugging & Testing](../topics/debugging-testing.md).

### 15. Not Testing Edge Cases for Your Own Solution
**Why it kills you:** Your solution works for the happy path but crashes on empty input, single element, or integer overflow. The interviewer's hidden test cases will catch this.
**Fix:** Memorize the [edge case checklist](../topics/debugging-testing.md). Check it mentally after every solution.

---

## Preparation Strategy Mistakes

### 16. Ignoring Behavioral Prep Entirely
**Why it kills you:** Amazon weights behavioral equally with technical. Google evaluates "Googleyness" independently. Strong technical + weak behavioral = rejection.
**Fix:** Prepare 8 stories in [STAR+ format](../interview/behavioral.md) starting Month 3. Practice telling each in < 2 minutes.

### 17. Not Reading Company-Specific Interview Experiences
**Why it kills you:** Companies repeat topics and patterns within 6-12 month windows. The student who reads the last 20 interview experiences on LeetCode Discuss has a real advantage.
**Fix:** Final 2 weeks before any company's interview: read ALL recent interview experiences on LeetCode Discuss, GFG, and r/developersIndia. Filter by company.

### 18. Stopping DSA Practice After Getting an Offer
**Why it kills you:** Skills decay. When you need to switch companies in 2-3 years, you'll be starting from scratch. DSA is a perishable skill.
**Fix:** After getting placed, solve at least 2 problems per week. Participate in one contest per month. Maintain, don't rebuild.

### 19. Comparing Progress With Others on LinkedIn
**Why it kills you:** People post wins, never failures. Comparison triggers anxiety and imposter syndrome, which directly reduce study quality.
**Fix:** Track only YOUR delta. You vs you last week. See [Mental Game](../topics/mental-game.md).

### 20. Preparing Without a Tracking System
**Why it kills you:** Without tracking, you don't know which topics are weak, which problems to review, or whether you're actually making progress.
**Fix:** Set up the [Progress Tracker](../tracking/progress-tracker.md) TODAY. It takes 5 minutes and saves months of misdirection.

---

**Next → [Start Here](../phases/start-here.md)**
