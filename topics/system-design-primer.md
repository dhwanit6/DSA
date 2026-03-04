# System Design Primer — What Freshers Now Need to Know

> System design is now expected at fresh grad level at Google, Amazon, and Indian product companies (Flipkart, Swiggy, PhonePe, Meesho).

---

## The 4-Step Fresher Framework

### Step 1: Clarify Requirements (3-5 min)
- **Functional:** "What should the system DO?" — list 3-5 core features
- **Non-functional:** "How many users? Read-heavy or write-heavy? Latency requirements?"
- **Scale:** "Millions of users? TB of data?"
- **Out of scope:** Explicitly state what you're NOT designing — shows maturity

### Step 2: High-Level Design (10 min)
- Draw core components: Client → Load Balancer → App Servers → Cache → Database
- Identify data flow: read path vs write path (these are almost always different)
- Choose protocols: REST for CRUD, WebSocket for real-time, gRPC for microservice-to-microservice

### Step 3: Component Deep-Dive (15 min)
- Database schema design
- API design with endpoints
- Caching strategy (what to cache, TTL, invalidation)
- Focus on the HARDEST component — this is where you differentiate

### Step 4: Scale & Trade-offs (5-10 min)
- Horizontal scaling, sharding, replication
- CAP theorem implications for your design
- Bottleneck identification: "The bottleneck would be writes to the database, so I'd add a message queue to buffer writes"

---

## 10 Core Concepts

| Concept | One-Line Definition | When to Use |
|---|---|---|
| **Horizontal Scaling** | Add more machines to handle more traffic | Always — default scaling strategy |
| **Load Balancer** | Distribute requests across servers | Between client and app servers |
| **Caching (Redis/Memcached)** | In-memory KV store, microsecond reads | Read-heavy data that doesn't change often |
| **CDN** | Serve static files from servers near the user | Images, CSS, JS, video thumbnails |
| **Database Sharding** | Split data across DB instances by key | When single DB can't handle the load |
| **Consistent Hashing** | Distribute keys with minimal reshuffling | Cache clusters, DB sharding |
| **CAP Theorem** | Choose 2: Consistency, Availability, Partition Tolerance | Every distributed system design discussion |
| **Message Queue (Kafka/RabbitMQ)** | Async event stream — decouple producers and consumers | Write-heavy: buffer writes, email notifications, analytics |
| **Rate Limiting** | Token bucket or sliding window — cap requests per user | API endpoints, login attempts |
| **SQL vs NoSQL** | ACID + schema vs horizontal scale + flexibility | SQL for relational data; NoSQL for documents, time-series, key-value |

---

## Database Schema Design — What Interviewers Actually Want

Freshers at Flipkart, Swiggy, PhonePe are asked to design schemas. Here's what "good" looks like:

### Example: E-Commerce Order System

```sql
-- Users table
CREATE TABLE users (
    user_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    product_id  BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    stock       INT DEFAULT 0,
    category_id BIGINT REFERENCES categories(category_id)
);

-- Orders table (one-to-many with order_items)
CREATE TABLE orders (
    order_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL REFERENCES users(user_id),
    total       DECIMAL(10, 2) NOT NULL,
    status      ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    created_at  TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_orders (user_id, created_at)  -- for "my orders" queries
);

-- Order items (many-to-many: orders ↔ products)
CREATE TABLE order_items (
    item_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id    BIGINT NOT NULL REFERENCES orders(order_id),
    product_id  BIGINT NOT NULL REFERENCES products(product_id),
    quantity    INT NOT NULL,
    unit_price  DECIMAL(10, 2) NOT NULL  -- snapshot at time of order
);
```

**Key design decisions to discuss:**
- `unit_price` in order_items is a SNAPSHOT — product price can change, but order shouldn't
- Composite index `(user_id, created_at)` for the "my orders" page query
- `ENUM` for status — finite set of values, enforced at DB level
- `DECIMAL(10,2)` for money — never use `FLOAT` for currency

---

## API Design — RESTful Endpoints

```
# Create order
POST /api/v1/orders
Body: { "items": [{"product_id": 123, "quantity": 2}] }
Response: 201 Created, { "order_id": 456, "total": 59.98, "status": "PENDING" }

# Get user's orders (paginated)
GET /api/v1/users/{user_id}/orders?page=1&limit=20
Response: 200 OK, { "orders": [...], "total": 45, "page": 1 }

# Get order details
GET /api/v1/orders/{order_id}
Response: 200 OK, { "order_id": 456, "items": [...], "status": "SHIPPED" }

# Cancel order
PATCH /api/v1/orders/{order_id}
Body: { "status": "CANCELLED" }
Response: 200 OK
```

