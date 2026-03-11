# Changelog - VSP Website

## 2026-03-10 (Event Featured Images Import)

### WordPress Event Image Migration
- Scraped 164 unique `og:image` URLs from live WordPress event pages
- Matched 162 images to local files in `wp-media/` directory (downloaded from Kinsta)
- Uploaded all 162 unique images to Sanity CDN
- Patched 222 out of 225 Sanity event documents with image references (3 events had no featured image in WordPress)
- Events now display real race photos and event flyers instead of dark VSP placeholders

### Scripts Added
- `scripts/scrape-event-images.py` - Scrapes WordPress event pages for `og:image`, maps `_thumbnail_id` to local files
- `scripts/upload-event-images.py` - Uploads images to Sanity CDN and patches event documents

---

## 2026-03-10 (Mockup Matching + Build Reliability)

### Mockup Layout Match
- Hero: subtitle text stacked vertically above RED Buy Tickets + GREEN Get Directions buttons
- Logo: VSP colorful logo now displays in nav and footer (base64 data URL via lib/logo.ts)
- EventCard: landscape 4:3 aspect ratio with title below image, DATE|TIME|LOCATION row
- Red accent bar with tagline below sticky nav
- Section heading red underline accents (section-title-accent-center)
- Background images use CSS background-image for signup/footer sections

### Build Reliability (Vercel + Turbopack)
- Sanity fetch: added retry logic (3 retries with exponential backoff) for timeout resilience
- Sanity client: switched from CDN (apicdn.sanity.io) to direct API to avoid build timeouts
- Static generation: limited generateStaticParams to 20 recent items (was 775+ news pages causing timeouts)
- Image imports: Turbopack on Vercel cannot resolve static imports from public/ directory; logo uses base64 data URL, backgrounds use CSS url()
- Vercel Deployment Protection: all JPGs in public/ return 404; background images degrade gracefully behind dark overlays

### CSS / Tailwind v4 Fixes
- Wrapped global base styles (h1-h6, body, a, img) in `@layer base` so Tailwind utility classes properly override base heading sizes/fonts
- Removed custom `--spacing-*` tokens from `@theme inline` that were overriding Tailwind v4's default named size scale (max-w-3xl was 64px instead of 768px, breaking layouts site-wide)

### News Filtering
- Created latestNewsQuery with `lower(category)` exclusion and title-pattern filters to keep Rules/Results/Winners posts off homepage
- Added scrollbar-hide CSS utility for horizontal scroll containers

### Media
- Downloaded 61,417 files (8.8GB) from Kinsta via rsync

---

## 2026-03-10 (Credentials, Vercel Deploy, Content Migration)

### Credentials
- Added all missing env vars to .env.local: Anthropic, Sanity (read + write tokens), MyRacePass, Resend, Kinsta SSH/DB
- Pulled MyRacePass API key from existing VSP_Results_Points_app Vercel project

### Vercel Environment Variables
- Pushed all env vars to Vercel dashboard (production, preview, development):
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY,
  NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN,
  MYRACEPASS_API_KEY, MYRACEPASS_SCHEDULE_ID, ANTHROPIC_API_KEY, RESEND_API_KEY, ADMIN_EMAIL

### Scripts Fixed
- Updated export-wordpress.sh with correct DB password
- Updated download-media.sh and export-wordpress.sh to use sshpass for password-based SSH auth
- Verified SSH connection to Kinsta works

### Content Migration
- Exported 225 events from WordPress via MySQL -> Sanity import (all 225 created, 0 errors)
- MyRacePass sync: 15 events + 70 results synced to Supabase
- WordPress posts export in progress (778 posts via WP-CLI over SSH)

### Build
- Production build passes clean, 23 routes

### MCP
- Added Supabase MCP server to project config

---

## 2026-03-09 (Infrastructure Setup + End-to-End Verification)

### Supabase
- Linked Supabase CLI to project zuurkvnklrieacubhzoa
- Ran `supabase db push` - created all 6 form tables in production
- Verified all tables responding 200 via REST API
- Tested all 6 form submissions end-to-end (API -> Supabase confirmed with real data)

