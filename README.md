# SILLYCONE: Living Silicon Knowledge Graph & Spec Observatory ⚡

> **A Unified Directed Acyclic Graph (DAG) & Cross-Platform Hardware Intelligence Platform**  
> Tracking mobile SoCs, desktop CPUs, discrete GPUs, and foundry node dependencies alongside automated benchmark crawlers and a rumor-to-silicon delta tracker. Designed to run **100% Free ($0/month)**.

---

## 🌟 Architecture Overview

```
                      [The Semiconductor Web]
       (Geekbench Browser, Linux Kernel Commits, EEC Filings, Weibo)
                                  │
                                  ▼
     ┌────────────────────────────────────────────────────────┐
     │  GitHub Actions Autonomous Cloud Collector             │
     │  - Cron schedule: Every 6 hours ('0 */6 * * *')       │
     │  - Python crawler for Geekbench / Kernel patches       │
     │  - $0 compute / zero laptop battery used               │
     └────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
     ┌────────────────────────────────────────────────────────┐
     │  Supabase (PostgreSQL) Hybrid DB                       │
     │  - Foundry Nodes (TSMC N3E/N3P/N2, Intel 18A)          │
     │  - Microarchitectures (Oryon, Cortex-X925, Lion Cove)   │
     │  - Silicon Entities (Snapdragon, Dimensity, Arrow Lake)│
     │  - Normalized Multi-Suite Benchmarks (GB6, Time Spy)   │
     │  - Rumor Delta Records & Leaker Leaderboard            │
     └────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
     ┌────────────────────────────────────────────────────────┐
     │  Next.js 14 Web Application (Deployed on Vercel)       │
     │  - Interactive React Flow Canvas (DAG Dependency Tree) │
     │  - High-Density Spec Observatory (Filter & Sort Table) │
     │  - Cross-Platform Head-to-Head Comparison (IPC/Watt)   │
     │  - Leaker Accuracy Leaderboard & Verification Deltas   │
     └────────────────────────────────────────────────────────┘
```

---

## 🛠️ The $0/Month Tech Stack

| Layer | Technology | Free Tier Allotment | Role in Project |
|---|---|---|---|
| **Frontend & UI** | Next.js 14 (App Router) + Tailwind CSS | Unlimited static edge bandwidth | Blazing fast client CDN delivery |
| **Graph Visualizer** | `@xyflow/react` (React Flow) | Open-Source (MIT) | Interactive pan/zoom DAG hardware dependency canvas |
| **Database** | Supabase (PostgreSQL 15) | 500 MB DB storage | Relational & recursive graph hierarchy queries |
| **Ingestion Radar** | GitHub Actions Python Cron | 2,000 public runner min/mo | 24/7 background scrapers without needing your laptop |
| **Icons & Design** | Lucide React | MIT | High-density hardware & telemetry icons |

---

## 🚀 Getting Started

### 1. Run Next.js Locally
```bash
# Clone the repository and install dependencies
cd Sillycone
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

### 2. Setup Database (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase dashboard.
3. Paste and run the contents of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql).
4. Paste and run the contents of [`supabase/seed.sql`](./supabase/seed.sql) to populate initial data.

### 3. Setup Cloud Scraper Cron (GitHub Actions)
1. In your GitHub repository settings, go to **Settings > Secrets and variables > Actions**.
2. Add the following repository secrets:
   - `SUPABASE_URL`: Your Supabase Project URL (`https://your-project.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (from Project Settings > API)
3. The scraper will now automatically run every 6 hours via [`.github/workflows/silicon-radar.yml`](./.github/workflows/silicon-radar.yml)!

---

## 📊 Core Features

1. **Interactive DAG Canvas**:
   - Traces dependencies: Foundry Node → Packaging / Substrate → Microarchitecture Family → Physical Die Products.
   - Click any node to inspect cluster topologies, cache levels, and thermal envelopes.

2. **Unified Spec Observatory**:
   - Search across Mobile SoCs, Handheld APUs, Laptops, Desktop CPUs, and Discrete GPUs.
   - Sort by TDP, Geekbench 6 Single-Core, Multi-Core, or Spec Confidence score.

3. **Rumor-to-Silicon Delta Tracker**:
   - Tracks early leaks (Weibo, X, Chiphell) and measures mathematical error deltas when retail hardware hits the lab.
   - Computes an autonomous Leaker Accuracy Leaderboard.

4. **Cross-Platform Head-to-Head Compare**:
   - Compares power-constrained smartphone SoCs (e.g. Snapdragon 8 Elite at 6W) against desktop flagships (e.g. Core Ultra 9 285K at 125W) on Geekbench single-core per watt.
