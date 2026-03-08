# Operating Systems → AI Infrastructure Engineering
## Complete 3-Month Curriculum | Sem 4 (Feb – May)

> **Run this PARALLEL with CN Phase 1 — not after it.**  
> **Target Role:** MLOps Engineer / AI Infrastructure Engineer  
> **Weekly commitment:** 8–10 hours/week on OS alone  
> **Core truth:** Every OS concept has a direct GPU/container/AI-infra mirror. Find that mirror in every topic.

---

## Mental Model: The Three Abstractions

Pin this. Every OS topic in this curriculum lives inside one of three boxes:

```
┌─────────────────────────────────────────────────────────────────┐
│  VIRTUALIZE          CONCURRENTLY MANAGE        PERSIST         │
│                                                                 │
│  Take 1 physical     Multiple things run        Data survives   │
│  resource, give      at once — arbitrate         process death  │
│  each process the    access, prevent             and power loss │
│  illusion it owns    corruption                                 │
│  the whole thing                                                │
│                                                                 │
│  CPU → processes     Scheduling, locks,          File systems,  │
│  RAM → virtual mem   semaphores, IPC,            block devices, │
│  GPU → CUDA streams  deadlock handling           object storage │
└─────────────────────────────────────────────────────────────────┘
```

**The GPU mirror:** CUDA virtualizes GPU cores → concurrent kernel execution → HBM persistence.  
Same three abstractions. Different hardware. Newer, less mature, more broken.  
Your job: understand the classical version deeply enough to fix the broken GPU version.

---

## Master Resource Stack (Read/Use Throughout)

