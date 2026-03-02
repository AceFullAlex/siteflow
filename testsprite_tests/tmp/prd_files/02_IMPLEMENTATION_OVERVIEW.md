# Implementation Overview — How This All Connects

> **Read `00_ROADMAP.md` first.** This document explains the file structure and the technical approach.

---

## What Are "Skills"?

A **skill** is a detailed instruction file describing **what to build**. You give it to Antigravity (this AI IDE), and it generates the code, runs commands, and assembles that part of the app.

**Key principle:** The skills describe requirements and architecture — they do NOT contain raw code to copy-paste. Antigravity generates fresh code based on the latest packages and best practices.

---

## The Files In This Folder

| File | Purpose |
|------|---------|
| `00_ROADMAP.md` | **Start here** — timeline, setup guide, how to use Antigravity |
| `01_FULL_RESEARCH.md` | Complete research (context & reasoning — reference only) |
| `02_IMPLEMENTATION_OVERVIEW.md` | This file — tech overview and architecture |
| `SKILL_01` → `SKILL_09` | Step-by-step build instructions |

---

## Build Order

```
SKILL_01 → SKILL_02 → SKILL_03 → SKILL_04 → SKILL_05 → SKILL_06 → SKILL_07 + SKILL_08 → SKILL_09
```

Skills 07 and 08 can run in parallel. Everything else is sequential.

---

## Tech Stack (Audited & Final)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (TypeScript, App Router) | Most popular — AI tools generate perfect code for it |
| **Styling** | CSS Modules + Apple HIG Principles | VKE Charcoal/Orange brand, 44px touch targets, haptics, depth |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, built-in auth & file storage |
| **AI Brain** | Google Gemini API via `@google/genai` | Free tier, excellent vision/document reading |
| **Hosting** | Vercel | Free tier, auto-deploys from GitHub |
| **PWA** | Native setup (`manifest.json` + `sw.js`) | No package needed — `next-pwa` is deprecated |
| **Code Repo** | GitHub | Free, code backup, Vercel auto-deploys from it |

### Packages Installed

```
@supabase/supabase-js    — Talk to the Supabase database
@supabase/ssr            — Supabase auth for Next.js server components  
@google/genai            — Google Gemini AI for document scanning & chat
```

> **No PWA package needed.** We use Next.js native `manifest.json` and a hand-written `public/sw.js`.

---

## Project Folder Structure

```
siteflow/
├── public/
│   ├── icons/              # App icons for PWA
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Login page (PIN entry)
│   │   ├── (auth)/         # Protected routes
│   │   │   ├── layout.tsx  # Auth check
│   │   │   ├── unloader/   
│   │   │   ├── dashboard/  
│   │   │   └── manager/    
│   │   └── api/            # Server-side API routes
│   │       ├── ai/         # Gemini integration
│   │       ├── auth/       # Login / logout
│   │       └── deliveries/ # Delivery CRUD
│   ├── components/         # Reusable UI
│   ├── lib/                # Core logic (no UI)
│   │   ├── supabase/       # DB clients
│   │   ├── gemini/         # AI client
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helpers
│   └── styles/             # Global CSS
├── .env.local              # Secret keys (never committed)
├── next.config.mjs         # Next.js config
├── CHANGELOG.md            # Track every change
└── package.json            # Dependencies
```

---

## Prerequisites (Create Before Building)

| Account | URL | What You Need From It |
|---------|-----|----------------------|
| **GitHub** | [github.com](https://github.com) | A free account + empty repo called `siteflow` |
| **Vercel** | [vercel.com](https://vercel.com) | Sign up with GitHub |
| **Supabase** | [supabase.com](https://supabase.com) | Project URL + `anon` API key |
| **Google AI Studio** | [aistudio.google.com](https://aistudio.google.com) | API key for Gemini |

**Software:** Node.js v20+ on your Mac (`node --version` to check).
