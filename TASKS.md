# VSP Website - Task Breakdown

Status: [ ] = todo, [x] = done, [~] = in progress

---

## Phase 1: Foundation [DONE]

- [x] T1.1 - Initialize Next.js 16 with App Router, TypeScript, Tailwind v4
- [x] T1.2 - Create GitHub repo (driveformv/vsp-site)
- [x] T1.3 - Create Vercel project (vsp-site), connect to GitHub
- [x] T1.4 - Install Sanity (project jsftjck0, dataset production)
- [x] T1.5 - Install Supabase client (project zuurkvnklrieacubhzoa)
- [x] T1.6 - Design tokens in globals.css (colors, fonts, spacing, radii)
- [x] T1.7 - Build 16 shared components (PageHero, EventCard, NewsCard, etc.)
- [x] T1.8 - Build layout components (StickyNav, Footer, MobileBottomBar)
- [x] T1.9 - Create all Sanity schemas (8 content types)
- [x] T1.10 - Embed Sanity Studio at /studio
- [x] T1.11 - Create all page shells with placeholder content (14 routes)
- [x] T1.12 - Verify build passes (zero errors)
- [x] T1.13 - Initial commit and push

---

## Phase 2: Port Results/Points App

### Dependencies to install
- [ ] T2.1 - Install MUI v7 (@mui/material, @mui/icons-material, @emotion/react, @emotion/styled)

### API Routes
- [ ] T2.2 - Port `/api/data/route.ts` from VSP_Results_Points_app
  - Source: `/Users/hectorsanchez/Projects/VSP_Results_Points_app/src/app/api/data/route.ts`
  - GET endpoint, query param `type=points|results`
  - Fetches from Supabase, returns JSON
  - Add CORS headers
- [ ] T2.3 - Port `/api/sync-all/route.js` (MyRacePass cron sync)
  - Source: `/Users/hectorsanchez/Projects/VSP_Results_Points_app/src/app/api/sync-all/route.js`
  - Fetches events, results, points from MyRacePass API
  - Upserts to Supabase tables (events, classes, results, points, sync_status)
  - 500ms delays between API calls
  - Handles MyRacePass JSON bug (double commas)
  - Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, MYRACEPASS_API_KEY, MYRACEPASS_SCHEDULE_ID

### Pages
- [ ] T2.4 - Port `/points/page.tsx` (replace placeholder)
  - Source: `/Users/hectorsanchez/Projects/VSP_Results_Points_app/src/app/points/page.tsx`
  - Year filter, class filter chips, driver search
  - Class name mappings (11 sponsor-branded names)
  - Mobile card view, desktop table view
  - Expand/collapse for 10+ drivers
  - Auto-refresh every 5 minutes
  - Preserve original positions during filtering
- [ ] T2.5 - Port `/results/page.tsx` (replace placeholder)
  - Source: `/Users/hectorsanchez/Projects/VSP_Results_Points_app/src/app/results/page.tsx`
  - Year filter, event filter chips, driver search
  - Accordion per race, position change calculation
  - DNF/DNS/DQ status indicators
  - Mobile card view, desktop table view

### Config
- [ ] T2.6 - Add cron jobs to vercel.json
  - `59 5 * * *` (5:59 AM UTC daily)
  - `0 12 * * *` (12:00 PM UTC daily)
  - Path: `/api/sync-all`
