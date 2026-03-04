# Low-Level Design & Object-Oriented Design — The Round Most Guides Skip

> Cross-validated against: Amazon SDE-I/II OOD round reports (2024-2026), Microsoft design round format, r/developersIndia campus placement data, Grokking the OOD Interview.

---

## Why This Chapter Exists

**Amazon asks OOD in every loop.** Microsoft asks it in most loops. Indian product companies (Flipkart, Swiggy, PhonePe) increasingly test it at fresher level. Yet almost no free DSA guide covers it.

LLD/OOD is NOT the same as System Design (HLD). Here is the difference:

| Dimension | LLD / OOD | HLD / System Design |
|---|---|---|
| **Scope** | One service or module — internal design | Entire distributed system |
| **Output** | Class diagrams, interfaces, interactions | Architecture diagrams, data flow, scaling |
| **Focus** | Clean code, extensibility, patterns | Scalability, availability, trade-offs |
| **When Asked** | Amazon SDE-I/II, Microsoft, Indian product cos | Google, Amazon (senior), Meta |
| **Example** | "Design a parking lot system" | "Design Instagram" |

---

## The 5-Step LLD Framework

Use this framework for EVERY LLD problem. Interviewers evaluate your process, not just the final design.

### Step 1: Clarify Requirements (2-3 minutes)

Ask questions. Never assume.

- "What are the core use cases? Any we should skip for now?"
- "Will this need to handle concurrency? Multiple users simultaneously?"
- "Any specific constraints? Maximum capacity, rate limits?"
- "Should I focus on the data model, the class hierarchy, or both?"

### Step 2: Identify Core Objects/Entities (3-5 minutes)

Extract nouns from the requirements. These become your classes.

**Example — Parking Lot:**
- Requirements mention: parking lot, floors, parking spots, vehicles, tickets, payment
- Core objects: `ParkingLot`, `ParkingFloor`, `ParkingSpot`, `Vehicle`, `Ticket`, `Payment`

### Step 3: Define Relationships & Interfaces (5-7 minutes)

- Which objects contain others? (composition)
- Which objects extend a base type? (inheritance)
- What operations does each class expose? (interface design)

### Step 4: Write the Code (15-20 minutes)

- Write class definitions with key methods
- Show how objects interact
- Handle 2-3 important edge cases in your methods

### Step 5: Discuss Extensions (3-5 minutes)

- "If we needed to add EV charging spots, how would this design accommodate that?"
- "What design pattern would help if we needed different pricing strategies?"

---

## SOLID Principles — What They Actually Mean in Practice

Don't memorize definitions. Understand the CODE SMELL each principle prevents.

### S — Single Responsibility

**Smell:** A class that changes for multiple reasons.

```cpp
// BAD — PaymentProcessor handles payments AND sends emails
class PaymentProcessor {
    void processPayment(Payment p) { /* ... */ }
    void sendReceipt(string email) { /* ... */ }  // NOT its job
};

// GOOD — separate concerns
class PaymentProcessor {
    void processPayment(Payment p) { /* ... */ }
};
class NotificationService {
    void sendReceipt(string email, Payment p) { /* ... */ }
};
```

### O — Open/Closed

**Smell:** Modifying existing code every time you add a new type.

```cpp
// BAD — adding a new vehicle type requires modifying this function
double calculateFee(Vehicle& v) {
    if (v.type == "CAR") return 10.0;
    else if (v.type == "TRUCK") return 20.0;
    // must modify here for every new type
}

// GOOD — extend by adding new classes, not modifying existing code
class Vehicle {
public:
    virtual double hourlyRate() const = 0;
    virtual ~Vehicle() = default;
};
class Car : public Vehicle {
    double hourlyRate() const override { return 10.0; }
};
class Truck : public Vehicle {
    double hourlyRate() const override { return 20.0; }
};
// New type? Add a new class. Existing code untouched.
```

### L — Liskov Substitution

**Smell:** A subclass that breaks the parent's contract.

```cpp
// BAD — Square inherits Rectangle but violates width/height independence
class Rectangle {
public:
    virtual void setWidth(int w) { width = w; }
    virtual void setHeight(int h) { height = h; }
    int area() { return width * height; }
protected:
    int width, height;
};
class Square : public Rectangle {
    void setWidth(int w) override { width = w; height = w; }   // VIOLATES contract
    void setHeight(int h) override { height = h; width = h; }  // Rectangle users expect independent w/h
};
```

### I — Interface Segregation

**Smell:** A class forced to implement methods it doesn't use.

