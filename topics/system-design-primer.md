# System Design Primer - The 30-Minute Interview Flow

> System design interviews reward structure and tradeoff clarity more than perfect architecture.

---

## 1) When This Gets Asked

Typical pattern:

1. full-time and backend roles: common
2. European product/backend companies: common earlier than many candidates expect
3. Indian product companies: increasingly common in later rounds
4. internships and early new-grad roles: lighter, but basic reasoning still helps

Do not treat design as "only for seniors." Treat it as structured thinking practice.

---

## 2) Standard 30-Minute Flow

1. Clarify functional and non-functional requirements.
2. Estimate scale:
   - users
   - QPS
   - storage
3. Define APIs and contracts.
4. Propose high-level components.
5. Design data model and consistency strategy.
6. Identify bottlenecks and discuss tradeoffs.

If you skip step 1 or 2, the rest becomes decoration.

---

## 3) Worked Example (URL Shortener)

1. Requirements:
   - create short URL
   - redirect quickly
   - basic analytics
2. Scale assumption:
   - 10M new URLs/day
   - 100M redirects/day
3. High-level design:
   - API service
   - ID generator
   - key-value store for mapping
   - cache for hot links
4. Tradeoffs:
   - random keys vs sequential IDs
   - cache freshness vs latency
   - analytics async pipeline vs sync writes

Good candidate behavior:

1. says assumptions out loud
2. explains why each component exists
3. surfaces one failure mode without prompting

---

## 4) Common Failure Modes And Fixes

| Failure mode | Why it hurts | Fix |
|---|---|---|
| Jumping into architecture too fast | Missing requirements | Spend first 4-5 min on questions |
| No scale numbers | Design has no constraints | State assumptions explicitly |
| Listing tools without rationale | Looks memorized | For each component, explain why |
| Ignoring failure handling | Incomplete design | Add retries, backoff, and fallback paths |

---

## 5) What Different Markets Reward

1. US big tech:
   - tradeoffs
   - communication
   - bottleneck thinking
2. Europe product and fintech:
   - practical service boundaries
   - APIs, latency, data flow, failure handling
3. India product companies:
   - increasingly asks design in later rounds
   - rewards structure over buzzwords

So the safest prep style is:

1. structured
2. simple
3. explicit on tradeoffs

---

## 6) Weekly Practice Protocol

1. Pick one design problem.
2. Time-box to 30 minutes.
3. Record 3 tradeoffs and 2 bottlenecks.
4. Repeat the same problem next week with improvements.

---

## 7) Next Chapter

Go to [LLD and OOD](./lld-ood-design.md)
