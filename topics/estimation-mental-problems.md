# Estimation And Mental Problems

> Estimation questions test structured thinking under ambiguity.

---

## 1) When This Gets Asked

These questions appear in:

1. system design rounds
2. product-thinking rounds
3. some backend and analytics-heavy interviews

They are rarely about the exact final number. They are about whether your reasoning stays stable.

---

## 2) The 4-Step Estimation Flow

1. Define scope and assumptions.
2. Choose rounded baseline values.
3. Compute in chunks.
4. State confidence range and bottlenecks.

---

## 3) Worked Example (Photo Storage)

Question: estimate storage for 10M users uploading 2 photos/day for 1 year.

1. Assume 1 photo = 2 MB.
2. Daily uploads = 10M * 2 = 20M photos.
3. Daily storage = 20M * 2 MB = 40M MB which is about 40 TB/day.
4. Yearly storage is about 40 TB * 365 which is about 14.6 PB/year.
5. If replication factor is 3, effective storage is about 43.8 PB/year.

What a good answer sounds like:

1. "I will round where possible."
2. "I will state every assumption."
3. "I will sanity-check the final magnitude."

---

## 4) Common Failure Modes And Fixes

| Failure mode | Why it hurts | Fix |
|---|---|---|
| No assumptions stated | Numbers look arbitrary | Speak assumptions first |
| Wrong unit conversion | Large order-of-magnitude errors | Convert units at every step |
| Overprecision | Wastes time | Use rounded values intentionally |
| No sanity check | Miss obvious mistakes | Final 10-second range check |

---

## 5) Weekly Practice Set

1. QPS estimate for a chat app.
2. Storage estimate for logs.
3. Bandwidth estimate for a video stream.

For each one:

1. write assumptions
2. compute in chunks
3. state the final range
4. say what can change the answer most

---

## 6) Next Chapter

Go to [AI-Era Interview Mastery](./ai-era-mastery.md)
