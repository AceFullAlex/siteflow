# 💎 SKILL_12: Premium UI, Roles & Gamification

---

## 🛑 AGENT INSTRUCTIONS: READ FIRST
You are building the "Professional Identity & Role Refinement" phase of SiteFlow. 
- **Goal:** Transform the app from "functional basic" to "impressive premium."
- **Tech Stack:** Next.js 15, CSS Modules (Glassmorphism), Inter/Montserrat fonts.
- **Reference Document:** Read `ROLE_BASED_UX_SYSTEM.md` for the full design specs.

---

## 1. Professional Login Overhaul
**Goal:** Create a "Silicon Valley" level first impression.
- **Background:** Implement a deep charcoal (`#0a0e17`) to dark navy background with a subtle linear gradient.
- **Typography:**
    - Use `font-family: 'Inter', sans-serif;` for everything.
    - Set weights to `500` (Medium) or `600` (Semi-Bold) for text against dark backgrounds.
- **The Glass Card:** 
    - The login form should be inside a glassmorphic container: `backdrop-filter: blur(20px)`, `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.1)`.
- **Haptics:** Add `navigator.vibrate(50)` on every PIN button tap.

---

## 2. Unloader Home Screen (Gamified)
**Goal:** Make the unloader feel like a "Pro."
- **Home View:** Instead of just a "New Delivery" button, show a **Dashboard**.
- **Progress Card:** A large, prominent progress bar: "Deliveries Today: [Current] / [Expected]".
- **Milestones:** "Good job, you've unloaded 50 materials this week!"
- **Hall of Fame:** A sleek, horizontal scroll of their recently completed deliveries with an "AI Verified ✅" status.
- **Animation:** Use a smooth CSS scale-up (`scale(1.05)`) when they tap the "New Delivery" button.

---

## 3. Manager vs. Admin Split
**Goal:** Tailor the experience to the specific job.

### Manager Dashboard (Project Progress)
- **Top Metrics:** Site Diary AI Summary (1-line), Material % Progress Bars.
- **Read-Only Mode:** Disable all "Delete" or "Add User" buttons for this role.
- **Clickable Maps:** If possible, link material types to a visual site zone description.

### Admin Dashboard (The "God" View)
- **User Cards:** A table to edit user names, roles, or disable access.
- **AI Override:** Add an "Edit Extracted Data" button to the Delivery Details view so admins can correct any Gemini hallucinations.
- **System Metrics:** High-level storage usage and API status logs.

---

## 4. Implementation Checklist
- [ ] Install/Import Google Fonts (Inter & Montserrat).
- [ ] Apply the Glassmorphism CSS variables to `globals.css`.
- [ ] Rebuild the `/unloader` home page with progress tracking.
- [ ] Implement role-based feature gating in the `/dashboard`.
- [ ] Add `navigator.vibrate` calls to all critical interactive elements.
- [ ] Verify the "Login" screen looks professional and polished.
