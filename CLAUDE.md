# VSP Website - Project Instructions

## Project
Vado Speedway Park website rebuild. Migration from WordPress/Divi (Kinsta) to modern stack.

## Tech Stack
- Next.js 16.1.6 (App Router, Turbopack)
- Sanity.io (headless CMS) - Project ID: jsftjck0, Dataset: production
- Supabase (database, storage) - Project: zuurkvnklrieacubhzoa
- Tailwind CSS v4
- TypeScript
- Vercel (hosting) - Project: vsp-site (mvt-marketing team)

## GitHub
- Repo: driveformv/vsp-site
- Existing Results/Points app: driveformv/VSP_Results_Points_app (DO NOT DELETE - in production)

## Vercel
- Project Name: vsp-site
- Team: mvt-marketing
- NEVER run `vercel link` without --project flag
- Prefer git push for deployments (auto-deploy from GitHub)

## Design System
- Fonts: Orbitron (display/headings), Inter (body), JetBrains Mono (code/data)
- Colors: Primary #000, Accent Red #E02B20, Accent Yellow #FFF205, Surface #FFF, Surface Alt #F5F5F7, Surface Dark #1A1A1A, Text #1D1D1F, Text Muted #86868B, Border #E5E5E5
- Max content width: 1280px
- Section spacing: 64px vertical
- Style: NASCAR.com/F1.com premium feel, McKinsey presentation aesthetics

## Project Structure
```
app/
  (site)/           -- Public pages (server components) with StickyNav + Footer + MobileBottomBar
    page.tsx        -- Homepage (fetches events, news, sponsors from Sanity)
    events/         -- Schedule & event detail (Sanity data)
    news/           -- News & articles (Sanity data)
    plan-your-visit/-- First-timer guide (Sanity singleton)
    drivers/        -- Rules, registration (Sanity race classes)
    sponsors/       -- Partner display + lead gen (Sanity sponsors)
    about/          -- Track info, contact (Sanity site settings)
  points/           -- Points standings (ported from existing app, MUI)
  results/          -- Race results (ported from existing app, MUI)
  studio/           -- Embedded Sanity Studio at /studio
  api/              -- API routes (sync, validate-event, forms)
  sitemap.ts        -- Dynamic sitemap (static + Sanity slugs)
  robots.ts         -- robots.txt
components/
  ui/               -- Shared UI components (PageHero, EventCard, NewsCard, etc.)
  layout/           -- Layout components (StickyNav, Footer, MobileBottomBar)
  seo/              -- JSON-LD structured data components
sanity/
  schemas/          -- Sanity content type definitions (8 types)
  lib/              -- Sanity client, queries, fetch helper, image builder
  actions/          -- Sanity document actions (ValidateEventAction)
lib/                -- Supabase client, utilities
types/              -- TypeScript interfaces
```

## Components
### Layout
- `StickyNav` - Global nav, transparent hero mode, mobile drawer
- `MobileBottomBar` - Mobile-only fixed bottom (Tickets, Schedule, Results)
- `Footer` - Dark 4-column footer

### UI
- `PageHero` - Full-width hero with video/image bg
- `SectionBlock` - Content wrapper (white/grey/dark variants)
- `EventCard` - Event card with date, classes, ticket CTA
- `NewsCard` - Article card with category badge
- `SponsorStrip` - Logo carousel/grid by tier
- `ResultsTable` - Data table with monospace font
- `AccordionGroup` - Collapsible sections
- `FormBlock` - Reusable form wrapper
- `CTABanner` - Full-width call-to-action
- `FilterBar` - Year/class/category filters
- `StatusBanner` - Event/rainout alert banner
- `BreadcrumbBar` - Breadcrumb navigation

## Sanity Schemas
- event, newsPost, sponsor, raceClass, page, navigation, firstTimerGuide (singleton), siteSettings (singleton)

## Sanity Data Flow
- All page data fetched via `sanityFetch()` from `sanity/lib/fetch.ts`
- GROQ queries defined in `sanity/lib/queries.ts`
- ISR: 60s for page data, 300s for layout data (nav, settings)
- Images via `urlFor()` from `sanity/lib/image.ts`
- Rich text rendered with @portabletext/react

## API Routes
- `/api/data` - GET with type=points|results (Supabase)
- `/api/sync-all` - MyRacePass -> Supabase cron sync (GET/POST)
- `/api/validate-event` - AI event validation (Anthropic SDK)

## Rules
- No emoji anywhere in the frontend
- Follow McKinsey/BCG consulting presentation design standards
- Always update CHANGELOG.md with changes
- Design system tokens are in app/globals.css - never override per-page
- Use shared components for all pages - no one-off styling
