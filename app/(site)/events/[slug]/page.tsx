import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetch';
import { eventBySlugQuery, eventSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, BreadcrumbBar, StickyMobileCTA } from '@/components/ui';
import { SportsEventJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import type { SanityEvent } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await sanityFetch<SanityEvent | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ['event'],
  });

  if (!event) return { title: 'Event Not Found' };

  const date = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    title: event.title,
    description: `${event.title} at Vado Speedway Park on ${date}. Dirt track racing in Vado, NM.`,
    openGraph: {
      title: event.title,
      description: `${event.title} at Vado Speedway Park on ${date}.`,
      ...(event.image && {
        images: [{ url: urlFor(event.image).width(1200).height(630).url() }],
      }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: eventSlugsQuery, tags: ['event'] });
  // Pre-render only recent 20 events; rest generated on-demand via ISR
  return (slugs || []).slice(0, 20).map((slug) => ({ slug }));
}

export const dynamicParams = true;

function StatusCTABar({ event, formattedDate }: { event: SanityEvent; formattedDate: string }) {
  const status = event.status || 'scheduled';

  if (status === 'cancelled') {
    return (
      <div className="bg-[var(--color-accent)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-4">
          <p
            className="text-sm font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            This event has been cancelled
          </p>
        </div>
      </div>
    );
  }

  if (status === 'postponed') {
    return (
      <div className="bg-[var(--color-accent-secondary)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-4">
          <p
            className="text-sm font-bold uppercase tracking-wider text-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            This event has been postponed -- check back for updates
          </p>
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="bg-[var(--color-surface-alt)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            This event has concluded
            {event.recapNote ? ` -- ${event.recapNote}` : ''}
          </p>
          <Link
            href="/results"
            className="text-sm font-medium text-[var(--color-text)] underline underline-offset-2 transition-colors hover:text-[var(--color-accent)]"
          >
            View Results
          </Link>
        </div>
      </div>
    );
  }

  // Upcoming / scheduled / soldOut -- show date + ticket CTA
  return (
    <div className="bg-[var(--color-accent)]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <p
            className="text-sm font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {formattedDate}
          </p>
          {event.raceTime && (
            <span className="text-sm text-white/80">
              Racing at {event.raceTime}
            </span>
          )}
        </div>
        {event.ticketLink && status !== 'soldOut' && (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded bg-white px-5 py-2 text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-white/90 md:inline-flex"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Buy Tickets
          </a>
        )}
        {status === 'soldOut' && (
          <span
            className="text-sm font-bold uppercase tracking-wider text-white/80"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sold Out
          </span>
        )}
      </div>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await sanityFetch<SanityEvent | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ['event'],
  });

  if (!event) notFound();

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const classes = (event.raceClasses || []).map((c) => c.className);
  const heroImage = event.image ? urlFor(event.image).width(1280).height(600).url() : undefined;
  const status = event.status || 'scheduled';
  const isFutureEvent = new Date(event.date) >= new Date(new Date().toDateString());
  const showMobileCTA = isFutureEvent && !!event.ticketLink && status !== 'completed' && status !== 'cancelled' && status !== 'soldOut';

  return (
    <>
      <SportsEventJsonLd
        name={event.title}
        startDate={event.date}
        url={`https://vadospeedwaypark.com/events/${slug}`}
        image={heroImage || undefined}
        offers={event.ticketLink ? { url: event.ticketLink } : undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://vadospeedwaypark.com' },
          { name: 'Schedule', url: 'https://vadospeedwaypark.com/events' },
          { name: event.title },
        ]}
      />
      <PageHero title={event.title} subtitle={formattedDate} backgroundImage={heroImage} />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Schedule', href: '/events' },
          { label: event.title },
        ]}
      />

      {/* Status-aware CTA bar */}
      <StatusCTABar event={event} formattedDate={formattedDate} />

      <SectionBlock variant="white">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Schedule & Admission -- primary info users look for */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-border)] p-6">
                <h2
                  className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Schedule
                </h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Date</dt>
                    <dd
                      className="font-medium text-[var(--color-text)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {formattedDate}
                    </dd>
                  </div>
                  {event.gateTime && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--color-text-muted)]">Gates Open</dt>
                      <dd
                        className="font-medium text-[var(--color-text)]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {event.gateTime}
                      </dd>
                    </div>
                  )}
                  {event.raceTime && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--color-text-muted)]">Racing Starts</dt>
                      <dd
                        className="font-medium text-[var(--color-text)]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {event.raceTime}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {event.admissionInfo && (
                <div className="rounded-lg border border-[var(--color-border)] p-6">
                  <h2
                    className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Admission
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {event.admissionInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Racing Divisions */}
            {classes.length > 0 && (
              <div>
                <h2
                  className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Racing Divisions
                </h2>
                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <span
                      key={cls}
                      className="rounded bg-[var(--color-surface-alt)] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text)]"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description ? (
              <div>
                <h2
                  className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Event Details
                </h2>
                <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
                  <PortableText value={event.description} />
                </div>
              </div>
            ) : (
              <div>
                <h2
                  className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Event Details
                </h2>
                <p className="leading-relaxed text-[var(--color-text-muted)]">
                  Event details coming soon.
                </p>
              </div>
            )}

            {/* Completed event: results link */}
            {status === 'completed' && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
                <h2
                  className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Results
                </h2>
                {event.recapNote ? (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {event.recapNote}
                  </p>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Results available on the results page.
                  </p>
                )}
                <Link
                  href="/results"
                  className="mt-3 inline-flex text-sm font-medium text-[var(--color-accent)] underline underline-offset-2 transition-colors hover:text-red-700"
                >
                  View Full Results
                </Link>
              </div>
            )}

            {/* First-timer cross-link */}
            <div className="rounded-lg border border-[var(--color-border)] p-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                First time at Vado Speedway Park?{' '}
                <Link
                  href="/plan-your-visit"
                  className="font-medium text-[var(--color-text)] underline underline-offset-2 transition-colors hover:text-[var(--color-accent)]"
                >
                  Plan your visit
                </Link>
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Weather Advisory */}
            {event.weatherStatus && event.weatherStatus !== 'normal' && (
              <div className="rounded-lg border-2 border-[var(--color-accent-secondary)] bg-yellow-50 p-5">
                <h3
                  className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Weather Update
                </h3>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {event.weatherStatus === 'delayed' && 'This event has been delayed. Check back for updates.'}
                  {event.weatherStatus === 'cancelled' && 'This event has been cancelled due to weather.'}
                  {event.weatherStatus === 'tbd' && 'Event status is to be determined. Check back for updates.'}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {event.streamLink && (
                <a
                  href={event.streamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded border border-[var(--color-border)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)] transition-colors hover:border-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Watch Live
                </a>
              )}
              {event.ticketLink && status !== 'completed' && status !== 'cancelled' && status !== 'soldOut' && (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden w-full items-center justify-center rounded bg-[var(--color-accent)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 md:flex"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Buy Tickets
                </a>
              )}
            </div>
          </aside>
        </div>
      </SectionBlock>

      {/* Mobile Sticky CTA */}
      {showMobileCTA && event.ticketLink && (
        <StickyMobileCTA ticketLink={event.ticketLink} />
      )}
    </>
  );
}