**What interviewers look for:**
- Proper HTTP methods (POST for create, GET for read, PATCH for partial update)
- Versioned API (`/v1/`)
- Pagination for list endpoints
- Consistent response format

---

## Back-of-Envelope Calculations Template

**Example: "Design a basic Twitter — estimate storage."**

```
Given:
- 500M total users, 200M daily active users (DAU)
- Average user sends 2 tweets/day
- Average tweet: 280 chars × 2 bytes (UTF-8 avg) = 560 bytes
- Metadata per tweet: user_id (8B) + timestamp (8B) + tweet_id (8B) + indexes ≈ 200B
- Total per tweet: 560 + 200 = ~760B ≈ 1 KB (round up for safety)

Daily tweets: 200M × 2 = 400M tweets/day
Daily storage: 400M × 1KB = 400 GB/day
Monthly: 400 GB × 30 = 12 TB/month
Yearly: 12 TB × 12 = 144 TB/year

With 3× replication: ~430 TB/year (text only)
Media (images): If 10% of tweets have images (avg 500KB):
  40M × 500KB = 20 TB/day → 600 TB/month → 7.2 PB/year
```

---

## 5 Classic Problems — Structured Walkthroughs

### 1. URL Shortener (bit.ly)
- **Write path:** User submits long URL → generate 7-char Base62 code → store `{shortCode: longURL}` in NoSQL → return short URL
- **Read path:** User clicks short URL → lookup in cache (Redis) → if miss, lookup in DB → 301 redirect
- **Encoding:** Base62 (a-z, A-Z, 0-9) = 62^7 ≈ 3.5 trillion unique URLs
- **Scale:** Cache aggressively (95%+ read-heavy). Shard DB by shortCode hash.

### 2. Instagram News Feed
- **Fan-out on write** (push model): When user posts, write to all followers' feeds. Good for users with < 10K followers.
- **Fan-out on read** (pull model): When user opens feed, pull latest from all followed accounts. Good for celebrities (millions of followers).
- **Hybrid:** Push for normal users, pull for celebrities. Merge at read time.
- **Storage:** CDN for images (S3 + CloudFront). Metadata in relational DB.

### 3. Chat System (WhatsApp)
- **Protocol:** WebSocket for real-time bidirectional messaging
- **Message flow:** Sender → WebSocket server → message queue → recipient's WebSocket server → recipient
- **Offline handling:** Store undelivered messages in DB. Deliver on reconnect.
- **Group chat:** Fan-out to all group members through message queue
- **Key metric:** P99 latency < 200ms for message delivery

### 4. Notification Service
- **Types:** Push, email, SMS — different delivery channels
- **Architecture:** API → message queue → workers (one per channel type)
- **Why queue?** Decouple send request from delivery. Handle spikes. Retry failures.
- **Rate limiting:** Max 10 notifications/hour per user to prevent spam
- **Template system:** Notifications reference templates, not hardcoded text

### 5. Rate Limiter
- **Token bucket:** Each user gets N tokens. Each request consumes 1. Tokens refill at fixed rate. If bucket empty → 429.
- **Sliding window:** Count requests in last T seconds. If count > limit → reject.
- **Implementation:** Redis `INCR` + `EXPIRE` for distributed rate limiting.
- **Granularity:** Per-user, per-IP, per-API-endpoint, or combination.

---

## AI System Design Vocabulary — The 2026 Edge

| Term | What It Is | Why It Matters |
|---|---|---|
| **Embedding** | Vector representation of meaning (text, image, user) | Foundation of all modern AI search and recommendation |
| **Vector Database** (Pinecone, Weaviate, Qdrant) | Finds nearest-neighbor embeddings in milliseconds | Powers semantic search, "similar items" |
| **RAG** (Retrieval-Augmented Generation) | LLM + knowledge base retrieval before generation | The dominant AI application pattern in 2025-26 |
| **Feature Pipeline** | Transform raw data → ML model input features | Cleaning, encoding, normalization, feature engineering |
| **Model Serving** | Host trained model as API endpoint | Key metrics: P50/P99 latency, throughput, GPU utilization |
| **Data Drift** | Production data diverges from training data | Causes silent model degradation — needs monitoring |

---

**Resources:**
- [System Design Primer](https://github.com/donnemartin/system-design-primer) — 250k+ stars, most comprehensive free resource
- [Gaurav Sen YouTube](https://www.youtube.com/@gkcs) — clearest free system design explanations
- [DesignGurus.io](https://www.designgurus.io/) — Grokking-style system design (some free content)

---

**Next → [LLD & OOD Design](./lld-ood-design.md)**
