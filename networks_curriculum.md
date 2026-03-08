# Computer Networks → AI Infrastructure Engineering
## Complete Learning Curriculum, Resources, Projects & Timeline

> **Target Role:** MLOps Engineer / AI Infrastructure Engineer  
> **Background:** AI/ML undergraduate, Tier-3 university, Cisco Packet Tracer course  
> **Approach:** First principles → classical mastery → modern cloud/container/AI cluster networking  
> **Total Duration:** 12–14 months (parallel with coursework)

---

## How to Use This Document

Every section follows the same structure:
1. **What it is** — the concept from first principles
2. **Why it matters** — the direct MLOps/AI infra connection
3. **How to learn it** — ordered approach, not a dump of links
4. **Best resources** — vetted, specific, with why each one
5. **Micro-project** — one deep hands-on build per major topic
6. **Flagship project** — combines 2–3 topics, real output
7. **Timeline** — exact weeks

> **Mental model to carry through everything:**  
> Every networking concept is a lever. Bandwidth, latency, jitter, routing, switching — each one directly controls ML training throughput or inference latency. You are not learning networking. You are learning how to make AI systems fast, reliable, and cheap to run.

---

## Master Timeline at a Glance

```
MONTHS 1-3    │ Phase 1: Classical Foundation (parallel with Cisco course)
MONTHS 3-5    │ Phase 2: Cloud Networking (AWS/GCP VPCs, Terraform)
MONTHS 5-7    │ Phase 3: Kubernetes & Container Networking (Cilium, Istio)
MONTHS 7-9    │ Phase 4: AI Cluster Networking (RDMA, InfiniBand, NCCL)
MONTHS 9-11   │ Phase 5: Observability & Performance Engineering
MONTHS 11-14  │ Final Capstone: Full AI Infrastructure Stack
```

> **Weekly commitment:** 8–12 hours/week  
> Each phase has a **flagship project** built at the end.  
> The **final capstone** combines all five phases into one production-grade system.

---

## Phase 1: Classical Networking — Properly Understood

**Duration:** Months 1–3 (Parallel with your Cisco Packet Tracer course)  
**Tools:** Cisco Packet Tracer, Wireshark, GNS3 (free)  
**Goal:** Not to pass exams — to understand WHY every protocol exists so you can derive modern equivalents yourself.

---

### Topic 1.1 — The OSI Model & TCP/IP: Real Architecture

#### What It Is
The OSI model is a philosophical framework for **separation of concerns** in network design. Each layer has a contract: it provides a service to the layer above and uses the service of the layer below — without needing to know how the other layer works internally. TCP/IP collapses the OSI 7 layers into 4 practical layers that run the real internet.

#### Why It Matters for AI Infra
- When a Kubernetes pod can't reach a model server, you debug layer by layer — "is this a Layer 3 routing problem or a Layer 4 port issue?"
- RDMA (used in GPU training clusters) **bypasses** Layers 3 and 4 entirely. You cannot understand why without knowing what those layers do.
- QUIC (HTTP/3) merges Transport + TLS into one protocol — you need to understand what it replaced and why.

#### How to Learn It
1. **First, draw it by hand.** Write down all 7 layers with their data unit names (segment, packet, frame, bit) and one real protocol per layer.
2. **Then capture a real packet.** Open Wireshark on your machine, visit any HTTP website. Find the Ethernet frame → IP packet → TCP segment → HTTP data. Identify every header field.
3. **Then simulate in Packet Tracer.** Build a 3-device network. Use "simulation mode" to step through a ping packet hop by hop. Watch the layers get added and stripped.
4. **Finally, read the RFC.** Skim RFC 793 (TCP) — not to memorize, but to see what a real protocol specification looks like.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Computer Networking: A Top-Down Approach** — Kurose & Ross, Ch.1-2 | Textbook | Best explanation of layering philosophy ever written. Free PDFs online. |
| **Professor Messer's CompTIA Network+** (YouTube, free) | Video | Clear, methodical. Covers every OSI concept with visuals. |
| **Wireshark Tutorial** — Chris Greer (YouTube) | Video | Practical. You learn OSI by seeing it in real packets. |
| **Cisco NetAcad: Introduction to Networks (ITN)** | Free Course | Aligns directly with your Packet Tracer curriculum. Self-paced. |
| **Julia Evans — "Networking! Ack!"** (zine, $12) | Zine | Best short visual explanation of TCP/IP ever made. Worth every rupee. |

#### Micro-Project 1.1 — "The Packet Dissector"
**Build:** A Python script using Scapy that captures 100 packets from your machine's network interface, extracts and prints a clean breakdown of each: Ethernet src/dst MAC → IP src/dst → Protocol (TCP/UDP/ICMP) → Port numbers → Payload summary.  
**What you learn:** OSI encapsulation becomes concrete. You're manually "removing the envelopes" in code.  
**Deep extension:** Add a function that identifies which OSI layer a given header field belongs to. Print a tree view.

```python
# Starter structure
from scapy.all import sniff, Ether, IP, TCP, UDP

def dissect(pkt):
    layers = {}
    if Ether in pkt:
        layers['L2_src_mac'] = pkt[Ether].src
        layers['L2_dst_mac'] = pkt[Ether].dst
    if IP in pkt:
        layers['L3_src_ip']  = pkt[IP].src
        layers['L3_protocol'] = pkt[IP].proto
    if TCP in pkt:
        layers['L4_src_port'] = pkt[TCP].sport
        layers['L4_flags']    = pkt[TCP].flags
    print(layers)

sniff(count=100, prn=dissect)
```

---

### Topic 1.2 — IP Addressing, Subnetting & CIDR

#### What It Is
Every device on a network needs a unique logical address (IP). Subnetting divides a large address space into smaller networks. CIDR (Classless Inter-Domain Routing) notation like `192.168.1.0/24` encodes both the network address and the subnet mask together.

#### Why It Matters for AI Infra
- **AWS VPC design for ML clusters:** When you create a training cluster on AWS with 1,000 GPU instances, you choose a VPC CIDR. Choose too small → IP exhaustion as you scale. Choose poorly → routing conflicts between regions.
- **Kubernetes pod networking:** Every pod needs an IP. With 500 pods per node and 100 nodes, you need a `/16` or larger pod CIDR. Getting this wrong breaks cluster networking silently.
- **Multi-region ML pipelines:** Data flows between training (us-east-1), preprocessing (us-west-2), and serving (ap-south-1). Non-overlapping CIDRs are essential for VPC peering.

#### How to Learn It
1. **Master binary first.** Convert IPs to binary by hand until it's automatic. `192.168.1.0/24` means the first 24 bits are the network. You should be able to compute this instantly.
2. **Subnet practice — do 50 problems.** Given `10.0.0.0/8`, create 16 equal subnets. What's the broadcast address of each? This is the type of calculation you'll do mentally while designing VPCs.
3. **Understand VLSM** (Variable Length Subnet Masking). Different subnets in the same network can have different sizes. This is exactly how you design a VPC: a /24 for training nodes, a /28 for bastion hosts, a /20 for batch processing.
4. **Practice with subnettingpractice.com** until you can do any problem in under 30 seconds.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **subnetting.org** | Free interactive | Best drill tool on the internet. Gamified practice. |
| **Professor Messer Network+ N10-008** — Subnetting videos | YouTube | Visual, binary-first explanation. Watch 3x if needed. |
| **Kurose & Ross Ch.4** | Textbook | Best theoretical treatment of IP addressing. |
| **AWS VPC Addressing** (AWS Documentation) | Docs | See how real cloud engineers think about CIDR design. |
| **Sunny Classroom — Subnetting** | YouTube | Clear worked examples. Indian-accent-friendly explanation. |

#### Micro-Project 1.2 — "The VPC CIDR Planner"
**Build:** A Python CLI tool that takes a parent CIDR block (e.g., `10.0.0.0/16`) and a set of requirements (e.g., "3 private subnets for training, 2 public subnets for bastion, 1 subnet for NAT gateway") and outputs the optimal CIDR allocation with host counts, broadcast addresses, and a summary table.  
**What you learn:** VLSM, CIDR math, and you'll use this tool for real when designing AWS VPCs in Phase 2.  
**Deep extension:** Add validation that checks if any two subnets in the plan overlap. Add an AWS CLI command that creates the VPC with these CIDRs.

---

### Topic 1.3 — Switching, MAC Addresses & VLANs

#### What It Is
Switches operate at Layer 2. They learn which MAC addresses are reachable on which ports (MAC address table), and forward frames only to the correct port — unlike hubs which flood to all ports. VLANs logically segment a physical switch into multiple virtual networks.

#### Why It Matters for AI Infra
- **GPU cluster fabric:** The switching fabric connecting 8,000 GPUs is a massive L2/L3 network. Understanding switching is the prerequisite to understanding fat-tree topologies used in AI clusters.
- **Network isolation in multi-tenant ML platforms:** Multiple teams sharing a GPU cluster need VLAN-level isolation to prevent traffic interference.
- **Debugging ARP storms:** In large Kubernetes clusters, ARP broadcasts can flood the network. This is a switching-layer problem.

#### How to Learn It
1. **Simulate in Packet Tracer:** Build a network with 2 switches and 8 hosts. Capture the MAC learning process. Watch an unknown unicast get flooded, then observe the MAC table being updated.
2. **Configure VLANs:** Put hosts in different VLANs on the same switch. Verify they cannot communicate without a router. This is the exact mechanism behind Kubernetes NetworkPolicy isolation.
3. **Understand Spanning Tree Protocol (STP):** What happens when you have two switches connected by two cables (redundancy)? STP prevents loops. Modern data centers use RSTP or MSTP.
4. **Study 802.1Q trunking:** How multiple VLANs travel over a single uplink. This is foundational to how virtual network overlays (VXLAN in Kubernetes) work.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Jeremy's IT Lab** — Switching Series (YouTube, free) | Video | Most detailed practical switching course. Free CCNA-level content. |
| **Packet Tracer labs from NetAcad** | Labs | Hands-on VLAN and trunking configs. |
| **Kurose & Ross Ch.6** | Textbook | Clear theoretical treatment of link layer and switches. |
| **David Bombal** — Packet Tracer VLAN lab (YouTube) | Video | Real configs, see it work. |

#### Micro-Project 1.3 — "VLAN Traffic Analyzer"
**Build:** Using Scapy, write a script that captures traffic on a Linux machine and categorizes frames by VLAN tag (802.1Q header), source MAC, and protocol. Output a live table showing packets/second per VLAN. Add anomaly detection: flag when a MAC address appears in two different VLANs (a VLAN-hopping attempt).  
**What you learn:** 802.1Q framing, L2 security concepts, live traffic analysis.

---

### Topic 1.4 — Routing: OSPF, BGP, and How the Internet Routes

#### What It Is
Routing determines the path packets take across multiple networks. **OSPF** (Open Shortest Path First) is a link-state protocol used within a single organization — every router has a complete map of the network and computes shortest paths independently. **BGP** (Border Gateway Protocol) is the internet's routing protocol — it handles routing between different organizations (Autonomous Systems).

#### Why It Matters for AI Infra
- **BGP is how the internet stays up** — and also how it breaks. The Facebook 2021 outage that took down WhatsApp, Instagram, and Facebook for 6 hours was a BGP misconfiguration. If your ML inference API depends on internet-facing endpoints, BGP affects you.
- **AWS uses BGP for Direct Connect** — the private high-bandwidth link between your data center and AWS (essential for hybrid ML training where data is on-prem).
- **Kubernetes with Calico CNI uses BGP** to distribute pod routes across nodes. Understanding BGP makes Calico debugging possible.

