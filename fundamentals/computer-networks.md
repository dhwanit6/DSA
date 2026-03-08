# Computer Networks - The Interview Request Path

> Networking interviews usually reward the candidate who can explain one request end-to-end without breaking the chain.

---

## 1) What Actually Gets Asked

The common interview asks are:

1. what happens when you type a URL in the browser
2. DNS at a practical level
3. TCP vs UDP
4. HTTP vs HTTPS
5. latency vs bandwidth
6. load balancer, reverse proxy, cache, CDN
7. keep-alive, retries, and timeouts

You do not need CCNA depth for most software interviews.

---

## 2) The 80/20 Topics

| Topic | What you must know | What interviewers usually want |
|---|---|---|
| DNS | domain name to IP resolution | can you place DNS in the request flow |
| TCP | handshake, reliability, ordering, flow/congestion basics | can you explain why it is reliable and when it costs latency |
| UDP | no built-in delivery guarantees, lower overhead | can you say when it is chosen intentionally |
| HTTP/HTTPS | request-response, methods, headers, TLS role | can you explain why HTTPS is more than "encrypted HTTP" |
| Load balancer | traffic distribution and availability | can you connect it to scale and failure handling |
| CDN/cache | reduce latency and origin load | can you explain why geography and caching matter |

---

## 3) The Browser Request Flow You Must Own

Question:

"What happens when you open `https://example.com`?"

One clean answer:

1. The browser checks local caches first:
   - browser cache
   - OS cache
   - DNS cache
2. If needed, DNS resolution maps the domain to an IP address.
3. The client opens a connection to the server or load balancer.
4. For HTTPS, TLS negotiation happens before secure HTTP data exchange.
5. The browser sends the HTTP request.
6. The load balancer or server processes it, maybe calling app servers and databases.
7. The response returns through the network.
8. The browser parses, renders, and may fetch more assets.

If you are asked for more detail, expand in this order:

1. DNS
2. TCP/TLS
3. HTTP
4. backend components
5. caching/CDN

Do not start with CDN before you can explain the base path.

---

## 4) TCP vs UDP - The Usual Comparison

Say it like this:

1. "TCP is connection-oriented, ordered, and reliable."
2. "UDP is lighter and does not provide ordering or guaranteed delivery by itself."
3. "TCP is a good default when correctness matters."
4. "UDP is chosen when low latency matters more and the application can tolerate or handle loss."

Good examples:

1. TCP:
   - web pages
   - payments
   - most API traffic
2. UDP:
   - real-time voice/video
   - gaming
   - telemetry where occasional loss is acceptable

If you say "UDP is faster" without mentioning tradeoffs, the answer is weak.

---

## 5) HTTP, HTTPS, and Keep-Alive

What to say:

1. "HTTP defines the application-level request-response format."
2. "HTTPS is HTTP over TLS, which adds confidentiality, integrity, and server authentication."
3. "Persistent connections or keep-alive reduce repeated connection setup cost."

Useful interview tradeoff:

1. new connection per request increases latency
2. reused connections reduce overhead
3. but long-lived connections need timeout and resource management

---

## 6) Latency Levers You Should Mention

If the interviewer asks how to make a system faster, common networking levers are:

1. cache repeated responses
2. use a CDN for static assets
3. keep services geographically closer to users
4. reduce unnecessary hops
5. reuse connections
6. compress wisely
7. place a load balancer in front of multiple app servers

This is the bridge between networking and system design.

---

## 7) Worked Example

Question:

"Why use a CDN?"

Strong answer:

1. "A CDN stores cached copies of static or cacheable content closer to users."
2. "That reduces latency because the request does not always need to travel back to the origin server."
3. "It also reduces origin load."
4. "The tradeoff is cache invalidation complexity and the fact that dynamic personalized content may not cache well."

That answer is better than "CDN makes it faster."

---

## 8) What Different Markets Care About

1. US big tech:
   - often asks networking inside system design or backend follow-ups
2. Europe product and fintech:
   - practical request flow, APIs, latency, and service-to-service reasoning show up more often
3. India product and placements:
   - direct viva questions on TCP/UDP, HTTP/HTTPS, DNS, and OSI/TCP-IP are common

So you need both:

1. direct short answers
2. end-to-end applied explanations

---

## 9) Weekly Drill

Do this out loud:

1. Explain one browser request from domain to response.
2. Compare TCP vs UDP with two real examples.
3. Explain HTTP vs HTTPS.
4. Explain how CDN, cache, and load balancer help performance.
5. Explain latency vs bandwidth without mixing them up.

---

## 10) Next Chapter

Go to [Concurrency & Multithreading](./concurrency-multithreading.md)
