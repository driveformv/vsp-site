'use client';

import Link from 'next/link';
import {
  PageHero,
  SectionBlock,
  EventCard,
  NewsCard,
  SponsorStrip,
  CTABanner,
} from '@/components/ui';

const upcomingEvents = [
  {
    title: 'Saturday Night Thunder',
    date: '2026-03-14',
    classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks'],
    gateTime: '5:00 PM',
    raceTime: '7:00 PM',
    ticketLink: '#',
    slug: 'saturday-night-thunder-03-14',
  },
  {
    title: 'Sprint Car Showdown',
    date: '2026-03-21',
    classes: ['Sprint Cars', 'Modifieds', 'Sport Mods'],
    gateTime: '4:30 PM',
    raceTime: '6:30 PM',
    ticketLink: '#',
    slug: 'sprint-car-showdown-03-21',
  },
  {
    title: 'Easter Classic',
    date: '2026-04-04',
    classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks', 'Mini Stocks'],
    gateTime: '4:00 PM',
    raceTime: '6:00 PM',
    ticketLink: '#',
    slug: 'easter-classic-04-04',
  },
];

const latestNews = [
  {
    title: '2026 Season Opener Sets New Attendance Record',
    category: 'Announcement',
    date: '2026-03-01',
    excerpt:
      'Vado Speedway Park kicked off the 2026 season with a record crowd as fans packed the grandstands for an unforgettable night of dirt track racing.',
    slug: '2026-season-opener-record',
  },
  {
    title: 'Modified Division Points Battle Tightens',
    category: 'Results',
    date: '2026-02-22',
    excerpt:
      'Three drivers are separated by just 15 points heading into March, setting up one of the closest championship races in recent memory.',
    slug: 'modified-points-battle',
  },
  {
    title: 'New Pit Facility Upgrades Complete',
    category: 'Feature',
    date: '2026-02-15',
    excerpt:
      'Expanded pit area with improved drainage, new concrete pads, and upgraded electrical service now available for all competitors.',
    slug: 'pit-facility-upgrades',
  },
];

const sponsors = [
  { name: 'Sponsor A', logo: '/sponsors/placeholder.svg', tier: 'Title' },
  { name: 'Sponsor B', logo: '/sponsors/placeholder.svg', tier: 'Title' },
  { name: 'Sponsor C', logo: '/sponsors/placeholder.svg', tier: 'Gold' },
  { name: 'Sponsor D', logo: '/sponsors/placeholder.svg', tier: 'Gold' },
  { name: 'Sponsor E', logo: '/sponsors/placeholder.svg', tier: 'Gold' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Fuel Your Passion for Speed"
        subtitle="New Mexico's Premier Dirt Track Racing Venue"
      >
        <Link
          href="/events"
          className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Buy Tickets
        </Link>
        <a
          href="https://maps.google.com/?q=Vado+Speedway+Park"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Get Directions
        </a>
      </PageHero>

      {/* Upcoming Events */}
      <SectionBlock variant="grey">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Upcoming Events
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            View Full Schedule
          </Link>
        </div>
      </SectionBlock>

      {/* Latest News */}
      <SectionBlock variant="white">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Latest News
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((article) => (
            <NewsCard key={article.slug} {...article} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            All News
          </Link>
        </div>
      </SectionBlock>

      {/* CTA Banner */}
      <CTABanner
        title="New to Dirt Racing?"
        description="Everything you need to know for your first visit to Vado Speedway Park."
        primaryAction={{ label: 'Start Here', href: '/plan-your-visit' }}
        variant="dark"
      />

      {/* Sponsors */}
      <SectionBlock variant="grey">
        <h2
          className="mb-8 text-center text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Partners
        </h2>
        <SponsorStrip sponsors={sponsors} />
        <div className="mt-8 text-center">
          <Link
            href="/sponsors"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Become a Sponsor
          </Link>
        </div>
      </SectionBlock>

      {/* Email Signup */}
      <SectionBlock variant="white">
        <div className="mx-auto max-w-xl text-center">
          <h2
            className="mb-3 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Don&apos;t Miss Out
          </h2>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Get race schedules, results, and exclusive updates delivered to your inbox.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text)]"
            />
            <button
              type="submit"
              className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </SectionBlock>
    </>
  );
}
