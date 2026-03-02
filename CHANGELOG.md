# Changelog

## v1.0.0 — Bug Fixes, Delivery Details & Storage Optimization
- **Bug Fix:** Delivery feed cards are now clickable — navigate to `/delivery/[id]`
- **Bug Fix:** Added Supplier dropdown filter to admin dashboard
- **Bug Fix:** Added "Open" filter tab (shows pending + issue deliveries combined)
- **Bug Fix:** Missing Documents Tracker with "Mark as Resolved" button per document
- **Bug Fix:** Manager dashboard now includes Material Progress section with ordered vs delivered progress bars
- **Feature:** Delivery Details View (`/delivery/[id]`) — AI summary, photo gallery with lightbox, raw extracted text, materials list, document status
- **Feature:** Export to ZIP — download all delivery photos + AI summary as a `.zip` file
- **Feature:** Post-AI image compression — `sharp` compresses photos to ~200KB after Gemini extracts data (saves ~90% Supabase storage)
- **Middleware:** `/delivery` route protected for admin + manager roles
- **Cleanup:** Removed `.DS_Store` files and test artifacts
- **Dependencies:** Added `sharp` (image compression), `archiver` (ZIP generation)

## v0.9.0 — PWA & Deploy Ready
- PWA manifest, service worker (network-first), app icons
- Ready for Vercel deployment

## v0.8.0 — AI Chat Agent
- Natural language query interface on admin dashboard
- 3-step pipeline: question → Gemini query plan → Supabase query → formatted answer
- Expandable chat panel (bottom-right)

## v0.7.0 — Manager View
- Read-only dashboard for managers
- Reuses StatsCards + DeliveryFeed components
- "Manager View" badge, read-only footer

## v0.6.0 — Admin Dashboard
- Stats cards (deliveries today, issues, missing docs, behind schedule)
- Delivery feed with filter tabs (Today/Complete/Issue/Pending)
- Auto-refresh every 30 seconds
- API routes for stats and deliveries

## v0.5.0 — AI Document Processing
- Gemini Vision integration for document scanning
- Extracts supplier, materials, doc types from photos
- Auto-updates delivery records and document tracking
- Non-blocking scan triggered after delivery submission

## v0.4.0 — Unloader Delivery View
- Mobile-optimized 4-step delivery input
- Photo capture (truck, material, documents)
- Delivery creation API with photo upload to Supabase Storage
- Success animation

## v0.3.0 — Authentication & Roles
- PIN-based login with SHA-256 hashing
- Session cookies (HTTP-only, 7-day expiry)
- Middleware route protection with role enforcement
- Login page with 4-digit PIN input, auto-submit, shake animation

## v0.1.0 — Initial Setup
- Next.js 15 project with TypeScript, App Router, Turbopack
- Supabase + Gemini client libraries
- CSS design system (dark construction theme)
- Database type definitions
- Folder structure ready for all features
