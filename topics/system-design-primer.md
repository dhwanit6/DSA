# System Design Primer - The 30-Minute Interview Flow

> System design interviews reward structure and tradeoff clarity more than perfect architecture.

---

## 1) Standard 30-Minute Flow

1. Clarify functional and non-functional requirements.
2. Estimate scale (users, QPS, storage).
3. Define APIs and contracts.
4. Propose high-level components.
5. Design data model and consistency strategy.
6. Identify bottlenecks and discuss tradeoffs.

---

## 2) Worked Example (URL Shortener)

1. Requirements:
   - create short URL
   - redirect quickly
   - track click count
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

---

## 3) Common Failure Modes and Fixes

| Failure mode | Why it hurts | Fix |
|---|---|---|
| Jumping into architecture too fast | Missing requirements | Spend first 4-5 min on questions |
| No scale numbers | Design has no constraints | State assumptions explicitly |
| Listing tools without rationale | Looks memorized | For each component, explain why |
| Ignoring failure handling | Incomplete design | Add retries, backoff, and fallback paths |

---

## 4) Weekly Practice Protocol

1. Pick one design problem.
2. Time-box to 30 minutes.
3. Record 3 tradeoffs and 2 bottlenecks.
4. Repeat same problem next week with improvements.

---

## 5) Next Chapter

Go to [LLD and OOD](./lld-ood-design.md)
