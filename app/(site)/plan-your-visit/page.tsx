import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetch';
import { firstTimerGuideQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  CTABanner,
} from '@/components/ui';
import PlanYourVisitFAQ from './PlanYourVisitFAQ';

interface GuideSection {
  title: string;
  body?: PortableTextBlock[];
  image?: { asset: { _ref: string } };
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FirstTimerGuide {
  sections?: GuideSection[];
  faqItems?: FAQItem[];
}

interface SiteSettings {
  address?: string;
  phone?: string;
  email?: string;
}

export default async function PlanYourVisitPage() {
  const [guide, settings] = await Promise.all([
    sanityFetch<FirstTimerGuide | null>({ query: firstTimerGuideQuery, tags: ['firstTimerGuide'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ]);

  const sections = guide?.sections || [];
  const faqItems = guide?.faqItems || [];

  return (
    <>
      <PageHero
        title="Plan Your Visit"
        subtitle="Everything you need for a great night at the track"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Plan Your Visit' },
        ]}
      />

      {/* Dynamic guide sections from Sanity */}
      {sections.length > 0 ? (
        sections.map((section, idx) => (
          <SectionBlock key={idx} variant={idx % 2 === 0 ? 'white' : 'grey'}>
            <h2
              className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {section.title}
            </h2>
            <div className="grid max-w-4xl gap-8 lg:grid-cols-2">
              <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
                {section.body ? (
                  <PortableText value={section.body} />
                ) : (
                  <p>Content coming soon.</p>
                )}
              </div>
              {section.image && (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={urlFor(section.image).width(640).height(400).url()}
                    alt={section.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </SectionBlock>
        ))
      ) : (
        <>
          {/* Fallback static content when no Sanity data */}
          <SectionBlock variant="white">
            <h2
              className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What to Expect
            </h2>
            <p className="max-w-3xl leading-relaxed text-[var(--color-text-muted)]">
              Vado Speedway Park is a 3/8-mile semi-banked clay oval located in Vado, New
              Mexico. Race nights feature multiple divisions of high-energy dirt track
              competition under the lights. The atmosphere is family-friendly, loud, and
              unforgettable.
            </p>
          </SectionBlock>

          <SectionBlock variant="grey">
            <h2
              className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What to Bring
            </h2>
            <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
              {[
                'Ear protection (it gets loud)',
                'Sunscreen for early gates',
                'Closed-toe shoes',
                'Layers -- desert nights cool down fast',
                'Small cooler (no glass)',
                'Seat cushion for bleachers',
                'Cash and cards accepted',
                'Camera (no flash during racing)',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {item}
                </div>
              ))}
            </div>
          </SectionBlock>
        </>
      )}

      {/* Getting Here */}
      <SectionBlock variant={sections.length > 0 ? (sections.length % 2 === 0 ? 'white' : 'grey') : 'white'}>
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Getting Here
        </h2>
        <div className="max-w-3xl space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Vado Speedway Park is located off I-10, approximately 20 minutes south of
            Las Cruces, New Mexico. Free parking is available on-site.
          </p>
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-5">
            <p
              className="text-sm font-semibold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Address
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {settings?.address || 'Vado Speedway Park, Vado, NM 88072'}
            </p>
            <a
              href="https://maps.google.com/?q=Vado+Speedway+Park"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Open in Maps
            </a>
          </div>
        </div>
      </SectionBlock>

      {/* Tickets & Pricing */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Tickets &amp; Pricing
        </h2>
        <div className="max-w-lg">
          <div className="rounded-lg border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
            {[
              { label: 'Adults', price: '$15' },
              { label: 'Seniors (62+)', price: '$12' },
              { label: 'Kids (12 & under)', price: 'Free' },
              { label: 'Pit Pass', price: '$35' },
              {
                label: 'Season Pass',
                price: (
                  <a
                    href={`tel:${settings?.phone || '5755247913'}`}
                    className="text-[var(--color-accent)] underline underline-offset-4"
                  >
                    Contact Office
                  </a>
                ),
              },
            ].map(({ label, price }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-[var(--color-text)]">{label}</span>
                <span className="font-semibold text-[var(--color-text)]">{price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            Prices may vary for special events. Check individual event listings for details.
          </p>
        </div>
      </SectionBlock>

      {/* FAQ */}
      {faqItems.length > 0 ? (
        <SectionBlock variant="white">
          <h2
            className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl">
            <PlanYourVisitFAQ items={faqItems} />
          </div>
        </SectionBlock>
      ) : (
        <SectionBlock variant="white">
          <h2
            className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl">
            <PlanYourVisitFAQ
              items={[
                { question: 'What time should I arrive?', answer: 'Gates typically open 1.5 to 2 hours before the first green flag. Arriving early gives you time to find parking, grab food, and settle into your seats before hot laps begin.' },
                { question: 'Can I bring outside food and drinks?', answer: 'Small personal coolers are permitted in the grandstand area. No glass containers. The concession stand offers a full menu if you prefer to grab something on-site.' },
                { question: 'Is there reserved seating?', answer: 'General admission is first-come, first-served in the main grandstand. Suite rentals are available for groups and corporate events -- contact the track office for availability.' },
                { question: 'Are pets allowed?', answer: 'Service animals are welcome. For the safety and comfort of all guests, pets are not permitted in the grandstand or pit areas.' },
                { question: 'What payment methods are accepted?', answer: 'Cash and all major credit/debit cards are accepted at the gate and concession stands.' },
              ]}
            />
          </div>
        </SectionBlock>
      )}

      <CTABanner
        title="Ready for Race Night?"
        description="Check the schedule and grab your tickets."
        primaryAction={{ label: 'View Schedule', href: '/events' }}
        variant="red"
      />
    </>
  );
}