| Resource | Type | Cost | When |
|----------|------|------|------|
| **OSTEP** — Operating Systems: Three Easy Pieces (ostep.org) | Textbook | Free | Primary textbook. Read every chapter. |
| **MIT 6.S081: Operating System Engineering** (pdos.csail.mit.edu/6.S081) | Course + Labs | Free | Best OS course on earth. xv6 labs are mandatory. |
| **"The Linux Programming Interface"** — Michael Kerrisk | Book | ~₹3,500 | The Linux bible. Use as reference throughout. |
| **"Linux Kernel Development"** — Robert Love | Book | ~₹2,500 | Best intro to Linux internals. |
| **Brendan Gregg's blog** (brendangregg.com) | Blog | Free | The authority on Linux performance. Bookmark everything. |
| **"Learning eBPF"** — Liz Rice (O'Reilly) | Book | ~₹2,500 | eBPF bible. Read in Month 3. |
| **Julia Evans (jvns.ca)** | Blog + Zines | Free/cheap | Best explanations of OS concepts. Read constantly. |
| **Hussein Nasser YouTube** | Videos | Free | Practical OS and systems programming explanations. |
| **CS162: Operating Systems** — UC Berkeley (YouTube) | Lectures | Free | Best video lectures for classical OS theory. |

---

## The 6 Pillars — Overview

```
PILLAR 1  │ Processes, Threads & CPU Scheduling        │ Weeks 1–2
PILLAR 2  │ Memory Management & Virtual Memory         │ Weeks 3–4
PILLAR 3  │ Concurrency, Synchronization & Deadlocks   │ Weeks 5–6
PILLAR 4  │ File Systems, I/O & Storage                │ Weeks 7–8
PILLAR 5  │ Virtualization & Containers                │ Weeks 9–10
PILLAR 6  │ eBPF, Linux Internals & GPU OS             │ Weeks 11–12
           │                                           │
FLAGSHIP 1 │ Process + Memory + Concurrency            │ End Week 6
FLAGSHIP 2 │ FS + Virtualization + Containers          │ End Week 10
CAPSTONE   │ All 6 Pillars → AI Infra Monitor          │ Weeks 11–13
```

---

## Pillar 1 — Processes, Threads & CPU Scheduling

**When:** Weeks 1–2  
**OSTEP:** Chapters 4–9 (Processes), 13 (Address Space intro), 26–28 (Threads intro)  
**MIT 6.S081:** Lectures 1–3, Lab: Utilities  
**Parallel CN topic:** CN 1.1 (OSI layers) — both teach layered abstractions

---

### OS-1.1 — Processes: The OS Unit of Work

#### What It Is

A **process** is a running program + all OS-maintained state: virtual address space (code, heap, stack), open file descriptors, register values, PID, scheduling priority, signal handlers. The kernel stores all this in a **Process Control Block (PCB)**.

When you run `python train.py`, the kernel does in sequence:
1. Creates a PCB
2. Allocates a virtual address space
3. Loads the ELF binary (parses headers, maps segments)
4. Sets the instruction pointer to `_start`
5. Adds the process to the scheduler run queue
6. Context-switches to it when CPU is free

**Context switch:** Saving one process's CPU state (all registers + PC + SP) into its PCB, loading another's, resuming it. Costs 1–10 microseconds. Every syscall, I/O wait, and sleep causes one.

**Process lifecycle states:**
```
NEW ──► READY ──► RUNNING ──► TERMINATED
                    │               
                    ▼               
                 WAITING ──► READY
              (blocked on I/O)
```

**Critical syscalls to know by heart:**
- `fork()` — duplicate the calling process (copy-on-write)
- `exec()` — replace process image with new program
- `wait()` / `waitpid()` — parent waits for child to exit
- `exit()` — terminate process, release resources
- `kill()` — send a signal to a process
- `getpid()` / `getppid()` — get own PID / parent's PID

#### Why It Matters for AI Infra

**PyTorch DDP uses `fork()` not threads.** `torchrun --nproc_per_node=8` creates 8 separate OS processes. Why processes instead of threads? Because Python's GIL (Global Interpreter Lock) prevents true CPU parallelism with threads. Separate processes each have their own GIL. Understanding `fork()` explains this architectural decision.

**DataLoader's `num_workers` is `fork()` in a loop.** Each worker is a child process. Copy-on-write means the dataset loaded in the parent is shared with all workers at zero cost — until a worker writes to it. Understanding CoW explains why `pin_memory=True` + `num_workers=4` is the fast DataLoader configuration.

**Zombie processes = production bug.** A training framework that spawns workers without `wait()`-ing on them accumulates zombie PCBs. Each zombie holds a PID. Linux has a PID limit (~32768 by default). When exhausted, you cannot start new processes. The training job silently fails. This is a real bug that has hit production ML systems.

**`/proc` is your debug window into every running process.** Without any instrumentation:
- `/proc/[PID]/status` — memory usage, state, threads
- `/proc/[PID]/maps` — every memory mapping (code, libraries, heap, stack)
- `/proc/[PID]/fd/` — every open file descriptor (files, sockets, pipes)
- `/proc/[PID]/stat` — CPU time, context switches, scheduler stats

#### How to Learn It

1. Read OSTEP Ch.4–6. Do the simulation exercises at the end.
2. Write a C program: `fork()` a child, have the child print its PID, parent `wait()`s and prints the exit code. Compile and run.
3. Read `/proc/self/` from a Python script — print every readable file's content. Understand what each means.
4. Intentionally create a zombie: fork a child, have it exit immediately, but don't call `wait()` in parent. Run `ps aux | grep Z` to see it.
5. MIT 6.S081 Lab: utilities — implement `sleep`, `pingpong`, `primes` using Unix process APIs.

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| OSTEP Ch.4–6 | Textbook | Best treatment of processes. Short, clear, simulation exercises. |
| MIT 6.S081 Lec 1–2 (YouTube) | Video | Shows exact kernel code for process creation in xv6. |
| Julia Evans — "What's in a process?" (jvns.ca) | Blog | Visual, concrete. Shows exactly what the kernel tracks. |
| `man 2 fork`, `man 2 execve` | Man pages | Read every line. The specification is the truth. |
| "The Linux Programming Interface" Ch.24–26 | Book | Processes in real Linux with every edge case documented. |

#### Micro-Project OS-1.1 — "procviz: Process Tree Visualizer"

**Build:** Pure Python (no psutil) process inspector that reads directly from `/proc`:

```python
# What you build — reads only from /proc filesystem
import os, re
from pathlib import Path

def read_proc(pid, field):
    """Read a field from /proc/[pid]/status"""
    # YOUR IMPLEMENTATION — parse /proc/[pid]/status
    pass

def get_all_processes():
    """Return list of dicts: pid, ppid, name, state, 
       rss_mb, threads, open_fds, cpu_time"""
    # Read /proc/[pid]/status, /proc/[pid]/stat, 
    # count /proc/[pid]/fd/ entries
    pass

def build_process_tree(processes):
    """Build parent→children tree structure"""
    pass

def print_tree(tree, pid=1, depth=0):
    """Print process tree like pstree"""
    pass

# OUTPUT: Pretty-printed process tree with 
# memory, state, and thread count per process
```

**Deep extension:** Add a "watch mode" that refreshes every 2 seconds and highlights processes whose memory grew by >10MB since last refresh. Use ANSI escape codes for coloring (red = high memory, yellow = waiting state, green = running).

**Why it matters:** After building this, you will never again use `ps aux` without understanding exactly where that data comes from.

---

### OS-1.2 — Threads: Concurrency Inside a Process

#### What It Is

A **thread** is a unit of execution within a process. All threads in a process share: address space (heap, code), open file descriptors, signal handlers. Each thread has its own: stack, program counter, register set, thread ID. Creating a thread is cheaper than a process (no new address space) — typically 10–50x faster than `fork()`.

**POSIX threads (pthreads)** is the Linux threading API:
- `pthread_create()` — create a thread
- `pthread_join()` — wait for thread completion
- `pthread_mutex_lock/unlock()` — mutual exclusion
- `pthread_cond_wait/signal()` — condition variables

**User-space threads vs kernel threads:**  
Linux threads are actually kernel-level threads (each has a kernel task struct). Python uses OS threads but the GIL means only one Python thread executes Python bytecode at a time. C/C++ threads use all cores. This is why PyTorch's CPU kernels are written in C++ — they bypass the GIL.

**Green threads / coroutines:** Python's `asyncio` uses a single OS thread but multiplexes thousands of "coroutines" using cooperative scheduling (`await` = voluntarily yield). FastAPI (used for ML serving APIs) is built on asyncio. Understanding the difference between threads (OS-scheduled) and coroutines (application-scheduled) explains why `async def` endpoint handlers in FastAPI are not actually parallel.

#### Why It Matters for AI Infra

- **NCCL uses CUDA streams (GPU's threads).** A CUDA stream is a sequence of GPU operations that execute in order. Multiple streams execute concurrently. This is GPU threading. Understanding CPU threads makes GPU streams immediately intuitive.
- **Model serving throughput.** A TorchServe worker uses multiple threads: one handling HTTP requests, one running inference, one doing pre/postprocessing. Thread pool sizing (too few = underutilized GPU, too many = context switch overhead) is OS tuning, not ML tuning.
- **The GIL is why Python ML uses multiprocessing.** Python DataLoader workers are processes (not threads) for this reason. You can't understand this design decision without understanding the GIL.

#### How to Learn It

1. Read OSTEP Ch.26–28.
2. Write C with pthreads: create 4 threads, each incrementing a shared counter 1,000,000 times without a lock. Observe the wrong result. Add a mutex. Observe correct result. Measure time difference.
3. Implement the same in Python: one version with `threading.Thread` (notice GIL limits parallelism for CPU-bound), one with `multiprocessing.Process` (true parallelism). Benchmark both.
4. Write a simple asyncio server: 1000 concurrent "requests" handled by 1 thread using `asyncio`. Measure throughput vs a threaded version.

#### Micro-Project OS-1.2 — "Thread vs Process Benchmark"

**Build:** A benchmarking tool that scientifically compares performance of: threads, processes, and asyncio coroutines for three workload types:
1. **CPU-bound:** Prime number computation (threads show GIL limitation, processes scale)
2. **I/O-bound:** Simulated file reads with sleep (threads work fine, asyncio best)
3. **Mixed:** CPU + I/O (real-world ML preprocessing simulation)

Output: A matplotlib chart showing throughput vs worker count for all three models on all three workloads.

**What you learn:** This experiment shows exactly when to use threads vs processes vs async — a decision you make constantly in ML systems engineering.

---

### OS-1.3 — CPU Scheduling: Who Runs When

#### What It Is

The **CPU scheduler** decides which ready process/thread gets the CPU next and for how long. Key algorithms:

- **FIFO/FCFS:** Run in order of arrival. Simple. Bad for short jobs stuck behind long ones.
- **SJF (Shortest Job First):** Run shortest job first. Optimal for average turnaround. Requires knowing job length (impossible in practice).
- **STCF (Shortest Time to Completion First):** Preemptive SJF. Preempt running job if new shorter job arrives.
- **Round Robin (RR):** Give each job a fixed time quantum (e.g., 10ms), then preempt and move to back of queue. Good response time. Bad turnaround.
- **MLFQ (Multi-Level Feedback Queue):** Multiple priority queues. New jobs start at highest priority (assuming short). Long-running jobs get demoted. Approximates SJF without knowing job length.
- **CFS (Completely Fair Scheduler):** Linux's actual scheduler. Uses a red-black tree keyed by "virtual runtime." Always runs the process with least accumulated CPU time. Fair, smooth, efficient.

**Key metrics:**
- **Turnaround time** = completion time − arrival time (batch jobs care)
- **Response time** = first run time − arrival time (interactive jobs care)
- **Throughput** = jobs completed per second

**Real-time scheduling:** `SCHED_FIFO` and `SCHED_RR` are real-time scheduling classes in Linux. They preempt all CFS tasks. Used in: audio systems, embedded controllers, and — critically — CUDA driver interrupt handlers.

#### Why It Matters for AI Infra

**GPU scheduling is the broken frontier.** Linux CFS schedules CPU processes fairly. There is no equivalent fair scheduler for GPU processes. By default, the first GPU process to launch runs at 100% utilization until it finishes — starving everyone else. Solutions:
- **NVIDIA MPS (Multi-Process Service):** Shares GPU context between processes, partial spatial multiplexing
- **NVIDIA MIG (Multi-Instance GPU):** Hardware partitions H100 into 7 isolated instances
- **NVIDIA time-slicing:** Round-robin GPU time between CUDA contexts (like CPU RR, but coarser — 50ms quanta)
- **Kubernetes GPU scheduling via Volcano/KAI Scheduler:** Gang scheduling (all-or-nothing for distributed jobs), GPU bin-packing, preemption policies

Understanding CPU scheduling algorithms is the prerequisite to understanding why GPU scheduling is hard and what the solutions trade off.

**Slurm scheduling in HPC** (how your training job gets scheduled on a supercomputer) uses Backfill scheduling — a variant of MLFQ. Without understanding scheduling theory, Slurm configuration is magic. With it, you can tune your job's priority and backfill eligibility.

#### How to Learn It

1. OSTEP Ch.7–9: work through every scheduling example by hand. Draw Gantt charts.
2. Implement MLFQ in Python: simulate 5 jobs with different burst lengths. Show how the scheduler adapts.
3. On your Linux machine: `cat /proc/[PID]/sched` — see the CFS scheduler's bookkeeping for a real process.
4. Use `chrt` to change a process's scheduling class: `chrt -f 99 ./my_program` (SCHED_FIFO, priority 99). Observe it preempt normal processes.
5. Read the Linux CFS scheduler code: `kernel/sched/fair.c`. You don't need to understand every line — find `pick_next_task_fair()` and understand the decision logic.

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| OSTEP Ch.7–9 | Textbook | Best scheduling treatment. Simulation tools included. |
| CS162 Berkeley Lecture 7–8 (YouTube) | Video | Best video explanation of real scheduler design. |
| "Linux Kernel Development" Ch.4 | Book | CFS internals explained clearly. |
| Brendan Gregg — "Linux CPU Scheduling" | Blog | Practical. Shows how to observe scheduling in real systems. |
| NVIDIA GPU Scheduling whitepaper | Doc | How GPU scheduling differs from CPU scheduling. |

#### Micro-Project OS-1.3 — "Scheduler Simulator"

**Build:** A Python simulator for the four main scheduling algorithms (FIFO, SJF, RR, MLFQ):

```python
class Job:
    def __init__(self, name, arrival_time, burst_time, io_bursts=[]):
        # io_bursts: list of (cpu_time_before_io, io_duration) tuples
        pass

class Scheduler:
    def simulate_fifo(self, jobs): pass
    def simulate_sjf(self, jobs): pass  
    def simulate_rr(self, jobs, quantum=10): pass
    def simulate_mlfq(self, jobs, queues=3, quantum_base=10): pass
    
    def compute_metrics(self, results):
        # returns: avg turnaround, avg response, throughput
        pass
    
    def plot_gantt(self, results):
        # matplotlib Gantt chart showing which job ran when
        pass
```

**Input:** A CSV of jobs with arrival time, burst time, and I/O interrupts.  
**Output:** Gantt chart + metrics table comparing all 4 algorithms on the same job set.  

**Deep extension:** Add a "GPU scheduler" mode that simulates NVIDIA time-slicing vs MIG vs MPS with different job mixes. Quantify the GPU utilization difference.

---

## ★ Pillar 1 Milestone Check

Before moving to Pillar 2, verify you can do all of these without notes:

- [ ] Explain what a PCB contains and why each field exists
- [ ] Write a C program using `fork()`, `exec()`, `wait()` from memory
- [ ] Explain why Python's DataLoader uses processes instead of threads
- [ ] Implement Round Robin scheduling in Python
- [ ] Read any process's memory usage directly from `/proc` without psutil
- [ ] Complete micro-projects OS-1.1, OS-1.2, OS-1.3

---

## Pillar 2 — Memory Management & Virtual Memory

**When:** Weeks 3–4  
**OSTEP:** Chapters 13–24 (Memory Management)  
**MIT 6.S081:** Lectures 4–5, Lab: Memory allocator  
**Parallel CN topic:** CN 1.4 (Routing) — both teach path resolution through hierarchical tables (page tables ↔ routing tables are structurally identical)

---

### OS-2.1 — Virtual Memory & Address Spaces

#### What It Is

Every process believes it has the entire 64-bit address space (0 to 2⁶⁴−1) to itself. This illusion is **virtual memory**. The OS maintains a **page table** per process that maps virtual addresses to physical RAM addresses. The **MMU (Memory Management Unit)** in hardware performs this translation on every memory access.

**Address space layout of a process:**
```
HIGH ADDRESS  ┌─────────────────────┐
              │   Kernel Space      │ ← only accessible in kernel mode
              ├─────────────────────┤ 0xFFFF...
              │   Stack             │ ← grows downward, per-thread
              │       ↓             │
              │   (unmapped)        │
              │       ↑             │
              │   Heap              │ ← grows upward via malloc/mmap
              ├─────────────────────┤
              │   BSS segment       │ ← uninitialized global variables
              │   Data segment      │ ← initialized global variables  
              │   Text segment      │ ← executable code (read-only)
LOW ADDRESS   └─────────────────────┘ 0x0000...
```

**Page table mechanics:**
- Virtual address space is divided into **pages** (typically 4KB)
- Physical RAM is divided into **frames** (same size as pages)
- Page table entry (PTE) stores: physical frame number + permission bits (read/write/execute) + present bit
- **TLB (Translation Lookaside Buffer):** Hardware cache of recent virtual→physical translations. A TLB miss = expensive page table walk (4 memory accesses for 4-level paging)
- **Page fault:** CPU accesses a page not in the page table → kernel interrupt → kernel allocates frame, loads page, resumes process. Transparent to process.

**Memory allocation:**
- `malloc()` → calls `brk()` or `mmap()` syscalls → kernel expands heap
- `mmap()` → maps files or anonymous memory directly into virtual address space
- **Copy-on-Write (CoW):** After `fork()`, parent and child share physical pages marked read-only. First write triggers a page fault → kernel copies the page → both processes get their own copy. Zero overhead for read-only data.

#### Why It Matters for AI Infra

**GPU memory is not virtual — it's physical.** When you call `torch.cuda.empty_cache()`, you're managing physical GPU VRAM directly. There is no virtual memory, no demand paging, no CoW. CUDA's memory allocator (cuMalloc) does manage a pool, but there's no OS-level abstraction below it. GPU OOM errors are real physical memory exhaustion — not page faults. Understanding virtual memory makes this contrast sharp.

**`mmap` for ML datasets.** Loading a 100GB dataset with `mmap` is the standard technique: `np.memmap(filename, dtype='float32', mode='r')`. The file is mapped into the process's virtual address space. Pages are loaded on demand (page fault) as training accesses them. This is demand paging over a file. The OS page cache means the second epoch is dramatically faster — pages are cached in RAM.

**vLLM's PagedAttention** is virtual memory for GPU KV cache. vLLM treats the GPU's KV cache like virtual memory — dividing it into "pages" of attention blocks, mapping them on demand, allowing non-contiguous physical allocation. It is literally implementing a paging system on the GPU using the lessons of CPU virtual memory. Without understanding virtual memory, PagedAttention is magic. With it, it's obvious.

**NUMA (Non-Uniform Memory Access):** Multi-socket servers have RAM banks physically closer to some CPUs. Accessing remote RAM is 2–4x slower than local. Kubernetes pod scheduling on NUMA nodes without NUMA-aware memory allocation causes silent performance degradation in ML training. `numactl` and NUMA-aware memory allocation fix this.

#### How to Learn It

1. OSTEP Ch.13–19. Read all. Do simulation exercises.
2. Write a C program: `malloc()` 1GB. Check `/proc/self/maps` before and after. See the heap grow.
3. Write a program that uses `mmap()` to read a large file, modifies a page, and uses `msync()` to flush changes. Check that the file is modified.
4. Observe TLB effects: write a C program that accesses a large array sequentially (good TLB) vs randomly (bad TLB). Measure time with `clock_gettime(CLOCK_MONOTONIC)`. The difference is TLB miss cost.
5. MIT 6.S081 Lab: memory allocator (implement `malloc` and `free`).

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| OSTEP Ch.13–24 | Textbook | The best virtual memory explanation in any textbook. |
| MIT 6.S081 Lectures 4–5 | Video | Shows xv6 page table code. Makes page tables concrete. |
| "What is virtual memory?" — Julia Evans | Blog | Best short explanation. Diagrams are excellent. |
| "Linux Kernel Development" Ch.15 | Book | Linux's specific memory management implementation. |
| Brendan Gregg — "Linux Memory Analysis" | Blog | How to observe memory behavior on real Linux systems. |

#### Micro-Project OS-2.1 — "memviz: Virtual Memory Map Visualizer"

**Build:** A tool that displays a process's complete virtual memory map with annotations:

```python
# reads /proc/[pid]/maps and /proc/[pid]/smaps
# outputs something like:

# VIRTUAL MEMORY MAP — python3 (PID 12345)
# ─────────────────────────────────────────────────────────────────
# 7f3a00000000 - 7f3a04000000  [64MB]  heap          rw   dirty:12MB
# 7f3a04000000 - 7f3a14000000  [256MB] mmap:dataset   r    cache:240MB
# 7f3b00000000 - 7f3b00001000  [4KB]   vdso          r-x  
# 7fff00000000 - 7fff00100000  [1MB]   stack         rw   used:48KB
# ...
# ─────────────────────────────────────────────────────────────────
# TOTAL VIRTUAL: 2.3GB  |  PHYSICAL RSS: 387MB  |  SWAP: 0

# Then annotate each mapping:
# - Which shared library it belongs to
# - Whether it's file-backed (mmap'd dataset) or anonymous (heap/stack)
# - Whether it's copy-on-write shared with parent process
```

**Deep extension:** Monitor a PyTorch training process. Show how the memory map changes from model load → first forward pass → backward pass. Show when the heap grows via cuMalloc wrapper calls.

---

### OS-2.2 — Paging, Page Replacement & Memory Pressure

#### What It Is

When physical RAM is full, the OS must evict pages to disk (**swap**). The **page replacement algorithm** decides which pages to evict:

- **OPT:** Evict the page that won't be used for the longest time. Optimal but requires future knowledge. Used as a benchmark.
- **FIFO:** Evict the oldest loaded page. Simple. Suffers from Belady's anomaly (more frames can cause more faults).
- **LRU (Least Recently Used):** Evict the page that hasn't been accessed the longest. Approximates OPT well. Expensive to implement exactly — Linux uses approximations (clock algorithm, CLOCK-Pro).
- **Linux's actual algorithm:** Two LRU lists — **active** (recently used) and **inactive** (candidates for eviction). Pages move between lists based on access bits set by the MMU. `kswapd` daemon runs in the background managing eviction.

**OOM Killer:** When memory is critically exhausted and no swap is available, Linux's OOM (Out-of-Memory) Killer selects a process to kill. It uses a score based on memory usage, process importance, and time running. ML training processes typically get killed by OOM in one of two situations: (1) GPU model too large for VRAM, then falls back to CPU RAM and exhausts it; (2) DataLoader workers each loading a copy of a dataset into RAM.

**Huge Pages:** Instead of 4KB pages, Linux supports 2MB and 1GB "huge pages." Fewer page table entries → fewer TLB misses → better performance for memory-intensive workloads. PyTorch allocates huge pages by default when available via `mmap` with `MAP_HUGETLB`. Deep learning training throughput can improve 5–15% with huge page configuration.

#### Why It Matters for AI Infra

**GPU OOM is not like CPU OOM.** CPU OOM → OS kills a process or swaps. GPU OOM → CUDA throws `RuntimeError: CUDA out of memory`. No swap, no OOM killer, just a crash. Understanding page replacement explains why GPU memory management must be explicit (gradient checkpointing, model sharding, mixed precision) — there is no OS safety net.

**Kubernetes memory limits kill training jobs.** A Kubernetes pod with `resources.limits.memory: 32Gi` will be OOM-killed if it exceeds 32GB. But the OOM kill happens at the container level, not the OS level. The cgroup memory controller enforces this — you must understand memory management to tune container memory limits correctly.

#### Micro-Project OS-2.2 — "Page Replacement Simulator"

**Build:** Simulate LRU, FIFO, OPT, and CLOCK algorithms:
- Input: reference string (sequence of page accesses), number of frames
- Output: page fault count per algorithm, visualization of page table state at each step
- Benchmark: generate random vs. temporal-locality-heavy access patterns (simulating ML training data access). Show how LRU dramatically outperforms FIFO on temporal locality.

**Deep extension:** Analyze the actual page fault rate of a PyTorch DataLoader with `mmap` dataset. Use `perf stat -e page-faults python train.py`. Show how the fault rate drops from epoch 1 to epoch 2 as the OS page cache warms up.

---

### OS-2.3 — Memory Allocators: malloc, the Slab Allocator & GPU Memory

#### What It Is

**User-space allocators (`malloc`):**
- `malloc()` requests large chunks from kernel (`brk()` or `mmap()`) and manages them internally
- **glibc's ptmalloc2:** Uses bins of different sizes. Free blocks are coalesced. Thread-safe via per-thread arenas.
- **jemalloc / tcmalloc:** Better for multithreaded workloads. jemalloc is used by Facebook; tcmalloc by Google. Both significantly reduce malloc contention in ML serving systems.
- **Memory fragmentation:** After many `malloc`/`free` cycles of different sizes, you can fail to allocate a large contiguous block even though enough total free bytes exist. Real problem in long-running ML servers.

**Kernel slab allocator:**  
The kernel needs to frequently allocate/free same-sized objects (PCBs, file descriptors, dentries). The **slab allocator** pre-allocates pools of same-sized objects. Allocation = grab from pool. Deallocation = return to pool. Zero fragmentation, O(1) operations.

**CUDA memory allocator:**  
`cudaMalloc()` is expensive (microseconds, synchronizes GPU). PyTorch's caching allocator wraps it: large CUDA allocations are cached and reused between `cudaMalloc`/`cudaFree` calls. `torch.cuda.memory_reserved()` vs `torch.cuda.memory_allocated()` shows reserved (cached pool size) vs actually-in-use memory.

#### Micro-Project OS-2.3 — "malloc Behavior Analyzer"

**Build:** A program that uses `LD_PRELOAD` to intercept all `malloc`/`free` calls in any process, logging: allocation size, time, call stack (via `backtrace()`). Then run a PyTorch training script and visualize: allocation size distribution, allocation frequency per call site, fragmentation ratio over time.

---

## Pillar 3 — Concurrency, Synchronization & Deadlocks

**When:** Weeks 5–6  
**OSTEP:** Chapters 26–34 (Concurrency)  
**MIT 6.S081:** Lab: Locking  
**Parallel CN topic:** CN 1.5 (TCP) — both deal with reliability in the face of non-deterministic timing

---

### OS-3.1 — Race Conditions & Mutual Exclusion

#### What It Is

A **race condition** occurs when the correctness of computation depends on the timing of concurrent operations. The classic example: two threads increment a shared counter. At machine code level, increment is three operations: LOAD → ADD → STORE. If both threads execute LOAD before either executes STORE, one increment is lost.

**Critical section:** Code that accesses shared data. Must be executed by at most one thread at a time.

**Mutex (Mutual Exclusion Lock):**
- `pthread_mutex_lock()` — acquire lock (block if held by another)
- `pthread_mutex_unlock()` — release lock
- **Spin lock vs blocking lock:** Spin lock busy-waits (wastes CPU but no context switch overhead). Blocking lock sleeps the thread. For very short critical sections, spin locks are faster.

**Atomic operations:**  
Hardware-supported operations that complete without interruption: `atomic_fetch_add`, `compare_and_swap (CAS)`. Lock-free data structures are built from atomics. Python's `threading.Lock` is a mutex. `multiprocessing.Value` uses shared memory with a lock.

**False sharing:** Two threads modify different variables that happen to be on the same cache line. Each modification invalidates the other thread's cache line, causing constant cache coherence traffic. In ML training, this can silently reduce throughput by 30%.

#### Why It Matters for AI Infra

**NCCL's AllReduce is a distributed synchronization problem.** Every GPU must contribute gradients before any GPU can move forward. This is a barrier — the most common synchronization primitive. Understanding mutex → semaphore → barrier progression makes NCCL's architecture obvious.

**Parameter servers use lock-free data structures.** When 100 GPU workers are pushing gradient updates to a central parameter server, a mutex on the parameter tensor would serialize all updates. Real parameter servers (like those in TensorFlow 1.x) used lock-free CAS operations on gradient accumulation buffers.

**Ray's actor model avoids shared memory entirely.** Ray processes (actors) communicate only via message passing — no shared memory, no locks. This is the actor concurrency model. Understanding why shared memory + locks causes problems (and why message passing avoids them) explains Ray's design.

#### Micro-Project OS-3.1 — "Race Condition Demo Suite"

**Build:** A series of C programs demonstrating every concurrency bug:
1. **Unsynchronized counter:** 4 threads increment 1M times each. Show non-deterministic wrong results.
2. **Mutex fixed:** Same, with mutex. Show correct result with timing overhead.
3. **Spin lock implementation:** Implement a spin lock using `__atomic_compare_exchange`. Benchmark vs mutex for short critical sections.
4. **False sharing:** Two threads modify adjacent integers in an array. Show 5x slowdown vs separate cache lines. Fix with padding.
5. **Lock-free stack:** Implement push/pop using CAS. Verify correctness under contention.

---

### OS-3.2 — Semaphores, Condition Variables & Classic Problems

#### What It Is

**Semaphore:** An integer counter with two atomic operations:
- `sem_wait()` (P): Decrement. If counter would go negative, block.
- `sem_post()` (V): Increment. Wake a blocked thread if any.
- Binary semaphore (initial value 1) = mutex. Counting semaphore (initial value N) = "at most N concurrent accesses."

**Condition variable:** Used with a mutex for "wait until condition is true":
- `pthread_cond_wait(cond, mutex)` — atomically release mutex and sleep until signaled
- `pthread_cond_signal(cond)` — wake one waiting thread
- `pthread_cond_broadcast(cond)` — wake all waiting threads

**Classic synchronization problems (understand all of them):**
- **Producer-Consumer (Bounded Buffer):** Producers add to a fixed-size buffer; consumers remove. Semaphores for empty/full slots + mutex for buffer access.
- **Readers-Writers:** Many readers can read simultaneously; writers need exclusive access.
- **Dining Philosophers:** 5 philosophers, 5 forks, each needs 2 forks to eat. Classic deadlock scenario.
- **Sleeping Barber:** Resource allocation with queuing. Models request queuing in servers.

**GPU parallel:** CUDA synchronization primitives — `__syncthreads()` (barrier for all threads in a block), CUDA events (async signal between streams), `cudaStreamSynchronize()` (wait for stream completion). These are the GPU equivalents of `pthread_barrier_wait()` and `sem_wait()`.

#### Micro-Project OS-3.2 — "ML Request Queue Simulator"

**Build:** A producer-consumer simulation modeling an ML inference server:
- **Producers:** HTTP request handlers (10 concurrent) — add requests to a bounded queue
- **Consumer:** GPU inference worker — takes batches of 8 from queue when enough requests accumulated (or after 10ms timeout)
- Implement with Python threading + semaphores/condition variables
- Measure: queue depth over time, batch utilization, request latency P50/P99
- Add backpressure: when queue is 80% full, return HTTP 429 to producers

**What you build is a simplified version of TorchServe's request batching engine.**

---

### OS-3.3 — Deadlocks: Detection, Prevention & Avoidance

#### What It Is

A **deadlock** occurs when a set of processes are each waiting for a resource held by another — circular wait with no process able to proceed.

**Coffman's four necessary conditions (all four must hold for deadlock):**
1. **Mutual exclusion:** Resources cannot be shared
2. **Hold and wait:** Process holds a resource while waiting for another
3. **No preemption:** Resources cannot be forcibly taken
4. **Circular wait:** Cycle of processes each waiting for the next

**Strategies:**
- **Prevention:** Ensure at least one Coffman condition never holds (e.g., require processes to request all resources at once — eliminates hold-and-wait)
- **Avoidance:** Banker's algorithm — before granting a request, check if the system remains in a "safe state"
- **Detection + Recovery:** Allow deadlocks, detect them (cycle detection in resource allocation graph), recover by killing a process
- **Ignorance (Ostrich algorithm):** Pretend deadlocks don't happen. Used by most OS for user programs.

#### Why It Matters for AI Infra

**PFC storms in RoCE networks are network-layer deadlocks.** Priority Flow Control pause frames propagate in a circle — switch A pauses switch B, which pauses switch C, which pauses switch A. Exactly Coffman circular wait at the network level. Understanding deadlock theory makes you the person who can diagnose and prevent this.

**CUDA device-to-device deadlocks.** If GPU kernel A is waiting for data from GPU B via P2P, and GPU B is waiting for data from GPU A, you have a CUDA deadlock. The symptom: training hangs forever with no error message. Detection: `nvidia-smi` shows both GPUs running but training makes no progress.

**Kubernetes resource deadlocks.** Job A needs GPUs on node 1 and CPUs on node 2. Job B needs CPUs on node 2 and GPUs on node 1. Both are partially scheduled, holding one resource, waiting for the other. Gang scheduling (all-or-nothing) prevents this.

#### Micro-Project OS-3.3 — "Resource Allocation Graph Analyzer"

**Build:** A Python tool that models resources and processes, detects deadlocks, and suggests resolutions:
- Input: a resource allocation graph (JSON: which process holds which resources, which is requesting what)
- Detection: cycle detection algorithm in directed graph (DFS with coloring)
- Output: "Deadlock detected involving: Process A → Resource X → Process B → Resource Y → Process A"
- Resolution suggestions: which process to preempt based on heuristics (least work done, fewest resources held)
- Visualization: NetworkX graph diagram with deadlock cycle highlighted in red

---

## ★ FLAGSHIP PROJECT 1 — "OScore: OS Behavior Profiler for ML Workloads"

> **Combines:** Pillar 1 (Processes, Threads, Scheduling) + Pillar 2 (Memory) + Pillar 3 (Concurrency)  
> **Build during:** End of Week 6  
> **Difficulty:** Intermediate Python + C + Linux systems  
> **Time investment:** 8–10 hours total

### What You Build

A profiling tool that runs alongside any Python ML training process and produces a comprehensive OS behavior report — showing exactly how the OS is spending its resources to support the training job.

**Architecture:**
```
[Training Process] ──► /proc/[pid]/ ──► [OScore Collector]
       │                                       │
       │◄── ptrace (syscall trace) ────────────┤
       │◄── /proc/[pid]/fd/ (I/O) ─────────────┤
       │◄── /proc/[pid]/schedstat ─────────────┤
                                               │
                                               ▼
                                    [OScore Analyzer]
                                    │  Process metrics
                                    │  Memory metrics  
                                    │  Thread metrics
                                    │  I/O metrics
                                    │  Scheduler metrics
                                    ▼
                                [Rich Terminal Dashboard]
```

**What it reports:**

Section 1 — Process Health:
- CPU utilization (user vs sys vs iowait) per second
- Context switch rate (voluntary vs involuntary — involuntary = scheduler preemption)
- Number of threads alive, thread state breakdown (R/S/D/Z)
- Open file descriptors — categorize: files, sockets, pipes, GPU devices

Section 2 — Memory Profile:
- RSS growth curve over training time
- Page fault rate (major = from disk, minor = CoW resolution)
- Memory map breakdown: code, heap, mmap'd files, stack per thread
- Memory pressure: is the process triggering kswapd? (check `/proc/vmstat`)

Section 3 — I/O Profile:
- Read/write bytes/sec from `/proc/[pid]/io`
- Most-accessed files (via inotify or `/proc/[pid]/fd/` inspection)
- I/O wait time percentage

Section 4 — Scheduler Report:
- Time on CPU vs time waiting in run queue vs time sleeping
- Which CPU cores the process ran on (core affinity)
- Involuntary preemptions count — high count = scheduler contention

Section 5 — Concurrency Report:
- Number of Python threads vs OS threads
- Lock contention estimate (via `perf` if available)
- GIL contention indicator (from `sys.getswitchinterval()` and context switch rate)

**Output:** A markdown report + live terminal dashboard (using `rich`) + JSON dump for further analysis.

**Why this is impressive:** This is a simplified version of what tools like `py-spy`, `Austin`, and `scalene` do. After building this, you understand exactly how every Python profiler works internally.

---

## Pillar 4 — File Systems, I/O & Storage

**When:** Weeks 7–8  
**OSTEP:** Chapters 36–42 (Persistence)  
**Parallel CN topic:** CN 1.6 (DNS) — both are hierarchical name resolution systems (path → inode, domain → IP)

---

### OS-4.1 — File Systems: From VFS to Inodes

#### What It Is

A **file system** is the OS's persistent storage abstraction. It provides: a namespace (directory tree), data persistence (survives reboot), access control (permissions), and efficient data retrieval.

**VFS (Virtual File System):** Linux's abstraction layer that allows multiple file system types (ext4, btrfs, tmpfs, procfs, nfs) to coexist under one `/` namespace. Every file operation (open, read, write, stat) goes through VFS, which dispatches to the appropriate FS implementation.

**Key VFS objects:**
- **inode:** Metadata about a file — permissions, ownership, timestamps, size, data block pointers. NOT the filename.
- **dentry:** Directory entry — maps a filename to an inode. The directory tree is a tree of dentries.
- **file:** Represents an open file — current offset, flags, pointer to dentry/inode.
- **superblock:** FS-wide metadata — total blocks, free blocks, inode table location.

**ext4 internals (most common Linux FS):**
- Disk divided into **block groups**. Each group has its own inode table, block bitmap, and data blocks.
- Files < 60 bytes: stored directly inside the inode (inline data)
- Small files: direct block pointers in inode
- Large files: indirect blocks, double-indirect blocks, or **extent trees** (ext4 default)
- **Journal:** ext4 is a journaling FS. Writes first go to the journal (a log). If power fails mid-write, journal replays. Guarantees consistency, costs some write performance.

**File descriptor table:**  
Each process has a file descriptor table. Each entry points to a system-wide open file table entry. Multiple FDs (and multiple processes via `dup`/`fork`) can point to the same open file. This is how `stdin`/`stdout` redirection works.

#### Why It Matters for AI Infra

**Distributed file systems for ML:** Training a 100B parameter model on 1,000 GPUs requires reading ~100TB of training data. Local disk is impossible. Solutions:
- **Lustre:** The standard HPC distributed FS. Used at every AI supercomputer. POSIX-compatible, high bandwidth via striped storage.
- **NFS:** Simple network file sharing. Too slow for large-scale training — single metadata server bottleneck.
- **AWS EFS / GCP Filestore:** Managed NFS. Better for inference (reading model artifacts) than training.
- **Object storage (S3/GCS):** Not POSIX. Key-value, HTTP-based. The actual storage medium for most ML datasets. Tools like `torchdata` and `webdataset` read from S3 using range requests.

**`tmpfs` for fast scratch space:** Putting your training data preprocessing output in `/dev/shm` (which is a `tmpfs` — a RAM-backed file system) avoids disk I/O entirely for temporary data. This is a standard ML engineering trick.

**File descriptor limits.** By default, Linux limits a process to 1024 open file descriptors (`ulimit -n`). A DataLoader with 8 workers, each reading from 100 files, can easily hit this. Production ML systems always increase this limit. Understanding FD tables is why this limit exists.

#### Micro-Project OS-4.1 — "ML Dataset Filesystem Analyzer"

**Build:** A tool that analyzes how a training process accesses its dataset:
1. Use `inotifywait` (or `fanotify` via Python bindings) to trace all file opens/reads/closes by a training process
2. Build an access pattern heatmap: which files are accessed most, access frequency distribution
3. Detect: sequential vs random access (important for HDD vs SSD performance), files accessed by multiple workers simultaneously, cache hit rate (file accessed again within 60s)
4. Recommend: "Your dataset has hot files (top 10% accessed 80% of time) — put them in `/dev/shm`" or "Access pattern is sequential — increase readahead with `posix_fadvise(FADV_SEQUENTIAL)`"

---

### OS-4.2 — I/O Architecture: From syscall to disk

#### What It Is

The I/O stack in Linux has multiple layers:
```
Application: read(fd, buf, n) ──► VFS ──► File System ──► Block Layer
──► I/O Scheduler ──► Device Driver ──► Hardware (NVMe/SATA/NFS)
```

**Page cache:** Linux caches disk blocks in RAM. `read()` on a cached file returns from RAM. Writes go to the page cache (marked dirty) and are flushed to disk asynchronously by `pdflush`. This is why reading the same file twice is much faster than the first time.

**Buffered vs Direct I/O:**
- Buffered (default): goes through page cache. Good for sequential reads (readahead works).
- Direct I/O (`O_DIRECT`): bypasses page cache. Data goes directly between user buffer and disk. Used in databases and ML training when you want to manage your own cache.

**`io_uring` (Linux 5.1+):** The modern async I/O interface. A ring buffer shared between kernel and user space. Submissions and completions happen without syscalls on the hot path. Applications can batch hundreds of I/O operations and submit them in one syscall. For ML data loading at 100+ GB/s, `io_uring` can be 2–3x faster than traditional `read()`.

**NVMe vs SATA:** NVMe SSDs connect via PCIe, use multiple queues (up to 65,535), achieve 7+ GB/s sequential read and 1M+ IOPS. SATA SSDs: 600 MB/s, single queue, 100K IOPS. For ML training, NVMe is often the bottleneck between storage and GPU.

#### Micro-Project OS-4.2 — "I/O Stack Benchmark"

**Build:** A benchmarking suite comparing I/O methods for ML workloads:
- Benchmark: sequential read of 10GB file using: `read()` (buffered), `mmap`, `O_DIRECT`, `io_uring` (via `liburing` Python bindings or `aiobotocore` for S3)
- Measure: throughput (GB/s), CPU utilization during I/O, latency for first byte
- Vary: block sizes (4KB to 1MB), access patterns (sequential vs random)
- Simulate ML training data loading: JPEG images from a directory, numpy arrays from .npy files
- Output: report with recommendations for each workload type

---

## ★ FLAGSHIP PROJECT 2 — "StorageScope: ML Training I/O Intelligence Layer"

> **Combines:** Pillar 4 (File Systems + I/O) + Pillar 1 (Processes) + Pillar 3 (Concurrency)  
> **Build during:** End of Week 8  
> **Difficulty:** Intermediate-Advanced Python + Linux  
> **Time investment:** 10–12 hours

### What You Build

A tool that sits between your training code and the storage layer, transparently monitoring and optimizing data loading:

**Component 1 — eBPF I/O Tracer (lite version using inotify):**
- Hooks into every `open()`, `read()`, `close()` for the training process
- Records: file path, bytes read, read latency, thread ID
- Detects: repeated reads of same file (should be cached), small reads that could be batched, random access patterns that hurt performance

**Component 2 — Dataset Cache Optimizer:**
- Analyzes access patterns from Component 1
- Automatically moves "hot" files (frequently accessed) to `/dev/shm` (tmpfs — RAM disk)
- Reports: "Moved 2.3GB of hot files to RAM. Estimated speedup: 3.2x on future epochs."

**Component 3 — DataLoader Concurrency Analyzer:**
- Monitors all DataLoader worker processes
- Reports: are workers CPU-bound (preprocessing) or I/O-bound (reading files)?
- Recommends optimal `num_workers` setting

**Component 4 — I/O Timeline Dashboard:**
- Timeline chart showing all I/O operations by all workers
- Highlights: I/O gaps (GPU waiting for data), worker stalls, cache misses

---

## Pillar 5 — Virtualization & Containers

**When:** Weeks 9–10  
**OSTEP:** Chapters 28 (Virtualization intro)  
**Primary sources:** Docker documentation, Linux namespaces man pages, cgroups v2 documentation  
**Parallel CN topic:** CN 1.7–1.8 (Topologies + Media) — both deal with isolation and multiplexing of shared physical resources

---

### OS-5.1 — Hypervisors & Hardware Virtualization

#### What It Is

**Type 1 hypervisor (bare-metal):** Runs directly on hardware. Guest OSes run on top. Examples: KVM (Linux), VMware ESXi, Xen. KVM is built into the Linux kernel — every AWS EC2 instance is a KVM VM.

**Type 2 hypervisor (hosted):** Runs on top of a host OS. Examples: VirtualBox, VMware Workstation. More overhead, used for development.

**Hardware virtualization (VT-x / AMD-V):**
- Intel VT-x / AMD-V adds a new CPU mode: **VMX root mode** for hypervisor, **VMX non-root mode** for guest.
- Guest instructions execute natively until they try a privileged operation (I/O, page table change) → **VM exit** → hypervisor takes control → emulates the operation → **VM enter** → guest resumes.
- VM exits are expensive (~1000 cycles). Minimizing them is the core hypervisor performance challenge.

**Memory virtualization:**
- **Shadow page tables:** Hypervisor maintains page tables mapping guest virtual → host physical. Expensive to maintain.
- **EPT (Extended Page Tables) / AMD NPT:** Hardware support for two-level address translation. Guest virtual → guest physical → host physical — all in hardware. Dramatically faster.

**VFIO and SR-IOV — GPU pass-through:**
- VFIO allows a VM to directly own a physical GPU (no hypervisor emulation layer).
- SR-IOV (Single Root I/O Virtualization) allows a physical NIC or GPU to present multiple "virtual functions" — each can be assigned to a different VM with near-native performance.
- This is how AWS P3/P4 GPU instances work: EC2 VM gets a virtual function of a physical NVIDIA GPU.

#### Why It Matters for AI Infra

Every cloud GPU instance is a VM with a passed-through GPU. Understanding hypervisors explains:
- Why there's ~5% GPU overhead compared to bare metal even on AWS
- Why some GPU operations trigger VM exits and cause latency spikes
- Why large memory pages (huge pages) are critical for VM performance
- Why KVM live migration of GPU instances is hard (GPU state is not easily serializable)

#### Micro-Project OS-5.1 — "VM Performance Analyzer"

**Build:** Using Python + libvirt (KVM API), create a VM management tool that:
1. Creates a lightweight KVM VM (using cloud-init for setup)
2. Monitors VM performance: vCPU steal time, memory balloon status, VM exit rate (via `perf kvm stat`)
3. Compares overhead of a computation-heavy task inside the VM vs natively
4. Reports: "CPU overhead from virtualization: 3.2%. Memory overhead: 1.1%. Recommended for ML training: use bare metal or metal instances."

---

### OS-5.2 — Linux Namespaces & cgroups: Containers from Scratch

#### What It Is

**Linux namespaces** provide isolation by giving each process (group) its own view of system resources:

| Namespace | Isolates | ML relevance |
|-----------|----------|-------------|
| `PID` | Process IDs | Container has its own PID 1. `ps` in container shows only container's processes. |
| `NET` | Network interfaces, routing | Container gets its own `eth0`. Foundation of container networking (Cilium, etc.) |
| `MNT` | Filesystem mount points | Container has its own root filesystem |
| `UTS` | Hostname and domain | Container can have its own hostname |
| `IPC` | SysV IPC, shared memory | Containers can't interfere with each other's shared memory segments |
| `USER` | User/group IDs | Container's root (UID 0) maps to unprivileged host user (rootless containers) |
| `CGROUP` | cgroup root | Container sees its own cgroup hierarchy |

**cgroups v2 (control groups):** Resource limiting and accounting for groups of processes:
- `cpu.max`: CPU bandwidth limit — `500000 1000000` means use at most 50% of one CPU core
- `memory.max`: Hard memory limit — process is OOM-killed if exceeded
- `memory.high`: Soft memory limit — triggers throttling before OOM
- `io.max`: I/O bandwidth limit per device
- `cpu.weight`: Relative CPU priority (replaces cpushares)

**Docker is namespace + cgroup + overlay filesystem + seccomp:**
- `docker run` = create namespaces + cgroup + mount overlay FS + exec process
- Docker image = a stack of OverlayFS layers (base OS → apt installs → pip installs → your code)
- Container filesystem = read-only base layers + read-write top layer

#### Why It Matters for AI Infra

**GPU resources are not cgroup-aware.** `memory.max = 32Gi` limits CPU RAM but NOT GPU VRAM. A training container can use 100% of GPU memory even with strict CPU memory limits. NVIDIA's solutions (MIG, MPS, time-slicing) are parallel resource management systems that don't integrate with standard cgroups. Understanding cgroups makes this gap obvious.

**Container CPU limits hurt ML.** Setting `cpu.max = 4` on a training container that uses PyTorch's multi-threaded BLAS (which launches `OMP_NUM_THREADS` threads) means all BLAS threads compete for 4 CPU units. The right approach: set `OMP_NUM_THREADS` inside the container to match the cgroup limit. Requires knowing how cgroup CPU limits work.

**`/dev/shm` size in containers.** Docker's default `/dev/shm` is 64MB. PyTorch uses shared memory for DataLoader worker communication. With `num_workers=8` and large batch sizes, the default `/dev/shm` fills up and DataLoader crashes. The fix: `--shm-size=8g` in `docker run`. Requires understanding that `/dev/shm` is a `tmpfs` mounted inside the container's MNT namespace.

#### How to Learn It

1. **Build a container from scratch** (no Docker): create namespaces manually using `unshare`, mount an overlay FS, `chroot` into it, set up cgroups. This is what Docker does.
2. **Read Docker's architecture documentation.** After building from scratch, it will make complete sense.
3. **Inspect a running container:** `nsenter --target [PID] --net -- ip addr` — enter the container's network namespace from the host. `cat /sys/fs/cgroup/[container-id]/memory.current` — see real memory usage.
4. **Write a Python script using `ctypes` to call `unshare(CLONE_NEWPID | CLONE_NEWNET)`** directly. You have created a namespace without any tool.

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| "Containers from Scratch" — Liz Rice (YouTube) | Talk | 35 minutes. Shows exact Linux calls Docker makes. Watch first. |
| Linux `man 7 namespaces` | Man page | Complete specification of all namespaces. |
| Linux `man 7 cgroups` | Man page | Complete cgroup v2 documentation. |
| "Container Security" — Liz Rice | Book | Deep treatment of container isolation. |
| Docker documentation: "Under the hood" | Docs | Official explanation of container internals. |

#### Micro-Project OS-5.2 — "minicontainer: Container Runtime from Scratch"

**Build:** A minimal container runtime in Python (~200 lines) that:
1. Creates PID, NET, UTS, MNT namespaces via `ctypes` calls to `unshare()`
2. Mounts an overlay filesystem (base Ubuntu layer + your read-write layer)
3. Sets cgroup limits: CPU (50%), memory (512MB), pids (50)
4. `chroot`s into the container root
5. Executes a command inside the container
6. Cleans up all namespaces and cgroups on exit

```python
#!/usr/bin/env python3
# minicontainer.py -- builds a real container
import ctypes, os, sys

# Linux constants
CLONE_NEWPID = 0x20000000
CLONE_NEWNET = 0x40000000  
CLONE_NEWUTS = 0x04000000
CLONE_NEWNS  = 0x00020000

def create_namespaces():
    libc = ctypes.CDLL("libc.so.6", use_errno=True)
    ret = libc.unshare(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWUTS | CLONE_NEWNS)
    if ret != 0: raise OSError(ctypes.get_errno(), "unshare failed")

def setup_cgroups(name, memory_mb, cpu_percent):
    # Write to /sys/fs/cgroup/...
    pass

def mount_overlay(lower_dir, upper_dir, work_dir, merge_dir):
    # mount -t overlay overlay -o lowerdir=...,upperdir=...,workdir=... merge/
    pass

def run_container(image_path, command):
    create_namespaces()
    setup_cgroups("mycontainer", memory_mb=512, cpu_percent=50)
    mount_overlay(image_path, "/tmp/upper", "/tmp/work", "/tmp/merge")
    os.chroot("/tmp/merge")
    os.execvp(command[0], command)
```

**What you learn:** After this project, Docker is not magic. It is a well-engineered wrapper around these exact syscalls. Kubernetes is a system that orchestrates millions of these containers across thousands of machines.

---

### OS-5.3 — GPU Virtualization: MIG, MPS & Time-Slicing

#### What It Is

The GPU resource management problem: a single H100 GPU costs $30,000. Giving it entirely to one small inference process is wasteful. But the GPU has no native time-sharing — one process runs until it finishes.

**NVIDIA's three solutions:**

**Time-slicing:** Kubernetes-level context switching. Each process gets a fixed time quantum on the GPU (default: 50ms). Coarser than CPU time-slicing (10ms). No memory isolation — processes share VRAM. Use case: small inference workloads that can tolerate latency jitter.

**MPS (Multi-Process Service):** Multiple CUDA processes share a single CUDA context on the GPU. The MPS daemon serializes kernel launches and merges them for efficiency. Better GPU utilization than time-slicing (no context switch overhead for each process). Still no memory isolation. Best for: many small inference workers on one GPU.

**MIG (Multi-Instance GPU):** Hardware partitioning. An H100 can be divided into up to 7 MIG instances, each with its own:
- Dedicated streaming multiprocessors (SMs)
- Dedicated HBM memory partition
- Dedicated L2 cache partition
- Hardware-enforced isolation (one instance cannot read another's memory)

MIG is the GPU equivalent of SR-IOV. Each MIG instance looks like an independent GPU to CUDA. Use case: multi-tenant ML platforms where isolation is required (different customers, different security levels).

**The cgroup analogy:**
- Time-slicing → CPU time-slicing (CFS scheduler)
- MPS → CPU threads sharing a core (hardware multithreading)
- MIG → CPU cores (fully isolated compute units)

#### Micro-Project OS-5.3 — "GPU Resource Manager"

**Build:** A GPU resource allocation simulator:
- Input: a set of ML workloads with GPU memory requirements, compute requirements, isolation requirements
- Simulate: assigning workloads to GPUs using time-slicing, MPS, and MIG strategies
- Output: GPU utilization %, average job latency, isolation score (0-100) for each strategy
- Recommendation engine: "For your workload mix, MIG with 3×3g.40gb instances achieves 87% utilization with full isolation"

---

## Pillar 6 — eBPF, Linux Internals & the GPU OS

**When:** Weeks 11–12  
**Primary resources:** "Learning eBPF" (Liz Rice), BCC tutorials, CUDA programming guide  
**This is the cutting-edge pillar — the one that makes your profile unique.**

---

### OS-6.1 — Linux System Calls & Kernel Architecture

#### What It Is

The **kernel** is the core of the OS — it runs in privileged mode (ring 0 on x86). User programs run in unprivileged mode (ring 3). **System calls** are the boundary crossing:

```
User Space                     │  Kernel Space
                               │
Python: open("file.txt")       │
  └─► glibc: open()            │
        └─► int 0x80 / syscall │──► sys_open() in kernel
                               │       └─► VFS lookup
                               │       └─► dentry/inode lookup
                               │       └─► return file descriptor
Python: fd = 5 ◄───────────────│
```

**Linux kernel subsystems you interact with daily:**
- **Process scheduler** (`kernel/sched/`) — CFS, RT, deadline
- **Memory manager** (`mm/`) — virtual memory, page allocator, slab allocator
- **VFS** (`fs/`) — virtual file system switch
- **Network stack** (`net/`) — socket layer, TCP/IP stack, netfilter
- **Device drivers** (`drivers/`) — hardware abstraction
- **Security** (`security/`) — LSM (Linux Security Modules), SELinux, AppArmor

**Key tools for observing kernel behavior:**
- `strace`: Trace every system call a process makes, with arguments and return values
- `ltrace`: Trace library calls
- `perf`: CPU performance counters, stack traces, kernel function profiling
- `ftrace`: Kernel function tracer. Trace any kernel function in real time.
- `bpftrace`: eBPF one-liners. Trace kernel internals with one command.

#### Micro-Project OS-6.1 — "syscall Tracer for ML Workloads"

**Build:** Using `strace` + Python post-processor:
1. Record all syscalls made by `python train.py` for 60 seconds: `strace -c -p [PID]`
2. Parse the output to build: syscall frequency table, top syscalls by total time, syscalls per second over time
3. Categorize syscalls by type: memory (`mmap`, `brk`), I/O (`read`, `write`, `pread`), process (`clone`, `futex`), GPU (`ioctl` to `/dev/nvidia*`)
4. Identify the `ioctl` calls to NVIDIA driver — these are every CUDA API call underneath
5. Output: "Your training process spends 23% of kernel time in `futex` (lock contention), 45% in `pread64` (data loading), 12% in `ioctl` (CUDA ops)"

---

### OS-6.2 — eBPF: The Linux Kernel Superpower

#### What It Is

**eBPF (extended Berkeley Packet Filter)** allows verified programs to run inside the Linux kernel — in networking, tracing, and security paths — without modifying kernel source code or loading kernel modules.

**How eBPF programs work:**
1. Write eBPF program in restricted C (or use Python BCC library)
2. Compile to eBPF bytecode using LLVM
3. Load into kernel via `bpf()` syscall
4. Kernel **verifier** checks: no infinite loops, no invalid memory access, no kernel panic possible
5. **JIT compiler** translates bytecode to native machine code
6. Program executes in kernel context at specific **hook points**

**eBPF hook points:**
- `kprobe` / `kretprobe` — attach to entry/return of any kernel function
- `tracepoint` — stable kernel instrumentation points
- `XDP` — before kernel networking stack (100+ Gbps packet processing)
- `tc` (traffic control) — at network device ingress/egress
- `socket filter` — filter packets at specific sockets
- `uprobe` — user-space function probes (attach to Python, CUDA functions)

**eBPF maps:** Shared data structures between eBPF program (kernel) and user-space program. Hash maps, arrays, ring buffers. This is how eBPF programs pass data to your Python analysis code.

**BCC (BPF Compiler Collection):** Python library that lets you write eBPF programs as Python strings, compile them, load them, and read their maps — all from Python. The easiest eBPF development path.

```python
from bcc import BPF

# eBPF program in C, written as Python string
program = r"""
#include <uapi/linux/ptrace.h>

BPF_HASH(counts, u32, u64);  // map: PID → syscall count

int count_syscalls(struct pt_regs *ctx) {
    u32 pid = bpf_get_current_pid_tgid() >> 32;
    u64 zero = 0, *count = counts.lookup_or_try_init(&pid, &zero);
    if (count) (*count)++;
    return 0;
}
"""

b = BPF(text=program)
b.attach_kprobe(event=b.get_syscall_fnname("read"), fn_name="count_syscalls")

# Read results from user space
import time
time.sleep(5)
for k, v in b["counts"].items():
    print(f"PID {k.value}: {v.value} read() calls")
```

#### Why It Matters for AI Infra

**Everything you want to observe in AI infrastructure uses eBPF:**
- Cilium (Kubernetes networking) = eBPF
- Falco (runtime security) = eBPF
- Pixie (zero-instrumentation observability) = eBPF
- Tetragon (Kubernetes security enforcement) = eBPF
- Parca / Polar Signals (continuous profiling) = eBPF

**Future: eBPF for GPU observability.** Research projects are extending eBPF hooks into CUDA kernel execution. This will enable zero-overhead GPU profiling without NVIDIA Nsight. If you understand eBPF now, you are positioned to use and contribute to this as it matures.

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| "Learning eBPF" — Liz Rice | Book | The definitive book. Read every chapter. |
| BCC Tutorial (github.com/iovisor/bcc/docs/tutorial.md) | Tutorial | Best hands-on intro. 14 lessons with working examples. |
| eBPF.io | Website | Official hub. Playground lets you run eBPF in browser. |
| Brendan Gregg — bpftrace one-liners | Blog | 60+ ready-to-use eBPF tracing one-liners. |
| Cilium eBPF Go library documentation | Docs | Production eBPF development. Used in Cilium. |

#### Micro-Project OS-6.2 — "ML Training eBPF Profiler"

**Build:** Using Python BCC, an eBPF profiler that monitors a PyTorch training process from kernel space:

1. **Syscall frequency monitor:** Attach to every syscall. Report top-10 syscalls by frequency and total time for the training process.

2. **I/O latency histogram:** Attach to `vfs_read` and `vfs_read_ret`. For every read on a `.pt` or `.pkl` data file, record latency. Output histogram showing distribution of read latencies.

3. **Lock contention detector:** Attach to `pthread_mutex_lock` via uprobe (user-space probe). Record: which mutex, time waiting, caller stack. Report top contentious locks.

4. **Memory allocation tracker:** Attach to `do_page_fault` (major faults) and `handle_mm_fault` (minor faults). Report page fault rate over time and which memory regions triggered them.

5. **Live dashboard:** Rich terminal UI showing all 4 metrics updating every second. Zero overhead on the training process — all instrumentation is in kernel eBPF programs.

---

### OS-6.3 — The GPU OS: CUDA Runtime & Memory Architecture

#### What It Is

The GPU is a second computer with its own "OS" — the **CUDA runtime**. Understanding it through the lens of classical OS concepts makes it immediately navigable.

**GPU Process Model:**
- CPU process → GPU CUDA Context (analogous to OS process)
- CUDA Context → multiple CUDA Streams (analogous to threads)
- CUDA Stream → sequence of CUDA Kernels (analogous to instructions)
- CUDA Kernel → Grid of Thread Blocks → Threads (the actual GPU execution units)

**GPU Scheduling (SM-level):**
- GPU has streaming multiprocessors (SMs) — H100 has 132 SMs
- Each SM runs multiple warps (groups of 32 threads) concurrently
- SM scheduler switches between warps with zero overhead (registers saved in SM register file — no context switch cost)
- This is called **latency hiding**: while one warp waits for memory, another runs

**GPU Memory Hierarchy:**
```
Registers (per-thread, fastest, ~1 cycle)
    └─► Shared Memory / L1 Cache (per-block, ~5-10 cycles, 228KB on H100)
        └─► L2 Cache (per-GPU, ~100 cycles, 50MB on H100)
            └─► HBM (Global Memory, ~400 cycles, 80GB on H100, 3.35 TB/s)
                └─► PCIe (CPU ↔ GPU, ~5000 cycles, 128 GB/s)
                    └─► NVLink (GPU ↔ GPU, ~1000 cycles, 900 GB/s on H100)
```

**Why "bank conflicts" in shared memory = "false sharing" on CPU:**
Shared memory is divided into 32 banks. If multiple threads access different addresses in the same bank simultaneously, accesses are serialized (bank conflict). Exactly analogous to CPU cache false sharing — different data, same cache line/bank.

**CUDA Unified Memory:** CUDA's `cudaMallocManaged()` creates memory accessible from both CPU and GPU. The driver migrates pages on demand (like CPU demand paging). But unlike CPU virtual memory: page migration across PCIe costs ~5000 cycles vs 1 cycle for local RAM. Understanding demand paging makes you cautious about overusing unified memory in training hot paths.

#### Best Resources

| Resource | Type | Why |
|----------|------|-----|
| NVIDIA CUDA C++ Programming Guide | Docs | The canonical reference. Read memory model section first. |
| "Programming Massively Parallel Processors" — Kirk & Hwu | Book | Best CUDA book. Memory chapters are essential. |
| Simon Boehm: "How to Optimize a CUDA Matmul Kernel" | Blog | Best practical CUDA memory optimization post. |
| Andrej Karpathy: "GPU Memory Bandwidth" lecture | Video | ML-focused GPU memory understanding. |

#### Micro-Project OS-6.3 — "GPU Memory Hierarchy Visualizer"

**Build:** A Python + PyTorch tool that empirically measures the GPU memory hierarchy:
1. **Bandwidth benchmark:** Measure memory bandwidth at each level by designing kernels that access: registers only, shared memory, L2 cache, HBM global memory. Plot the bandwidth vs memory level pyramid.
2. **Latency measurement:** Time memory accesses of increasing stride — as stride exceeds cache line size, latency jumps. Plot the latency curve to identify L1/L2/HBM boundaries.
3. **PCIe vs NVLink benchmark:** Transfer same tensor: CPU→GPU (PCIe), GPU→GPU same node (NVLink or PCIe), GPU→GPU different nodes (simulated). Compare effective bandwidth.
4. **Memory leak detector:** Track `torch.cuda.memory_allocated()` and `torch.cuda.memory_reserved()` across training steps. Plot both to show caching allocator behavior. Alert when reserved grows unboundedly (memory leak).

---

## ★ CAPSTONE PROJECT — "KernelMind: OS-Aware AI Infrastructure Monitor"

> **Combines all 6 pillars:** Processes + Memory + Concurrency + File Systems + Containers + eBPF + GPU  
> **Build during:** Weeks 11–13 (parallel with CN Flagship Project 1)  
> **This is the project that goes on your resume.**

---

### The Problem It Solves

When an ML training job is running slow, there are many possible causes: CPU bottleneck, memory pressure, I/O bottleneck, network congestion, lock contention, GPU underutilization, CUDA kernel inefficiency. Current tools force you to look at each layer separately. **KernelMind looks at all layers simultaneously and automatically identifies the root cause.**

---

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        KernelMind                               │
│                                                                 │
│  COLLECTION LAYER (all eBPF — zero instrumentation required)    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Syscall  │ │ Memory   │ │   I/O    │ │ GPU (CUDA uprobes)│   │
│  │ Tracer   │ │ Profiler │ │ Analyzer │ │ + nvidia-smi API │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘   │
│       └────────────┴────────────┴─────────────────┘            │
│                             │                                   │
│  ANALYSIS LAYER                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Bottleneck Classifier (decision tree, rule-based)     │     │
│  │  Input: 20 OS metrics → Output: bottleneck category    │     │
│  │  Categories: CPU-bound, Memory-bound, I/O-bound,       │     │
│  │  Lock-contended, GPU-compute-bound, GPU-memory-bound,  │     │
│  │  GPU-PCIe-bound, DataLoader-bound                      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  RECOMMENDATION ENGINE                                          │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Maps bottleneck → concrete fix with expected impact   │     │
│  │  "I/O-bound: increase num_workers from 4 to 8 (+23%)" │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  DASHBOARD (Rich terminal + optional Grafana)                   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐    │
│  │ OS Health │ │ GPU Util  │ │ I/O Flow  │ │ Bottleneck   │    │
│  │ Panel     │ │ Panel     │ │ Panel     │ │ Alert Panel  │    │
│  └───────────┘ └───────────┘ └───────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

### The 5 Modules

**Module 1 — Process & Thread Monitor (Pillar 1)**
- Reads `/proc/[pid]/stat`, `/proc/[pid]/status`, `/proc/[pid]/schedstat`
- Metrics: CPU%, context switch rate (voluntary/involuntary), thread count by state, run queue wait time
- Alert: "Involuntary preemptions high — your process is competing for CPU with other processes. Pin to specific cores with `taskset`."

**Module 2 — Memory Profiler (Pillar 2)**
- eBPF kprobe on `do_page_fault` — count major and minor faults per second
- Reads `/proc/[pid]/smaps` for detailed memory breakdown
- Reads `/proc/vmstat` for system-wide memory pressure
- Alert: "Major page faults detected — your dataset is not fitting in page cache. Consider reducing dataset size or adding RAM."

**Module 3 — I/O Intelligence (Pillar 4)**
- eBPF kprobe on `vfs_read` / `vfs_write` — per-file latency histogram
- Categorizes I/O: dataset reads, model checkpoint writes, log writes
- Detects: sequential vs random patterns, readahead effectiveness, page cache hit rate
- Alert: "DataLoader I/O is random-access on HDD. Convert dataset to sequential format (WebDataset/TFRecord) for 4x speedup."

**Module 4 — Container Resource Inspector (Pillar 5)**
- Reads cgroup v2 stats: `cpu.stat`, `memory.stat`, `io.stat` for the training container
- Detects: CPU throttling (container hitting CPU limit), memory pressure (approaching limit), I/O throttling
- Alert: "Container CPU is being throttled 23% of the time — increase CPU limit from 4 to 8 in your Kubernetes pod spec."

**Module 5 — GPU OS Analyzer (Pillar 6)**
- `nvidia-smi` polling: GPU utilization, memory used/free, power, temperature, SM clock
- CUDA uprobe on key CUDA functions (via eBPF): cudaMalloc frequency, kernel launch rate, PCIe transfer rate
- Detects: GPU idle (waiting for CPU), memory fragmentation, PCIe bottleneck (CPU→GPU transfers limiting throughput)
- Alert: "GPU is idle 40% of the time waiting for CPU DataLoader. Your bottleneck is NOT the GPU — fix your DataLoader."

**Module 6 — Bottleneck Classifier**
- Takes 20 metrics from all 5 modules
- Decision tree classifier (trained on synthetic labeled data representing each bottleneck type)
- Outputs: primary bottleneck type + confidence + specific recommendation + expected improvement

---

### The Experiment: OS-Aware Training Optimization

Run a standard PyTorch training job (ResNet-50 on CIFAR-10, then GPT-2 on text data) with KernelMind running. Systematically:

1. **Baseline:** Record all metrics for normal training
2. **Induce CPU bottleneck:** Set `OMP_NUM_THREADS=1`. Verify KernelMind detects it.
3. **Induce memory pressure:** Set container memory limit to 4GB. Verify detection.
4. **Induce I/O bottleneck:** Use `num_workers=0` (synchronous DataLoader). Verify detection.
5. **Induce lock contention:** Add artificial mutex in preprocessing. Verify detection.
6. **Induce GPU-PCIe bottleneck:** Move large tensors CPU↔GPU every step. Verify detection.

**Document:** For each induced bottleneck: which metrics changed, how quickly KernelMind detected it (seconds), whether the recommendation was correct.

**Output:** A GitHub repo with full code + a technical blog post: "I Built a Tool That Automatically Finds OS-Level Bottlenecks in PyTorch Training" — this is publishable and gets attention.

---

## 3-Month Daily Schedule

> **This schedule runs OS and CN simultaneously. They are not separate — they are one integrated study program.**  
> Mornings = theory (reading). Evenings = practical (code + labs). Weekends = projects.

---

### Month 1: Foundation (Weeks 1–4)

**Week 1: OS Processes + CN OSI/TCP-IP**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.4–5: Processes | Wireshark lab: capture TCP handshake. Identify every header field. |
| Tue | OSTEP Ch.6: Process API | C program: fork/exec/wait from scratch. Run, debug, understand. |
| Wed | CN: OSI model + Kurose Ch.1 | Start Micro-project CN-1.1: Packet Dissector (Scapy basics). |
| Thu | OSTEP Ch.7–8: Scheduling (FIFO, SJF, RR) | Continue CN-1.1. Add TCP flag parsing. |
| Fri | MIT 6.S081 Lecture 1 (YouTube) | Start Micro-project OS-1.1: procviz. Read /proc structure. |
| Sat | — | **PROJECT DAY:** Finish procviz basic version. Finish CN-1.1 Packet Dissector. |
| Sun | Review week. Write 1 page of notes in own words. | Plan next week. Push both projects to GitHub. |

**Week 2: OS Threads + Scheduling + CN IP/Subnetting**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.26–27: Thread API | Python thread vs process benchmark. Measure GIL effect. |
| Tue | OSTEP Ch.28: Locks intro | C: demonstrate race condition with 4 threads. Fix with mutex. |
| Wed | CN: IP addressing, binary, CIDR — Kurose Ch.4 | Subnet practice: 20 problems on subnettingpractice.org |
| Thu | OSTEP Ch.9: MLFQ scheduling | Implement MLFQ scheduler in Python (OS-1.3 micro-project). |
| Fri | CN: Subnetting VLSM | Start CN Micro-project 1.2: VPC CIDR Planner tool. |
| Sat | — | **PROJECT DAY:** Finish Scheduler Simulator (OS-1.3). Finish CIDR Planner. |
| Sun | Review. Write notes. GitHub commit. | Plan Week 3. |

**Week 3: OS Virtual Memory + CN Switching**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.13–15: Address Spaces, Memory API | C program: malloc, observe /proc/self/maps heap growth. |
| Tue | OSTEP Ch.16–17: Segmentation, Paging | Draw page table translation by hand for 3 examples. |
| Wed | CN: Switching, MAC tables, VLANs — Kurose Ch.6 | Cisco Packet Tracer: 2-switch VLAN lab. Verify isolation. |
| Thu | OSTEP Ch.18–19: TLBs, Advanced Paging | C: measure TLB miss penalty (sequential vs stride access). |
| Fri | CN: Switching, STP, 802.1Q trunking | Start CN Micro-project 1.3: VLAN Traffic Analyzer (Scapy). |
| Sat | — | **PROJECT DAY:** Start OS-2.1: memviz virtual memory visualizer. |
| Sun | Review. Notes. GitHub. | Plan Week 4. |

**Week 4: OS Page Replacement + CN Routing**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.20–22: Page replacement (FIFO, LRU, Clock) | Implement page replacement simulator (OS-2.2 micro-project). |
| Tue | OSTEP Ch.23–24: VAX/VMS, Linux VM | Read /proc/vmstat. Understand every field. Run a memory-heavy process and watch it change. |
| Wed | CN: Routing algorithms, Dijkstra, OSPF — Kurose Ch.5 | Cisco Packet Tracer: configure OSPF on 4-router topology. |
| Thu | OSTEP Ch.13: Memory Allocators | Implement malloc behavior analyzer (OS-2.3). |
| Fri | CN: BGP overview, AS concepts | Start CN Micro-project 1.4: BGP Route Simulator (NetworkX). |
| Sat | — | **PROJECT DAY:** Finish memviz (OS-2.1). Finish VLAN Analyzer (CN-1.3). |
| Sun | **MONTH 1 REVIEW:** Test yourself on all 8 checklist items from OS Pillar 1. | Write Month 1 summary. GitHub all projects. |

---

### Month 2: Depth (Weeks 5–8)

**Week 5: OS Concurrency + CN TCP Deep Dive**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.29–31: Locks, Concurrent Data Structures | C: lock-free stack using CAS. Benchmark vs mutex stack. |
| Tue | OSTEP Ch.32: Common Concurrency Problems | Python: Race condition demo suite (OS-3.1 micro-project). |
| Wed | CN: TCP deep dive — Kurose Ch.3. 3-way handshake, flow control. | Wireshark: capture and annotate a full TCP connection lifecycle. |
| Thu | OSTEP Ch.33–34: Semaphores, Monitor | Implement ML request queue with semaphores (OS-3.2 project). |
| Fri | CN: TCP congestion control, CUBIC vs BBR | Wireshark: capture TCP slow start. Plot cwnd growth. |
| Sat | — | **PROJECT DAY:** OS: finish OS-3.2 request queue. CN: start TCP visualizer (CN-1.5). |
| Sun | Review. Notes. GitHub. | Plan Week 6. |

**Week 6: OS Deadlocks + CN DNS + FLAGSHIP PROJECT 1**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.35 + supplemental: Deadlocks | Implement Resource Allocation Graph analyzer (OS-3.3). |
| Tue | Coffman conditions: work through 5 examples. Identify which condition to break for each. | CN: DNS deep dive. `dig +trace` 5 different domains. |
| Wed | CN: DNS, DHCP, NAT — Kurose + Julia Evans | Start CN Micro-project 1.6: DNS resolver from scratch (raw UDP sockets). |
| Thu | Review Pillars 1–3 (OS). Self-test on each concept. | Continue DNS resolver. Add CNAME chain following. |
| Fri | CN: TCP congestion window visualizer (finish CN-1.5) | Finish DNS resolver. Test against 8.8.8.8. |
| **Sat** | — | **FLAGSHIP PROJECT 1 DAY 1:** OScore — set up architecture, implement process monitor and memory profiler modules. |
| **Sun** | — | **FLAGSHIP PROJECT 1 DAY 2:** OScore — add I/O module, scheduler report. Integrate Rich dashboard. |

**Week 7: OS File Systems + CN File Systems Mirror**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.36–38: I/O Devices, Hard Disk, RAID | Write C program: compare sequential vs random read on SSD. Measure time. |
| Tue | OSTEP Ch.39–40: Files and Directories, FS Implementation | Read a file using ONLY open/read/lseek syscalls. Trace with strace. |
| Wed | CN: Flagship Project 1 (NetSight) planning + start | CN: Begin NetSight terminal dashboard structure. |
| Thu | OSTEP Ch.41: FFS locality + ext4 overview | ML Dataset FS Analyzer (OS-4.1 micro-project). |
| Fri | Linux I/O: page cache, mmap, O_DIRECT | Benchmark I/O methods for ML data loading (OS-4.2 project). |
| Sat | — | **PROJECT DAY:** Finish OS-4.1 and OS-4.2 micro-projects. |
| Sun | Review. Notes. GitHub. | OScore: polish, add concurrency report. Tag v1.0 on GitHub. |

**Week 8: OS + CN Flagship Projects**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | OSTEP Ch.42: journaling, log-structured FS | StorageScope planning: architecture design document. |
| Tue | io_uring: read LWN article "Ringing in a new asynchronous I/O API" | StorageScope: implement inotify-based I/O tracer. |
| Wed | CN NetSight: add DNS query logger and top talkers panel. | StorageScope: implement dataset cache optimizer. |
| Thu | StorageScope: DataLoader concurrency analyzer. | CN NetSight: add anomaly detection (2σ baseline). |
| **Sat** | — | **FLAGSHIP PROJECT 2 DAY 1:** StorageScope — integrate all components, test on real PyTorch training. |
| **Sun** | — | **FLAGSHIP PROJECT 2 DAY 2 + CN NetSight finish:** Finalize both. Write README. Push to GitHub. |

---

### Month 3: Advanced + Capstone (Weeks 9–13)

**Week 9: OS Virtualization + CN Modern Stack**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | KVM/QEMU: how hardware virtualization works | VM performance analyzer (OS-5.1 micro-project planning). |
| Tue | Linux namespaces: `man 7 namespaces` + "Containers from Scratch" talk | Build container from scratch: create PID + NET namespace with `unshare`. |
| Wed | CN: SDN concepts, control/data plane separation, Google B4 paper | Mininet install and first SDN lab. |
| Thu | cgroups v2: `man 7 cgroups` + kernel docs | Set cgroup limits for a process. Verify CPU throttling. |
| Fri | GPU virtualization: MIG, MPS, time-slicing (NVIDIA docs) | GPU Resource Manager simulator (OS-5.3). |
| Sat | — | **PROJECT DAY:** minicontainer from scratch (OS-5.2). This is the most important project of the curriculum. |
| Sun | Review. Test minicontainer. Write notes explaining every syscall you made. | GitHub push. |

**Week 10: eBPF Introduction + CN Kubernetes Concepts**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | "Learning eBPF" Ch.1–2 (Liz Rice) | Install BCC. Run bcc/examples/hello_world.py. Read every line. |
| Tue | BCC Tutorial lessons 1–5 | Write: packet counter per protocol using BCC kprobe. |
| Wed | CN: Container networking concepts, CNI introduction | K3s local setup. Deploy 2 pods. Check pod IPs. |
| Thu | BCC Tutorial lessons 6–10 | ML syscall tracer (OS-6.1 micro-project). |
| Fri | "Learning eBPF" Ch.3–4 | eBPF map types: implement per-PID I/O byte counter. |
| Sat | — | **PROJECT DAY:** I/O latency histogram with eBPF (OS-6.2 start). |
| Sun | Review. Notes. GitHub. | Plan Capstone architecture in detail. |

**Week 11: GPU OS + eBPF Advanced + Capstone Start**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | CUDA memory hierarchy (NVIDIA programming guide Ch.5) | GPU Memory Hierarchy Visualizer (OS-6.3 micro-project). |
| Tue | "Learning eBPF" Ch.5–6 | Finish OS-6.2: eBPF ML Training Profiler — syscall + I/O modules. |
| Wed | CN: gRPC, Protocol Buffers, HTTP/2 concepts | Deploy TorchServe locally. Profile its gRPC handling. |
| Thu | CUDA unified memory + PyTorch memory management | GPU memory leak detector (part of OS-6.3). |
| Fri | Plan KernelMind capstone: finalize 6 modules, data flow, dashboard layout | KernelMind: repository setup, initial architecture skeleton. |
| Sat | — | **CAPSTONE DAY 1:** KernelMind Module 1 (Process monitor) + Module 2 (Memory profiler). |
| Sun | — | **CAPSTONE DAY 2:** KernelMind Module 3 (I/O intelligence). Test on real training process. |

**Week 12: Capstone Build**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | Read: "How Pixie observes Kubernetes" (px.dev/blog) | KernelMind Module 4 (Container inspector). |
| Tue | Read: "vLLM: PagedAttention" paper (introduction + architecture) | KernelMind Module 5 (GPU analyzer). |
| Wed | CN: eBPF networking (Cilium concepts) | KernelMind Module 6 (Bottleneck classifier — decision tree). |
| Thu | Review all OS pillars. Self-test on each topic. | KernelMind: integrate all 6 modules. Single unified dashboard. |
| Fri | CN: Review all 8 CN Phase 1 topics. | KernelMind: write the 5 bottleneck induction experiments. |
| Sat | — | **CAPSTONE DAY 3:** Run all 5 experiments. Record results. Debug issues. |
| Sun | — | **CAPSTONE DAY 4:** Fix issues from experiments. Document findings. |

**Week 13: Polish, Document, Publish**

| Day | Morning (45 min) | Evening (90 min) |
|-----|-----------------|-----------------|
| Mon | Read 3 examples of technical blog posts you admire. Note their structure. | KernelMind README: architecture diagram (Excalidraw), setup instructions, demo gif. |
| Tue | CN: Review Phase 1 checklist. Verify all 8 items pass. | KernelMind blog post draft: title, problem statement, architecture, results. |
| Wed | OS: Review all 6 pillar checklists. Find gaps. Fill them. | CN Phase 1 checklist: run all micro-projects, verify they work. |
| Thu | Finalize blog post draft. | Record 5-minute KernelMind demo video (OBS or `asciinema`). |
| Fri | Final GitHub cleanup: README for every project, license, clean commit history. | LinkedIn post: "What I built in 3 months learning OS from first principles." |
| Sat | — | **REVIEW DAY:** Study for your actual OS exam. Your curriculum knowledge covers 100% of the exam. |
| Sun | — | **REFLECT:** Write a private document: what did you learn, what would you do differently, what's next (Phase 2 plan). |

---

## OS Phase Complete — Full Skills Checklist

### Pillar 1 — Processes, Threads, Scheduling
- [ ] Explain every field in a PCB and why it exists
- [ ] Write `fork()`/`exec()`/`wait()` C program from memory
- [ ] Read any process's stats from `/proc` without psutil
- [ ] Implement Round Robin and MLFQ schedulers in Python
- [ ] Explain why PyTorch DDP uses processes not threads
- [ ] Explain GIL and when to use threads vs processes vs asyncio

### Pillar 2 — Memory Management
- [ ] Draw virtual address space layout for a running process
- [ ] Explain page table walk step by step (4-level paging)
- [ ] Explain copy-on-write and why fork() is fast
- [ ] Implement LRU page replacement simulator
- [ ] Explain why GPU OOM is different from CPU OOM
- [ ] Explain what vLLM's PagedAttention borrows from virtual memory

### Pillar 3 — Concurrency & Synchronization
- [ ] Demonstrate a race condition and fix it with a mutex in C
- [ ] Implement producer-consumer with semaphores
- [ ] State all 4 Coffman conditions for deadlock
- [ ] Explain why PFC storms in RoCE networks are deadlocks
- [ ] Implement lock-free stack using CAS

### Pillar 4 — File Systems & I/O
- [ ] Explain inode vs dentry vs file object
- [ ] Explain why `mmap` is faster than `read()` for repeated access
- [ ] Explain `O_DIRECT` and when to use it
- [ ] Explain io_uring's performance advantage over `read()`
- [ ] Explain why `/dev/shm` is fast and its size matters for DataLoader

### Pillar 5 — Virtualization & Containers
- [ ] List all 7 Linux namespace types and what each isolates
- [ ] Explain cgroup v2 CPU and memory limiting
- [ ] Build a container using only Linux syscalls (minicontainer)
- [ ] Explain Docker as: namespace + cgroup + overlayfs + seccomp
- [ ] Explain GPU MIG vs MPS vs time-slicing trade-offs

### Pillar 6 — eBPF & GPU OS
- [ ] Write a working BCC Python eBPF program that traces syscalls
- [ ] Explain the eBPF verifier's role
- [ ] Trace kernel function execution with `bpftrace` one-liner
- [ ] Explain CUDA stream as GPU equivalent of OS thread
- [ ] Explain GPU SM warp scheduling as latency hiding
- [ ] Explain why GPU memory hierarchy knowledge affects ML performance

---

*OS Curriculum Version 1.0 | Semester 4, 2026 | Designed for AI/ML Infrastructure Track*
