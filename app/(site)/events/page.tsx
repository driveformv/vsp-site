import { sanityFetch } from '@/sanity/lib/fetch';
import {
  upcomingEventsQuery,
  pastEventsQuery,
  featuredUpcomingEventQuery,
} from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, BreadcrumbBar } from '@/components/ui';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { EventsClient } from './EventsClient';
import type { SanityEvent } from '@/types/sanity';

function mapEvent(e: SanityEvent) {
  return {
    title: e.title,
    date: e.date,
    classes: (e.raceClasses || []).map((c) => c.className),
    gateTime: e.gateTime,
    raceTime: e.raceTime,
    ticketLink: e.ticketLink,
    image: e.image ? urlFor(e.image).width(1080).height(1080).url() : undefined,
    slug: e.slug.current,
    eventType: e.eventType,
    status: e.status,
    recapNote: e.recapNote,
  };
}

function formatHeroDate(dateStr: string) {
  const d = new Date(dateStr);
  const weekday = d.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const month = d.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return { weekday, month, day, year };
}

export default async function EventsPage() {
  const [upcoming, past, featured] = await Promise.all([
    sanityFetch<SanityEvent[]>({ query: upcomingEventsQuery, tags: ['event'] }),
    sanityFetch<SanityEvent[]>({ query: pastEventsQuery, tags: ['event'] }),
    sanityFetch<SanityEvent | null>({ query: featuredUpcomingEventQuery, tags: ['event'] }),
  ]);

  const upcomingEvents = (upcoming || []).map(mapEvent);
  const pastEvents = (past || []).map(mapEvent);

  // Featured event: prefer isFeatured, fallback to first upcoming
  const featuredRaw = featured || (upcoming && upcoming.length > 0 ? upcoming[0] : null);
  const heroEvent = featuredRaw ? mapEvent(featuredRaw) : null;
  const heroDate = heroEvent ? formatHeroDate(heroEvent.date) : null;
  const timeDisplay = heroEvent
    ? heroEvent.raceTime || heroEvent.gateTime
    : null;

  return (
    <>
      <PageHero
        title="Schedule"
        subtitle="Race Calendar and Event Listings"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Schedule' },
        ]}
      />

      {/* Next Race Hero */}
      {heroEvent && heroDate && (
        <SectionBlock variant="dark">
          <div className="flex flex-col items-center gap-6 text-center md:gap-8">
            {/* Countdown */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Next Race In
              </span>
              <CountdownTimer targetDate={heroEvent.date} />
            </div>

            {/* Date */}
            <div className="flex flex-col items-center">
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {heroDate.weekday}
              </span>
              <span
                className="text-4xl font-bold leading-none text-white md:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {heroDate.month} {heroDate.day}
              </span>
              <span
                className="mt-1 text-sm font-medium tracking-wider text-white/40"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {heroDate.year}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-xl font-bold uppercase leading-tight tracking-tight text-white md:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {heroEvent.title}
            </h2>

            {/* Time */}
            {timeDisplay && (
              <div className="flex items-center gap-6 text-sm text-white/70">
                {heroEvent.gateTime && (
                  <span>
                    Gates:{' '}
                    <span className="font-semibold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                      {heroEvent.gateTime}
                    </span>
                  </span>
                )}
                {heroEvent.raceTime && (
                  <span>
                    Racing:{' '}
                    <span className="font-semibold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                      {heroEvent.raceTime}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            {heroEvent.ticketLink && (
              <a
                href={heroEvent.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded bg-[var(--color-accent)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Buy Tickets
              </a>
            )}
          </div>
        </SectionBlock>
      )}

      {/* No Events Fallback */}
      {!heroEvent && upcomingEvents.length === 0 && (
        <SectionBlock variant="dark">
          <div className="py-12 text-center">
            <p
              className="text-lg font-bold uppercase tracking-tight text-white/50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No upcoming events scheduled
            </p>
            <p className="mt-2 text-sm text-white/30">
              Check back soon for the latest race schedule.
            </p>
          </div>
        </SectionBlock>
      )}

      {/* Client-side filtered listing */}
      <EventsClient
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </>
  );
}
