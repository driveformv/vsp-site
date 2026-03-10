import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/fetch';
import { upcomingEventsQuery, newsPostsQuery, sponsorsQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import {
  PageHero,
  SectionBlock,
  EventCard,
  NewsCard,
  NewsListItem,
  SponsorStrip,
  CTABanner,
} from '@/components/ui';
import EmailSignup from './EmailSignup';
import FanProgramForm from './FanProgramForm';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';

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
}

interface SanityNewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  featuredImage?: { asset: { _ref: string } };
  publishDate?: string;
  excerpt?: string;
}

interface SanitySponsor {
  _id: string;
  name: string;
  logo: { asset: { _ref: string } };
  tier?: string;
  websiteUrl?: string;
}

interface SiteSettings {
  ticketUrl?: string;
}

export default async function HomePage() {
  const [events, posts, sponsors, settings] = await Promise.all([
    sanityFetch<SanityEvent[]>({ query: upcomingEventsQuery, tags: ['event'] }),
    sanityFetch<SanityNewsPost[]>({ query: newsPostsQuery, tags: ['newsPost'] }),
    sanityFetch<SanitySponsor[]>({ query: sponsorsQuery, tags: ['sponsor'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ]);

  const upcomingEvents = (events || []).slice(0, 3).map((e) => ({
    title: e.title,
    date: e.date,
    classes: (e.raceClasses || []).map((c) => c.className),
    gateTime: e.gateTime,
    raceTime: e.raceTime,
    ticketLink: e.ticketLink,
    image: e.image ? urlFor(e.image).width(640).height(360).url() : undefined,
    slug: e.slug.current,
  }));

  const latestNews = (posts || []).slice(0, 5).map((p) => ({
    title: p.title,
    category: p.category || 'News',
    date: p.publishDate || '',
    excerpt: p.excerpt || '',
    image: p.featuredImage ? urlFor(p.featuredImage).width(640).height(400).url() : undefined,
    slug: p.slug.current,
  }));

  const sponsorList = (sponsors || []).map((s) => ({
    name: s.name,
    logo: s.logo ? urlFor(s.logo).width(320).height(160).url() : '/sponsors/placeholder.svg',
    tier: s.tier ? s.tier.charAt(0).toUpperCase() + s.tier.slice(1) : 'Partner',
    url: s.websiteUrl,
  }));

  const ticketUrl = settings?.ticketUrl || '/events';

  return (
    <>
      <LocalBusinessJsonLd />
      <PageHero
        title="Fuel Your Passion for Speed"
        subtitle="New Mexico's Premier Dirt Track Racing Venue"
      >
        <a
          href={ticketUrl}
          target={ticketUrl.startsWith('http') ? '_blank' : undefined}
          rel={ticketUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="rounded border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Buy Tickets
        </a>
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
          className="section-title-accent mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
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
          className="section-title-accent mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Latest News
        </h2>
        {latestNews.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {latestNews.map((article) => (
              <NewsListItem
                key={article.slug}
                title={article.title}
                date={article.date}
                image={article.image}
                slug={article.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            No news posts yet.
          </p>
        )}
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

      <CTABanner
        title="New to Dirt Racing?"
        description="Everything you need to know for your first visit to Vado Speedway Park."
        primaryAction={{ label: 'Start Here', href: '/plan-your-visit' }}
        variant="dark"
      />

      {/* Sponsors */}
      <SectionBlock variant="grey">
        <h2
          className="section-title-accent-center mb-8 text-center text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Partners
        </h2>
        {sponsorList.length > 0 ? (
          <SponsorStrip sponsors={sponsorList} />
        ) : (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Sponsor information coming soon.
          </p>
        )}
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

      {/* Fan Program */}
      <SectionBlock variant="white">
        <h2
          className="section-title-accent mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Fan Program
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-[var(--color-text-muted)]">
          Join the Vado Speedway Park Fan Program for exclusive updates, promotions,
          and early access to special event tickets.
        </p>
        <div className="max-w-xl">
          <FanProgramForm />
        </div>
      </SectionBlock>

      {/* Email Signup */}
      <SectionBlock variant="grey">
        <EmailSignup />
      </SectionBlock>
    </>
  );
}