#### How to Learn It
1. **OSPF in Packet Tracer:** Configure OSPF on a 5-router topology. Verify routes are learned. Shut down one link and watch OSPF reconverge. Understand DR/BDR election.
2. **BGP conceptually (theory + simulation):** You don't need to memorize BGP attributes for now — understand: what is an AS, what is an AS-path, what is prefix advertisement, what is route aggregation. Configure basic eBGP in GNS3.
3. **Read "BGP for Dummies" blog post by Cloudflare** (actual title: "BGP in 2021"). The best practical treatment available.
4. **Understand ECMP** (Equal-Cost Multi-Path) — how multiple equal paths are used simultaneously. This is how fat-tree topologies in GPU clusters achieve full bisection bandwidth.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Jeremy's IT Lab — OSPF Series** | YouTube | Clearest explanation of link-state routing. |
| **Cloudflare Blog: "BGP Leaks and Outages"** | Blog | Real-world BGP incidents. Teaches you what matters. |
| **Avi Freedman's BGP course on Packet Pushers** | Podcast/Blog | Deep practitioner knowledge of BGP. |
| **Kurose & Ross Ch.5** | Textbook | Best theoretical treatment of routing algorithms. |
| **GNS3 Academy — BGP labs** | Free Labs | Hands-on BGP configs without physical hardware. |