- [ ] T2.7 - Add CORS headers to vercel.json for /api/* routes
- [ ] T2.8 - Update .env.local.example with MyRacePass vars
  - SUPABASE_SERVICE_KEY
  - MYRACEPASS_API_KEY
  - MYRACEPASS_SCHEDULE_ID=31705
- [ ] T2.9 - Set environment variables in Vercel dashboard
- [ ] T2.10 - Test: /api/data?type=points returns data
- [ ] T2.11 - Test: /api/data?type=results returns data
- [ ] T2.12 - Test: /points page renders with real data
- [ ] T2.13 - Test: /results page renders with real data

---

## Phase 3: AI Event Validation (Claude SDK)

### Install
- [ ] T3.1 - Install @anthropic-ai/sdk

### API Route
- [ ] T3.2 - Create `/api/validate-event/route.ts`
  - POST endpoint, receives event JSON from Sanity Studio
  - Calculates day name from date
  - Sends prompt to claude-haiku-4-5-20251001
  - Checks: day/date mismatch, time logic, missing data, typos
  - Returns { isValid: boolean, issues: [{severity, message}] }
  - Env var: ANTHROPIC_API_KEY (server-side only)

### Sanity Action
- [ ] T3.3 - Create `sanity/actions/validateEvent.ts`
  - "Validate Event" button in Sanity Studio toolbar
  - Calls /api/validate-event with draft or published doc
  - Shows toast notifications (green=good, yellow=warning, red=error)
  - Loading state while validating

### Config
- [ ] T3.4 - Register ValidateEventAction in sanity.config.ts
  - Only on event documents (schemaType === 'event')
  - Prepend to existing actions array
- [ ] T3.5 - Add ANTHROPIC_API_KEY to .env.local.example
- [ ] T3.6 - Set ANTHROPIC_API_KEY in Vercel env vars
- [ ] T3.7 - Test: create event with wrong day/date, validation catches it
- [ ] T3.8 - Test: create valid event, validation passes

---

## Phase 4: Connect Sanity to Pages

### Sanity Queries (GROQ)
- [ ] T4.1 - Create `sanity/lib/queries.ts` with all GROQ queries
  - getUpcomingEvents, getPastEvents, getEventBySlug
  - getNewsPosts, getNewsPostBySlug
  - getSponsors (by tier)
  - getSiteSettings
  - getFirstTimerGuide
  - getNavigationItems
  - getRaceClasses
- [ ] T4.2 - Create `sanity/lib/fetch.ts` helper (sanityFetch with caching/ISR)

### Wire up pages
- [ ] T4.3 - Homepage: fetch upcoming events, latest news, sponsors from Sanity
- [ ] T4.4 - Events listing: fetch all events, support filtering
- [ ] T4.5 - Event detail [slug]: fetch single event, generate static params
- [ ] T4.6 - News listing: fetch posts with category filter
- [ ] T4.7 - News detail [slug]: fetch single post, generate static params
- [ ] T4.8 - Sponsors page: fetch sponsors grouped by tier
- [ ] T4.9 - Plan Your Visit: fetch firstTimerGuide singleton
- [ ] T4.10 - Drivers page: fetch raceClasses, rules PDFs
- [ ] T4.11 - About page: fetch siteSettings for contact info
- [ ] T4.12 - StickyNav: fetch navigation items from Sanity
- [ ] T4.13 - Footer: fetch siteSettings for contact/social

### SEO / Structured Data
- [ ] T4.14 - Add SportsEvent JSON-LD to event detail pages
- [ ] T4.15 - Add LocalBusiness + Organization JSON-LD to homepage
- [ ] T4.16 - Add BreadcrumbList JSON-LD to all subpages
- [ ] T4.17 - Add Article JSON-LD to news posts
- [ ] T4.18 - Generate sitemap.xml (app/sitemap.ts)
- [ ] T4.19 - Generate robots.txt (app/robots.ts)
- [ ] T4.20 - Add OpenGraph and Twitter meta to all pages

### Revalidation
- [ ] T4.21 - Set up Sanity webhook to hit Vercel deploy hook
- [ ] T4.22 - Configure ISR revalidation (60s for listings, on-demand for detail pages)

---

## Phase 5: Forms & API Routes

- [ ] T5.1 - Create `/api/contact/route.ts` (Contact form -> Supabase + Resend)
- [ ] T5.2 - Create `/api/sponsor-inquiry/route.ts` (Sponsor form -> Supabase + Resend)
- [ ] T5.3 - Create `/api/shout-out/route.ts` (Shout Out Request form)
- [ ] T5.4 - Create `/api/driver-registration/route.ts` (Driver form - NO SSN/CC fields)
- [ ] T5.5 - Create `/api/entry-form/route.ts` (Entry form - NO payment fields)
- [ ] T5.6 - Create `/api/fan-program/route.ts` (Fan Program form)
- [ ] T5.7 - Install and configure Resend for email confirmations
- [ ] T5.8 - Create Supabase tables for form submissions (contact_submissions, sponsor_inquiries, etc.)
- [ ] T5.9 - Build form UIs on respective pages using FormBlock component
- [ ] T5.10 - Test: each form submits, data appears in Supabase, confirmation email sends

---

## Phase 6: Media Migration

- [ ] T6.1 - Download all media from Kinsta via SSH/rsync (9.3 GB)
  - SSH: vadospeedwaypark@34.174.186.154:24029
  - WP path: /www/vadospeedwaypark_162/public/wp-content/uploads/
- [ ] T6.2 - Write Sanity asset upload script (content images: event covers, news, logos)
- [ ] T6.3 - Run upload script to push images to Sanity CDN
- [ ] T6.4 - Upload bulk race photos to Supabase Storage (race-photos/{year}/{event-slug}/)
- [ ] T6.5 - Copy static assets (logo, favicon) to /public/
- [ ] T6.6 - Update all content references to new image URLs
- [ ] T6.7 - Verify no broken images across all pages

---

## Phase 7: Content Migration

- [ ] T7.1 - Write event import script (parse WordPress MEC meta -> Sanity)
  - Source: wp-content-inventory/events-meta-sample.txt
  - Map: dates, times, classes, images, event types
- [ ] T7.2 - Run event import into Sanity
- [ ] T7.3 - Write news post import script (strip Divi shortcodes -> clean Portable Text)
  - Source: wp-content-inventory/all-pages-content.txt
  - 392 Videos, 112 Photos, 105 News, 105 Results posts
- [ ] T7.4 - Run news post import into Sanity
- [ ] T7.5 - Import 46+ sponsors with logos and tiers into Sanity
- [ ] T7.6 - Migrate About, FAQ, Rules, Suites page content into Sanity
- [ ] T7.7 - Create race class entries in Sanity (with sponsor names, rules PDFs)
- [ ] T7.8 - Set up navigation items in Sanity
- [ ] T7.9 - Create siteSettings singleton data
- [ ] T7.10 - Create firstTimerGuide singleton data
- [ ] T7.11 - Wild West Shootout: create archive content (historical results, photos, relocation note)
- [ ] T7.12 - QA: check every page against live WordPress site

---

## Phase 8: Domain Cutover

- [ ] T8.1 - Final QA on Vercel preview URL
- [ ] T8.2 - Set up 301 redirects in vercel.json for old WordPress URLs
- [ ] T8.3 - Set up subdomain redirects (points.vadospeedwaypark.com -> /points, results. -> /results)
- [ ] T8.4 - Point vadospeedwaypark.com DNS to Vercel (A: 76.76.21.21, www CNAME: cname.vercel-dns.com)
- [ ] T8.5 - Verify SSL provisioning
- [ ] T8.6 - Add Facebook Pixel via next/script
- [ ] T8.7 - Set up Google Analytics / Search Console
- [ ] T8.8 - Submit sitemap.xml to Google Search Console
- [ ] T8.9 - Monitor 404s in Vercel logs for 48 hours
- [ ] T8.10 - Keep Kinsta live 2 weeks as fallback
- [ ] T8.11 - Decommission Kinsta

---

## Verification Checklist (before cutover)

- [ ] V1 - `npm run build` zero errors
- [ ] V2 - Lighthouse: Performance > 90, SEO > 95, Accessibility > 90
- [ ] V3 - All SportsEvent schema validates at validator.schema.org
- [ ] V4 - Mobile test on iPhone/Android at track (sun, cellular)
- [ ] V5 - Sanity Studio: team can create event, publish, see it live < 60s
- [ ] V6 - Results/Points: MyRacePass sync runs, data shows on /points and /results
- [ ] V7 - All forms submit to Supabase, confirmation emails send via Resend
- [ ] V8 - 301 redirects work for top 20 most-trafficked old WordPress URLs
- [ ] V9 - No broken images across all pages
- [ ] V10 - Google Search Console: sitemap submitted, indexing verified
