import Link from 'next/link';
import Image from 'next/image';
import signupBg from '@/public/signup-bg.jpg';
import { sanityFetch } from '@/sanity/lib/fetch';
import { upcomingEventsQuery, latestNewsQuery, sponsorsQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import {
  PageHero,
  SectionBlock,
  EventCard,
  NewsListItem,
  SponsorStrip,
} from '@/components/ui';
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
    sanityFetch<SanityNewsPost[]>({ query: latestNewsQuery, tags: ['newsPost'] }),
    sanityFetch<SanitySponsor[]>({ query: sponsorsQuery, tags: ['sponsor'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ]);

  const upcomingEvents = (events || []).slice(0, 6).map((e) => ({
    title: e.title,
    date: e.date,
    classes: (e.raceClasses || []).map((c) => c.className),
    gateTime: e.gateTime,
    raceTime: e.raceTime,
    ticketLink: e.ticketLink,
    image: e.image ? urlFor(e.image).width(640).height(480).url() : undefined,
    slug: e.slug.current,
  }));

  const latestNews = (posts || []).slice(0, 5).map((p) => ({
    title: p.title,
    category: p.category || 'News',
    date: p.publishDate || '',
    excerpt: p.excerpt || '',
    image: p.featuredImage ? urlFor(p.featuredImage).width(320).height(200).url() : undefined,
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

      {/* ── Hero ── */}
      <PageHero
        title="Vado Speedway Park"
        videoUrl="/hero-video.mp4"
        backgroundImage="/hero-bg.jpg"
      >
        <div className="flex flex-col items-center gap-6">
          <p
            className="text-center text-lg font-medium uppercase tracking-wide text-white/90 md:text-xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fuel Your{' '}
            <span className="text-2xl font-bold italic text-white md:text-3xl">Passion</span>
            <br />
            <span className="text-2xl font-bold italic text-white md:text-3xl">for Speed</span>
            <br />
            at Vado Speedway Park
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={ticketUrl}
              target={ticketUrl.startsWith('http') ? '_blank' : undefined}
              rel={ticketUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded bg-[var(--color-accent)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Buy Tickets
            </a>
            <a
              href="https://maps.google.com/?q=Vado+Speedway+Park"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-green-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get Directions
            </a>
          </div>
        </div>
      </PageHero>

      {/* ── Upcoming Events ── */}
      <SectionBlock variant="grey">
        <h2
          className="section-title-accent-center mb-10 text-center text-3xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {upcomingEvents.map((event) => (
                <EventCard key={event.slug} {...event} />
              ))}
            </div>
            {/* Right scroll arrow */}
            {upcomingEvents.length > 3 && (
              <div className="pointer-events-none absolute right-0 top-0 flex h-[75%] w-16 items-center justify-end bg-gradient-to-l from-white via-white/80 to-transparent">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            No upcoming events scheduled. Check back soon.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-block rounded bg-[var(--color-accent)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            View Full Schedule
          </Link>
        </div>
      </SectionBlock>

      {/* ── Sponsor Strip ── */}
      {sponsorList.length > 0 && (
        <section className="border-y border-[var(--color-border)] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-6">
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
              {sponsorList.slice(0, 10).map((sponsor) => (
                sponsor.url ? (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center"
                    title={sponsor.name}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-8 max-w-[120px] object-contain grayscale transition-all hover:grayscale-0 md:h-10 md:max-w-[140px]"
                    />
                  </a>
                ) : (
                  <div key={sponsor.name} className="flex shrink-0 items-center" title={sponsor.name}>
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-8 max-w-[120px] object-contain grayscale transition-all hover:grayscale-0 md:h-10 md:max-w-[140px]"
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest News ── */}
      <SectionBlock variant="white">
        <h2
          className="section-title-accent-center mb-10 text-center text-3xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Latest News
        </h2>
        {latestNews.length > 0 ? (
          <div className="mx-auto max-w-3xl divide-y divide-[var(--color-border)]">
            {latestNews.map((article) => (
              <NewsListItem
                key={article.slug}
                title={article.title}
                date={article.date}
                image={article.image}
                slug={article.slug}
                category={article.category}
                excerpt={article.excerpt}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
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

      {/* ── Email Signup / Fan Program ── */}
      <section className="relative overflow-hidden">
        <Image
          src={signupBg}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h2
                className="text-3xl font-bold uppercase tracking-tight text-[var(--color-accent)] md:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Don&apos;t Miss Out
              </h2>
              <p className="mt-2 text-sm uppercase tracking-wider text-white/80" style={{ fontFamily: 'var(--font-display)' }}>
                Sign up for email updates here
              </p>
            </div>
            <div className="w-full max-w-md">
              <FanProgramForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