#### Micro-Project 1.4 — "BGP Route Simulator"
**Build:** Using Python NetworkX library, build a simulation of a 10-AS internet. Each AS has 2–3 routers. Implement simplified BGP: each AS advertises its prefixes, neighboring ASes propagate them with AS-path prepending. Visualize the routing table of each AS. Then simulate an AS misconfiguration (advertising a route it shouldn't) and show the route leak propagation.  
**What you learn:** BGP path selection, AS-path, route leak dynamics — the same concepts behind the Facebook 2021 outage.

---

### Topic 1.5 — TCP Deep Dive: The Reliability Machine

#### What It Is
TCP provides reliable, ordered, connection-oriented delivery over an unreliable IP network. It does this through: **three-way handshake** (connection setup), **sequence numbers** (ordering), **acknowledgments + retransmit** (reliability), **sliding window** (flow control), and **congestion control** (CUBIC, BBR, RENO).

#### Why It Matters for AI Infra
- **ML training data loading:** Reading a 10TB dataset from S3 into a training job uses TCP. AWS uses BBR congestion control — if your application uses CUBIC, you get 40% less throughput on high-bandwidth-delay-product paths.
- **TCP's head-of-line blocking** is why QUIC was invented. When a single lost packet blocks the entire stream, multi-request ML inference APIs suffer. Understanding TCP's flaw makes QUIC's design obvious.
- **Inference API latency:** Every TCP connection costs 1.5 RTTs minimum (handshake) before any data flows. For a model API with 50ms server latency and 20ms RTT, that's 30ms of pure TCP overhead per new connection. Connection pooling and HTTP/2 multiplexing are direct responses to this.

#### How to Learn It
1. **Capture a TCP 3-way handshake in Wireshark.** See SYN, SYN-ACK, ACK. Note the sequence numbers. See how they relate to data acknowledgment.
2. **Understand the sliding window.** Draw it by hand: sender window of 4 packets, receiver window of 4 packets. What happens when a packet is lost? What happens during slow start?
3. **Compare CUBIC vs BBR:** CUBIC backs off on loss. BBR maximizes bandwidth-delay product (BDP) without waiting for loss. Read the Google BBR paper — it's readable and explains the motivation clearly.
4. **Understand TIME_WAIT:** When a TCP connection closes, the socket stays in TIME_WAIT for 2×MSL (about 60 seconds). In a high-throughput ML inference server making thousands of short connections, this exhausts ports. The fix is `SO_REUSEADDR`. This is a real production problem.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Julia Evans — "TCP! Ack!"** | Zine | Best short visual guide to TCP. |
| **Wireshark TCP Analysis — Chris Greer** | YouTube | See TCP in real packets. RTT graphs, retransmits. |
| **Google BBR Paper (2016)** — Neal Cardwell | Paper | Seminal. Explains why loss-based CC is wrong. Short and readable. |
| **Cloudflare Blog: "TCP Fast Open"** | Blog | Real-world TCP optimization case study. |
| **"TCP/IP Illustrated Vol.1"** — Stevens | Textbook | The bible of TCP. Reference for when you need depth. |

#### Micro-Project 1.5 — "TCP Congestion Window Visualizer"
**Build:** Python script using raw sockets (or Scapy) that initiates a large file transfer to a local server, captures all TCP packets, extracts the congestion window evolution (cwnd) from sequence numbers and ACKs, and plots it over time. Show: slow start phase, congestion avoidance, packet loss event (triple duplicate ACK), and cwnd reduction.  
**What you learn:** TCP congestion control becomes visual and concrete. You'll reference this understanding every time you debug slow ML data loading.

---

### Topic 1.6 — DNS, DHCP, NAT — The Service Layer

#### What It Is
**DNS** resolves human-readable names (`model-server.internal`) to IP addresses. It is hierarchical, distributed, and cached. **DHCP** automatically assigns IP addresses to devices. **NAT** translates private IP addresses to a single public IP, allowing many devices behind a router to share one internet address.

#### Why It Matters for AI Infra
- **CoreDNS in Kubernetes** replaces standard DNS for pod service discovery. When a pod calls `http://model-service:8080`, CoreDNS resolves `model-service` to the ClusterIP. A misconfigured CoreDNS is one of the top causes of Kubernetes networking failures.
- **NAT breaks RDMA.** RDMA requires direct memory addressing between nodes — NAT, which rewrites IP addresses, makes this impossible. This is why GPU clusters need fully routable (non-NAT) networks.
- **DNS-based load balancing** is used for global ML inference routing: `api.yourmodel.com` returns the IP of the nearest inference server based on geographic DNS.

#### How to Learn It
1. **Trace a DNS resolution:** `dig +trace google.com`. Watch it go from root nameservers → TLD servers → authoritative servers. Every hop is a separate network request. Time it.
2. **Run your own DNS server** (bind9 or CoreDNS in Docker) and create a zone file with custom records. Resolve from another machine.
3. **Understand TTL:** Why DNS caching matters. During a service migration (old model server → new), you need to reduce TTL before you switch, or clients will cache the old IP for hours.
4. **NAT and its problems:** Understand SNAT vs DNAT. Understand how stateful NAT tables work. Understand why NAT breaks end-to-end connectivity and why it's considered a workaround, not a solution.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **"How DNS Works"** — Julia Evans comic | Free web | Best visual explanation. bookmarks.dns.lookup.dog |
| **CoreDNS documentation** | Docs | The actual DNS implementation in Kubernetes. Read after basics. |
| **Cloudflare Learning: "What is DNS?"** | Blog | Excellent, detailed, free primer. |
| **Jeremy's IT Lab — NAT** | YouTube | Practical NAT config and theory. |

#### Micro-Project 1.6 — "DNS Resolver from Scratch"
**Build:** Implement a minimal recursive DNS resolver in Python (no dns libraries — use raw UDP sockets). It should: (1) send a query to a root nameserver, (2) follow the referral chain (root → TLD → authoritative), (3) return the final A record. This means constructing and parsing raw DNS wire-format messages.  
**What you learn:** DNS protocol internals completely. You'll never be confused by DNS again — and debugging CoreDNS becomes intuitive.  
**Deep extension:** Add caching with TTL expiry. Add CNAME chain following.

---

### ★ FLAGSHIP PROJECT 1 — "NetSight: Classical Network Analyzer"

> **Combines:** Topics 1.1 (OSI/TCP-IP), 1.2 (Subnetting), 1.5 (TCP), 1.6 (DNS)  
> **Timeline:** End of Month 2  
> **Difficulty:** Intermediate Python + Networking

**What you build:**  
A terminal dashboard (using Rich library) that monitors your machine's network in real time. It shows:

1. **Protocol distribution:** Live pie chart of traffic by protocol (TCP/UDP/ICMP/DNS/HTTP)
2. **TCP connection health:** Active connections with state (ESTABLISHED/TIME_WAIT/CLOSE_WAIT), RTT estimates, retransmit rates
3. **DNS query log:** Every DNS query your machine makes, resolved IPs, and TTL remaining
4. **Top talkers:** Source/destination IPs with bytes transferred, with reverse DNS lookup
5. **Subnet membership:** For each IP seen, classify as: private (RFC1918), public, loopback, multicast — and compute which subnet it belongs to

**Tech stack:** Python, Scapy (capture), Rich (UI), psutil (system stats), raw socket for DNS

**Real-world relevance:** This is the same type of tool that network security teams run continuously. Tools like Zeek, Suricata, and Wireshark are industrial versions of this.

**What to add for depth:** Baseline "normal" traffic for 1 hour, then detect and alert on anomalies (new protocols appearing, unusual DNS queries, unexpected external IPs).

---

### Topic 1.7 — Network Topologies: The Trade-off Language

#### What It Is
Network topology describes how nodes are physically and logically connected. Common types: **Bus** (all on one cable), **Star** (all connect to central hub/switch), **Ring** (each node connects to next in circle), **Mesh** (every node connects to every other), **Tree** (hierarchical), **Fat-Tree** (tree where higher-level switches have more bandwidth), **Dragonfly** (high-radix interconnect for supercomputers).

#### Why It Matters for AI Infra
- **Fat-Tree is the topology of every major GPU cluster.** NVIDIA's DGX SuperPOD, Meta's AI Research SuperCluster, OpenAI's training infrastructure — all fat-tree. The reason: it provides **full bisection bandwidth** (any half of the nodes can communicate with the other half at full speed simultaneously). AllReduce operations in distributed training require this.
- **Dragonfly** is used in the top 500 supercomputers. Understanding it explains why AI hardware companies spend $10M+ on networking per cluster.
- **Spine-leaf** (Clos network) is the standard for modern cloud data centers — every AWS AZ uses spine-leaf. It's a two-tier fat-tree.

#### How to Learn It
1. **Draw each topology.** Don't just name them — draw them for 8 nodes. Count links, compute bisection bandwidth, identify single points of failure.
2. **Compute bandwidth oversubscription.** If a switch has 48 ports at 10Gbps each and a 40Gbps uplink, oversubscription = (48×10)/(2×40) = 6:1. This means in the worst case, 6 flows compete for 1 slot. Fat-tree aims for 1:1 (no oversubscription).
3. **Read the original fat-tree paper:** "A Scalable, Commodity Data Center Network Architecture" — Al-Fares et al. (2008). 8 pages. Changed data center networking forever.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Fat-Tree Paper** — Al-Fares et al. 2008 | Paper | 8 pages. Changed the industry. Read it. |
| **NVIDIA DGX SuperPOD Architecture Guide** | Technical doc | Real GPU cluster topology. See fat-tree in production. |
| **"Data Center Networks: Topologies"** — Stanford CS144 lecture | Lecture notes | Academic treatment of Clos, fat-tree, jellyfish. |
| **Packet Pushers Podcast: "Clos Networks"** | Podcast | Practitioner perspective on spine-leaf. |

---

### Topic 1.8 — Transmission Media: Physics Meets Engineering

#### What It Is
The physical medium that carries signals: **Twisted pair** (copper, short distances), **Coaxial cable** (TV/cable internet), **Single-mode fiber** (long distance, 80km+, highest bandwidth), **Multi-mode fiber** (short distance, cheaper transceivers), **Wireless** (radio waves, 5G, WiFi).

#### Why It Matters for AI Infra
- **InfiniBand cables are specific media.** HDR InfiniBand (200Gbps) uses Active Optical Cables (AOC) or Direct Attach Copper (DAC) — different from standard Ethernet cabling. Understanding signal physics tells you why you can't just use any cable.
- **Fiber vs copper trade-off inside GPU clusters:** NVIDIA uses DAC (copper) for short intra-rack connections (0–3m) and AOC (optical) for inter-rack. The choice is cost vs distance vs power consumption.
- **5G network slicing** for edge ML inference uses different frequency bands for different latency/bandwidth requirements. Understanding frequency physics explains the architectural choices.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Kurose & Ross Ch.2.1** | Textbook | Best theoretical treatment. |
| **NVIDIA InfiniBand Cable Guide** | Tech doc | Real specs for AI cluster cabling. |
| **Cloudflare Blog: "Optics for Dummies"** | Blog | How fiber optics actually work in data centers. |

---

## Phase 1 Complete — Skills Checklist

Before moving to Phase 2, verify you can do all of these:

- [ ] Given any IP and prefix length, compute network address, broadcast address, first/last host, number of hosts — in under 60 seconds
- [ ] Open Wireshark and identify every header field in a captured TCP/HTTP packet
- [ ] Configure OSPF on a multi-router Packet Tracer topology
- [ ] Explain the TCP 3-way handshake and why each step is necessary
- [ ] Trace a DNS query from root to answer using `dig +trace`
- [ ] Explain why fat-tree topology is chosen for GPU clusters (bisection bandwidth)
- [ ] Complete the NetSight flagship project

---

## Phase 2: Cloud Networking — Where ML Actually Runs

**Duration:** Months 3–5  
**Tools:** AWS Free Tier (or GCP), Terraform, Ansible  
**Goal:** Design, provision, and operate cloud network infrastructure for ML workloads. This is the bridge between classical networking and production AI infrastructure.

> **Key mental shift:** In cloud networking, there is no physical cable to check. Everything is software-defined. Your network configuration lives in code (Terraform). You debug with metrics and logs, not hardware.

---

### Topic 2.1 — Virtual Private Cloud (VPC) Architecture

#### What It Is
A VPC is your own logically isolated network inside a cloud provider. You define: IP address range (CIDR), subnets (public vs private, across availability zones), route tables (controlling where traffic goes), internet gateways (for public internet access), NAT gateways (allowing private subnets to initiate outbound connections), and security groups (stateful firewalls per instance).

#### Why It Matters for AI Infra
This is literally the first thing you configure when setting up ML infrastructure on AWS. A well-designed VPC for ML training looks like:
- `/20` private subnet per AZ for GPU training instances (no internet access)
- `/24` private subnet for inference servers (no internet access)
- `/27` public subnet for bastion hosts (SSH jump box)
- NAT gateway for training instances to reach S3 for dataset downloads
- VPC endpoints for S3/ECR (keeps training traffic on AWS backbone, not internet)

Getting the architecture wrong means: IP exhaustion, security exposure, or unnecessarily expensive data transfer costs.

#### How to Learn It
1. **AWS VPC documentation** — read the complete VPC User Guide. AWS documentation is industry standard. Get comfortable with it.
2. **Build a 3-tier VPC by hand** in the AWS console (not Terraform yet). Click through every option. Understand what each does.
3. **Then rebuild it with Terraform.** The same VPC, but now it's code. This shift to IaC is the most important professional skill in cloud networking.
4. **Calculate data transfer costs** for a ML training setup: training data lives in S3 in the same region. Understand that VPC endpoints make this free vs. paying per GB for internet routing.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **AWS VPC Documentation** | Official Docs | The definitive reference. Read fully once. |
| **"Terraform: Up & Running"** — Yevgeniy Brikman | Book | Best Terraform learning resource. First 3 chapters alone worth it. |
| **A Cloud Guru: AWS Certified Solutions Architect** | Course | Best structured AWS networking curriculum. |
| **Anton Babenko's Terraform AWS modules** (GitHub) | Code | Real production Terraform patterns used by enterprises. |
| **AWS re:Invent VPC Deep Dive talks** (YouTube) | Video | Deep technical content from AWS engineers who built VPC. |

#### Micro-Project 2.1 — "ML Training VPC with Terraform"
**Build:** Using Terraform, provision a complete VPC designed for ML training:
- 3 AZs, each with a private training subnet and a private inference subnet
- 1 public subnet with bastion host (EC2 t2.micro) secured with security groups
- NAT Gateway for outbound traffic from private subnets
- S3 VPC endpoint so training data transfer is free
- VPC flow logs to CloudWatch for all traffic
- Security groups: training SG (intra-cluster communication only), inference SG (HTTPS inbound), bastion SG (SSH from your IP only)

**Output:** `terraform apply` provisions the entire network. `terraform destroy` tears it down. The VPC is documented with a architecture diagram (draw.io or Excalidraw).

**What to add for depth:** Add a Terraform module for a second region (ap-south-1) and configure VPC peering between the two regions.

---

### Topic 2.2 — Software-Defined Networking (SDN)

#### What It Is
SDN separates the **control plane** (deciding where traffic goes) from the **data plane** (actually forwarding packets). A centralized **SDN controller** programs "dumb" switches via a southbound API (OpenFlow). Applications program the controller via a northbound API (REST). The result: the entire network becomes programmable software.

#### Why It Matters for AI Infra
- **Every cloud provider's network IS SDN.** AWS VPC, GCP Andromeda, Azure SDN — these are massive SDN implementations. When you add a security group rule, you're programming an SDN controller.
- **NVIDIA's Air platform** (for validating AI cluster network configurations) uses SDN to simulate GPU cluster networks in software before purchasing hardware.
- **Kubernetes networking itself is SDN:** kube-proxy programs iptables (or IPVS), which programs the kernel's packet forwarding. The CNI plugin (Cilium, Calico) is an SDN controller for pod networks.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **ONF SDN Architecture Overview** | Paper | The canonical SDN reference. Readable overview. |
| **"Software Defined Networks: A Comprehensive Approach"** — Goransson | Book | Best book on SDN. First 3 chapters essential. |
| **Mininet tutorials** | Interactive | Simulate SDN networks on your laptop for free. |
| **Google B4 Paper** — Jain et al. 2013 | Paper | How Google runs their WAN with SDN. Real production. |

#### Micro-Project 2.2 — "Mininet SDN Traffic Controller"
**Build:** Using Mininet (free SDN simulator) and the Ryu SDN controller (Python-based), create a 10-node network and implement a custom routing application that: (1) monitors traffic per flow, (2) dynamically reroutes flows over least-utilized paths, (3) enforces bandwidth limits per application type (e.g., "ML training flows get priority over web traffic").  
**What you learn:** SDN controller programming, OpenFlow, dynamic traffic engineering — the concepts behind cloud network virtual routing.

---

### Topic 2.3 — Load Balancing: L4 vs L7

#### What It Is
Load balancers distribute incoming traffic across multiple backend servers. **Layer 4 load balancers** work at TCP/UDP level — they don't inspect application content, just forward connection streams. **Layer 7 load balancers** understand HTTP/gRPC — they can route based on URL paths, headers, and content, and terminate TLS.

#### Why It Matters for AI Infra
- **Model serving requires L7 load balancing.** TorchServe and Triton Inference Server use gRPC (HTTP/2). L4 load balancers can't do proper gRPC routing because they don't understand HTTP/2 stream multiplexing. An L4 LB sends all streams from one TCP connection to the same backend, defeating the purpose of load balancing.
- **A/B testing model versions** requires L7: route 10% of traffic with header `X-Model-Version: v2` to new model, 90% to stable model. This is impossible at L4.
- **Health checks:** L4 checks "is port 8080 open?" L7 checks "does `GET /health` return 200?" For ML, you want L7 health checks that verify the model is actually loaded and responding.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **AWS ELB documentation: ALB vs NLB** | Docs | Direct comparison of L4 vs L7 in production. |
| **HAProxy documentation** | Docs | The reference L7 load balancer. Teaches concepts deeply. |
| **Envoy Proxy documentation** | Docs | The load balancer inside every service mesh. Modern standard. |
| **"NGINX Cookbook"** — Derek DeJonghe | Book | Practical L7 load balancing configurations. |

#### Micro-Project 2.3 — "gRPC Model Server Load Balancer"
**Build:** Deploy 3 instances of a simple gRPC "inference server" (Python, returns a fake prediction). Configure an Envoy proxy as L7 load balancer in front of them. Implement: (1) round-robin load balancing, (2) weighted routing (70%/20%/10% for v1/v2/v3), (3) circuit breaking (if v2 errors > 5%, stop sending traffic), (4) health check endpoint.  
**What you learn:** Envoy configuration, gRPC L7 routing, circuit breaking — the exact setup used in production ML serving systems.

---

### Topic 2.4 — Network Security: Zero Trust & Cloud Firewalls

#### What It Is
Traditional security: build a strong perimeter (firewall), trust everything inside. **Zero trust:** never trust, always verify — every request must be authenticated and authorized regardless of whether it comes from inside or outside the network. In cloud: security groups (stateful, per-instance), NACLs (stateless, per-subnet), WAF (web application firewall, L7), Shield (DDoS protection).

#### Why It Matters for AI Infra
- **Model weights are intellectual property worth millions.** If your Llama fine-tune or proprietary model leaks, the damage is irreversible. Network segmentation is the primary defense.
- **Training data compliance:** HIPAA, GDPR require that PII training data never leaves specific network boundaries. This is enforced at the network security layer, not the application layer.
- **Supply chain attacks:** A compromised ML dependency that makes outbound connections to an attacker's server. Egress network controls catch this.
- **GPU instance costs:** A security breach leading to cryptomining on your GPU fleet costs $500/hour per GPU. Happened to multiple companies.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **AWS Security Best Practices Whitepaper** | Whitepaper | Official, comprehensive. Bookmark. |
| **"Zero Trust Networks"** — Evan Gilman | Book | Best book on zero trust architecture. |
| **Cloudflare Zero Trust documentation** | Docs | Real implementation of zero trust for modern teams. |
| **AWS re:Invent: Security Best Practices** | YouTube | Real case studies from AWS security engineers. |

#### Micro-Project 2.4 — "Network Security Audit Tool"
**Build:** A Python tool that queries AWS (via boto3) and audits a VPC's security posture. It checks: (1) any security groups with 0.0.0.0/0 inbound on sensitive ports (22, 8080, etc.), (2) any subnets with both a route to IGW and instances with public IPs that have open inbound rules, (3) VPC flow logs enabled, (4) no NACLs blocking necessary internal traffic. Output a scored security report with remediation steps.  
**What you learn:** AWS security APIs, network security audit thinking, boto3.

---

### ★ FLAGSHIP PROJECT 2 — "CloudNet: Production ML Infrastructure Network"

> **Combines:** Topics 2.1 (VPC), 2.2 (SDN/routing), 2.3 (Load Balancing), 2.4 (Security)  
> **Timeline:** End of Month 4  
> **Difficulty:** Cloud engineering, Terraform, Python

**What you build:**  
A complete, production-grade network infrastructure for an ML serving system, fully defined as Terraform code:

**Architecture:**
- Multi-AZ VPC (us-east-1) with training, inference, and management subnet tiers
- Application Load Balancer (L7) in front of 3 inference server replicas
- gRPC-based model server (TorchServe) behind the ALB
- Bastion host with SSM Session Manager (no SSH keys, zero-trust access)
- WAF rules blocking model API abuse (rate limiting, input size limits)
- VPC flow logs → CloudWatch → Lambda alert when unusual outbound traffic detected
- S3 VPC endpoint for model artifact downloads
- Fully automated: `terraform apply` brings up the entire stack

**Security layer:**
- All inference servers in private subnets (no public IPs)
- Security groups: ALB → inference servers only (port 8080), inference → S3 endpoint only
- CloudWatch alarm + SNS notification on: unusual egress bytes, connection to unknown external IPs

**What to add for depth:**  
- Add a second region (ap-south-1) and Route 53 latency-based routing to serve Indian users from the closest region
- Implement AWS WAF rate limiting to prevent API abuse

---

## Phase 3: Kubernetes & Container Networking

**Duration:** Months 5–7  
**Tools:** k3s or minikube, kubectl, Helm, Cilium, Istio  
**Goal:** Understand how ML workloads are deployed and networked in Kubernetes. This is the daily operating environment for MLOps engineers.

> **Key mental shift:** In Kubernetes, the network is not a physical thing you configure once. It is a dynamic, software-defined system that changes every time a pod starts or stops. The network must adapt automatically. Understanding how this works is what separates good MLOps engineers from great ones.

---

### Topic 3.1 — Kubernetes Networking Internals: CNI & Pod IPs

#### What It Is
In Kubernetes, every pod gets its own IP address. Pods on different nodes can communicate directly (no NAT). This is implemented via **CNI (Container Network Interface)** plugins. Each pod runs in a Linux **network namespace** (isolated network stack). The CNI plugin creates a **veth pair** (virtual ethernet cable) — one end in the pod's namespace, one end on the host — and connects it to a bridge or routes it directly.

**How it actually works (the real mechanics):**
1. `kubelet` calls the CNI plugin when a pod is created
2. CNI creates a network namespace for the pod
3. CNI creates a veth pair: `eth0` (pod) ↔ `veth0abc` (host)
4. CNI assigns an IP from the pod CIDR to the pod's `eth0`
5. CNI adds routes so the pod's traffic goes out through the host
6. For cross-node communication: CNI either uses an overlay (VXLAN encapsulation) or BGP routing (Calico) to connect node networks

**Key CNI plugins:**
- **Cilium:** eBPF-based, no iptables, L7-aware, network policy enforcement, observability built-in. The modern standard.
- **Calico:** BGP-based routing, good for large clusters, network policy support.
- **Flannel:** Simple overlay (VXLAN), easy to set up, limited policy features.
- **AWS VPC CNI:** Puts pod IPs directly in the VPC (no overlay), uses ENIs. Best AWS performance.

#### Why It Matters for AI Infra
When your training job pods can't communicate: you need to know if it's a CNI issue (IP assignment failed), a NetworkPolicy blocking (intentional firewall), or a routing problem (routes not propagated). Without understanding CNI internals, you're guessing.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **"Kubernetes Networking" — Cilium documentation** | Docs | Best technical explanation of k8s networking from the ground up. |
| **"Container Networking From Scratch"** — Liz Rice | Talk (YouTube) | 35-min demo building a container network from raw Linux tools. Watch first. |
| **"Kubernetes in Action"** — Luksa, Ch.11 | Book | Best k8s networking chapter in any book. |
| **Ivan Pepelnjak — ipSpace.net** | Blog/Podcast | Deep technical networking blog. Many k8s networking posts. |
| **Cilium Getting Started Guide** | Hands-on | Official Cilium labs. Free, well-structured. |

#### Micro-Project 3.1 — "Build a Container Network from Scratch"
**Build:** Without using Docker or Kubernetes, manually create a container network using only Linux tools:
1. Create two network namespaces (`ip netns add ns1`, `ip netns add ns2`)
2. Create a veth pair connecting them
3. Assign IPs and bring up interfaces
4. Create a bridge and connect both to it
5. Add NAT rules so containers can reach the internet
6. Verify pod-to-pod and pod-to-internet connectivity

**What you learn:** This is exactly what every CNI plugin does internally. After this, CNI debugging becomes trivial.

**Deep extension:** Add a third namespace on a "different node" (different bridge). Implement VXLAN encapsulation between them to simulate overlay networking.

---

### Topic 3.2 — Kubernetes Services, kube-proxy, and CoreDNS

#### What It Is
A **Kubernetes Service** provides a stable virtual IP (ClusterIP) for a set of pods (selected by labels). Even as pods start and stop, the Service IP stays the same. **kube-proxy** implements Services by writing iptables or IPVS rules that DNAT the ClusterIP to one of the backend pod IPs. **CoreDNS** provides DNS resolution within the cluster: `my-service.my-namespace.svc.cluster.local` resolves to the ClusterIP.

#### Why It Matters for AI Infra
- Deploying a model server (`TorchServe`) as a Deployment with a Service means you can scale from 1 to 10 replicas without changing any client code — the Service IP stays the same.
- CoreDNS misconfiguration is a top-5 cause of Kubernetes incidents. Understanding its configuration makes you faster at debugging.
- **IPVS vs iptables:** For clusters with 10,000+ services, iptables becomes slow (O(n) rule lookup). IPVS is O(1) hash-based. Understanding this matters when you're running large ML platform clusters.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Kubernetes documentation: Services** | Docs | Comprehensive. Read carefully. |
| **"Life of a Packet Through Kubernetes"** — Michael Rubin | Talk (YouTube) | Best explanation of kube-proxy and iptables. Essential watch. |
| **CoreDNS documentation** | Docs | Configuration reference. Critical for debugging. |

#### Micro-Project 3.2 — "K8s Service Mesh Debugger"
**Build:** A Python tool that runs inside a Kubernetes cluster (as a pod) and:
1. Queries the Kubernetes API to get all Services and their endpoints
2. For each Service, tests connectivity from the current pod to the ClusterIP on the advertised port
3. Compares the iptables rules on the node (via `nsenter`) to the expected rules from the Service configuration
4. Reports discrepancies (e.g., "Service `model-server` has 3 pods but only 2 are in iptables rules")

**What you learn:** Kubernetes API, kube-proxy internals, network debugging in k8s.

---

### Topic 3.3 — Ingress, API Gateway & Traffic Management

#### What It Is
**Ingress** is how external traffic enters a Kubernetes cluster. An **Ingress Controller** (NGINX, Traefik, AWS ALB Ingress Controller) watches Ingress resources and programs an external load balancer. **API Gateways** (Kong, Ambassador) add authentication, rate limiting, and routing on top of Ingress.

#### Why It Matters for AI Infra
- Your ML inference API must be accessible externally. The path is: Internet → Load Balancer → Ingress Controller → Service → Pod (model server). Each hop adds latency and potential failure points.
- **Canary deployments for models:** Route 5% of traffic to `model-v2` Service, 95% to `model-v1` Service — configured via Ingress annotations. This is how you safely roll out new model versions.
- **Rate limiting:** Your inference API costs compute per request. An Ingress with rate limiting prevents a single client from exhausting your GPU fleet.

#### Micro-Project 3.3 — "ML Model A/B Traffic Router"
**Build:** Deploy two versions of a model server (v1 returns random numbers, v2 returns squares) in Kubernetes. Configure NGINX Ingress with: (1) 90/10 traffic split between v1/v2, (2) header-based routing (`X-Model-Version: v2` always goes to v2), (3) rate limiting at 100 req/s per IP, (4) metrics endpoint showing request count per version.  
**Verify:** Use `wrk` (HTTP benchmarking tool) to send 1000 requests and confirm the 90/10 split in the Ingress metrics.

---

### Topic 3.4 — Service Mesh: Istio & Envoy

#### What It Is
A service mesh adds a **sidecar proxy** (Envoy) to every pod automatically. All traffic in and out of the pod goes through the sidecar. This enables: **mTLS** (mutual TLS between all services, zero-trust), **traffic management** (weighted routing, circuit breaking, retries), **observability** (automatic metrics, logs, traces for every request). **Istio** is the control plane that configures all the Envoy sidecars.

#### Why It Matters for AI Infra
- **Shadow traffic testing:** Route 100% of production traffic to the current model AND a copy to the new model — silently, without clients knowing. Compare responses. This is how large ML teams validate new models before going live.
- **Circuit breaking:** If a model server becomes slow (GPU is saturated), the Istio circuit breaker stops sending new requests to it and returns an error immediately instead of queueing — preventing cascading failures.
- **mTLS everywhere:** In a multi-tenant ML platform, team A's model servers should never be accessible by team B's training jobs. Istio enforces this cryptographically.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Istio documentation: Concepts** | Docs | Clear conceptual overview. Read before labs. |
| **"Istio in Action"** — Posta & Calcote | Book | Best Istio book. Chapter 7 (traffic management) is directly applicable to ML. |
| **Envoy documentation: Architecture** | Docs | Understanding Envoy internals makes Istio debugging possible. |
| **Kiali dashboard** | Tool | Visual service mesh topology. Run during labs to see traffic flow. |

#### Micro-Project 3.4 — "ML Service Mesh with Shadow Testing"
**Build:** Deploy a 3-service ML pipeline (data preprocessor → model v1 → postprocessor) with Istio. Implement:
1. mTLS between all services (verify that direct pod-to-pod without mTLS is rejected)
2. Deploy model v2 alongside v1 with shadow traffic (all v1 requests mirrored to v2)
3. Circuit breaker on model v1 (if 3 consecutive 500 errors, open circuit for 10s)
4. Distributed tracing with Jaeger (see full request trace across all 3 services)
5. Kiali dashboard showing real-time service graph

---

### Topic 3.5 — eBPF: The Linux Kernel Networking Revolution

#### What It Is
**eBPF (extended Berkeley Packet Filter)** allows you to run verified programs inside the Linux kernel — including in the networking stack — without modifying kernel source code or loading kernel modules. eBPF programs are compiled to bytecode, verified for safety by the kernel, and JIT-compiled to native machine code. They run at kernel speed, in kernel context, with access to all kernel data structures.

**Where eBPF hooks into networking:**
- `XDP` (eXpress Data Path): before the kernel even processes a packet. 100+ Gbps packet processing.
- `tc` (Traffic Control): as packets enter/leave network devices.
- Socket filters: inspect traffic at specific sockets.
- kprobes/tracepoints: attach to any kernel function call.

#### Why It Matters for AI Infra
- **Cilium (best k8s CNI) is built on eBPF.** It replaces iptables entirely. eBPF-based routing is 3–5x faster for large clusters (10,000+ pods).
- **Cloudflare uses eBPF to process 100+ million HTTP requests/second.** Their DDoS mitigation drops malicious packets at XDP before they even reach the kernel networking stack.
- **Zero-overhead observability:** Pixie, Hubble (Cilium), and Tetragon use eBPF to trace every network connection, DNS query, and HTTP request in a cluster — without any application-side instrumentation. This is how you debug ML system networking in production.
- **For your AI anomaly detection project:** eBPF gives you nanosecond-granularity network data at kernel speed — no userspace overhead.

#### How to Learn It
1. **Start with Liz Rice's "What is eBPF?"** (O'Reilly free report) — 30 pages, the best intro.
2. **Run the BCC tools first** — pre-built eBPF programs that ship with Linux: `tcptracer`, `execsnoop`, `biolatency`. Run them on your machine and see what they show.
3. **Write your first eBPF program** using Python BCC bindings: a packet counter that counts packets per protocol.
4. **Learn XDP:** Write an XDP program that drops packets from a specific IP. This is how Cloudflare does DDoS mitigation.
5. **Explore Cilium's Hubble:** Deploy Cilium on a local k8s cluster, run Hubble, and observe all pod-to-pod network flows in real time.

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **"What is eBPF?"** — Liz Rice (O'Reilly) | Free report | Best intro. 30 pages. Read first. |
| **"Learning eBPF"** — Liz Rice | Book | The definitive eBPF book. Every chapter is dense and practical. |
| **BCC Tutorial** (github.com/iovisor/bcc) | Tutorial | Hands-on Python BCC examples. Best learning path. |
| **Cilium eBPF documentation** | Docs | Production eBPF networking. See how Cilium uses it. |
| **eBPF.io** | Website | Official hub. Tutorials, talks, playground. |
| **Brendan Gregg's eBPF blog** | Blog | The authority on eBPF performance tools. |

#### Micro-Project 3.5 — "eBPF Network Flow Tracer"
**Build:** Using Python BCC (BPF Compiler Collection), write an eBPF program that:
1. Attaches to the `tcp_connect` and `tcp_accept` kernel functions
2. For every TCP connection: records timestamp, source/dest IP, port, process name, PID
3. Computes per-connection latency (time from SYN to first data byte) by hooking `tcp_sendmsg`
4. Outputs a live table of active connections with latency percentiles (P50/P95/P99)
5. Detects and alerts on unusual connection patterns (port scanning: >20 SYNs to different ports from same IP in 1 second)

**What you learn:** eBPF kernel hooks, BCC Python API, kernel data structures, network connection lifecycle.

**Deep extension:** Write an XDP program that rate-limits connections from a specific subnet to 100 connections/second. Verify it works with `hping3`.

---

### ★ FLAGSHIP PROJECT 3 — "ObserveML: Zero-Instrumentation ML Pipeline Monitor"

> **Combines:** Topics 3.1 (CNI/k8s networking), 3.4 (Istio/service mesh), 3.5 (eBPF)  
> **Timeline:** End of Month 6  
> **Difficulty:** Advanced — Kubernetes + eBPF + Python

**What you build:**  
Deploy a 4-stage ML inference pipeline in Kubernetes:
`client → preprocessing service → model server (TorchServe) → postprocessing service → response`

Without modifying any application code, instrument the entire pipeline using eBPF (via Cilium Hubble and custom BCC programs) to produce:

1. **Automatic service topology map:** Shows all communication paths, current traffic rates, error rates — pulled directly from eBPF without any application metrics
2. **Per-request latency breakdown:** For each stage of the pipeline, P50/P95/P99 latency — eBPF hooks on socket operations
3. **Anomaly detection:** Baseline normal traffic patterns (request size distribution, inter-arrival times). Alert when current traffic deviates by >2σ
4. **Security events:** Log any connection attempt to a service that violates NetworkPolicy (should be blocked by Cilium)
5. **Grafana dashboard:** Everything in one view with time-series graphs

**Tech stack:** Kubernetes (k3s), Cilium + Hubble, Python BCC, Prometheus, Grafana, TorchServe

**Why this is impressive:**  
- Zero application code changes — observability comes from the infrastructure layer
- Demonstrates deep understanding of both networking and ML systems
- This is exactly how companies like Datadog, New Relic, and Honeycomb build their agents

---

## Phase 4: AI Cluster Networking — The Differentiator

**Duration:** Months 7–9  
**Tools:** PyTorch DDP, NCCL test suite, ibverbs perftest (or simulated via Docker), NVIDIA documentation  
**Goal:** Understand the networking that makes large-scale AI training possible. This is the rarest and most valuable skill in AI infrastructure.

> **Context:** Training GPT-4 required ~25,000 A100 GPUs running for ~90 days. Every second those GPUs spend waiting for gradient synchronization (AllReduce) over the network is $8,000 of compute wasted. The network design of a GPU cluster directly determines training cost and speed. This is why NVIDIA sells InfiniBand switches for $100,000+ each.

---

### Topic 4.1 — Why Standard Networking is Too Slow for AI Training

#### What It Is
In distributed AI training, after each batch forward+backward pass, all GPUs must synchronize their gradients via **AllReduce** — every GPU sends its gradients to all others and receives all others' gradients. With 8,000 GPUs and 140GB of gradients (GPT-4 scale), this communication happens every 1–2 seconds.

**The math of why Ethernet TCP fails:**
- TCP handshake: ~1.5 RTT = 3μs (even on 100Gbps local network)
- TCP stack overhead: ~5–15μs kernel processing per message
- For 8,000 GPU AllReduce with ring algorithm: 2×(N-1) communication steps
- At 8,000 GPUs: 15,994 message exchanges × 10μs TCP overhead = **160ms pure overhead**
- Compared to actual computation time of 200ms per step: the network adds 80% overhead
- **Result:** GPU utilization drops below 50%

**What RDMA achieves:**
- Direct memory transfer: 1–3μs end-to-end
- Zero CPU involvement
- For the same 8,000 GPU AllReduce: ~15ms network time
- GPU utilization: >90%

#### How to Learn It
1. **Run a PyTorch DDP benchmark** on your own machine with 2 GPUs or 2 CPU processes. Measure time per step. Then artificially add latency (using `tc netem delay 10ms`) and see the training throughput drop.
2. **Read the NCCL paper:** "Optimizing Performance of Collective Communication Primitives" (NVIDIA). Short, readable, explains ring-AllReduce algorithm.
3. **Calculate BDP** (Bandwidth-Delay Product) for a GPU cluster: bandwidth × RTT = how much data is "in flight." This tells you the buffer sizes needed.
4. **Study the roofline model** for distributed training: compute-bound vs communication-bound. At what model size does the network become the bottleneck?

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **"Efficient Training of Very Deep Neural Networks for Supervised Hashing"** — Ring-AllReduce explanation | Blog | Baidu's blog post explaining ring-AllReduce algorithm clearly. |
| **Hugging Face: "Model Parallelism"** | Blog | Best practical guide to distributed training communication patterns. |
| **Semianalysis: "AI Cluster Networking"** blog | Blog | Deep technical analysis of real GPU cluster networking. Highly recommended. |
| **PyTorch Distributed Training documentation** | Docs | Official. Covers DDP, FSDP, communication primitives. |
| **NVIDIA NCCL documentation** | Docs | The actual communication library. Read the architecture section. |

#### Micro-Project 4.1 — "AllReduce Communication Simulator"
**Build:** Python simulation (no GPU needed) of the ring-AllReduce algorithm:
1. Simulate N workers, each with a gradient tensor of size G
2. Implement the two-phase ring-AllReduce: reduce-scatter phase, then all-gather phase
3. Measure simulated communication time as a function of N workers and G gradient size
4. Compare ring-AllReduce vs naive parameter server (all workers send to one central server)
5. Add network latency simulation: inject random delays representing TCP overhead vs RDMA overhead
6. Plot: training throughput vs number of workers for both approaches

**What you learn:** Why ring-AllReduce is O(2(N-1)/N × G) and why it scales perfectly. Why parameter servers become bottlenecks. Why RDMA matters.

---

### Topic 4.2 — RDMA: Remote Direct Memory Access

#### What It Is
RDMA allows a network card (HCA — Host Channel Adapter) to **directly read from or write to the memory of a remote machine** without involving the remote machine's CPU or OS. The data path completely bypasses the kernel networking stack. This is implemented using the **InfiniBand Verbs API** (or its Ethernet equivalent, RoCE).

**The key operations:**
- **RDMA Write:** Write data directly into a pre-registered memory region of the remote host. Remote CPU is never interrupted.
- **RDMA Read:** Pull data from remote memory into local memory. No message on the remote side.
- **Send/Receive:** Traditional message passing, but still bypassing OS stack. Sub-microsecond latency.

**How it works (simplified):**
1. Both sides register memory regions with the HCA: `ibv_reg_mr()`
2. HCA pins the memory (prevents OS from paging it out)
3. Sender posts a "work request" to a "send queue" in the HCA
4. HCA DMA's data from local memory onto the wire
5. Remote HCA DMA's received data directly into pre-registered remote memory
6. Remote CPU is never involved — the operation completes via a "completion queue event"

#### Why It Matters for AI Infra
- NCCL uses RDMA internally when InfiniBand or RoCE is available
- GPUDirect RDMA combines this with GPU memory registration — so the HCA DMA's directly from GPU VRAM over the network without CPU or system RAM involvement
- Understanding RDMA explains why GPU cluster networking is architecturally different from regular networking — it's not just "faster Ethernet"

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Mellanox (NVIDIA) RDMA Aware Networks Programming Manual** | PDF | The canonical RDMA reference. Deep, technical, complete. |
| **"RDMA over Commodity Ethernet (RoCE)"** — IBTA specification overview | Doc | Explains RoCEv2 architecture. |
| **rdmamojo.com** — Dotan Barak's blog | Blog | Best RDMA blog on the internet. Written by an RDMA expert. |
| **"High Performance Computing: RDMA Concepts"** — Cluster Computing course | Lecture notes | Stanford/MIT HPC course materials. Free online. |

#### Micro-Project 4.2 — "RDMA Performance Analyzer"
**Build:** A Python tool that (using the `pyverbs` library or simulating with shared memory + semaphores) benchmarks RDMA-like data transfers:
1. Measure latency for 1B/4KB/64KB/1MB transfers between two processes (simulating two network nodes)
2. Plot latency vs message size curve
3. Compare against TCP socket performance for the same message sizes
4. Calculate maximum theoretical RDMA bandwidth: `throughput = message_size / (RTT/2)`
5. Identify the "break-even" point where RDMA outperforms TCP

**What you learn:** Latency vs bandwidth trade-off for different message sizes — the same curve that determines NCCL algorithm selection in PyTorch.

---

### Topic 4.3 — InfiniBand: The AI Training Standard

#### What It Is
InfiniBand (IB) is a high-performance interconnect specifically designed for HPC and AI. Key properties:
- **Native RDMA** support (built into the protocol, not added on top)
- **Lossless fabric**: Uses hardware flow control (Credits) to guarantee no packet drops
- **Low latency**: ~1 microsecond end-to-end
- **High bandwidth**: NDR InfiniBand = 400 Gbps per port

**IB network components:**
- **HCA (Host Channel Adapter):** The NIC equivalent for InfiniBand, installed in each GPU server
- **InfiniBand Switch:** High-radix switches (e.g., NVIDIA QM9700, 64 ports × 400 Gbps)
- **Subnet Manager:** Software (OpenSM) that configures the entire IB fabric — assigns LIDs (addresses), computes routes, programs switches. No human-configured routing tables.
- **Fat-tree topology:** Standard for AI clusters. 2-tier or 3-tier, provides full bisection bandwidth.

**Generations:**
- SDR: 10 Gbps
- FDR: 56 Gbps
- EDR: 100 Gbps
- HDR: 200 Gbps (H100 DGX A100)
- NDR: 400 Gbps (current H100 HGX/DGX H100)
- XDR: 800 Gbps (upcoming Blackwell GB200 NVL72)

#### Why It Matters for AI Infra
- Every major AI lab's training infrastructure uses InfiniBand: OpenAI, Google DeepMind, Anthropic, Meta, Microsoft
- Job descriptions for "AI Infrastructure Engineer" at NVIDIA, CoreWeave, Lambda Labs, Crusoe Energy all list InfiniBand experience
- Understanding IB architecture lets you read GPU cluster performance benchmarks meaningfully

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **NVIDIA InfiniBand Architecture Specification** | Spec | The canonical reference. Dense but complete. |
| **NVIDIA DGX SuperPOD Architecture Guide** | Technical doc | Real production AI cluster design with InfiniBand. Invaluable. |
| **"InfiniBand Trade Association (IBTA)" — Architecture Overview** | White paper | Best intro to IB concepts. |
| **Semianalysis: "AI Cluster Networking Deep Dive"** | Blog | Best analysis of real GPU cluster network designs. |
| **OpenSM documentation** | Docs | The actual subnet manager used in production IB fabrics. |

#### Micro-Project 4.3 — "InfiniBand Fabric Simulator"
**Build:** A Python simulation of a complete InfiniBand fat-tree fabric:
1. Create a k-ary fat-tree topology with k=4 (16 hosts, 10 switches)
2. Implement the Subnet Manager: automatically assign LIDs to all ports and compute linear forwarding tables for all switches using Dijkstra's algorithm
3. Simulate AllReduce traffic: all hosts simultaneously send gradient data using ring-AllReduce
4. Measure simulated bisection bandwidth utilization
5. Introduce a switch failure and show how the SM reconverges (recomputes routes)
6. Visualize the topology with NetworkX and matplotlib

**What you learn:** IB fat-tree routing, subnet manager function, resilience. This is the type of simulation NVIDIA uses to validate new IB switch designs.

---

### Topic 4.4 — RoCE: RDMA over Converged Ethernet

#### What It Is
**RoCEv2** (RDMA over Converged Ethernet version 2) is InfiniBand's semantics (RDMA verbs API) running over UDP/IP on standard Ethernet infrastructure. It is cheaper than InfiniBand (standard 100/400GbE NICs instead of IB HCAs and switches) and more flexible (Ethernet is everywhere). But Ethernet is not inherently lossless — you need:

- **Priority Flow Control (PFC):** Pause frames at L2 that tell the sender to stop transmitting when a receiver's buffer fills. Creates a lossless path.
- **ECN (Explicit Congestion Notification):** Routers mark packets when buffers are filling, so senders can slow down before dropping occurs.
- **DCQCN (Data Center Quantized Congestion Notification):** The congestion control algorithm for RoCE, combining ECN feedback with DCTCP-like rate reduction.

**Who uses RoCE:** Meta (Llama training on 24,576 GPUs), Microsoft Azure (HBv4 instances), ByteDance, Alibaba. The "Ethernet for AI" movement is essentially RoCE adoption.

#### Why It Matters for AI Infra
- RoCE is increasingly preferred for AI training clusters because Ethernet ecosystem is mature, cheaper, and allows converged networking (storage + compute + RDMA on same cables)
- Understanding PFC storms (a type of deadlock where PFC pause frames propagate in a loop) is critical for operating stable RoCE clusters
- "Lossless Ethernet" configuration is a required skill for AI infrastructure at hyperscalers

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Meta's blog: "Introducing Meta's AI Research SuperCluster"** | Blog | Real RoCE deployment at 24,576 GPU scale. |
| **Microsoft Research: "RoCEv2 Congestion Control"** | Paper | How DCQCN works. Essential for understanding RoCE stability. |
| **NVIDIA RoCE Configuration Guide** | Technical doc | Production RoCE configuration for AI clusters. |
| **Chelsio: "Understanding RoCE"** | White paper | Clear technical overview of RoCEv2 mechanics. |

---

### Topic 4.5 — NCCL, GPUDirect & the PyTorch Communication Stack

#### What It Is
**NCCL (NVIDIA Collective Communications Library)** implements collective operations (AllReduce, AllGather, ReduceScatter, Broadcast, Scatter, Gather) optimized for NVIDIA GPUs. It automatically selects the best algorithm (ring vs tree) based on the number of GPUs and message size. It transparently uses NVLink (intra-node), InfiniBand, or RoCE (inter-node) based on what's available.

**GPUDirect RDMA:** NCCL can DMA GPU memory directly over the network card (if GPUDirect is available) — bypassing CPU, system RAM, and PCIe round-trips. This is the maximum performance path for inter-node GPU communication.

**NVLink:** NVIDIA's proprietary GPU-to-GPU interconnect within a node. H100 NVLink provides 900 GB/s total bandwidth (vs PCIe 5.0's 128 GB/s). Within a DGX H100 (8 GPUs), NVLink AllReduce is ~100x faster than PCIe.

