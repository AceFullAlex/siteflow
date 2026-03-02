# 🎭 Role-Based UX & Gamification System

This document defines the distinct "Vibes" and functionalities for the three user roles in SiteFlow, ensuring the app looks professional, functions intuitively, and feels rewarding.

---

## 🏗️ Design Pillars (Premium UI)
- **Glassmorphism:** Use `backdrop-filter: blur(20px)` on all cards and modals.
- **Typography:** **Inter** is the primary font. Use **Montserrat** for headings.
- **Color Palette:**
    - Background: `#0a0e17` (Charcoal)
    - Card: `rgba(255, 255, 255, 0.03)` with `1px solid rgba(255, 255, 255, 0.1)` border.
    - Accent: `#e8912d` (VKE Orange)
- **Login Experience:** 
    - Full-screen animated gradient background (dark charcoal to deep navy).
    - Floating glassmorphic login card.
    - Professional "Welcome back, [Name]" header.

---

## 👷 1. The Unloader View (The "Hero" Experience)
**Goal:** Make manual labor feel rewarding and progress-driven.

### Features:
- **Daily Progress Bar:** "Deliveries Today: 7/12" (Visual pulse animation on increment).
- **Gamification Points:** "Total Points: 450" (Earn points for clear photos and fast document tagging).
- **Recent Deliveries List:** A "Hall of Fame" scroll showing their successful uploads today with "AI Verified ✅" badges.
- **Personal Peak:** "Current Streak: 5 Days" (Reward for daily logins/submissions).

---

## 📊 2. The Manager View (The "Strategic" Cockpit)
**Goal:** High-level oversight for Site & Project Managers. No "messy" details, just results.

### Features:
- **Material Pulse:** Visual progress bars for high-value materials (e.g., "Steel: 85% On-Site").
- **Site Diary AI Summary:** A one-sentence AI summary of the day: *"Solid progress: 12 deliveries today, no major discrepancies detected."*
- **Issue Heatmap:** Red alerts for late deliveries or missing documents.
- **Read-Only:** Managers see everything but can't "delete" or "edit" raw data (prevents accidental errors).

---

## 🛠️ 3. The Admin View (The "Command" Center)
**Goal:** Total control and system audit.

### Features:
- **User Management:** UI to edit user roles, reset PINs, and add new site members.
- **AI Tweak Mode:** Ability to manually override AI extracted data if Gemini makes a mistake.
- **System Health:** Monitoring storage usage (1GB limit) and Gemini API status.
- **Audit Logs:** See who uploaded what and when in a searchable table.

---

## 🚀 Professional Interaction Rules
1. **Haptics:** Strong vibration on "Error," soft "Tick" on successful scan.
2. **Descriptive Verbs:** Instead of "Save," use "Log Delivery" or "Apply Changes."
3. **Skeleton Loaders:** Never show a blank screen while AI is thinking; use premium shimmer effects.