```cpp
// BAD — ElectricCar must implement refuel() which makes no sense
class IVehicle {
    virtual void drive() = 0;
    virtual void refuel() = 0;   // Not all vehicles refuel
    virtual void charge() = 0;   // Not all vehicles charge
};

// GOOD — split into focused interfaces
class IDriveable { virtual void drive() = 0; };
class IFuelable { virtual void refuel() = 0; };
class IChargeable { virtual void charge() = 0; };

class ElectricCar : public IDriveable, public IChargeable { /* ... */ };
class GasCar : public IDriveable, public IFuelable { /* ... */ };
```

### D — Dependency Inversion

**Smell:** High-level modules depending on concrete low-level implementations.

```cpp
// BAD — ParkingLot directly depends on MySQLDatabase
class ParkingLot {
    MySQLDatabase db;  // tightly coupled
};

// GOOD — depend on abstraction
class IDatabase {
public:
    virtual void save(const Ticket& t) = 0;
};
class ParkingLot {
    unique_ptr<IDatabase> db;  // can be MySQL, Postgres, in-memory — doesn't matter
public:
    ParkingLot(unique_ptr<IDatabase> database) : db(move(database)) {}
};
```

---

## Design Patterns That Actually Appear in Interviews

Master these 4. They cover 90% of OOD interview situations.

| Pattern | When It Appears | Interview Example |
|---|---|---|
| **Strategy** | Different algorithms/behaviors swappable at runtime | Parking lot pricing: hourly, flat-rate, weekend rate |
| **Observer** | Notify multiple objects when state changes | Notification system: email, SMS, push when order status changes |
| **Factory** | Creating objects without exposing instantiation logic | Vehicle factory: creates Car, Truck, Bike based on type string |
| **Singleton** | Exactly one instance needed globally | Database connection pool, configuration manager |

### Strategy Pattern — Worked Example

```cpp
// Different pricing strategies, swappable
class IPricingStrategy {
public:
    virtual double calculate(int hours) const = 0;
    virtual ~IPricingStrategy() = default;
};

class HourlyPricing : public IPricingStrategy {
public:
    double calculate(int hours) const override { return hours * 10.0; }
};

class FlatRatePricing : public IPricingStrategy {
public:
    double calculate(int hours) const override { return 50.0; }
};

class ParkingLot {
    unique_ptr<IPricingStrategy> pricing;
public:
    void setPricing(unique_ptr<IPricingStrategy> p) { pricing = move(p); }
    double computeFee(int hours) { return pricing->calculate(hours); }
};
```

---

## 5 Classic LLD Problems — Complete Walkthroughs

### Problem 1: Parking Lot System