#### Why It Matters for AI Infra
- When your distributed training job is running slow, you check: (1) `NCCL_DEBUG=INFO` output to see which transport NCCL is using, (2) NCCL test benchmarks to establish baseline, (3) GPU utilization to see if it's compute-bound or communication-bound
- Understanding NCCL algorithm selection (ring vs tree) explains why performance degrades differently for different batch sizes and model sizes
- NCCL bus bandwidth is the key metric in GPU cluster spec sheets

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **NCCL documentation** | Docs | Official. Read "NCCL Algorithms" section carefully. |
| **"Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM"** — Narayanan et al. | Paper | Shows real training throughput with NCCL at scale. |
| **Lambda Labs: "NCCL Performance Guide"** | Blog | Practical NCCL debugging and optimization guide. |
| **PyTorch distributed documentation** | Docs | DDP, FSDP, DeviceMesh — the API over NCCL. |

#### Micro-Project 4.5 — "NCCL Training Throughput Analyzer"
**Build:** A Python tool using PyTorch that:
1. Runs distributed training with 4+ processes (using `torch.distributed` with `gloo` backend — no GPU required)
2. Instruments NCCL/Gloo AllReduce calls to measure communication time
3. Sweeps over model sizes (10M, 100M, 1B parameters) and batch sizes
4. For each configuration: records compute time, communication time, GPU utilization, achieved AllReduce bandwidth
5. Identifies whether each configuration is compute-bound or communication-bound
6. Plots "roofline model": theoretical peak vs actual performance

