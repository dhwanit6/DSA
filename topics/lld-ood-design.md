# LLD And OOD Design - Clean Object Modeling

> LLD rounds test whether you can structure code that survives change.

---

## 1) When This Gets Asked

LLD shows up most in:

1. Indian product companies
2. backend and platform interviews
3. companies that want practical coding design, not only whiteboard architecture

It is less about patterns-by-name and more about responsibility boundaries.

---

## 2) Core Principles

1. Single responsibility.
2. Open/closed.
3. Dependency inversion.
4. Composition over inheritance.

If you memorize SOLID but still build one giant class, the round is lost.

---

## 3) Practical LLD Flow

1. Clarify scope and constraints.
2. Identify entities and responsibilities.
3. Define interfaces first.
4. Model relationships.
5. Walk one end-to-end use case.

---

## 4) Worked Example (Parking Lot)

1. Entities:
   - ParkingLot
   - Floor
   - Slot
   - Ticket
   - PaymentService
2. Key interfaces:
   - SlotAllocationStrategy
   - PaymentGateway
3. Flow:
   - vehicle arrives -> find slot -> create ticket
   - vehicle exits -> compute fee -> process payment -> release slot
4. Extension point:
   - add EV charging slots without rewriting payment code

What interviewers want to hear:

1. why a class exists
2. why an interface exists
3. where change is expected

---

## 5) Common Failure Modes And Fixes

| Failure mode | Fix |
|---|---|
| Huge God class for all logic | Split by responsibilities and services |
| No interface boundaries | Add strategy/service abstractions |
| Inheritance everywhere | Prefer composition and delegated behavior |
| No walkthrough | Always trace one concrete use case |

---

## 6) Weekly Drill

1. Pick one LLD problem.
2. Draw class/interface model in 20 minutes.
3. Code only core interfaces + one flow.
4. Explain one extension you can add without rewriting the whole design.

---

## 7) Next Chapter

Go to [Estimation and Mental Math](./estimation-mental-problems.md)
