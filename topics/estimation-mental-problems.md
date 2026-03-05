# Estimation and Mental Problems

> Estimation questions test structured thinking under ambiguity.

---

## 1) 4-Step Estimation Flow

1. Define scope and assumptions.
2. Choose rounded baseline values.
3. Compute in chunks.
4. State confidence range and bottlenecks.

---

## 2) Worked Example (Photo Storage)

Question: estimate storage for 10M users uploading 2 photos/day for 1 year.

1. Assume 1 photo = 2 MB.
2. Daily uploads = 10M * 2 = 20M photos.
3. Daily storage = 20M * 2 MB = 40M MB ~= 40 TB/day.
4. Yearly storage ~= 40 TB * 365 ~= 14.6 PB/year.
5. Mention replication factor (e.g., x3) if required -> ~43.8 PB effective.

---

## 3) Common Failure Modes and Fixes

| Failure mode | Why it hurts | Fix |
|---|---|---|
| No assumptions stated | Numbers look arbitrary | Speak assumptions first |
| Wrong unit conversion | Large order-of-magnitude errors | Convert units at every step |
| Overprecision | Wastes time | Use rounded values intentionally |
| No sanity check | Miss obvious mistakes | Final 10-second range check |

---

## 4) Weekly Practice Set

1. QPS estimate for a chat app.
2. Storage estimate for logs.
3. Bandwidth estimate for video stream.

Write assumptions and final range for each.

---

## 5) Next Chapter

Go to [AI-Era Interview Mastery](./ai-era-mastery.md)
