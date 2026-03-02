# 📦 SiteFlow — Datacenter Construction Logistics App
## Full Research & Architecture Document

> **Author:** AI Research Assistant  
> **Date:** 2026-02-28  
> **Status:** Draft — awaiting review  
> **For:** Alex Talpig — Logistics Assistant Manager, Datacenter Construction

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [The Problem We're Solving](#2-the-problem-were-solving)
3. [Users & Roles](#3-users--roles)
4. [Feature Breakdown](#4-feature-breakdown)
5. [Recommended Tech Stack](#5-recommended-tech-stack)
6. [Free Tier Cost Analysis](#6-free-tier-cost-analysis)
7. [Database Design](#7-database-design)
8. [App Architecture](#8-app-architecture)
9. [AI Integration Strategy](#9-ai-integration-strategy)
10. [Development Roadmap](#10-development-roadmap)
11. [AI-Upgradeability Strategy](#11-ai-upgradeability-strategy)
12. [Risk Analysis](#12-risk-analysis)

---

## 1. Executive Summary

**SiteFlow** is a zero-cost, mobile-first logistics web application designed for datacenter construction sites. It replaces manual Excel tracking and paper-based delivery management with a modern, AI-powered system that:

- Lets unloading crew **snap photos** of trucks, materials, and documents → AI reads and organizes everything
- Gives managers a **real-time dashboard** answering: "How many deliveries today?", "What's missing?", "What's behind schedule?"
- Provides an **AI chat agent** that answers natural language questions about the database
- Costs **£0/month** using free tiers of modern cloud services
- **AI Material Discovery:** Automatically learns your site's random materials, translates foreign documents (German), and builds your inventory database from scratch with zero manual setup.

---

## 2. The Problem We're Solving

### Current Pain Points (from Knowledge Base)
| Problem | Impact |
|---------|--------|
| Drivers arrive without CMRs/TADs | Compliance risk, manual chasing |
| Delivery tracking is Excel-based | No real-time visibility, prone to human error |
| Documents are physically in a cabinet | No searchability, no backup, no remote access |
| Discrepancies between ordered vs delivered | Caught late, affects concrete pour schedules |
| No mobile-friendly system for on-site crew | Unloading supervisors have no tools |
| Information requests from managers require manual lookup | Slow response times |

### What SiteFlow Changes
| Before | After |
|--------|-------|
| Paper documents in a cabinet | Digitized, searchable, AI-organized |
| Excel delivery sheet updated manually | Auto-populated from AI scans |
| "How many pipes arrived?" → 30min lookup | "How many pipes arrived?" → instant AI answer |
| Unloading guy emails you a photo | Unloading guy taps 3 buttons in the app |
| Missing CMRs discovered weeks later | Flagged immediately on the dashboard |

---

## 3. Users & Roles

### Role Matrix (5 users max)

| Role | User | Device | Access Level | Primary View |
|------|------|--------|-------------|-------------|
| **Admin** | Alex (you) | Desktop + Phone | Full access to everything | Master Dashboard |
| **Unloader** | 2-3 site crew | Personal phones (mobile data) | Input only — cannot view other deliveries | Delivery Input Screen |
| **Manager** | 1-2 managers | Phone or desktop | Read-only dashboard with custom view | Manager Overview |

### Authentication
- **Simple 4-digit PIN** per user (no email required)
- You create PINs and assign roles
- PINs are stored securely (hashed) in the database
- No password recovery needed — you reset PINs as admin

---

## 4. Feature Breakdown

### 4A. Unloader View (Mobile-First)

**Design Philosophy (Apple HIG Integration):**
- **Deference & Clarity:** UI supports the content. No harsh borders; use soft shadows and negative space.
- **Direct Manipulation:** 44x44px touch targets. Buttons scale down (`0.97x`) when pressed.
- **Haptic Feedback:** Physical vibration tick on successful scans/submissions.
- **Sunlight Readability:** Solid high-contrast backgrounds (`#161b22`) for outdoor use.

**Core Flow:**
```
[Open App] → [Enter PIN] → [New Delivery Button] 
    → [📸 Photo: Truck Plate] 
    → [📸 Photo: Material on Truck] 
    → [📸 Photo: Document (CMR/DN/TAD)] 
    → [AI Processing / Compression... ✅]
```

### 4B. Admin Dashboard (Real-Time Command Center)

**Key Competitor Features (Stolen from Procore/Fieldwire):**
- **Booking Slots:** Vendors can book Crane/Loading Bay time slots to prevent traffic.
- **QR Receiving:** Fast-scan material tags for instant database matching.
- **Auto-Daily Reports:** Digital Site Diary generates a 1-page PDF summary every night.
- **Geofencing:** Auto-alerts unloader when trucks arrive within 1 mile.

**Features:**
- **Tabbed Navigation:** Apple-style segmentation: `[Action Center] [Deliveries] [Materials]`.
- **Depth (Z-Axis):** Delivery details slide up as "Bottom Sheets", maintaining spatial context.
- **Optimistic UI:** Actions (Resolving docs) happen instantly; server syncs in background.
- **AI "Short-Shipment" Check:** AI compares scanned delivery note vs. original order manifest.

### 4C. Manager View (Read-Only)
- Optimized for "Just-In-Time" (JIT) delivery tracking.
- Visual material state: `Ordered -> In Transit -> On Site -> Installed`.

---

## 5. Recommended Tech Stack

### Why NOT Google AI Studio Alone?
Google AI Studio is excellent for **AI prototyping** (testing prompts, processing documents) but it is NOT an app-building platform. It cannot:
- Host a web app with user auth
- Store data in a database
- Serve different views to different users
- Work as a PWA on phones

**However**, we use Google's **Gemini API** (which powers AI Studio) as the AI brain inside our app. You get the same AI capabilities, embedded in a real application.

### The Zero-Cost Stack

| Layer | Technology | Why This One | Monthly Cost |
|-------|-----------|-------------|-------------|
| **Frontend** | Next.js (React) PWA | AI tools understand it perfectly; installable on phones | £0 |
| **Hosting** | Vercel | 100GB bandwidth free; deploys from GitHub automatically | £0 |
| **Database** | Supabase (PostgreSQL) | 500MB free; built-in auth; real-time subscriptions; file storage | £0 |
| **File Storage** | Supabase Storage | 1GB free for document photos | £0 |
| **AI Brain** | Google Gemini API (Free Tier) | 15 requests/min, ~250-500/day; vision capability for documents | £0 |
| **Code Repository** | GitHub | Free private repos; Vercel auto-deploys from it | £0 |
| **AI Code Editor** | Antigravity / Claude Code / Cursor | For you to modify the app via AI assistants | £0* |

> *Antigravity and Claude Code have free tiers. Cursor has a free tier too. You only pay if you exceed limits.

### What is a PWA (Progressive Web App)?
- A website that **behaves like a native app** on phones
- Users visit the URL → phone prompts "Add to Home Screen" → app icon appears
- No App Store needed, no approval process, instant updates
- Works with camera, notifications, and offline capability
- Looks and feels identical to a native app

---

## 6. Free Tier Cost Analysis

### Will the free tiers be enough? Let's check:

| Resource | Free Tier Limit | Your Estimated Usage | Verdict |
|----------|----------------|---------------------|---------|
| **Supabase Database** | 500 MB | ~5-10 MB/month (delivery records are tiny) | ✅ Years of headroom |
| **Supabase Storage** | 1 GB | ~50 MB/month (compressed delivery photos) | ✅ ~20 months before full |
| **Supabase Auth** | 50,000 MAU | 5 users | ✅ Infinitely fine |
| **Supabase Edge Functions** | 500K/month | ~1,000/month (AI processing) | ✅ 500x headroom |
| **Vercel Bandwidth** | 100 GB/month | ~1-2 GB/month (5 users, small app) | ✅ 50x headroom |
| **Vercel Serverless Functions** | 1M requests | ~5,000/month | ✅ 200x headroom |
| **Gemini API** | ~250 requests/day | ~10-20/day (document scans + AI chat) | ✅ 12x headroom |

### ⚠️ The One Catch: Supabase Auto-Pause
Supabase free tier projects **pause after 1 week of inactivity**. This means:
- If nobody uses the app for 7 days, the database goes to sleep
- The next user would experience a ~30 second cold start
- **Solution:** This won't be a problem if you're using it daily (which you plan to)
- **Backup Solution:** A free cron job (GitHub Actions) can ping the database every 3 days to keep it alive

### Photo Storage Strategy (Zero-Cost Optimization)
To stay within the 1GB storage limit indefinitely:
- **Phase 1: Post-Scan Compression.** AI scans high-res photos, then the server instantly compresses them to ~150KB and overwrites the original.
- **Phase 2: Manual ZIP Export.** Managers can download a ZIP of past delivery months to their laptop/Drive and wipe the app's database to reset storage.
- **Verdict:** With compression, 1GB fits ~7,000 photos, enough for several years of site traffic before needing a manual reset.

---

## 7. Database Design

### Core Tables

```
┌─────────────────────┐     ┌──────────────────────┐
│       USERS          │     │     DELIVERIES        │
├─────────────────────┤     ├──────────────────────┤
│ id (PK)             │     │ id (PK)              │
│ name                │     │ created_at           │
│ pin_hash            │     │ created_by (FK→Users)│
│ role (admin/unloader│     │ supplier             │
│       /manager)     │     │ truck_plate          │
│ created_at          │     │ status (complete/    │
└─────────────────────┘     │   issue/pending)     │
                            │ notes                │
                            │ ai_summary           │
┌─────────────────────┐     └──────────────────────┘
│   DELIVERY_ITEMS     │              │
├─────────────────────┤              │
│ id (PK)             │              │
│ delivery_id (FK) ───┼──────────────┘
│ material_type       │
│ material_id         │     ┌──────────────────────┐
│ quantity_delivered   │     │    DELIVERY_PHOTOS    │
│ unit                │     ├──────────────────────┤
│ condition           │     │ id (PK)              │
│ notes               │     │ delivery_id (FK)     │
└─────────────────────┘     │ photo_type (truck/   │
                            │   material/document) │
┌─────────────────────┐     │ storage_path         │
│  EXPECTED_ORDERS     │     │ ai_extracted_text    │
├─────────────────────┤     │ uploaded_at          │
│ id (PK)             │     └──────────────────────┘
│ material_type       │
│ material_id         │     ┌──────────────────────┐
│ quantity_ordered    │     │  DOCUMENT_TRACKING    │
│ supplier            │     ├──────────────────────┤
│ expected_date       │     │ id (PK)              │
│ priority            │     │ delivery_id (FK)     │
└─────────────────────┘     │ doc_type (CMR/TAD/DN)│
                            │ status (received/    │
                            │   missing/requested) │
                            │ flagged_at           │
                            │ resolved_at          │
                            └──────────────────────┘
```

### Key Relationships
- One **Delivery** has many **Items**, many **Photos**, many **Documents**
- **Expected Orders** are independent (imported from your delivery sheet)
- The app compares **EXPECTED_ORDERS** vs sum of **DELIVERY_ITEMS** = gap analysis

---

## 8. App Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER DEVICES                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Unloader │  │   Admin      │  │   Manager     │  │
│  │ (Phone)  │  │ (Desktop +   │  │   (Phone)     │  │
│  │          │  │   Phone)     │  │               │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬────────┘  │
│       │               │                │             │
│       └───────────────┼────────────────┘             │
│                       │                              │
│              ┌────────▼─────────┐                    │
│              │    PWA (Next.js) │                    │
│              │   Hosted on      │                    │
│              │   Vercel (Free)  │                    │
│              └────────┬─────────┘                    │
└───────────────────────┼──────────────────────────────┘
                        │ HTTPS
           ┌────────────┼────────────────┐
           │            │                │
  ┌────────▼──────┐ ┌───▼────────┐ ┌────▼──────────┐
  │   Supabase    │ │  Supabase  │ │  Google       │
  │   Database    │ │  Storage   │ │  Gemini API   │
  │  (PostgreSQL) │ │  (Photos)  │ │  (AI Brain)   │
  │   FREE        │ │  FREE      │ │  FREE         │
  └───────────────┘ └────────────┘ └───────────────┘
```

### How It Works End-to-End

**Unloader submits a delivery:**
1. Opens PWA on phone → enters PIN
2. Taps "New Delivery" → camera opens
3. Snaps photos (truck, material, documents)
4. Photos upload to Supabase Storage
5. Vercel serverless function sends photos to Gemini API
6. Gemini extracts: supplier name, delivery note number, material types, quantities, CMR details
7. If Gemini is confident → auto-fills the delivery record
8. If Gemini is unsure → prompts user: "I couldn't read the supplier. Can you type it?"
9. Delivery saved to database with status
10. Alex's dashboard updates in real-time (Supabase real-time subscriptions)

**Alex checks the dashboard:**
1. Opens app on desktop → enters admin PIN
2. Sees today's summary: deliveries, issues, material gaps
3. Clicks into any delivery → sees photos, AI-extracted data, document status
4. Notices a missing CMR → already flagged automatically
5. Types into AI chat: "How many 400mm pipes arrived this month?" → gets instant answer

---

## 9. AI Integration Strategy

### Document Processing Pipeline

```
[Phone Camera Photo]
        │
        ▼
[Gemini Vision API - Free Tier]
        │
        ├── Translate: Force all text into English (e.g., German DN -> English record)
        ├── Normalize: Group materials into fuzzy categories (e.g., "Steel" vs "Reinforcement")
        ├── Extract: Supplier Name, DN Number, Date, Quantities
        ├── Extract: CMR / TAD status
        │
        ▼
[Confidence Check]
        │
        ├── High confidence → Auto-save to DB with fuzzy tags
        └── Low confidence → Prompt user: "Found German text. Is this a Concrete delivery?"
```

### AI Chat Agent Architecture

The AI agent doesn't just answer questions — it **queries your actual database**:

```
User: "How many deliveries had issues this week?"
        │
        ▼
[Gemini converts to SQL]
→ SELECT COUNT(*) FROM deliveries 
  WHERE status = 'issue' 
  AND created_at >= '2026-02-22'
        │
        ▼
[Database returns: 4]
        │
        ▼
[Gemini formats response]
→ "There were 4 deliveries with issues this week:
   - Feb 23: Vendor X — missing CMR
   - Feb 24: Vendor Y — quantity discrepancy (ordered 50, received 47)
   - Feb 25: Vendor Z — damaged pipe noted
   - Feb 27: Vendor X — missing TAD"
```

### Gemini API System Prompt (Pre-configured)
The AI will be pre-loaded with context from your Knowledge Base:
- Material types and IDs
- Document types (CMR, TAD, DN, POD)
- Your specific datacenter construction terminology
- Your company's naming conventions
- Safety and compliance requirements

---

## 10. Development Roadmap

### Phase 1: Foundation (Week 1)
> **Goal:** Working app with PIN login and basic delivery input

- [ ] Set up GitHub repo + Vercel deployment
- [ ] Set up Supabase project (database + auth + storage)
- [ ] Create database tables
- [ ] Build PIN-based authentication
- [ ] Build basic Unloader view: camera capture + manual input
- [ ] Build basic Admin view: delivery list
- [ ] Deploy PWA (installable on phones)

**Deliverable:** A working app where the unloader can photograph and log deliveries, and you can see them on your screen.

---

### Phase 2: AI Brain (Week 2)
> **Goal:** AI reads documents and auto-fills delivery data

- [ ] Integrate Gemini API for document processing
- [ ] Build the photo → AI extraction → auto-fill pipeline
- [ ] Add confidence scoring + fallback manual prompts
- [ ] Store AI-extracted text alongside photos

**Deliverable:** Unloader snaps a photo → AI reads the document → delivery auto-populates.

---

### Phase 3: Dashboard & Tracking (Week 3)
> **Goal:** Real-time dashboard with material tracking

- [ ] Build Admin dashboard with today's overview
- [ ] Build missing documents tracker
- [ ] Build ordered vs delivered comparison view
- [ ] Add real-time updates (Supabase subscriptions)
- [ ] Build Manager view (read-only dashboard)
- [ ] Add delivery filtering and search

**Deliverable:** Full management dashboard answering all your key questions at a glance.

---

### Phase 4: AI Chat Agent (Week 4)
> **Goal:** Ask the app questions in plain English

- [ ] Build AI chat interface
- [ ] Connect Gemini to database queries
- [ ] Pre-load Knowledge Base context
- [ ] Add report generation capability

**Deliverable:** "How many pipes arrived this week?" → instant, accurate answer from your data.

---

### Phase 5: Polish & Iterate (Ongoing)
> **Goal:** Daily improvements driven by real usage

- [ ] Refine UX based on unloader feedback
- [ ] Add push notifications for critical issues
- [ ] Add weekly email/report summaries
- [ ] Expand AI capabilities based on new needs
- [ ] Migrate old delivery data from Excel

---

## 11. AI-Upgradeability Strategy

This is critical for you since you have no coding knowledge but want to change the app daily.

### How You'll Modify the App

```
You:     "I want to add a column showing the weight of each delivery"
            │
            ▼
AI Tool: [Antigravity / Claude Code / Cursor]
            │
            ├── Reads the codebase (it's on your machine + GitHub)
            ├── Understands the database schema
            ├── Modifies the relevant component
            ├── Tests the change
            └── Deploys via `git push` → Vercel auto-deploys
            │
            ▼
         App updated in ~2 minutes
```

### Why This Stack is AI-Friendly
1. **Next.js + React** — The most popular web framework; AI tools have massive training data for it
2. **Clear file structure** — Each feature in its own folder; AI can navigate easily
3. **Supabase client** — Simple, well-documented API that AI tools generate correctly
4. **Single repository** — Everything in one place; no complex multi-service setup
5. **TypeScript** — Catches errors before deployment; AI tools generate safer code

### Rules for Maintainability
- Every component is small (under 200 lines)
- Every feature has its own folder
- Database schema is documented in the repo
- A `CHANGELOG.md` tracks every change made
- Your Knowledge Base stays updated with new features

---

## 12. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Supabase free tier runs out of storage | Low (in <6 months) | Medium | Archive older photos to Google Drive |
| Gemini API free tier gets restricted further | Medium | High | Fall back to manual input; or switch to another free LLM (Llama via Groq free tier) |
| Supabase pauses after inactivity | Low (daily use) | Low | GitHub Actions cron ping every 3 days |
| Phone camera quality too low for AI reading | Medium | Medium | AI fallback prompt for manual input; works with any quality |
| Mobile data drops during upload | Medium | Low | App shows "upload pending" and retries automatically |
| 5-user limit exceeded | Low | Low | Supabase supports 50K MAU; the limit is self-imposed for simplicity |
| Vercel detects "commercial use" on free tier | Very Low | Medium | 5 users is well within hobby scope; migrate to Netlify if needed |

---

## Summary: Why This Will Work

✅ **Zero cost** — Every service has a free tier that massively exceeds your needs  
✅ **Phone-first** — PWA works on any phone with a browser; no app store needed  
✅ **AI-powered** — Document scanning, auto-fill, and chat agent all via Gemini  
✅ **Impressive** — Real-time dashboard, live data, AI chat — this is leagues ahead of Excel  
✅ **Upgradeable** — AI coding tools can modify any part of the app in minutes  
✅ **Simple for unloaders** — Photo → AI → Done. Under 60 seconds per delivery  
✅ **Professional for managers** — Clean dashboard with the answers they actually need  
✅ **Built on your knowledge** — The AI is pre-loaded with your datacenter logistics expertise  

> **Next step:** Review this document. If you're happy, we start building Phase 1.