### Environment
- Created .env.local with real Supabase credentials (anon key + service role key)
- Created sanity.cli.ts for Sanity CLI access
- Excluded scripts/ from tsconfig.json (standalone CLI scripts, not part of Next.js build)

### Build
- Zero errors, 23 routes compiled

---

## 2026-03-09 (Phase 6-7: Migration Scripts + Redirects)

### Migration Scripts (scripts/)
- `download-media.sh` - rsync-over-SSH to pull 9.3 GB WP uploads from Kinsta (dry-run support)
- `upload-to-sanity.ts` - categorize + upload media to Sanity CDN / Supabase Storage
- `export-wordpress.sh` - SSH tunnel MySQL export of events, posts, sponsors as JSON
- `import-events.ts` - parse WordPress MEC event meta, create Sanity event documents
- `import-news.ts` - strip Divi shortcodes, convert HTML to Portable Text, create Sanity news posts
- `import-sponsors.ts` - upload logos + create Sanity sponsor documents by tier

### 301 Redirects
- Added 32 permanent redirects in vercel.json mapping all WordPress URLs to new routes
- Covers: pages, forms, events, results, points, photos, videos, surveys, calendars

---

## 2026-03-09 (Phase 5: Forms & API Routes)

### API Routes (6 form endpoints)
- `/api/contact` - Contact form -> Supabase + Resend confirmation + admin notification
- `/api/sponsor-inquiry` - Sponsor inquiry -> Supabase + Resend emails
- `/api/shout-out` - Shout out request -> Supabase + admin notification
- `/api/driver-registration` - Driver registration -> Supabase + Resend (NO SSN/CC fields)
- `/api/entry-form` - Event entry form -> Supabase + Resend (NO payment fields)
- `/api/fan-program` - Fan program signup -> Supabase + Resend emails

### Form UIs (6 client components)
- `ContactForm` on /about - name, email, message
- `SponsorInquiryForm` on /sponsors - company, contact, email, phone, message
- `ShoutOutForm` on /about - your name, email, recipient, message
- `DriverRegistrationForm` on /drivers - full registration with address, car #, division, emergency contact
- `EntryForm` on /drivers - driver name, email, car #, division, event, hometown
- `FanProgramForm` on homepage - name, email, phone, interests

### Infrastructure
- Created `lib/email.ts` (Resend helper with lazy init, sendConfirmationEmail + sendAdminNotification)
- Created `lib/supabase-server.ts` (server-side Supabase client with service key)
- Created `supabase/migrations/001_form_tables.sql` (6 tables with RLS enabled)
- All forms use FormBlock component with consistent loading/success/error states
- Build: zero errors, 23 routes

---

## 2026-03-09 (UI Design Refinement)

### Homepage Design Updates
- Added red underline accent bars (4px x 60px) to section headings via `.section-title-accent` and `.section-title-accent-center` CSS classes in globals.css
- Changed hero "Buy Tickets" CTA from filled red to bordered/outlined white style to match design reference
- Converted "Latest News" section from 3-column card grid to horizontal list layout (up to 5 items) using new `NewsListItem` component
- Applied `section-title-accent` class to "Upcoming Events" and "Latest News" headings
- Applied `section-title-accent-center` class to "Our Partners" heading
- Updated EmailSignup: heading now red, subtitle changed, added inline name field, dark sign-up button

### New Components
- `NewsListItem` - Horizontal news row with title/date on left, optional thumbnail on right, separated by border lines
- Exported from components/ui/index.ts barrel file

---

## 2026-03-09

### Phase 1: Foundation - Complete

#### Infrastructure
- Initialized Next.js 16.1.6 (App Router, Turbopack, TypeScript, Tailwind v4)
- Created GitHub repo: driveformv/vsp-site
- Created Vercel project: vsp-site (mvt-marketing team)
- Linked Vercel to project
- Installed Sanity.io (project jsftjck0, dataset production)
- Installed Supabase client (project zuurkvnklrieacubhzoa)
- Cloned existing VSP_Results_Points_app for porting (not deleted)

#### Design System
- Design tokens defined in app/globals.css (colors, fonts, spacing, radii)
- Tailwind v4 @theme integration for utility classes
- Typography scale: h1-h6 with Orbitron, body with Inter, data with JetBrains Mono
- Fonts loaded via next/font/google for optimal performance

