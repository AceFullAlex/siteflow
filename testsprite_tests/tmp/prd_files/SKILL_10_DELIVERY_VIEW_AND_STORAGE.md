# 📦 SKILL_10_DELIVERY_DETAILS_AND_STORAGE

---

## 🛑 AGENT INSTRUCTIONS: READ FIRST
You are building the "Delivery Details & Storage Optimization" feature for the SiteFlow Logistics App. Do **not** hallucinate the tech stack. Here is the verified context:
- **Framework:** Next.js 15 (TypeScript, App Router)
- **Database / File Storage:** Supabase (table `deliveries`, bucket `delivery-photos`)
- **AI Brain:** Google Gemini API via `@google/genai` (uses `gemini-2.5-flash`)
- **Styling:** CSS Modules with glassmorphism, dark charcoal (`#0a0e17` / `#0f1318`), and orange (`#e8912d`) branding.

---

## 1. Context & Research (Why we are building this)
**The Problem:** The app is currently fully functional, allowing unloaders to submit delivery photos which Gemini processes and saves to Supabase. However:
1. Managers have no UI to actually *view* the photos and the AI's raw extraction side-by-side.
2. Supabase Free Tier has a strict **1GB file storage limit**. High-res photos will eat this up in ~110 deliveries.
3. The user needs a manual way to pull photos *out* of Supabase to offload them into Google Drive or a local computer to save space.

**The Solution Constraints:**
- Users want to keep the primary storage free (Supabase).
- Photos MUST remain high-resolution *until* the AI scans them.
- Once the AI validates and extracts text, the images must be **heavily compressed** to a fraction of their size and overwritten in Supabase.
- Managers need a fast, minimalistic UI to view the AI summary, neatly cropped photos, and a button to download/export the delivery package locally.

---

## 2. What You Must Build (3 Features)

### Feature 1: The Manager "Delivery Details" View
**Where:** When a manager clicks a card in `<DeliveryFeed />`, open a modal (`<dialog>`) or navigate to a new page `/delivery/[id]`.
**What to Build:**
- **Short AI Overview:** At the top, a concise summary of what was delivered (extracted from `deliveries.ai_summary`).
- **Photo Gallery:** Display the uploaded photos (truck, materials, documents). Crop them nicely (e.g., `aspect-ratio: 4/3`, `object-fit: cover`, rounded corners) so the layout is clean. Clicking a photo should expand it to full size.
- **Raw Data Display:** Show exactly the text Gemini extracted so the manager can verify it against the photos.
- **Design:** Keep it minimalist. Use glassmorphism cards and the VKE orange accent.

### Feature 2: Post-Verification Image Compression
**Where:** The Next.js API route `/api/ai/scan` or `/lib/gemini/scanner.ts`.
**What to Build:**
- Currently, the AI route downloads the high-res images from the Supabase bucket (`delivery-photos`) to process them.
- **NEW LOGIC:** *After* Gemini successfully extracts the data and you have the raw text, run the image buffers through a Node.js compression library (e.g., `sharp`).
- Heavily compress them (e.g., JPEG, quality 40-50, max width 1200px) so they drop from 3MB down to ~200KB.
- Re-upload the compressed buffers back to Supabase, **overwriting the original high-res files** at the same storage path.
- *Goal:* Free up 90% of the Supabase 1GB limit immediately after the AI finishes its job.

### Feature 3: Manual Export / Download Feature
**Where:** In the new Delivery Details View.
**What to Build:**
- Add a highly visible "Export Delivery" button.
- When clicked, trigger an API route (e.g., `/api/deliveries/export`) that fetches all photos for that delivery ID from Supabase, zips them into a single archive (`.zip`) using a library like `archiver`, and adds a simple `.txt` file containing the AI summary and materials list.
- Return the ZIP buffer so the manager's browser downloads it instantly.
- *Bonus Quality of Life:* Add a "Delete after Export" checkbox or button so the user can wipe the delivery from Supabase entirely after backing it up locally, guaranteeing they never hit the 1GB limit.

---

## 3. Checklist for the Agent
- [ ] Build the detailed Delivery View UI (minimalist, cropped images)
- [ ] Implement `sharp` compression in the AI processing route
- [ ] Verify image paths in Supabase are overwritten with compressed files
- [ ] Build the ZIP export script/API route
- [ ] Add the "Download to computer" button to the UI
- [ ] Ensure all code compiles and uses the existing design system (`globals.css`)