**What you learn:** Real distributed training profiling. This is how ML infrastructure teams diagnose slow training runs.

---

### ★ FLAGSHIP PROJECT 4 — "AINet: Distributed Training Network Performance Lab"

> **Combines:** Topics 4.1 (Why standard networking fails), 4.2 (RDMA concepts), 4.4 (RoCE/congestion), 4.5 (NCCL)  
> **Timeline:** End of Month 8  
> **Difficulty:** Advanced — PyTorch distributed + network simulation + data analysis

**What you build:**  
A complete distributed training network characterization toolkit that simulates a GPU cluster environment (no actual GPUs needed — uses CPU processes + Linux `tc` for network simulation):

**Component 1: Network Condition Simulator**
- Uses Linux `tc netem` to inject realistic network conditions: baseline (0.1ms RTT, 100Gbps), congested Ethernet (5ms RTT, packet loss 0.01%), lossless RoCE (0.5ms RTT, 0 loss), InfiniBand-like (0.05ms RTT, 0 loss)
- Switchable between conditions during training

**Component 2: Distributed Training Harness**
- 4-process PyTorch DDP training on a small GPT-2 architecture
- Custom communication hook to measure per-AllReduce latency and bandwidth
- Records: time-to-convergence, training throughput (samples/sec), AllReduce efficiency (actual vs theoretical)

