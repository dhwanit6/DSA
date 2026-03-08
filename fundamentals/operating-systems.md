# Operating Systems - The Interview Version

> OS interviews are not testing whether you can build Linux. They are testing whether you can reason about running programs without hand-waving.

---

## 1) What Actually Gets Asked

The highest-ROI OS questions are:

1. process vs thread
2. stack vs heap
3. what a context switch is
4. why virtual memory exists
5. paging and page faults at a high level
6. mutex, semaphore, deadlock
7. scheduling basics
8. fork, exec, and system calls in practical terms

For interview prep, clarity matters more than depth.

---

## 2) The 80/20 Topics

| Topic | What you need | What to avoid overdoing |
|---|---|---|
| Process vs thread | ownership of memory, isolation, cost, use cases | kernel-internal scheduler structures |
| Stack vs heap | lifetime, allocation style, scope, common bugs | allocator implementation details |
| Virtual memory | isolation, abstraction, paging, page fault | page-table bit fields beyond role needs |
| Scheduling | why preemption exists, time slice, throughput vs latency | memorizing obscure algorithms |
| Synchronization | critical section, mutex, semaphore | research-level lock-free theory |
| Deadlock | 4 conditions, prevention ideas | formal proofs unless role demands it |

---

## 3) Process vs Thread - The Must-Have Answer

Use this answer shape:

1. "A process is an isolated running program with its own address space."
2. "A thread is a unit of execution inside a process."
3. "Threads in the same process share heap and file descriptors, but each thread has its own stack and registers."
4. "Processes are heavier but safer to isolate; threads are lighter but shared memory creates race conditions."

What good examples sound like:

1. "A browser may use multiple processes for isolation."
2. "Inside one process, it may still use multiple threads for rendering or network work."

If your answer does not mention shared vs private state, it is incomplete.

---

## 4) Stack vs Heap - The Usual Trap

Say it this way:

1. "Stack memory is typically used for function call frames and local variables."
2. "Heap memory is used for dynamically allocated data whose lifetime is controlled more explicitly."
3. "Stack allocation is usually fast and scoped to function execution."
4. "Heap allocation is flexible but easier to misuse through leaks or dangling references."

Common interview trap:

Question: "Why not put everything on the stack?"

Answer:

1. Stack size is limited.
2. Large or long-lived objects do not fit well there.
3. Returned or shared data often needs lifetime beyond one function frame.

---

## 5) Virtual Memory - The Practical Explanation

Use this explanation:

1. "Virtual memory gives each process the illusion of its own contiguous memory space."
2. "It improves isolation and makes memory management simpler for programs."
3. "The OS and hardware translate virtual addresses to physical addresses."
4. "When needed data is not currently in RAM, a page fault occurs and the OS brings it in."

Good interview example:

1. "A process can use addresses starting from a familiar logical range even though physical RAM is shared with other processes."
2. "That abstraction is one reason crashes in one process do not automatically corrupt another."

---

## 6) Context Switch and Scheduling

A clean answer:

1. "A context switch happens when the CPU stops running one thread or process and saves enough state to resume it later."
2. "Then it loads the next runnable thread or process."
3. "This enables multitasking, but switching too often adds overhead."

If asked about scheduling, say:

1. latency and responsiveness often prefer short tasks getting CPU quickly
2. throughput often prefers keeping the CPU busy
3. fairness prevents starvation

You do not need to dump every scheduling algorithm unless the interviewer goes there.

---

## 7) Deadlock - The 60-Second Answer

Deadlock answer:

1. "Deadlock is a situation where multiple threads or processes wait forever because each is holding a resource the other needs."
2. "The classic four conditions are mutual exclusion, hold and wait, no preemption, and circular wait."
3. "To prevent it, break at least one of those conditions."

Easy prevention examples:

1. acquire locks in a fixed global order
2. avoid holding one lock while waiting indefinitely for another
3. use timeouts or try-lock patterns where appropriate

If you only recite the four conditions without a prevention example, the answer feels half-done.

---

## 8) Worked Example

Question:

"Why are threads cheaper than processes?"

A solid answer:

1. "Threads share the same address space, so creating a thread does not require building a new isolated memory space."
2. "That usually makes creation and communication cheaper."
3. "But the tradeoff is shared memory bugs like races and deadlocks."
4. "Processes cost more, but they isolate failures better."

This is the right level for most interviews.

---

## 9) What Different Markets Care About

1. US big tech:
   - expects clear reasoning and examples
   - direct OS grilling is role-dependent for new grads
2. Europe backend and platform roles:
   - often expects stronger systems vocabulary and practical reasoning
3. India product and placement rounds:
   - direct OS viva questions are common
   - process/thread, deadlock, paging, and scheduling are frequent

So your OS prep must be spoken, not just read.

---

## 10) Weekly Drill

Do these without notes:

1. Explain process vs thread in under 45 seconds.
2. Explain stack vs heap with one bug example.
3. Explain virtual memory and page fault in simple language.
4. Explain deadlock plus one prevention strategy.
5. Explain why a context switch is useful but not free.

---

## 11) Next Chapter

Go to [Computer Networks](./computer-networks.md)
