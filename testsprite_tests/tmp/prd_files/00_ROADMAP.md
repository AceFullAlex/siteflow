# 🗺️ SiteFlow Build Roadmap
## Complete Guide for Building in Antigravity IDE

---

## What is Antigravity?

Antigravity is the **AI coding IDE you are reading this in right now**. It's powered by Google DeepMind and can:
- Write entire applications from natural language descriptions  
- Run terminal commands (install packages, start servers, deploy)
- Browse web pages (create accounts, configure services)
- Generate images (app icons, UI mockups)
- Modify code intelligently when you describe what you want changed

**You don't need to know how to code.** You describe what you want, and Antigravity builds it.

---

## How This Will Work

### Your Workflow (Repeat Daily)
```
1. Open Antigravity
2. Open a skill file from this folder
3. Tell Antigravity: "Follow the instructions in SKILL_XX to build this part of the app"
4. Antigravity builds it
5. You verify it works (each skill has a checklist)
6. Move to the next skill
```

### How Skills Work With Antigravity
Each skill file is a **set of instructions** that tells Antigravity WHAT to build—not raw code to copy-paste. Antigravity generates fresh, correct code based on these requirements. This is better than copy-pasting because:
- Antigravity adapts to the latest package versions
- It handles edge cases that static code would miss
- It can fix issues in real-time
- You can ask follow-up questions

---

## ⚠️ Corrections From Initial Research

After auditing, I found 3 issues in the original skills that are now fixed:

| Issue | Problem | Fix |
|-------|---------|-----|
| `next-pwa` package | **Unmaintained since 2023**, incompatible with Next.js 15 App Router | Use **native PWA** setup: hand-written `manifest.json` + `public/sw.js` — no package needed |
| `@google/generative-ai` | **Deprecated** as of Aug 2025 | Use `@google/genai` — the correct, maintained package |
| Photo upload via API route | Slow: phone → API server → Supabase Storage | **Direct upload**: phone → Supabase Storage (faster, less server load) |

---

## Complete Timeline

### Pre-Build Setup (30 minutes — YOU do this manually)

Before telling Antigravity to build anything, create these free accounts:

| Step | What | Where | Time |
|------|------|-------|------|
| 1 | Create a GitHub account | [github.com](https://github.com) | 5 min |
| 2 | Create a Vercel account (sign up with GitHub) | [vercel.com](https://vercel.com) | 3 min |
| 3 | Create a Supabase account | [supabase.com](https://supabase.com) | 3 min |
| 4 | Get a Gemini API key | [aistudio.google.com](https://aistudio.google.com) → "Get API Key" | 5 min |
| 5 | Check Node.js is installed | Open terminal → type `node --version` | 2 min |
| 6 | Install Node.js if needed | `brew install node` or [nodejs.org](https://nodejs.org) | 10 min |

> **Save all your keys/passwords somewhere safe!** You'll need them during the build.

---

### Build Phase (Skills 01-09)

| Skill | What It Builds | Estimated Time | Difficulty | Dependencies |
|-------|---------------|---------------|------------|-------------|
| **SKILL 01** | Project setup, folder structure, design system | 15-20 min | Easy | Pre-build done |
| **SKILL 02** | Supabase database, tables, storage | 20-30 min | Easy (some Supabase dashboard clicking) | Skill 01 |
| **SKILL 03** | PIN login, role-based routing, session management | 25-35 min | Medium | Skills 01 + 02 |
| **SKILL 04** | Unloader delivery input (camera, stepper UI) | 30-40 min | Medium | Skill 03 |
| **SKILL 05** | AI document scanning (Gemini Vision) | 20-30 min | Medium | Skill 04 |
| **SKILL 06** | Admin dashboard (stats, feed, filters) | 30-40 min | Medium | Skill 05 |
| **SKILL 07** | Manager view (read-only dashboard) | 10-15 min | Easy | Skill 06 |
| **SKILL 08** | AI chat agent (natural language queries) | 20-30 min | Medium | Skill 06 |
| **SKILL 09** | PWA installability + deploy to Vercel | 15-25 min | Easy | All skills done |
| **SKILL_10** | Delivery Details View & Storage Optimization | 30-40 min | Hard | Skill 06 |
| **SKILL_11** | UI/UX Overhaul (Apple HIG Edition) | 40-50 min | Hard | Skill 10 |
| **SKILL_12** | Premium Roles & Gamification (Role Overhaul) | 50-60 min | Hard | Skill 11 |

### Total Estimated Build Time

| Phase | Time |
|-------|------|
| Pre-build setup | ~30 min |
| Skills 01-03 (Foundation) | ~1-1.5 hours |
| Skills 04-05 (Core Features) | ~1-1.5 hours |
| Skills 06-08 (Dashboards + AI) | ~1-1.5 hours |
| Skill 09 (Deploy) | ~20 min |
| **Total** | **~3.5-5 hours** |

> These times assume Antigravity handles the coding. Your job is to describe what you want, review what it builds, and verify it works. If something doesn't work, tell Antigravity what went wrong and it'll fix it.

---

### Post-Build (Ongoing)

| Activity | How Often | How |
|----------|-----------|-----|
| Add features | Daily / as needed | Tell Antigravity what you want → it modifies the code → `git push` → live in 2 min |
| Migrate Excel data | Once | Give Antigravity your delivery sheet → it imports the data into Supabase |
| Create new users | As needed | Run a SQL command in Supabase dashboard |
| Fix bugs | As they appear | Describe the bug to Antigravity → it fixes it |
| Monitor free tier usage | Monthly | Check Supabase dashboard → Storage usage |

---

## How to Give Each Skill to Antigravity

### Method 1: Reference the File (Recommended)
```
"Read @[SKILL_01_PROJECT_SETUP.md] and follow all the instructions to set up the SiteFlow project"
```

### Method 2: Summarize
```
"I need you to create a Next.js 15 project called 'siteflow' with TypeScript, 
App Router, and install these packages: @supabase/supabase-js, @supabase/ssr, @google/genai. 
Set up the folder structure and design system as described in SKILL_01."
```

### Method 3: Step by Step
Go through the skill file section by section, asking Antigravity to do each step.

---

## ⚡ Tips for Working With Antigravity

1. **Be specific:** "Add a red border to the delivery cards when there's an issue" works better than "make it look better"
2. **One thing at a time:** Don't ask for 5 changes at once — do them sequentially
3. **Verify after each skill:** Each skill has a checklist. Run through it before moving on.
4. **If something breaks:** Describe exactly what happened — what you expected vs what you got
5. **Save your progress:** After each skill, Antigravity should commit to Git: `git add . && git commit -m "Complete SKILL_XX"`
6. **Take breaks:** You don't have to build it all in one day. The skills are designed to be stopping points.

---

## Tech Stack Summary (Final, Audited)

| Layer | Technology | Monthly Cost |
|-------|-----------|-------------|
| Framework | Next.js 15 (TypeScript, App Router) | £0 |
| Hosting | Vercel (Free Tier — 100GB bandwidth) | £0 |
| Database | Supabase PostgreSQL (Free — 500MB) | £0 |
| File Storage | Supabase Storage (Free — 1GB) | £0 |
| Auth | Custom PIN system (session cookies) | £0 |
| AI Brain | Google Gemini API via `@google/genai` (Free Tier) | £0 |
| PWA | Native (`manifest.json` + `sw.js` — no npm package) | £0 |
| Code Repo | GitHub (Free) | £0 |
| **Total** | | **£0/month** |