**Component 3: Analysis Dashboard**
- For each network condition: training throughput, communication overhead %, AllReduce latency distribution
- Compute "communication tax": percentage of step time spent waiting for AllReduce
- Recommendation engine: "For this model size on this network, use ring-AllReduce with chunked gradient compression"

**Component 4: Experiment Report**
- Automated generation of a PDF report with methodology, results, and conclusions
- Publishable quality — this is the type of infrastructure benchmarking paper that gets attention

---

## Phase 5: Observability & Network Performance Engineering

**Duration:** Months 9–11  
**Tools:** Prometheus, Grafana, OpenTelemetry, Jaeger, eBPF/Pixie, iperf3  
**Goal:** Operate ML infrastructure at production scale. Find and fix performance problems before they cost money or break SLOs.

> **The cost of not doing this:** A 512-GPU training job running at 60% GPU utilization instead of 85% due to a network bottleneck costs ~$8,000/day in wasted compute. Network observability is how you find the 25% that's being wasted.

---

### Topic 5.1 — Metrics, Monitoring & Alerting: Prometheus + Grafana

#### What It Is
**Prometheus** is a time-series database and scraping system. Services expose metrics via an HTTP `/metrics` endpoint (in Prometheus text format). Prometheus scrapes these endpoints on a schedule, stores the data, and makes it queryable via PromQL. **Grafana** connects to Prometheus (and other data sources) and provides dashboards, graphs, and alerting.

**Key concepts:**
- **Counter:** Monotonically increasing. Example: total requests served. Never decreases.
- **Gauge:** Current value, can go up or down. Example: current active connections.
- **Histogram:** Distribution of values. Example: request latency distribution. Stored as buckets.
- **PromQL:** Prometheus Query Language. `rate(http_requests_total[5m])` = requests/second over last 5 minutes.

#### Why It Matters for AI Infra
Critical ML infrastructure metrics to instrument and alert on:
- **Training throughput:** samples/sec — should be constant; a drop means a network or compute bottleneck
- **AllReduce latency P99:** >10ms on a local cluster indicates network congestion or stragglers
- **GPU link utilization:** NVLink/InfiniBand port utilization; saturation means you're network-bound
- **Inference latency P99:** Your SLO for model serving; exceeding it means customer impact
- **Pod-to-pod error rate:** Packet errors, retransmits on pod network indicate CNI or physical issues

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **Prometheus documentation** | Docs | Complete reference. Read "Data Model" and "PromQL" sections. |
| **"Prometheus: Up & Running"** — Brazil & Agarwal | Book | Best Prometheus book. Practical and complete. |
| **Grafana documentation: Dashboards** | Docs | Official. Build your first dashboard here. |
| **MLflow + Prometheus integration guide** | Blog | ML-specific metrics instrumentation patterns. |

#### Micro-Project 5.1 — "ML Infrastructure Prometheus Exporter"
**Build:** A custom Prometheus exporter in Python that exposes ML-specific metrics:
1. `ml_training_throughput_samples_per_sec` — gauge, updated by training job
2. `ml_allreduce_duration_seconds` — histogram, measures each AllReduce operation
3. `ml_gpu_memory_used_bytes` — gauge per GPU (using pynvml)
4. `ml_model_serving_request_latency_seconds` — histogram per model version
5. `ml_dataloader_batch_load_time_seconds` — histogram, data loading time
6. Deploy in Kubernetes (as a sidecar to training pod), scrape with Prometheus, build Grafana dashboard with: throughput trend, latency heatmap, GPU memory utilization

---

### Topic 5.2 — Distributed Tracing: OpenTelemetry & Jaeger

#### What It Is
**Distributed tracing** tracks a single request as it flows through multiple services, recording how long each hop takes. A **trace** is a tree of **spans**. Each span has: service name, operation name, start time, duration, status, and tags. **OpenTelemetry (OTel)** is the unified SDK (language libraries, collector) for emitting traces, metrics, and logs. **Jaeger** is a trace visualization and storage backend.

#### Why It Matters for AI Infra
A user request to your ML API might traverse: `API Gateway → Auth Service → Preprocessing → Model Server → Postprocessing`. With distributed tracing, you see that `Preprocessing` takes 200ms of your 300ms total latency — and you can drill into why (is it a data fetch? a CPU bottleneck? network to a database?).

Without tracing, you're looking at aggregate latency graphs and guessing where the time went.

#### Micro-Project 5.2 — "Full-Trace ML Inference Pipeline"
**Build:** A 3-service ML inference pipeline (preprocessor → model → postprocessor) with complete OpenTelemetry instrumentation:
- Auto-instrumentation for all HTTP/gRPC calls (OTel auto-instrument)
- Manual spans for: feature extraction time, model inference time, postprocessing time
- Custom attributes: model version, input size, batch size
- Deployed in Kubernetes with Jaeger collector
- Build a Grafana panel showing P99 latency per pipeline stage from the Jaeger data

---

### Topic 5.3 — Network Performance Testing & Benchmarking

#### What It Is
Before deploying ML workloads, you need to baseline and verify your network performance. Standard tools:

- **iperf3:** TCP/UDP bandwidth test between two endpoints. Measures maximum achievable throughput.
- **qperf:** Latency and bandwidth test, especially for RDMA networks (supports IB verbs).
- **perftest** (ibverbs): InfiniBand/RoCE RDMA benchmarks — `ib_write_bw`, `ib_read_lat`, `ib_send_bw`. The standard for HPC network acceptance testing.
- **NCCL tests:** `all_reduce_perf`, `all_gather_perf` — test collective performance at GPU cluster scale.
- **wrk / hey:** HTTP load testing for inference API benchmarking.
- **netperf:** Network performance test. Good for TCP latency measurement.

