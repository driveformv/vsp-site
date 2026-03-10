import { notFound } from 'next/navigation';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetch';
import { eventBySlugQuery, eventSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, BreadcrumbBar } from '@/components/ui';
import { SportsEventJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

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
  streamLink?: string;
  admissionInfo?: string;
  eventType?: string;
  weatherStatus?: string;
  description?: PortableTextBlock[];
}

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

      <SectionBlock variant="white">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2
              className="mb-4 text-xl font-bold uppercase tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Event Details
            </h2>
            {event.description ? (
              <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
                <PortableText value={event.description} />
              </div>
            ) : (
              <p className="leading-relaxed text-[var(--color-text-muted)]">
                Event details coming soon.
              </p>
            )}

            {classes.length > 0 && (
              <div className="mt-8">
                <h3
                  className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Racing Divisions
                </h3>
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
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Schedule Card */}
            <div className="rounded-lg border border-[var(--color-border)] p-5">
              <h3
                className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Schedule
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Date</dt>
                  <dd className="font-medium text-[var(--color-text)]">{formattedDate}</dd>
                </div>
                {event.gateTime && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Gates Open</dt>
                    <dd className="font-medium text-[var(--color-text)]">{event.gateTime}</dd>
                  </div>
                )}
                {event.raceTime && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-text-muted)]">Racing Starts</dt>
                    <dd className="font-medium text-[var(--color-text)]">{event.raceTime}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Admission Card */}
            {event.admissionInfo && (
              <div className="rounded-lg border border-[var(--color-border)] p-5">
                <h3
                  className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Admission
                </h3>
                <p className="whitespace-pre-line text-sm text-[var(--color-text-muted)]">
                  {event.admissionInfo}
                </p>
              </div>
            )}

            {/* Weather Status */}
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
                  {event.weatherStatus === 'cancelled' && 'This event has been cancelled.'}
                  {event.weatherStatus === 'tbd' && 'Event status is to be determined. Check back for updates.'}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {event.ticketLink && (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded bg-[var(--color-accent)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Buy Tickets
                </a>
              )}
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
            </div>
          </aside>
        </div>
      </SectionBlock>

      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Results &amp; Photos
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Results and photos will be posted after the event.
        </p>
      </SectionBlock>
    </>
  );
}