#### Sanity CMS Schemas (8 content types)
- event, newsPost, sponsor, raceClass, page, navigation
- firstTimerGuide (singleton), siteSettings (singleton)
- Sanity Studio embedded at /studio with custom desk structure

#### Shared Component Library (16 components)
- **Layout:** StickyNav (transparent hero mode, mobile drawer), MobileBottomBar (sticky bottom), Footer (4-column dark)
- **UI:** PageHero, SectionBlock, EventCard, NewsCard, SponsorStrip, ResultsTable, AccordionGroup, FormBlock, CTABanner, FilterBar, StatusBanner, BreadcrumbBar

#### Page Shells (14 routes)
- Homepage (/) - Hero, events, news, CTA, sponsors, email signup
- Events (/events) - Filterable event listing
- Event Detail (/events/[slug]) - Single event with schedule/admission
- News (/news) - Category-filtered article listing
- Article (/news/[slug]) - Single article layout
- Plan Your Visit (/plan-your-visit) - First-timer guide with FAQ
- Drivers (/drivers) - Rules, registration, entry forms
- Sponsors (/sponsors) - Tier grid + inquiry form
- About (/about) - Track info, history, contact
- Points (/points) - Standings placeholder (to be ported)
- Results (/results) - Results placeholder (to be ported)
- Wild West Shootout Archive (/events/archive/wild-west-shootout)
- Sanity Studio (/studio)

#### Configuration
- TypeScript interfaces for all data types
- Supabase client configured
- Sanity client + image URL builder configured
- Environment variable template (.env.local.example)
- Build: zero errors, all routes compile

### Phase 2: Port Results/Points App - Complete
- Ported /api/data route (GET with type=points|results from Supabase)
- Ported /api/sync-all route (MyRacePass -> Supabase cron sync with lazy init)
- Ported /points page (MUI, year/class filters, mobile cards, auto-refresh)
- Ported /results page (MUI, year/event filters, accordions, position changes)
- Configured Vercel cron jobs (5:59 AM + 12:00 PM UTC)
- Added CORS headers for API routes

### Phase 3: AI Event Validation - Complete
- Created /api/validate-event (Anthropic SDK, claude-haiku-4-5-20251001)
- Created Sanity Document Action (ValidateEventAction with dialog UI)
- Registered in sanity.config.ts for event documents

### Phase 4: Connect Sanity to Pages - Complete
- Created sanity/lib/queries.ts (all GROQ queries for events, news, sponsors, settings, navigation, race classes, pages)
- Created sanity/lib/fetch.ts (sanityFetch helper with ISR tags + 60s revalidation)
- Converted all page shells from hardcoded data to Sanity-powered server components
- Homepage: fetches upcoming events, latest news, sponsors, site settings
- Events listing: server-rendered with upcoming/past sections from Sanity
- Event detail: generateStaticParams, Portable Text body, weather status, admission info
- News listing: server-rendered with featured + grid layout
- News detail: generateStaticParams, Portable Text body, related articles
- Sponsors: grouped by tier from Sanity, with logo images
- Plan Your Visit: firstTimerGuide singleton + FAQ from Sanity, static fallback
- Drivers: raceClasses from Sanity with rules PDF links
- About: siteSettings for contact info, social links
- StickyNav: receives navigation items + ticket/stream URLs from layout
- Footer: receives contact info + social links from site settings
- MobileBottomBar: configurable ticket URL
- Fixed StickyNav/Footer links (/schedule -> /events, /visit -> /plan-your-visit)
- Installed @portabletext/react for rich text rendering
- Fixed @sanity/image-url deprecation (createImageUrlBuilder)

#### SEO & Structured Data
- SportsEvent JSON-LD on event detail pages
- LocalBusiness + SportsActivityLocation JSON-LD on homepage
- BreadcrumbList JSON-LD on event detail and news detail pages
- Article JSON-LD on news detail pages
- Dynamic sitemap.xml (static routes + Sanity slugs)
- robots.txt allowing all crawlers
- OpenGraph + Twitter meta on all pages (template title, images)
- Page-specific generateMetadata on event and news detail pages
- ISR configured: 60s for listings, 300s for layout data
- Build: zero errors, 19 routes
