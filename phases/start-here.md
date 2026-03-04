# Start Here — Before You Write a Single Line of Code

> Listen to me. Read this before anything else. It takes 5 minutes and will save you months of banging your head against the wall.

### Before you begin

This guide assumes you can already write basic programs — loops, functions, arrays, and simple input/output — in at least one language (C++, Python, or Java). If you're not there yet, that's completely fine. Spend 2–3 weeks on any introductory programming course first, then come back. This guide will still be here. **Don't rush the foundation.**

---

## The Hard Truth Nobody Tells You

I see this all the time: students grind 800 LeetCode problems, get into the interview, and completely bomb. Why? Because they don't understand what an interview actually is. 

**An interview is not a math test. It's a collaboration test.**

Interviewers at top companies aren't just looking for a working compiler. They score you on a four-dimension rubric. If your code holds together but you fail the other three, *you fail the interview.*

<Flashcard question="What are the 4 dimensions an interviewer scores you on?">
1. **Communication**: Talking through your logic.
2. **Problem Solving**: Pattern recognition & breaking down complex tasks.
3. **Technical Competency**: Code quality, efficiency (Big O), and edge cases.
4. **Testing**: Proactively verifying your solution with dry runs.
</Flashcard>

**The takeaway:** From Day 1, practice all four dimensions. Talk out loud. Write test cases. Stop acting like you're alone in a dark room submitting to a LeetCode grader.

---

## Your Day 1 Checklist (Do This Right Now)

Don't procrastinate on these. Do them in order.

- [ ] **Create your tracking system.** I built a tracker straight into this website. Use it. Check off problems as you go, and hit "Revise!" when an algorithm doesn't stick in your head. If you prefer your own Notion setup, [here's a template you can steal](../tracking/progress-tracker.md).
- [ ] **Memorize the Latency Numbers.** Take 5 minutes to look at this [latency gist](https://gist.github.com/jboner/2841832). "Disk seek" vs "Main memory access." You need this intuition for System Design later.

<UnderTheHood>
**The Architectural Intuition**: A main memory reference is ~100ns. A disk seek is ~10,000,000ns. 
In the CPU's eyes, waiting for a disk is like waiting 2 years for a package that usually takes 2 hours. This is why we care about $O(1)$ lookup in HashMaps and why we avoid nested loops that scan large arrays repeatedly. The CPU is fast; memory and disk are the bottlenecks.
</UnderTheHood>
- [ ] **Stop hoarding resources.** Bookmark this guide, LeetCode, and NeetCode/Striver's YouTube channels. That's it. Resource paralysis is real. You don't need 15 roadmaps. You just need to walk down one.
- [ ] **Set up an actual IDE.** Use VSCode or CLion with a proper C++ setup locally. Don't rely on online IDEs for daily practice. The autocomplete crutches train bad habits.
- [ ] **Make a blood pact with your calendar.** Block out minimum 90 minutes a day. Non-negotiable. Protect that time like your life depends on it. Because your career does.

---

## Pick Your Lane

**Are you aiming for an Internship (5th Sem) or Full-Time (7th/8th Sem)?**

The strategies are completely different. If you have 6 months, you need to be ruthless with what you cut. If you have 18 months, you need to build deep foundations. 

→ **Go read [The Two Tracks](../interview/two-tracks.md) right now to figure out your game plan.**

---

## The "Top 1%" Habits

I've talked to hundreds of successful candidates. They all do these three things:

**Rule 1 — The 30 Minute Struggle**  
You have to fight the problem for at least 30 minutes before looking at a hint or video. *The frustration is the feeling of your brain growing.* If you just watch a video immediately, you are borrowing understanding you don't actually own. The interviewer will see right through it.

<UnderTheHood>
**Neuroplasticity note**: Your brain only creates new synaptic connections when you are in a state of mild frustration or "prediction error." If you see the solution immediately, your brain thinks "I already knew that" and won't bother encoding the logic into your long-term memory. Struggle is the signal for growth.
</UnderTheHood>

**Rule 2 — Write It Down Immediately**  
After solving something, write down a 3-sentence journal entry. "This was a Sliding Window. The key trick was expanding the window until condition X broke, then shrinking it." If you can't write it out simply, you don't understand it yet. (Check the [Patterns Journal](../topics/patterns-journal-template.md)).

**Rule 3 — Look Like a Crazy Person**  
Talk out loud while you code. Yes, in your bedroom. Alone. Explain your approach to your wall or a rubber duck. I promise you: the habit of talking while coding takes months to feel natural. You *cannot* cram this skill the week before an interview.

---

## What We're NOT Doing Here

- No 500+ problem lists padded to look impressive. We do the essential 120. Quality over quantity.
- No paywalls. Everything you need is right here, for free. Don't let influencers rip you off.
- No shortcuts. They don't exist.

## What We ARE Doing

We're going to build a system. [OA strategy](../interview/oa-strategy.md), exact [interview mechanics](../interview/mechanics.md), [pattern recognition](../topics/pattern-recognition.md), and [the mental game](../topics/mental-game.md) that nobody talks about.

You ready? Let's get to work.

---

**Next step → [The Two Tracks: Internship vs Full-Time](../interview/two-tracks.md)**
