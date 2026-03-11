# Changelog - Vado Speedway Park Website Optimization

All notable changes to this project will be documented in this file.

## [2026-03-11] - Events System Redesign (Phase 1-5)

### Schema
- Added `isFeatured` (boolean), `status` (scheduled/postponed/cancelled/completed/soldOut), `recapNote` (string) to Sanity event schema
- Added `featuredUpcomingEventQuery` for hero section
- Updated all GROQ queries to include new fields
- Deprecated `weatherStatus` field (kept for backward compat)
- Created shared `SanityEvent` type in `types/sanity.ts` (eliminates 3 duplicate interfaces)
- Removed phantom `ticketPrice`/`pitPrice` from Event interface
- Migration script: `scripts/migrate-events-schema.ts` (sets status based on date + weatherStatus)

### Events Listing Page
- **Next Race hero section** (dark variant) with CountdownTimer, large date, ticket CTA
- Featured event selection: `isFeatured` flag, fallback to first upcoming
- **Month filter** + **Event type tabs** (All/Weekly/Special) with client-side filtering
- Status badges on upcoming events (POSTPONED yellow, CANCELLED red + strikethrough)
- Event type pill (SPECIAL in red outline) on upcoming event rows
- Past events with **Load More** button (20 at a time) and `recapNote` display

### Event Detail Page
- **Status-aware CTA bar** above the fold: red (upcoming/tickets), grey (completed + recap), yellow (postponed), red (cancelled)
- Reordered content: schedule + admission info first (main column), description after
- Completed events show recap note + link to /results
- Removed hardcoded "Results & Photos" placeholder
- Cross-link to /plan-your-visit for first-time visitors
- Simplified sidebar: weather + watch live + tickets
- **StickyMobileCTA** fixed bottom bar for mobile ticket purchase

### EventCard Component
- Added `eventType`, `status`, `isFeatured`, `recapNote` props
- Status badges (cancelled, postponed, soldOut) on all variants
- Event type badge (SPECIAL) on default + card variants
- Featured treatment on card variant (left accent border + badge)
- Cancelled events: strikethrough title + muted opacity
- Sold Out events: grey "SOLD OUT" replaces ticket badge

### Homepage
- Event cards now pass `eventType`, `status`, `isFeatured` fields
- Scroll arrow is now a functional button (EventsCarousel client component)
- Uses shared `SanityEvent` type (removed local duplicate)

### Validation
- Fixed field names in AI validation prompt: `pitGatesTime`/`frontGatesTime`/`racesTime` -> `gateTime`/`raceTime`
- Added `status` and `isFeatured` to validation data

### New Files
- `components/ui/CountdownTimer.tsx` - Orbitron countdown (Xd Xh Xm Xs)
- `components/ui/StickyMobileCTA.tsx` - Mobile-only fixed ticket button
- `app/(site)/events/EventsClient.tsx` - Client filters/load-more
- `app/(site)/EventsCarousel.tsx` - Functional scroll carousel
- `types/sanity.ts` - Shared Sanity event types
- `scripts/migrate-events-schema.ts` - Schema migration

---

## [2026-03-11] - Nav Logo Size + Points & Results Fixes

### UI
- **Nav logo enlarged:** Increased StickyNav logo from 40px/48px to 56px/64px (mobile/desktop)

---

## [2026-03-11] - Fix Points & Results Year Default + Coming Soon

### Bug Fixes
- **Critical: Points & Results pages broken on Vercel.** `.vercelignore` contained `data/` (no leading slash) which matched `app/api/data/` and excluded the API route from deployment. Changed to `/data/` to anchor the pattern to the project root only. The `/api/data` endpoint now deploys correctly and both pages load data.
- **Points & Results defaulting to 2025 instead of 2026.** Pages auto-selected the most recent year from data, which was 2025. Fixed to always default to the current season year (2026). The current year is always shown in the year filter chips even when no data exists yet.
- **"Coming Soon" empty state.** When a selected year has no data, pages now show a clean "Coming Soon" message instead of a generic MUI alert. Matches the original app behavior.

---

## [2026-03-11] - Date Timezone Fix & MUI SSR Support

### Bug Fixes
- **Timezone date shift:** Replaced `new Date()` constructor-based date formatting in points and results pages with manual YYYY-MM-DD string parsing to prevent off-by-one-day bugs across timezones
- **MUI hydration mismatch:** Added `@mui/material-nextjs` with `AppRouterCacheProvider` and layout wrappers for `/points` and `/results` routes for proper server-side rendering

