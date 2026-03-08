# CS Fundamentals Roadmap - What Interviews Actually Ask

> DSA gets you into the room. CS fundamentals stop the interview from collapsing after the first coding round.

---

## 1) Use This Section Correctly

1. Do not start this section on Day 1.
2. Start it after your DSA base is moving, or when interviews are 2-4 months away.
3. Study one fundamentals chapter at a time.
4. Pair every reading session with oral practice.
5. Stop at the interview-relevant 80/20 before going deep.

This section is built for interview prep, not for kernel engineering or distributed systems specialization.

---

## 2) Market Reality (Broad Tendencies, Not Guarantees)

| Market | Usually weighted heavily | Usually lighter | What this means for you |
|---|---|---|---|
| US big tech and strong product companies | Coding rounds, communication, testing, behavioral, sometimes system design | Direct viva-style OS/CN grilling for new grads is less common | Be able to answer fundamentals cleanly, but DSA + interview execution remain the main filter |
| European product, fintech, and backend-heavy companies | Practical coding, APIs, SQL, debugging, concurrency, service reasoning | Memorized textbook definitions with no example | Your answers must sound applied: what breaks, why it matters, and what tradeoff you chose |
| Indian product companies and placements | DSA, OA speed, DBMS, OS, CN, OOP, SQL, LLD are asked more directly | Purely abstract theory with no interview framing | Expect direct questions like "process vs thread," "normalization," "TCP vs UDP," "deadlock," and "write this SQL query" |

If you are applying broadly, train for the mixed case:

1. DSA remains your primary engine.
2. DBMS, OS, CN, and concurrency must become 60-second answers.
3. System design and LLD matter more for backend, full-time, and stronger product companies.

---

## 3) Exact Order In This App

Follow this sequence:

1. [DBMS & SQL](./dbms-sql.md)
2. [Operating Systems](./operating-systems.md)
3. [Computer Networks](./computer-networks.md)
4. [Concurrency & Multithreading](./concurrency-multithreading.md)
5. [System Design Primer](../topics/system-design-primer.md)
6. [LLD & OOD Design](../topics/lld-ood-design.md)
7. [Estimation & Mental Problems](../topics/estimation-mental-problems.md)

Why this order works:

1. DBMS gives immediate interview ROI because SQL and indexing questions are common.
2. OS gives the first-principles vocabulary for processes, threads, memory, and locking.
3. Networks helps with backend request flow, latency, DNS, HTTP, and system design.
4. Concurrency converts OS theory into coding-level interview reasoning.
5. Design chapters become easier once the vocabulary above is stable.

---

## 4) The 80/20 Scope

Master these first:

1. DBMS:
   - SQL joins, grouping, filtering
   - indexes
   - ACID
   - isolation levels at a practical level
   - normalization vs denormalization
2. OS:
   - process vs thread
   - stack vs heap
   - virtual memory and paging
   - context switch
   - mutex/semaphore/deadlock
3. Networks:
   - DNS
   - TCP vs UDP
   - HTTP/HTTPS
   - what happens when you open a website
   - latency, caching, load balancer, CDN
4. Concurrency:
   - race conditions
   - critical sections
   - locks, semaphores, atomics
   - deadlock
   - thread pools
   - async vs multithreading
5. Design:
   - requirements
   - scale assumptions
   - APIs
   - schema
   - bottlenecks
   - tradeoffs

Skip for now unless the role clearly needs it:

1. deep kernel internals
2. BGP policy and advanced routing protocols
3. database storage engine internals
4. lock-free algorithm theory
5. container networking, eBPF, RDMA, GPU scheduling

Those belong to a deeper systems track, not this app's main interview flow.

---

## 5) The 4-Week Fundamentals Rotation

### Week 1: DBMS + SQL

1. Learn joins, grouping, keys, indexes.
2. Write 5 SQL queries by hand.
3. Practice ACID and isolation with one ticket-booking example.

### Week 2: OS + Concurrency Basics

1. Lock process vs thread until you can explain it in under 45 seconds.
2. Practice stack vs heap, paging, context switch.
3. Solve one race-condition example with lock-based reasoning.

### Week 3: Networks

1. Practice browser request flow.
2. Compare TCP vs UDP with one product example each.
3. Explain DNS, TLS, keep-alive, CDN, and load balancing.

### Week 4: Design Integration

1. Do one system design walkthrough.
2. Do one LLD walkthrough.
3. Do 3 short estimation drills.
4. Run one mock that mixes coding + fundamentals + behavior.

---

## 6) The Interview Answer Standard

A strong fundamentals answer usually has 4 parts:

1. Definition:
   - "A process is an isolated running program with its own address space."
2. Contrast:
   - "A thread is lighter because threads share the same address space."
3. Example:
   - "A browser process may have multiple threads for rendering and network work."
4. Tradeoff or failure mode:
   - "Threads are cheaper, but shared memory creates race conditions."

If your answer is only a definition, it sounds memorized.
If your answer is only an example, it sounds incomplete.
If your answer includes definition + example + tradeoff, it sounds interview-ready.

---

## 7) Exit Criteria Before You Move On

You are ready to leave this roadmap when you can do all 5:

1. Say what gets asked in DBMS, OS, CN, concurrency, and design without guessing.
2. Explain the regional emphasis differences without overfitting to one market.
3. Commit to the exact chapter order above.
4. Reserve weekly fundamentals slots in your planner.
5. Start [DBMS & SQL](./dbms-sql.md) immediately.

---

## 8) Next Chapter

Go to [DBMS & SQL](./dbms-sql.md)