> **Frequency:** Amazon (#1 OOD question), Microsoft, Flipkart

**Requirements (after clarification):**
- Multi-floor parking lot with different spot sizes (compact, regular, large)
- Vehicles: motorcycle, car, truck (truck needs large spot)
- Ticket issued on entry, payment on exit
- Track available spots per floor

**Core Classes:**

```cpp
enum class VehicleType { MOTORCYCLE, CAR, TRUCK };
enum class SpotType { COMPACT, REGULAR, LARGE };

class ParkingSpot {
    int id;
    SpotType type;
    bool occupied = false;
public:
    bool canFit(VehicleType vt) const;
    void occupy() { occupied = true; }
    void release() { occupied = false; }
};

class ParkingFloor {
    int floorNumber;
    vector<ParkingSpot> spots;
public:
    ParkingSpot* findAvailableSpot(VehicleType vt);
    int availableCount(SpotType type) const;
};

class Ticket {
    int id;
    VehicleType vehicleType;
    ParkingSpot* spot;
    time_t entryTime;
public:
    int getSpotId() const { return spot->id; }
};

class ParkingLot {
    vector<ParkingFloor> floors;
    unordered_map<int, Ticket> activeTickets;
    unique_ptr<IPricingStrategy> pricing;
public:
    Ticket* enter(VehicleType type);    // find spot, create ticket
    double exit(int ticketId);          // calculate fee, release spot
};
```

**Key design decisions to discuss:**
- Why composition (ParkingLot HAS floors) not inheritance
- How to make spot-finding O(1): maintain a `set<ParkingSpot*>` per SpotType per floor
- Strategy pattern for pricing (hourly vs flat vs weekend)
- Thread safety: mutex on `enter()` and `exit()` if concurrent

---

### Problem 2: Library Management System

> **Frequency:** Amazon, Microsoft, Indian product companies

**Core entities:** `Library`, `Book`, `Member`, `Librarian`, `BookItem` (physical copy), `Reservation`, `Fine`

**Key insight:** Separate `Book` (title/author/ISBN metadata) from `BookItem` (physical copy with barcode and status). One Book has many BookItems.

```cpp
enum class BookStatus { AVAILABLE, BORROWED, RESERVED, LOST };

class Book {
    string ISBN, title, author;
    vector<BookItem*> copies;
};

class BookItem {
    string barcode;
    BookStatus status = BookStatus::AVAILABLE;
    time_t dueDate;
public:
    bool checkout(Member* m);
    void returnItem();
};

class Member {
    static const int MAX_BOOKS = 5;
    vector<BookItem*> borrowed;
public:
    bool canBorrow() const { return borrowed.size() < MAX_BOOKS; }
    void borrow(BookItem* item);
    double returnBook(BookItem* item);  // returns fine amount
};
```

---

### Problem 3: Online Booking System (BookMyShow)

> **Frequency:** Flipkart, Swiggy, PhonePe, Indian product companies

**Core entities:** `Cinema`, `Screen`, `Show`, `Seat`, `Booking`, `Payment`

**Key design challenge:** Seat-locking during concurrent bookings — two users selecting same seats simultaneously.

**Solution:** Temporary lock with TTL (5-minute hold while user completes payment). Use `SeatLock` with expiry timestamp.

```cpp
class Seat {
    int row, col;
    SeatType type;  // REGULAR, PREMIUM, VIP
};

class Show {
    Movie movie;
    Screen screen;
    time_t startTime;
    unordered_map<int, SeatStatus> seatStatusMap;
public:
    bool lockSeats(vector<int> seatIds, string userId);
    bool confirmBooking(string userId, Payment payment);
    void releaseExpiredLocks();  // called periodically
};
```

---

### Problem 4: Chess Game

> **Frequency:** Microsoft, Google

**Core entities:** `Game`, `Board`, `Piece` (abstract), `King`, `Queen`, `Rook`, `Bishop`, `Knight`, `Pawn`, `Player`, `Move`

**Key insight:** Each `Piece` implements `isValidMove(Board, from, to)` differently — classic polymorphism.

```cpp
class Piece {
    Color color;
public:
    virtual bool isValidMove(const Board& board, Position from, Position to) const = 0;
    virtual ~Piece() = default;
};

class Knight : public Piece {
    bool isValidMove(const Board& board, Position from, Position to) const override {
        int dx = abs(to.row - from.row), dy = abs(to.col - from.col);
        return (dx == 2 && dy == 1) || (dx == 1 && dy == 2);
    }
};
```

---

### Problem 5: Elevator System

> **Frequency:** Amazon, Microsoft

**Core entities:** `ElevatorSystem`, `Elevator`, `Request`, `Direction`

**Key design challenge:** Scheduling algorithm — SCAN (elevator algorithm), LOOK, or shortest-seek-first.

```cpp
class Elevator {
    int currentFloor = 0;
    Direction direction = Direction::UP;
    set<int> upRequests, downRequests;
public:
    void addRequest(int floor);
    void move();  // process next floor in current direction
    void switchDirectionIfNeeded();
};

class ElevatorSystem {
    vector<Elevator> elevators;
public:
    void handleRequest(int fromFloor, Direction dir);  // assign to nearest elevator going same direction
};
```

---

## LLD Interview Cheat Sheet

| When Interviewer Says... | They Mean... |
|---|---|
| "Walk me through your design" | Start with core objects and relationships, then show method signatures |
| "How would you extend this?" | Show Open/Closed principle — new feature = new class, not modified existing class |
| "What if two users do this simultaneously?" | Discuss concurrency: mutex, optimistic locking, or seat-lock with TTL |
| "Is there a design pattern that fits here?" | Strategy for interchangeable behavior, Observer for event notification, Factory for object creation |
| "How would you test this?" | Unit test each class independently. Mock dependencies. Test edge cases. |

---

## Practice Plan

- [ ] Design Parking Lot from scratch in 30 minutes (no reference)
- [ ] Design Library Management System — focus on Book vs BookItem distinction
- [ ] Design BookMyShow — focus on concurrent seat booking
- [ ] Design Chess — focus on Piece polymorphism
- [ ] Design Elevator — focus on scheduling algorithm
- [ ] Review: can you explain SOLID violations in your own past code?

---

**Next → [System Design Primer](./system-design-primer.md)**
