# Concurrency & Multithreading - The Coding Systems Bridge

> OS gives you the vocabulary. Concurrency interviews test whether you can use that vocabulary to reason about real code.

---

## 1) Why This Chapter Is Separate From OS

Operating systems explains what processes, threads, memory, and scheduling are.

This chapter answers a different interview question:

"Can you reason about shared state, parallel execution, and correctness in application code?"

That is why backend and platform interviews often ask concurrency separately.

---

## 2) What Actually Gets Asked

The common asks are:

1. what a race condition is
2. mutex vs semaphore
3. deadlock, starvation, livelock
4. producer-consumer
5. thread-safe counter, queue, cache, or rate limiter
6. thread pool vs creating a thread per request
7. async vs multithreading

For many interviews, this chapter matters more than advanced OS theory.

---

## 3) The 80/20 Topics

| Topic | What you must know | What good interview signal sounds like |
|---|---|---|
| Race condition | shared state updated without safe coordination | "The result depends on timing, so the same program may produce different outcomes." |
| Mutex | one holder at a time | "Use it to protect a critical section around shared mutable state." |
| Semaphore | counting coordination primitive | "Useful when a fixed number of workers or slots can proceed." |
| Deadlock | cyclic waiting on resources | "Prevent with lock ordering or reduced lock scope." |
| Thread pool | bounded worker reuse | "It reduces creation overhead and prevents unbounded thread explosion." |
| Async vs threads | concurrency model tradeoffs | "Async is not the same thing as parallel CPU execution." |

---

## 4) Worked Example - The Unsafe Counter

Problem:

Two threads both run:

```text
counter = counter + 1
```

Why it breaks:

1. Thread A reads `counter = 5`.
2. Thread B reads `counter = 5`.
3. Thread A writes `6`.
4. Thread B writes `6`.
5. One increment is lost.

What to say:

1. "This is a race condition because read-modify-write is not atomic."
2. "I would protect the critical section with a mutex or use an atomic primitive if the operation and language support it."

Tradeoff:

1. locks improve correctness
2. locks also add contention and can reduce throughput if overused

---

## 5) Mutex vs Semaphore - The Clean Comparison

Say it this way:

1. "A mutex protects exclusive access to a critical section."
2. "A semaphore tracks available permits and can allow up to N concurrent holders."
3. "If I want exactly one thread in a section, a mutex is the clearer default."
4. "If I want to limit concurrency, for example only 10 workers hitting a dependency, a semaphore fits better."

If you answer only with textbook words like "binary semaphore" and cannot give a use case, the answer feels weak.

---

## 6) Deadlock - What You Must Add Beyond OS

In concurrency interviews, do not stop at the definition.

Add one code-level fix:

1. acquire locks in a fixed order
2. reduce lock scope
3. use a single coarse lock first, then optimize later
4. use timeouts or try-lock when appropriate

Interviewers like candidates who prefer correctness before premature optimization.

---

## 7) Producer-Consumer - The Standard Pattern

What is happening:

1. producers add work to a shared buffer
2. consumers remove work from that buffer
3. synchronization is needed so:
   - producers do not overflow the buffer
   - consumers do not read empty state
   - shared buffer state is not corrupted

What a solid answer includes:

1. mutex for buffer access
2. condition variable or semaphore for coordination
3. bounded queue as the core data structure

This pattern appears in interviews because it reveals whether you understand both correctness and throughput.

---

## 8) Async vs Multithreading

Good answer:

1. "Multithreading uses multiple threads of execution and can achieve parallelism on multiple cores."
2. "Async is a coordination model where tasks yield while waiting, often on fewer threads."
3. "Async helps especially for high-concurrency I/O workloads."
4. "CPU-bound work still needs threads, processes, or another parallel execution model."

This distinction matters a lot for backend interviews.

---

## 9) What Different Markets Care About

1. US big tech:
   - concurrency often appears in backend or systems-flavored rounds
   - correctness and tradeoff language matter
2. Europe product and fintech:
   - thread pools, async request handling, shared-state bugs, and throughput tradeoffs appear frequently
3. India product companies:
   - mutex/semaphore/deadlock questions and producer-consumer are common
   - LLD rounds also indirectly test concurrency thinking

So your prep must cover both direct definitions and code-level application.

---

## 10) Weekly Drill

Do this once this week:

1. Explain race condition, mutex, semaphore, and deadlock out loud.
2. Write one thread-safe counter example in your main language.
3. Sketch producer-consumer with a bounded queue.
4. Explain when async is better than spawning many threads.
5. Explain why a thread pool is usually safer than one thread per request.

---

## 11) Next Chapter

Go to [System Design Primer](../topics/system-design-primer.md)
