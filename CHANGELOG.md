# Changelog - Vado Speedway Park Website Optimization

All notable changes to this project will be documented in this file.

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
