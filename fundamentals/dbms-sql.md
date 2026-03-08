# DBMS & SQL - The Backend Interview Core

> Most candidates either memorize DBMS definitions or only practice SQL syntax. Interviews punish both extremes.

---

## 1) What Actually Gets Asked

Across US, Europe, and India, the highest-frequency DBMS asks are:

1. Write a SQL query with joins, filtering, grouping, sorting, or subqueries.
2. Explain when an index helps and when it does not.
3. Explain ACID and transaction isolation with a real example.
4. Compare normalization vs denormalization.
5. Reason about schema choices for a simple product flow.

For many backend roles, SQL and indexing matter more than textbook database architecture.

---

## 2) The 80/20 Topics

| Topic | What you must know | What good interview signal sounds like |
|---|---|---|
| Keys and relationships | primary key, foreign key, one-to-many | "Orders join back to users on user_id; the foreign key keeps the relation explicit." |
| SQL | SELECT, JOIN, WHERE, GROUP BY, HAVING, ORDER BY | "Filter first, then aggregate, then sort only what remains." |
| Indexes | why they speed reads, why they cost writes, selectivity | "An index helps when the query filters to a small subset, not when almost every row matches." |
| Transactions | ACID at practical level | "Atomicity prevents half-written state; isolation prevents bad concurrent reads/writes." |
| Isolation | read committed, repeatable read, serializable at a practical level | "Higher isolation prevents anomalies but usually costs concurrency." |
| Schema tradeoffs | normalization vs denormalization | "Normalize for correctness and maintainability, denormalize for read-heavy performance when justified." |

---

## 3) The Fast Answer Framework

When asked a DBMS theory question, use this flow:

1. Define the concept in one line.
2. Give one concrete product example.
3. State the tradeoff.
4. Mention the failure mode if used badly.

Example:

Question: "Why use an index?"

Answer shape:

1. "An index is an auxiliary structure that helps the database find rows faster without scanning the entire table."
2. "If I frequently query orders by user_id and created_at, indexing those columns can reduce lookup work."
3. "The tradeoff is extra storage and slower inserts or updates."
4. "If the column has very low selectivity, the index may not help much."

---

## 4) Worked SQL Example

Assume:

```text
users(id, name, city)
orders(id, user_id, amount, status, created_at)
```

Question:

"Return the top 3 users by paid order count in the last 30 days."

One clean answer:

```sql
SELECT
  u.id,
  u.name,
  COUNT(*) AS paid_order_count
FROM users u
JOIN orders o
  ON o.user_id = u.id
WHERE o.status = 'paid'
  AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.name
ORDER BY paid_order_count DESC
LIMIT 3;
```

What you should say while writing it:

1. "I join users to orders on the foreign key."
2. "I filter to paid orders and recent time first."
3. "Then I group by user and count."
4. "Then I sort descending and take top 3."

Possible index discussion:

1. `orders(user_id, created_at)` helps if the query often starts from a user.
2. `orders(status, created_at)` may help if status and recency are selective.
3. Index choice depends on actual query mix and cardinality, not guesswork.

---

## 5) Worked Transaction Example

Question:

"Why do isolation levels matter?"

Use a ticket-booking example:

1. Two users try to book the last seat.
2. Transaction A reads "1 seat left."
3. Transaction B reads "1 seat left."
4. Both write back successfully if concurrency control is weak.
5. Now you oversold the seat.

What to say:

1. "Isolation controls how much concurrent transactions can interfere."
2. "Lower isolation gives more concurrency but can allow anomalies."
3. "Higher isolation prevents more anomalies but usually reduces throughput."

A safe interview-level simplification:

1. `READ COMMITTED`: avoids reading uncommitted garbage, but repeat reads may change.
2. `REPEATABLE READ`: repeated reads stay stable inside the transaction, but some phantom-style issues depend on the engine.
3. `SERIALIZABLE`: strongest mental model; transactions behave as if run one by one.

Do not bluff engine-specific edge cases unless you are sure.

---

## 6) Common Questions You Must Answer Cleanly

### A) Normalization vs Denormalization

Say:

1. "Normalization reduces redundancy and improves correctness."
2. "Denormalization duplicates data intentionally to improve read performance or simplify hot queries."
3. "I start normalized, then denormalize only when a real query pattern justifies it."

### B) Clustered vs Secondary Index

Say:

1. "The clustered index affects the physical row ordering in storage."
2. "Secondary indexes are separate lookup structures."
3. "You usually get only one clustered order, so choose it carefully."

If your target database does not use the term the same way, say "engine-dependent details vary."

### C) Why `SELECT *` Is Often Bad

Say:

1. "It pulls unnecessary data."
2. "It increases network and memory cost."
3. "It can block index-only access patterns."
4. "Explicit columns are safer and clearer."

---

## 7) What Different Markets Care About

1. US big tech:
   - expects clean SQL reasoning and practical tradeoffs
   - rarely rewards textbook dumping
2. Europe product and fintech:
   - often cares about query behavior, indexes, API/data access patterns
   - practical backend reasoning matters
3. India product and placement interviews:
   - often asks direct SQL writing plus ACID, normalization, joins, and indexing
   - short viva-style answers matter a lot

So train both:

1. handwritten SQL
2. spoken theory answers

---

## 8) Weekly Drill

Do this once this week:

1. Write 5 SQL queries without autocomplete.
2. Explain 3 index choices and why one of them is bad.
3. Answer ACID, normalization, and isolation out loud.
4. Design one simple schema:
   - users
   - products
   - orders
   - payments

If you cannot do this in one sitting, you do not own the chapter yet.

---

## 9) Next Chapter

Go to [Operating Systems](./operating-systems.md)