**What to measure:**
- Unidirectional bandwidth (maximize throughput one direction)
- Bidirectional bandwidth (both directions simultaneously — different from unidirectional)
- Latency at different message sizes (plot latency vs message size curve)
- Bandwidth at different message sizes (plot bandwidth vs message size curve)
- Jitter (standard deviation of latency) — critical for training stability

#### Best Resources
| Resource | Type | Why This One |
|----------|------|-------------|
| **iperf3 documentation** | Docs | Short, complete. Learn all flags. |
| **NCCL Tests GitHub** | Tool | Official NCCL benchmark suite. Used by every GPU cloud provider. |
| **Cloudflare Blog: "Measuring network latency"** | Blog | Deep analysis of how to measure network performance correctly. |

#### Micro-Project 5.3 — "Network Acceptance Test Suite"
**Build:** A Python test suite that, given a set of nodes (or containers on localhost), automatically runs a full network acceptance test battery:
1. iperf3 bandwidth test (TCP and UDP, 1/10/100 second durations)
2. Latency sweep (message sizes: 1B, 64B, 1KB, 64KB, 1MB, 10MB)
3. Bidirectional bandwidth test
4. Jitter measurement (UDP with timestamps)
5. AllReduce benchmark (using PyTorch `dist.all_reduce` with timing)
6. Output: pass/fail report with comparison against expected baselines
7. Auto-detects if a network is "AI training ready" based on latency/bandwidth thresholds

**Real-world use:** This is what data center operations teams run when new GPU nodes arrive to verify the interconnect is working correctly.

---

### Topic 5.4 — Security: Network Threat Modeling for ML Systems

#### What It Is
Threat modeling for ML infrastructure networks: systematically identifying what can go wrong, who might cause it, and how to prevent it.

**ML-specific threats:**
- **Model exfiltration:** Attacker copies model weights via unrestricted egress
- **Training data poisoning via MITM:** Attacker intercepts training data pipeline and inserts adversarial examples
- **GPU cryptojacking:** Compromised ML container starts mining cryptocurrency
- **Gradient leakage:** Gradients flowing over the network can reveal training data under reconstruction attacks
- **Supply chain:** Compromised Python package makes outbound connections to attacker's C2 server
- **Inference API abuse:** Reverse engineer model via excessive querying

**Defenses:**
- **Egress filtering:** Training nodes should only reach S3/GCS for data, not arbitrary internet
- **mTLS everywhere:** Cilium or Istio mTLS ensures only known services can communicate
- **Network segmentation:** Training VLAN separate from serving VLAN; no direct communication
- **Rate limiting:** On inference API and model artifact registry
- **Audit logging:** VPC flow logs, Hubble network flows, alert on anomalies

#### Micro-Project 5.4 — "ML Security Network Scanner"
**Build:** A Kubernetes-native security scanner that:
1. Enumerates all pods and their network connectivity (using Kubernetes API + iptables inspection)
2. Tests each pod for unexpected egress (can it reach 8.8.8.8? 1.1.1.1? arbitrary IPs?)
3. Checks for missing mTLS (pods communicating without TLS)
4. Verifies NetworkPolicy coverage (are there pods with no NetworkPolicy — unprotected?)
5. Generates a network security posture report: severity-ranked findings with remediation

---

### ★ FLAGSHIP PROJECT 5 — "SentinelNet: ML Infrastructure Security & Observability Platform"

> **Combines:** Topics 5.1 (Prometheus), 5.2 (Tracing), 5.3 (Benchmarking), 5.4 (Security) + eBPF from Phase 3  
> **Timeline:** End of Month 10  
> **Difficulty:** Production-grade system design

**What you build:**  
A unified observability and security platform for ML infrastructure, running in Kubernetes, providing:

**Layer 1: Performance Observability**
- Prometheus exporters for: training throughput, AllReduce latency, GPU utilization, inference latency
- Grafana dashboard: "ML Cluster Health" — 12 panels showing every critical metric
- Automated baseline learning: normal distribution of each metric over 24 hours
- Smart alerting: alert only when metric is 2σ outside baseline (not just threshold)

**Layer 2: Request Tracing**
- OpenTelemetry auto-instrumentation for all ML services
- Jaeger backend for trace storage and querying
- Custom trace analysis: "find all requests where model inference > 200ms" 

**Layer 3: eBPF Security Monitoring**
- Custom eBPF program (via Cilium Tetragon or BCC) that monitors:
  - All outbound connections from training pods (alert on unknown IPs)
  - Unusual file access patterns (model weight files being read by unknown processes)
  - CPU/GPU usage spikes inconsistent with training job pattern
- Security event timeline with severity levels

**Layer 4: Automated Network Benchmarking**
- Nightly benchmark job: runs iperf3, AllReduce test, inference latency test
- Compares to previous night's baseline
- Alerts on >5% degradation (indicates network regression from a config change)

**Output:** A GitHub repository with complete Kubernetes manifests, Helm chart, runbook documentation, and a 5-minute demo video. This is a portfolio project that can be shown in technical interviews.


---

## The Final Capstone Project

**Duration:** Months 11–14  
**This is the project that goes on your resume, GitHub, and LinkedIn.**

---

### CAPSTONE: "NeuralFabric — Production AI Infrastructure Stack with Intelligent Network Management"

> **Real-world problem it solves:** Running AI training and inference at scale costs $10–50k/day in GPU compute. Network inefficiencies silently waste 20–40% of that budget. There are no open-source tools that give you a complete picture of where the network is costing you money and what to do about it. This project builds that tool — combining networking theory, ML, and systems engineering.

---

#### The Architecture

**System Overview:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    NeuralFabric Platform                         │
│                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │  Network    │   │  Training   │   │  Inference          │    │
│  │  Collector  │   │  Cluster    │   │  Cluster            │    │
│  │  (eBPF)     │   │  (DDP)      │   │  (TorchServe)       │    │
│  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘    │
│         │                 │                      │               │
│  ┌──────▼─────────────────▼──────────────────────▼──────────┐    │
│  │              Telemetry Pipeline (Kafka)                   │    │
│  └──────────────────────────┬────────────────────────────────┘    │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐    │
│  │           Intelligence Layer (Python + ML)                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │    │
│  │  │  Anomaly     │  │  Bottleneck  │  │  Cost           │ │    │
│  │  │  Detection   │  │  Identifier  │  │  Optimizer      │ │    │
│  │  │ (Isolation   │  │  (causal     │  │  (recommends    │ │    │
│  │  │  Forest)     │  │  analysis)   │  │  config fixes)  │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │    │
│  └──────────────────────────┬────────────────────────────────┘    │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐    │
│  │        Dashboard + Alerting (Grafana + PagerDuty)         │    │
│  └───────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

#### Component 1: Network Data Collection Layer

**What it does:** Collects comprehensive network telemetry from every level of the stack.

**Sub-component A — eBPF Kernel Collector:**
- Custom BCC program that hooks into: `tcp_connect`, `tcp_accept`, `tcp_sendmsg`, `tcp_recvmsg`, `udp_sendmsg`, kernel NCCL hooks
- Collects per-flow: bytes transferred, packets, retransmits, RTT samples, connection duration
- Runs on every Kubernetes node, streams events to Kafka
- Zero application instrumentation required

**Sub-component B — NCCL Profiler:**
- Custom NCCL plugin (using NCCL net plugin API) that intercepts all collective operations
- Records: operation type, data size, start/end time, achieved bandwidth, algorithm used
- Streams to Kafka with training job metadata (step number, epoch, model name)

**Sub-component C — Inference API Tracer:**
- OpenTelemetry auto-instrumentation on TorchServe
- Captures: request latency, queuing time, preprocessing time, inference time, postprocessing time
- Tagged with: model version, request size, client ID

**Sub-component D — Infrastructure Metrics:**
- Prometheus node-exporter: NIC utilization, packet drops, errors per interface
- Kubernetes cadvisor: pod-level network I/O
- GPU metrics via DCGM exporter: NVLink utilization (if GPUs available)

---

#### Component 2: Telemetry Pipeline

**Apache Kafka** serves as the central nervous system:
- Topic: `network.flows` — eBPF connection events (high volume, millisecond latency)
- Topic: `nccl.operations` — AllReduce/AllGather timing data
- Topic: `inference.traces` — OpenTelemetry spans from model server
- Topic: `infra.metrics` — Prometheus scrape data

**Why Kafka:** At 100 GPU scale, network events are ~50,000 events/second. Kafka handles this without losing data, and allows multiple consumers (anomaly detector, cost analyzer, storage) to process independently.

**Stream processor (Faust or Apache Flink):**
- Real-time aggregation: per-minute AllReduce latency statistics, per-training-step communication time
- Windowed anomaly scoring: 5-minute rolling window of each metric
- Flow correlation: join eBPF events + NCCL events to identify which application caused which network flow

---

#### Component 3: Intelligence Layer

**Module A — Anomaly Detection:**
- **Isolation Forest** trained on 24 hours of baseline "healthy" metrics
- Features: AllReduce latency, packet retransmit rate, inference P99, NIC utilization per pod, DNS query rate
- Online scoring: each incoming minute's metrics is scored for anomaly
- **Alert when:** anomaly score > threshold, with root cause analysis ("AllReduce latency spiked 3x, correlated with increased packet retransmits on node-07, likely physical link issue")

**Module B — Training Bottleneck Identifier:**
- Per training step: what fraction of time was compute vs AllReduce wait vs data loading?
- Identifies: "Your model is communication-bound — reducing gradient precision from FP32 to FP16 would improve throughput by ~40%"
- Detects straggler nodes: "GPU node-12 is consistently 200ms slower than others — it's delaying all nodes due to AllReduce synchronization"

**Module C — Cost Optimizer:**
- Given: GPU hourly cost, training throughput, model size, network configuration
- Computes: wasted GPU cost due to network inefficiency (in rupees and dollars)
- Recommends: specific configuration changes with predicted throughput improvement and cost savings
- Example output: "Current AllReduce efficiency: 68%. Switching to FSDP with gradient compression would save ₹12,000/day on this training run."

**Module D — Capacity Planner:**
- Given: planned model size (parameters), target training batch size, available GPU count
- Predicts: required network bandwidth, expected AllReduce time, training throughput, total training time and cost
- Validates: is the available network infrastructure sufficient? What will be the bottleneck?

---

#### Component 4: Dashboard & Alerting

**Grafana dashboards:**

1. **"Cluster Pulse"** — Real-time overview: training throughput trend, current AllReduce latency, inference P99, active anomaly count
2. **"Training Deep Dive"** — Per-step compute/communication breakdown, gradient bandwidth efficiency, straggler detection
3. **"Inference Performance"** — Request rate, latency distribution, model version comparison, error rate
4. **"Network Health"** — Per-node NIC utilization, packet error rates, DNS resolution times, connection state distribution
5. **"Security Events"** — Unusual outbound connections, policy violations, authentication anomalies

**Alerting:**
- Severity P0: training job stopped (throughput = 0), inference API down
- Severity P1: training throughput dropped >20%, inference P99 > SLO
- Severity P2: anomaly detected, network efficiency < 70%
- Severity P3: cost waste > ₹5,000/hour, straggler node detected

---

#### Component 5: Experiments & Novel Contribution

This is what elevates it from "good project" to "publishable-quality work."

