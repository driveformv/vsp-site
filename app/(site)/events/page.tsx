import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/fetch';
import {
  upcomingEventsQuery,
  pastEventsQuery,
  featuredUpcomingEventQuery,
} from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, BreadcrumbBar } from '@/components/ui';
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

  const featuredRaw = featured || (upcoming && upcoming.length > 0 ? upcoming[0] : null);
  const heroEvent = featuredRaw ? mapEvent(featuredRaw) : null;
  const heroDate = heroEvent ? formatHeroDate(heroEvent.date) : null;
  const heroImage = heroEvent?.image
    ? heroEvent.image.replace('1080x1080', '1920x1080')
    : undefined;

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

      {/* ── Next Race Hero ── cinematic full-width with image background */}
      {heroEvent && heroDate && (
        <section className="relative overflow-hidden bg-black">
          {heroImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />

          <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20 md:py-32">
            <div className="flex flex-col items-center gap-10 text-center">
              {/* Label */}
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--color-accent)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Next Race
              </span>

              {/* Countdown */}
              <CountdownTimer targetDate={heroEvent.date} />

              {/* Date line */}
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-white/10" />
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {heroDate.weekday} / {heroDate.month} {heroDate.day}, {heroDate.year}
                </span>
                <div className="h-px w-8 bg-white/10" />
              </div>

              {/* Title */}
              <h2
                className="max-w-3xl text-3xl font-bold uppercase leading-tight tracking-tight text-white md:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {heroEvent.title}
              </h2>

              {/* Time info */}
              {(heroEvent.gateTime || heroEvent.raceTime) && (
                <div className="flex items-center gap-6 text-sm text-white/50">
                  {heroEvent.gateTime && (
                    <span>
                      Gates:{' '}
                      <span className="font-semibold text-white/80" style={{ fontFamily: 'var(--font-mono)' }}>
                        {heroEvent.gateTime}
                      </span>
                    </span>
                  )}
                  {heroEvent.raceTime && (
                    <span>
                      Racing:{' '}
                      <span className="font-semibold text-white/80" style={{ fontFamily: 'var(--font-mono)' }}>
                        {heroEvent.raceTime}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {heroEvent.ticketLink && (
                  <a
                    href={heroEvent.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded bg-[var(--color-accent)] px-12 py-4 text-center text-base font-bold uppercase tracking-wider text-white shadow-[0_0_40px_rgba(224,43,32,0.35)] transition-all hover:bg-red-700 hover:shadow-[0_0_60px_rgba(224,43,32,0.5)] sm:w-auto md:text-lg"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Buy Tickets
                  </a>
                )}
                <Link
                  href={`/events/${heroEvent.slug}`}
                  className="text-sm font-bold uppercase tracking-wider text-white/30 transition-colors hover:text-white/70"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Event Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* No Events Fallback */}
      {!heroEvent && upcomingEvents.length === 0 && (
        <section className="bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <div className="py-12 text-center">
              <p
                className="text-lg font-bold uppercase tracking-tight text-white/30"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                No upcoming events scheduled
              </p>
              <p className="mt-2 text-sm text-white/20">
                Check back soon for the latest race schedule.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Client-side filtered listing */}
      <EventsClient
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </>
  );
}
