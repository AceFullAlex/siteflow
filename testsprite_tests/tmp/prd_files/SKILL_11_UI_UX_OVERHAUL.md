# 🎨 SKILL_11_UI_UX_OVERHAUL (APPLE HIG EDITION)

---

## 🛑 AGENT INSTRUCTIONS: READ FIRST
You are tasked with a comprehensive UI/UX overhaul of the **SiteFlow** Logistics App. 
**Context:** The app is built with Next.js 15, React, and basic CSS Modules. The brand is **VKE Group** (Dark Charcoal `#0a0e17` background, and Warm Orange `#e8912d` accents). 
The user specifically requested implementing **Apple's Human Interface Guidelines (HIG)** to make the app incredibly intuitive.

---

## 1. Apple HIG: Clarity & Deference (Styling)
- **Install Lucide React:** Run `npm install lucide-react`. Replace all textual icons (like `→`, checkmarks, logout) with SVG line icons (matches Apple's SF Symbols approach).
- **Mute the Colors:** Subdue bright badges. Use the VKE Orange *only* for primary call-to-action buttons or critical alerts.
- **Negative Space > Borders:** Remove rigid 1px borders on cards. Use soft, diffused drop shadows (e.g., `box-shadow: 0 4px 20px rgba(0,0,0,0.2)`) and ample padding to separate elements visually without boxing them in.
- **44x44 Touch Targets:** Ensure every clickable element (especially filter tabs and buttons) has a minimum CSS size of `min-height: 44px; min-width: 44px;` for gloved hands.

## 2. Apple HIG: Depth & Feedback
- **Haptic Engine:** Inject `if (navigator.vibrate) navigator.vibrate(50);` into key interactions: tapping tabs, submitting a delivery step, clicking 'Resolve' on a missing document.
- **Interactive States:** Buttons and cards must have an `:active` state that smoothly scales down (`transform: scale(0.97)`) to simulate physical depression of the button.
- **Z-Axis Modals:** For the upcoming Delivery Detail view, do not build a flat page. Prepare the CSS global variables for sliding "Bottom Sheets" that overlay the screen while dimming the dashboard behind it, maintaining spatial context.

## 3. Navigation ("Predictability")
- Update `/src/components/layout/NavHeader.tsx`.
- Add a clickable Home Icon (using Lucide) next to the "SiteFlow" logo. This icon must route the user back to their respective home page (`/dashboard`, `/manager`, or `/unloader`).
- Reorganize the Dashboard (`DashboardClient.tsx`) into a clean Tabbed interface instead of a vertical scroll:
  - **Tab 1: Action Center.** (`<StatsCards />` and `<MissingDocsTracker />`)
  - **Tab 2: Deliveries.** (`<DeliveryFeed />`)
  - **Tab 3: Materials.** (`<MaterialProgress />`)

## 4. Apple HIG: Fluid Performance (Optimistic UI)
- **Optimistic UI:** Update `MissingDocsTracker.tsx`. When a user clicks "Resolve", immediately animate the item out of the React state *before* awaiting the `fetch` call. If the fetch fails, revert the state and show an error.
- **Backend Aggregation:** Ensure `/api/dashboard/material-progress` does the heavy lifting in SQL aggregation rather than passing raw rows, keeping the frontend snappy. Include proper TypeScript types in `/api/ai/chat/route.ts` instead of `any`.
