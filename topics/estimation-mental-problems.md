# 💡 Estimation & Mental Problems — The Questions Standard DSA Prep Misses

---

## Numbers to Memorize Cold

### Powers of 2 (Your Mental Calculator)

| Power | Value | Approximate | Anchor |
|---|---|---|---|
| 2^10 | 1,024 | ~1 Thousand | 1 KB |
| 2^20 | 1,048,576 | ~1 Million | 1 MB |
| 2^30 | 1,073,741,824 | ~1 Billion | 1 GB |
| 2^32 | 4,294,967,296 | ~4 Billion | Max unsigned int |
| 2^40 | | ~1 Trillion | 1 TB |

**Usage:** "Can I store N items in a hash map?" → If N ≤ 10^8, that's ~400 MB (4 bytes × 10^8). Fits in RAM. If N = 10^10, that's 40 GB. Doesn't fit.

### Latency Numbers Every Programmer Should Know

| Operation | Time | Relative |
|---|---|---|
| L1 cache access | 0.5 ns | Baseline |
| L2 cache access | 7 ns | 14× L1 |
| RAM access | 100 ns | 200× L1 |
| SSD read (4KB) | 100 μs | 200,000× L1 |
| HDD read | 10 ms | 20,000,000× L1 |
| Network roundtrip (same datacenter) | 500 μs | |
| Network roundtrip (cross-continent) | 150 ms | |

### Storage and Throughput

| Resource | Value |
|---|---|
| Server RAM (typical) | 64-256 GB |
| SSD throughput (NVMe) | 3-5 GB/s |
| Network bandwidth (datacenter) | 10-25 Gbps |
| Requests per server | 10K-50K RPS (simple reads) |
| 1 day | 86,400 seconds |
| 1 year | ~31.5 million seconds (~π × 10^7) |

---

## The 6 Mental Problem Patterns (With Worked Math)

### Pattern 1: File Doesn't Fit in RAM → External Sort / MapReduce

**Example:** "Count word frequencies in a 5TB text file."

**Worked calculation:**
- 5 TB file. Max server RAM = 256 GB. File is ~20× RAM.
- **Step 1:** Split file into 256 GB chunks → ~20 chunks.
- **Step 2:** For each chunk, load into RAM, build frequency map, write sorted `(word, count)` pairs to disk.
- **Step 3:** Merge 20 sorted files using a min-heap of size 20. When same word appears in multiple files, sum counts.
- **Complexity:** O(N log K) where N = total words, K = number of chunks.

**MapReduce variant:**
- Map: Each worker processes one chunk, emits `(word, 1)` pairs.
- Shuffle: Framework groups all pairs by key (word).
- Reduce: Sum counts per word.

### Pattern 2: Find Duplicates in Huge Data → Bloom Filter / Hashing

**Example:** "Detect duplicate URLs across 10 billion web pages."

**Worked calculation:**
- 10 billion URLs, average 100 bytes each = 1 TB of URL data.
- Hash set approach: 10B entries × 108 bytes (URL + hash table overhead) ≈ 1 TB RAM. Too much for one server.
- **Bloom filter:** 10B elements at 1% false positive rate → ~9.6 bits per element → 10B × 9.6 bits = ~12 GB. Fits easily in one server's RAM.
- **Trade-off:** 1% false positive (acceptable — re-check positives against disk).

### Pattern 3: Count Unique Items in Stream → HyperLogLog

**Example:** "Count unique visitors from 10 billion daily requests."

**Worked calculation:**
- Exact hash set: if 500M unique visitors × 8 bytes = 4 GB. Borderline possible but expensive at scale.
- **HyperLogLog:** Uses ~1.5 KB memory regardless of cardinality. ~2% standard error. Used by Redis `PFCOUNT`, Google BigQuery.
- 10 billion requests → 500M unique visitors → HyperLogLog reports ~490M-510M. Good enough for analytics.

### Pattern 4: Capacity Estimation

**Example:** "Twitter has 500 million tweets per day. How many servers for the write path?"

**Worked calculation:**
- 500M tweets / 86,400 sec ≈ **5,800 tweets per second** (TPS) average.
- Peak traffic = 3× average = **~17,400 TPS**.
- Each tweet write: validate + store + fanout. Assume 5ms per write → one server handles 200 writes/sec.
- Servers needed: 17,400 / 200 = **87 servers** for peak.
- Add N+1 redundancy and geographic distribution → **~100-120 servers**.

### Pattern 5: Storage Capacity Estimation

**Example:** "How much storage does WhatsApp need for messages per year?"

**Worked calculation:**
- 2 billion users. 100 billion messages per day (WhatsApp's reported number).
- Average message size: 100 bytes (text) + 200 bytes metadata = 300 bytes.
- Daily: 100B × 300B = **30 TB per day**.
- Monthly: 30 TB × 30 = **900 TB per month**.
- Yearly: 900 TB × 12 = **~10.8 PB per year** (text messages only).
- With 3× replication: **~32 PB per year**.
- Media (images, videos) dominates: ~30× text → **~300 PB per year** total.

### Pattern 6: Top K Most Frequent → Count-Min Sketch + Heap

**Example:** "Find the top 10 trending hashtags from 1 billion tweets."

**Offline algorithm:**
```
1. Build frequency map: O(N) time, O(K) space where K = unique hashtags
2. Use min-heap of size 10: iterate through frequencies
   - If heap size < 10: push
   - If current count > heap top: pop and push
3. Total: O(N + K log 10) ≈ O(N)
```

**Streaming algorithm:**
- Count-Min Sketch: O(1) per update, ~fixed memory, approximate counts
- Maintain min-heap of size 10 over sketch estimates
- Trade-off: approximate but handles infinite stream in constant memory

---

## Practice Problems

1. **Easy:** "How many piano tuners are in Chicago?" (Classic Fermi estimation)
   - Chicago population: ~2.7M → ~1M households → ~10% have pianos → 100K pianos
   - Each piano tuned once/year → 100K tunings/year
   - Each tuner does 4 tunings/day × 250 work days = 1,000/year
   - Answer: ~100 piano tuners

2. **Medium:** "How much storage for a YouTube-like video platform with 1 million videos uploaded daily?"
   - Hint: Average video = 10 min at 720p ≈ 500 MB. But encode at multiple resolutions (360p, 720p, 1080p) ≈ 1.5 GB total. 1M × 1.5 GB = 1.5 PB/day.

3. **Hard:** "Design the storage system for Google Maps tile data."
   - Hint: Earth surface ≈ 510M km². At zoom level 18, each tile ≈ 150m × 150m. How many tiles? What resolution? What compression?

---

**Next → [System Design Primer](./system-design-primer.md)**
