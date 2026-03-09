import Link from 'next/link';
import { PageHero, SectionBlock, BreadcrumbBar } from '@/components/ui';

// Placeholder static data -- will be replaced with Sanity fetch
const event = {
  title: 'Saturday Night Thunder',
  date: 'March 14, 2026',
  gateTime: '5:00 PM',
  raceTime: '7:00 PM',
  classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks'],
  admission: {
    adults: '$15',
    seniors: '$12',
    kids: 'Free (12 & under)',
    pit: '$35',
  },
  description:
    'Weekly Saturday night racing returns with a full card of dirt track action. Three divisions take to the 3/8-mile clay oval under the lights. Grandstand seating is first-come, first-served.',
  ticketLink: '#',
  streamLink: '#',
};

export default function EventDetailPage() {
  return (
    <>
      <PageHero title={event.title} subtitle={event.date} />

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
            <p className="leading-relaxed text-[var(--color-text-muted)]">
              {event.description}
            </p>

            {/* Classes */}
            <div className="mt-8">
              <h3
                className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Racing Divisions
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.classes.map((cls) => (
                  <span
                    key={cls}
                    className="rounded bg-[var(--color-surface-alt)] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text)]"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
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
                  <dd className="font-medium text-[var(--color-text)]">{event.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Gates Open</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.gateTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Racing Starts</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.raceTime}</dd>
                </div>
              </dl>
            </div>

            {/* Admission Card */}
            <div className="rounded-lg border border-[var(--color-border)] p-5">
              <h3
                className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Admission
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Adults</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.admission.adults}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Seniors (62+)</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.admission.seniors}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Kids</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.admission.kids}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Pit Pass</dt>
                  <dd className="font-medium text-[var(--color-text)]">{event.admission.pit}</dd>
                </div>
              </dl>
            </div>

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

      {/* Related Results / Photos placeholder */}
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