**Experiment 1 — "The Communication Tax Study":**  
Systematically measure communication overhead as a percentage of total training time for different: model sizes (10M, 100M, 1B params), GPU counts (1, 2, 4, 8, 16 simulated workers), network conditions (LAN, WAN latency, lossy), and AllReduce algorithms (ring, tree, recursive halving).  
**Hypothesis to test:** "Is there a crossover point where tree-AllReduce outperforms ring-AllReduce on high-latency networks?"  
**Expected output:** A paper-quality table + graph showing communication efficiency vs model size vs network quality.

**Experiment 2 — "eBPF vs Prometheus: Observability Overhead":**  
Compare CPU overhead and data granularity of: (A) pure eBPF-based collection vs (B) Prometheus scraping vs (C) application-level instrumentation.  
**Hypothesis:** eBPF provides higher-resolution data at lower overhead than application instrumentation.  
**Methodology:** Run identical workloads with each monitoring approach, measure: CPU overhead of monitoring agent, data granularity (events/sec), gaps in coverage.

**Experiment 3 — "Network Topology Impact on AllReduce Performance":**  
Using your topology simulator from Phase 4, and PyTorch DDP in simulation mode, compare AllReduce performance on: star topology (switch-based), fat-tree (2-tier), ring (direct connections).  
**Hypothesis:** Fat-tree provides 2–4x better AllReduce performance at 16+ nodes due to full bisection bandwidth.

---

#### What the Complete Project Looks Like

**GitHub repository structure:**
```
neuralFabric/
├── collector/
│   ├── ebpf_collector.py         # BCC eBPF programs
│   ├── nccl_profiler.py          # NCCL operation interceptor
│   └── otel_tracer.py            # OpenTelemetry instrumentation
├── pipeline/
│   ├── kafka_producer.py         # Telemetry → Kafka
│   └── stream_processor.py       # Faust stream processing
├── intelligence/
│   ├── anomaly_detector.py       # Isolation Forest model
│   ├── bottleneck_identifier.py  # Causal analysis
│   ├── cost_optimizer.py         # ROI calculator
│   └── capacity_planner.py       # Infra sizing tool
├── infra/
│   ├── terraform/                # VPC, EKS/k3s provisioning
│   ├── helm/                     # K8s manifests for all components
│   └── grafana_dashboards/       # Dashboard JSON exports
├── experiments/
│   ├── experiment1_comm_tax.py
│   ├── experiment2_ebpf_overhead.py
│   └── experiment3_topology.py
├── docs/
│   ├── architecture.md           # System design document
│   ├── runbook.md                # How to operate in production
│   └── paper_draft.md            # Experiment results write-up
└── README.md                     # With architecture diagram + demo GIF
```

**Deliverables:**
- Fully working system deployable with `helm install neuralFabric ./infra/helm`
- 3 experiments with results documented
- 5-minute demo video walking through a simulated training run with anomaly detection
- Blog post / paper draft suitable for submission to an AI/ML infrastructure conference (MLSys, SysML)

---

## Complete Resource Master List

### Books (buy these, they're investments)

| Book | Phase | Cost | Why |
|------|-------|------|-----|
| **Computer Networking: A Top-Down Approach** — Kurose & Ross | 1 | Free PDF | The foundational textbook. Use as reference throughout. |
| **TCP/IP Illustrated Vol.1** — Stevens | 1 | ~₹3,500 | The bible of TCP/IP. Use for deep dives. |
| **Terraform: Up & Running** — Brikman | 2 | ~₹2,000 | Best Terraform book. Chapters 1-4 alone worth it. |
| **Kubernetes in Action** — Luksa | 3 | ~₹3,000 | Best k8s book. Chapter 11 (networking) is essential. |
| **Learning eBPF** — Liz Rice | 3,5 | ~₹2,500 | Definitive eBPF book. Read cover to cover. |
| **Zero Trust Networks** — Gilman | 2,5 | ~₹2,000 | Best security architecture book for cloud. |
| **"Istio in Action"** — Posta & Calcote | 3 | ~₹2,000 | Definitive service mesh book. |

### Free Online Courses (structured learning)

| Course | Phase | Platform | Hours | Why |
|--------|-------|----------|-------|-----|
| **CS144: Introduction to Computer Networking** — Stanford | 1 | YouTube / cs144.github.io | 40h | World-class networking course. Free. Labs included. |
| **Jeremy's IT Lab CCNA** | 1 | YouTube | 100h | Best free practical networking course. |
| **AWS Certified Solutions Architect Associate** — Adrian Cantrill | 2 | cantrill.io (~$60) | 80h | Best AWS course for deep understanding, not just exam. |
| **Kubernetes and Cloud Native Associate** — KodeKloud | 3 | KodeKloud.com (~₹2,500/yr) | 40h | Best k8s hands-on course with labs. |
| **Cilium Getting Started** | 3 | cilium.io/labs | 10h | Free official Cilium labs. Excellent. |
| **PyTorch Distributed Training** — official | 4 | pytorch.org/tutorials | 20h | Official tutorials for DDP, FSDP, RPC. |
| **Linux Performance** — Brendan Gregg | 5 | brendangregg.com | Self-paced | Everything about Linux performance including networking. |

### Key Papers to Read (in order)

| Paper | Phase | Why |
|-------|-------|-----|
| **"A Scalable, Commodity Data Center Network Architecture"** — Al-Fares et al. 2008 | 1 | Invented fat-tree for data centers. 8 pages. Changed everything. |
| **"B4: Experience with a Globally-Deployed Software Defined WAN"** — Jain et al. 2013 | 2 | Google's SDN WAN. Real production SDN at scale. |
| **"Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center"** | 3 | Foundation for understanding Kubernetes resource management. |
| **"BBR: Congestion-Based Congestion Control"** — Cardwell et al. 2016 | 1,4 | Google's TCP algorithm. Essential for ML data pipeline performance. |
| **"Efficient Large-Scale Language Model Training on GPU Clusters"** — Narayanan et al. 2021 | 4 | Megatron-LM paper. Shows real NCCL AllReduce performance at 3072 GPU scale. |
| **"DCQCN: Congestion Control for Large-Scale RDMA Deployments"** — Zhu et al. 2015 | 4 | How RoCE congestion control works. Microsoft Research. |
| **"eBPF: A New Type of Software"** — Calavera et al. 2022 | 3,5 | Technical overview of eBPF by its creators. |
| **"Borg, Omega, and Kubernetes"** — Burns et al. 2016 | 3 | Google's evolution to Kubernetes. Explains design decisions. |

### YouTube Channels (subscribe to all)

| Channel | What You Get |
|---------|-------------|
| **Jeremy's IT Lab** | Best free CCNA-level networking content |
| **Liz Rice (Aqua Security)** | eBPF, container security, cloud native networking |
| **KodeKloud** | Kubernetes hands-on labs and explanations |
| **TGS (The Good Stuff)** | Cisco enterprise networking |
| **David Bombal** | Practical networking labs |
| **Packet Pushers** | Expert practitioner networking podcast |
| **MLOps Community** | ML infrastructure discussions |
| **NVIDIA Developer** | AI infrastructure, NCCL, InfiniBand talks |

### Blogs to Follow (read regularly)

| Blog | Phase | Quality |
|------|-------|---------|
| **Cloudflare Blog** (blog.cloudflare.com) | All | World-class. Deep technical posts on every networking topic. |
| **Julia Evans (jvns.ca)** | 1,3 | Best explanations of networking fundamentals. Must read. |
| **Brendan Gregg (brendangregg.com)** | 5 | The authority on Linux performance and eBPF. |
| **Ivan Pepelnjak (ipspace.net)** | 1,2,3 | Deep networking expertise. SDN, cloud, data center. |
| **Liz Rice (lizrice.com)** | 3 | eBPF, container networking. |
| **Semianalysis (semianalysis.com)** | 4 | Best AI infrastructure analysis. GPU clusters, AI economics. |
| **High Scalability** | All | System design case studies. How companies scale. |
| **The Morning Paper** | 4 | Academic papers summarized. |

---

## Weekly Schedule Template

### During University Semester (20h/week available)

```
WEEKDAYS (Mon–Fri):
  Morning (7:00–8:30): Read 1 chapter / 1 blog post / 1 paper section
  After college (18:00–20:00): Hands-on lab or project coding (2h)

WEEKEND:
  Saturday (3h): Project work — build the week's micro-project
  Sunday (2h): Review week's concepts, update notes, plan next week
```

### During Semester Break (40h/week available)

```
Morning block (9:00–13:00): Deep learning — textbook chapter + video + lab
Afternoon block (14:00–18:00): Project building
Evening (19:00–21:00): Reading — papers, blogs, next day's prep
```

---

## Career Milestones & What to Build By When

### 3 Months — Entry Level MLOps Intern Ready
- Phase 1 complete + NetSight project
- Can explain OSI/TCP from first principles
- Can write Wireshark filters and read packet captures
- GitHub: 1 public project (NetSight)

### 6 Months — MLOps Engineer (Junior) Ready
- Phase 1 + 2 complete + CloudNet project
- Can design and provision VPCs with Terraform
- Knows Kubernetes basics and pod networking
- GitHub: 2 public projects
- Start applying for MLOps internships at product companies

### 9 Months — MLOps Engineer (Mid-Level) Ready
- Phase 1 + 2 + 3 complete + ObserveML project
- Can deploy and operate ML models in Kubernetes
- Understands Cilium, Istio, eBPF
- GitHub: 3 public projects
- Apply for MLOps/SRE roles at cloud-native companies, startups

### 12 Months — AI Infrastructure Engineer Ready
- Phase 1–4 complete + AINet project
- Can reason about distributed training networking trade-offs
- Understands RDMA, InfiniBand, NCCL at conceptual level
- GitHub: 4 projects + NeuralFabric in progress
- Apply for AI infrastructure roles at AI-first companies (NVIDIA, CoreWeave, Lambda Labs)

### 14 Months — Senior / Specialist Trajectory
- All phases + NeuralFabric capstone complete
- Published the experiments write-up (blog post minimum, arxiv ideal)
- Has measurable, quantified outcomes from projects (e.g., "identified 35% training efficiency improvement")
- Apply for senior roles, research engineering positions, AI infra at hyperscalers

---

## How to Get the Most From This Curriculum

**Rule 1: Build before you're ready.**  
Start the micro-project for each topic before you feel you fully understand the topic. Confusion during building forces you to go back and learn exactly what you need. Passive reading produces no learning. Active building produces deep understanding.

**Rule 2: One Wireshark capture per topic.**  
For every networking concept in Phase 1, open Wireshark and find a real packet that demonstrates it. Making the abstract concrete in real captured data is the fastest path to genuine understanding.

**Rule 3: Write everything you learn.**  
Keep a personal wiki (Obsidian, Notion, or just markdown files). After each topic, write a 1-page explanation in your own words. If you can't explain it simply, you don't understand it yet. These notes become invaluable during interviews.

**Rule 4: Don't skip Phase 1.**  
Every Phase 2–5 concept has a Phase 1 root. Kubernetes CNI failures trace back to IP routing. RDMA performance traces back to TCP's limitations. eBPF traces back to kernel networking stack understanding. The foundation is not optional.

**Rule 5: Connect to cost.**  
For every networking concept you learn, ask: "how does this affect the cost or throughput of an ML system?" This trains the systems-thinking mindset that AI infrastructure roles require. The answer always exists — find it.

**Rule 6: Contribute publicly.**  
As you build micro-projects, write blog posts. "I implemented a DNS resolver from scratch and here's what I learned" gets more recruiter attention than any certification. Document your journey on LinkedIn and GitHub from Month 1.

---

*Last updated: 2026 | Curriculum version 1.0*  
*This document is a living guide — revisit and update as you progress through each phase.*
