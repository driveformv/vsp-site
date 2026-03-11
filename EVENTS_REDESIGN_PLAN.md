# Events System Redesign Plan

## Context

Two independent audits (Gemini + Codex) identified the same core problems with the events section: the schema is too thin, the listing page is a flat grid with no urgency or filtering, the detail page buries the ticket CTA, and the EventCard component ignores data it already receives. Both audits over-recommend features. This plan takes the highest-impact subset and sequences it practically.

## What Already Exists (from prior session, commit e4652fa)

The EventCard component already has 4 variants (featured/default/compact/card) and the events page already uses them. But **none of the audit issues were addressed** -- same schema, same flat layout, no filters, no countdown, no status awareness, ticket CTA still buried on detail page. This plan builds on that foundation without redoing it.

## What We Skip (Both audits suggest, we defer)

- **raceClasses as references** -- Migrating 225 events' inline arrays to references is high disruption for a track with ~11 classes. Keep inline.
- **Structured pricing array** -- admissionInfo text field works for editorial. Structured pricing needs migration of all events.
- **Race-night timeline visualization** -- gateTime/raceTime strings are what editors fill in. Multi-segment schema requires editorial training.
- **Event sponsor reference** -- inline raceClasses[].sponsorName covers this.
- **Hero vs card media** -- single image with hotspot is enough.
- **Live stream status** -- no infrastructure exists. streamLink field is sufficient.
- **Standings/results tie-ins** -- Results are in Supabase, events in Sanity. No join key exists.
- **Add-to-calendar** -- can bolt on later without schema changes.
- **Directions on detail page** -- homepage hero already has this.
- **First-timer module on detail** -- cross-link to /plan-your-visit is enough.

---

## Phase 1: Schema + Queries + Migration (Foundation)

Everything downstream depends on these three new fields.

### 1A. Schema -- `sanity/schemas/event.ts`

Add 3 fields:

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `isFeatured` | boolean | false | Editors flag major events for hero treatment |
| `status` | string (list) | `scheduled` | Unified state: scheduled, postponed, cancelled, completed, soldOut |
| `recapNote` | string | - | One-line post-race note (e.g. "John Doe wins Modified feature") |

Keep `weatherStatus` temporarily (deprecation note in description). Do NOT remove or rename existing fields.

### 1B. Queries -- `sanity/lib/queries.ts`

- Add `isFeatured`, `status`, `recapNote` to ALL event queries
- Fix `pastEventsQuery` -- add missing `streamLink`, `admissionInfo`, `isExternal`, `externalUrl`
- Add new `featuredUpcomingEventQuery` -- `*[_type == "event" && isFeatured == true && date >= now()] | order(date asc)[0]`

### 1C. Types -- `types/index.ts` + new `types/sanity.ts`

- Update Event interface with new fields
- Extract shared `SanityEvent` type to `types/sanity.ts` (currently duplicated in 3 page files)
- Remove phantom fields (`ticketPrice`, `pitPrice`) that never existed in Sanity

### 1D. Migration Script -- `scripts/migrate-events-schema.ts`

- Set `isFeatured: false` on all events
- Set `status: "completed"` where `date < now()`
- Set `status: "scheduled"` where `date >= now()`
- Map `weatherStatus: "cancelled"` -> `status: "cancelled"`, `"delayed"` -> `status: "postponed"`
- Leave `recapNote` empty
- Non-destructive: only adds fields, never modifies/deletes existing ones
- Test on 1 event first, then batch all 225

### 1E. Verify

- Schema deploys to /studio
- Migration script runs, spot-check 5 events in Studio
- All GROQ queries return new fields
- `npm run build` passes

---

## Phase 2: Events Listing Page Redesign

### 2A. New Client Component -- `app/(site)/events/EventsClient.tsx`

Client component receives all events as server-rendered props. Handles:
- **Month filter** -- horizontal scrollable month picker (reuse existing `FilterBar`)
- **Event type filter** -- All / Weekly / Special
- **Client-side filtering** of the event arrays
- **Load More** for past events (real button, loads 20 at a time)

### 2B. Restructure Page -- `app/(site)/events/page.tsx`

**Section 1 -- "Next Race" Hero** (`SectionBlock variant="dark"`)
- Pick featured upcoming event (`isFeatured && date >= now()`), fallback to first upcoming
- Countdown timer (new `CountdownTimer` client component)
- Large date, title, time, prominent red "Buy Tickets" button
- Full-width, high contrast

**Section 2 -- Filter Bar**
- Month picker + Event Type dropdown
- Uses existing `FilterBar` component

**Section 3 -- Upcoming Events**
- `DefaultEventCard` timeline rows (already exist)
- Add event type pill ("SPECIAL" in red, nothing for weekly)
- Add status badge for non-normal (POSTPONED yellow, CANCELLED red + strikethrough)
- Show ticket link inline (partially there, not rendering consistently)

**Section 4 -- Past/Completed Events**
- `CompactEventCard` rows with real "Load More" button
- Show `recapNote` when available

### 2C. New Component -- `components/ui/CountdownTimer.tsx`

- Client component, `targetDate: string` prop
- Orbitron font, monospace numbers: `23d 04h 32m 18s`
- 1-second interval via useEffect
- Shows "Race Night" at zero
- Clean data display, no animation

### Files Modified

- `app/(site)/events/page.tsx` -- restructure
- `app/(site)/events/EventsClient.tsx` -- **NEW**
- `components/ui/CountdownTimer.tsx` -- **NEW**
- `components/ui/EventCard.tsx` -- add eventType/status props, render badges

