# LLD and OOD Design - Clean Object Modeling

> LLD rounds test whether you can structure code that survives change.

---

## 1) Core Principles

1. Single responsibility.
2. Open/closed.
3. Dependency inversion.
4. Composition over inheritance.

---

## 2) Practical LLD Flow

1. Clarify scope and constraints.
2. Identify entities and responsibilities.
3. Define interfaces first.
4. Model relationships.
5. Walk one end-to-end use case.

---

## 3) Worked Example (Parking Lot)

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
   - adding EV charging slots without changing payment code

---

## 4) Common Failure Modes and Fixes

| Failure mode | Fix |
|---|---|
| Huge God class for all logic | Split by responsibilities and services |
| No interface boundaries | Add strategy/service abstractions |
| Inheritance everywhere | Prefer composition and delegated behavior |
| No walkthrough | Always trace one concrete use case |

---

## 5) Weekly Drill

1. Pick one LLD problem.
2. Draw class/interface model in 20 minutes.
3. Code only core interfaces + one flow.

---

## 6) Next Chapter

Go to [Estimation and Mental Math](./estimation-mental-problems.md)