### Dependencies
- Added `@emotion/cache` ^11.14.0
- Added `@mui/material-nextjs` ^7.3.9

---

## [2026-03-11] - Events Redesign, Verification & QA

### Events Page Redesign
- **EventCard component:** Complete rewrite with 4 variant system:
  - `featured` - Large hero card with side-by-side image/content, "Next Event" badge, ticket CTA, race class tags
  - `default` - Timeline-style row with prominent date block (month/day/weekday), divider, time and class count
  - `compact` - Minimal row for past events with monospace date, truncated title, arrow indicator
  - `card` - Visual card for homepage horizontal scroll with image, date badge overlay, ticket badge
- **Events listing page:** Restructured from flat 3-column grid to hierarchical layout:
  - Featured "Next Event" hero card at top
  - Upcoming events in clean timeline list with section counter
  - Past events in compact rows with total count (capped at 20 visible)
  - Empty state fallback when no upcoming events

### Bug Fixes
- **Critical: Infinite redirect loops on 5 pages.** Removed self-referencing redirects in `vercel.json` where source == destination (`/news`, `/about`, `/sponsors`, `/points`, `/results`). These caused 308 redirect loops making those pages completely inaccessible.

### Verification Tests
- **V5 - Webhook revalidation:** `/api/revalidate` route committed (was untracked). Tested POST with secret header.
- **V8 - 301 redirects:** All 10 tested URLs return 308 permanent redirect with correct Location headers:
  - `/upcoming-events` -> `/events`, `/rules-forms` -> `/drivers`, `/points-2` -> `/points`
  - `/faq` -> `/plan-your-visit`, `/suites` -> `/plan-your-visit`, `/race-results` -> `/results`
  - `/2025-wild-west-shootout` -> `/events/archive/wild-west-shootout`
  - `/driver-information-form` -> `/drivers`, `/fan-registration-form` -> `/about`, `/photos` -> `/news`
- **Build:** Zero errors, all routes compile successfully

---

## [2026-03-11] - Task Completion & Sanity Data Population

### Features
- **Sanity Webhook Revalidation:** Created `/api/revalidate` route for on-demand ISR cache invalidation. Sanity webhook triggers tag-based revalidation per document type. Secret-authenticated via `x-sanity-webhook-secret` header.
- **Sanity Data Population:** Populated all Sanity singletons and content types via `scripts/populate-sanity.ts`:
  - siteSettings: contact info, social links, ticket/stream URLs
  - firstTimerGuide: 4 guide sections, 7 FAQ items
  - 8 navigation items (Schedule, Results, Points, News, Plan Your Visit, Drivers, Sponsors, About)
  - 11 race classes with sponsor names and divisions

### Bug Fixes
- **NewsCard Category Mismatch:** Fixed category color mapping to use lowercase keys matching Sanity schema values (`recap`, `announcement`, `feature`, `news`) instead of incorrect capitalized keys (`Results`, `Announcement`, `Feature`).

### Task Updates
- Marked T2.10-T2.13, T3.7-T3.8, T4.21, T6.3, T6.5, T6.6, T7.6-T7.11, V1 as complete in TASKS.md
- SANITY_WEBHOOK_SECRET added to .env.local and pushed to Vercel (production + preview)

## [2026-03-10] - Mobile & Content Audit Fixes

### Global & Layout
- **Global Styles:** Implemented responsive typography for headings in `globals.css` using fluid-like scaling and media queries.
- **StickyNav:** Reduced mobile padding and logo size; hid the tagline bar on mobile to reclaim vertical space.
- **Footer:** Increased social icon touch targets to `p-2` (approx. 40px) for better mobile accessibility.

### Components
- **PageHero:** Reduced mobile min-height from `85vh` to `60vh` and scaled headings down (e.g., `text-3xl` on mobile) to prevent overflow.
- **EventCard:** Increased metadata font sizes to `text-xs` (12px) for readability; removed redundant "Vado Speedway Park" from location text.
- **FormBlock:** Increased input, select, and textarea font sizes to `16px` (`text-base`) to prevent the intrusive iOS auto-zoom behavior.

### Branding & Consistency
- **MUI Synchronization:** Updated `Results` and `Points` pages to use the custom brand theme (Orbitron for headers, Inter for body, and Red accent color).
- **Sticky Headers:** Adjusted the filter bar sticky offset from `64px` to `80px` on Results and Points pages to align with the optimized `StickyNav`.

### Content & UX
- **Redundancy:** Removed repetitive track mentions in event listings.
- **CTAs:** Converted the static "Contact Office" text for Season Passes on the Plan Your Visit page into a live `tel:` link.