### Verify

- Featured event hero shows with countdown
- Filters narrow the list correctly
- Past events "Load More" actually loads more
- Status badges render for postponed/cancelled
- Mobile stacks correctly

---

## Phase 3: Event Detail Page Redesign

### 3A. Restructure -- `app/(site)/events/[slug]/page.tsx`

**Above-fold CTA bar** (after PageHero, before content):
- Future events: Red bar with date, time, "Buy Tickets" -- use `CTABanner variant="red"` (already exists)
- Completed events: Grey bar with "This event has concluded" + recapNote
- Cancelled: Red bar "This event has been cancelled"
- Postponed: Yellow bar "This event has been postponed"

**Main content reorder**:
- Move Schedule/Admission/Time info INTO main column (not sidebar) -- this is what people look for first
- Race classes displayed as styled pills (already done, keep)
- Description below
- Cross-link to /plan-your-visit for first-timers

**Remove hardcoded Results placeholder**:
- If `status === "completed"` and `recapNote`: show recap + link to /results
- If `status === "completed"` and no recap: "Results available at /results"
- If upcoming: show nothing

**Sidebar simplification**:
- Weather/advisory (if non-normal)
- Watch Live button (if streamLink)

### 3B. Mobile Sticky CTA -- `components/ui/StickyMobileCTA.tsx`

- Fixed bottom bar, mobile only (hidden on md:+)
- "Buy Tickets" button
- Only for future events with ticketLink
- Positioned above existing MobileBottomBar (z-index management)

### Files Modified

- `app/(site)/events/[slug]/page.tsx` -- restructure layout
- `components/ui/StickyMobileCTA.tsx` -- **NEW**

### Verify

- Ticket CTA visible above fold on desktop and mobile
- Status banners render correctly for each state
- Completed events show recap, not placeholder
- Mobile sticky CTA doesn't conflict with MobileBottomBar
- SportsEventJsonLd still works

---

## Phase 4: EventCard + Homepage

### 4A. EventCard -- `components/ui/EventCard.tsx`

Add props: `eventType?`, `status?`, `isFeatured?`

Status badges (all variants):
- `cancelled` -- red "CANCELLED" pill, title strikethrough, muted opacity
- `postponed` -- yellow "POSTPONED" pill
- `soldOut` -- grey "SOLD OUT" pill replaces ticket badge

Event type badge (default + card variants):
- "SPECIAL" events get small red-outlined pill
- Weekly = no badge (default)

Featured treatment (card variant):
- `isFeatured` gets left border accent + "FEATURED" small badge

### 4B. Homepage -- `app/(site)/page.tsx`

- Pass `eventType`, `status`, `isFeatured` to EventCard in carousel
- Fix decorative scroll arrow -- make it functional (scrollBy on click)
- Update mapEvent helper with new fields

### Files Modified

- `components/ui/EventCard.tsx` -- add props, badges, featured treatment
- `app/(site)/page.tsx` -- pass new props, fix scroll arrow

### Verify

- Cancelled events in carousel show strikethrough + badge
- Special events visually distinct from weekly
- Scroll arrow actually scrolls
- No mobile layout breaks

---

## Phase 5: Cleanup

### 5A. Fix Validation -- `app/api/validate-event/route.ts`

Current prompt uses wrong field names:
- `event.pitGatesTime` -> `event.gateTime`
- `event.frontGatesTime` -> `event.gateTime` (single field)
- `event.racesTime` -> `event.raceTime`

Add new fields to validation: `status`, `isFeatured`

### 5B. Shared Types -- `types/sanity.ts`

Extract `SanityEvent` interface (currently copy-pasted in 3 files):
- `app/(site)/events/page.tsx`
- `app/(site)/events/[slug]/page.tsx`
- `app/(site)/page.tsx`

Import from shared location.

### Files Modified

- `app/api/validate-event/route.ts` -- fix field names
- `types/sanity.ts` -- **NEW** shared types
- 3 page files -- import shared type
- `CHANGELOG.md` -- document all changes

### Verify

- Validate Event in Sanity Studio works correctly
- `npm run build` passes with zero TS errors
- All pages render correctly

---

## Dependency Graph

```
Phase 1 (Schema + Queries + Migration)
  |
  +---> Phase 2 (Events Listing)
  |       |
  |       +---> Phase 4 (EventCard + Homepage)
  |
  +---> Phase 3 (Event Detail)
  |
  +---> Phase 5 (Cleanup)
```

Phases 2 and 3 are independent -- can run in parallel.
Phase 4 builds on Phase 2's EventCard changes.
Phase 5 can go anytime after Phase 1.

---

## New Files (5)

1. `app/(site)/events/EventsClient.tsx`
2. `components/ui/CountdownTimer.tsx`
3. `components/ui/StickyMobileCTA.tsx`
4. `scripts/migrate-events-schema.ts`
5. `types/sanity.ts`

## Modified Files (10)

1. `sanity/schemas/event.ts`
2. `sanity/lib/queries.ts`
3. `types/index.ts`
4. `components/ui/EventCard.tsx`
5. `app/(site)/events/page.tsx`
6. `app/(site)/events/[slug]/page.tsx`
7. `app/(site)/page.tsx`
8. `app/api/validate-event/route.ts`
9. `components/ui/index.ts` (exports)
10. `CHANGELOG.md`
