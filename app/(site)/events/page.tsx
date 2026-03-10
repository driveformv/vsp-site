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
    image: e.image ? urlFor(e.image).width(640).height(480).url() : undefined,
    slug: e.slug.current,
  };
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    sanityFetch<SanityEvent[]>({ query: upcomingEventsQuery, tags: ['event'] }),
    sanityFetch<SanityEvent[]>({ query: pastEventsQuery, tags: ['event'] }),
  ]);

  const upcomingEvents = (upcoming || []).map(mapEvent);
  const pastEvents = (past || []).slice(0, 12).map(mapEvent);

  return (
    <>
      <PageHero title="Schedule" subtitle="All upcoming and past events at Vado Speedway Park" />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Schedule' },
        ]}
      />

      {/* Upcoming Events */}
      <SectionBlock variant="grey">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            No upcoming events scheduled. Check back soon.
          </p>
        )}
      </SectionBlock>

      {/* Past Events */}
      <SectionBlock variant="white">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Past Events
        </h2>
        {pastEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            No past events to show.
          </p>
        )}
      </SectionBlock>
    </>
  );
}
