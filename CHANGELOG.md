# Changelog - VSP Website

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
