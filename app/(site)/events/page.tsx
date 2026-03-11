import { sanityFetch } from '@/sanity/lib/fetch';
import { upcomingEventsQuery, pastEventsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, EventCard, BreadcrumbBar } from '@/components/ui';

interface SanityEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  gateTime?: string;
  raceTime?: string;
  raceClasses?: { sponsorName?: string; className: string }[];
  image?: { asset: { _ref: string } };
  ticketLink?: string;
  eventType?: string;
  weatherStatus?: string;
}

function mapEvent(e: SanityEvent) {
  return {
    title: e.title,
    date: e.date,
    classes: (e.raceClasses || []).map((c) => c.className),
    gateTime: e.gateTime,
    raceTime: e.raceTime,
    ticketLink: e.ticketLink,
    image: e.image ? urlFor(e.image).width(800).height(500).url() : undefined,
    slug: e.slug.current,
  };
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    sanityFetch<SanityEvent[]>({ query: upcomingEventsQuery, tags: ['event'] }),
    sanityFetch<SanityEvent[]>({ query: pastEventsQuery, tags: ['event'] }),
  ]);

  const upcomingEvents = (upcoming || []).map(mapEvent);
  const pastEvents = (past || []).map(mapEvent);

  const featuredEvent = upcomingEvents[0];
  const remainingEvents = upcomingEvents.slice(1);

  // Show first 20 past events, rest behind "load more" (client-side)
  const visiblePast = pastEvents.slice(0, 20);
  const totalPast = pastEvents.length;

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

      {/* Featured Next Event */}
      {featuredEvent && (
        <SectionBlock variant="white">
          <EventCard {...featuredEvent} variant="featured" />
        </SectionBlock>
      )}

      {/* Upcoming Events - Timeline */}
      {remainingEvents.length > 0 && (
        <SectionBlock variant="grey">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              className="section-title-accent text-lg font-bold uppercase tracking-tight text-[var(--color-text)] md:text-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Upcoming Events
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {remainingEvents.length} {remainingEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>
          <div>
            {remainingEvents.map((event) => (
              <EventCard key={event.slug} {...event} variant="default" />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* No Upcoming Events Fallback */}
      {upcomingEvents.length === 0 && (
        <SectionBlock variant="grey">
          <div className="py-12 text-center">
            <p
              className="text-lg font-bold uppercase tracking-tight text-[var(--color-text-muted)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No upcoming events scheduled
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Check back soon for the latest race schedule.
            </p>
          </div>
        </SectionBlock>
      )}

      {/* Past Events */}
      {visiblePast.length > 0 && (
        <SectionBlock variant="white">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              className="section-title-accent text-lg font-bold uppercase tracking-tight text-[var(--color-text)] md:text-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Past Events
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {totalPast} {totalPast === 1 ? 'event' : 'events'}
            </span>
          </div>
          <div>
            {visiblePast.map((event) => (
              <EventCard key={event.slug} {...event} variant="compact" />
            ))}
          </div>
          {totalPast > 20 && (
            <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
              Showing 20 of {totalPast} past events. Visit individual event pages for details.
            </p>
          )}
        </SectionBlock>
      )}
    </>
  );
}
