'use client';

import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  AccordionGroup,
  CTABanner,
} from '@/components/ui';

const faqItems = [
  {
    title: 'What time should I arrive?',
    content: (
      <p>
        Gates typically open 1.5 to 2 hours before the first green flag. Arriving early
        gives you time to find parking, grab food, and settle into your seats before
        hot laps begin.
      </p>
    ),
  },
  {
    title: 'Can I bring outside food and drinks?',
    content: (
      <p>
        Small personal coolers are permitted in the grandstand area. No glass containers.
        The concession stand offers a full menu if you prefer to grab something on-site.
      </p>
    ),
  },
  {
    title: 'Is there reserved seating?',
    content: (
      <p>
        General admission is first-come, first-served in the main grandstand. Suite
        rentals are available for groups and corporate events -- contact the track office
        for availability.
      </p>
    ),
  },
  {
    title: 'Are pets allowed?',
    content: (
      <p>
        Service animals are welcome. For the safety and comfort of all guests, pets are
        not permitted in the grandstand or pit areas.
      </p>
    ),
  },
  {
    title: 'What payment methods are accepted?',
    content: (
      <p>
        Cash and all major credit/debit cards are accepted at the gate and concession stands.
      </p>
    ),
  },
];

export default function PlanYourVisitPage() {
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

      {/* What to Expect */}
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
          unforgettable. Whether you are a lifelong fan or visiting for the first time,
          you will feel the excitement from the moment you walk through the gate.
        </p>
      </SectionBlock>

      {/* What to Bring */}
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

      {/* Flag Guide */}
      <SectionBlock variant="white">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Flag Guide
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-[var(--color-text-muted)]">
          Racing flags communicate with drivers throughout each race. Here is what they mean.
        </p>
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {[
            { flag: 'Green', meaning: 'Race is underway / restart' },
            { flag: 'Yellow', meaning: 'Caution -- slow down, no passing' },
            { flag: 'Red', meaning: 'Stop immediately on the track' },
            { flag: 'White', meaning: 'One lap remaining' },
            { flag: 'Checkered', meaning: 'Race is complete' },
            { flag: 'Black', meaning: 'Driver must report to pits' },
          ].map(({ flag, meaning }) => (
            <div key={flag} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 font-bold uppercase tracking-wider text-[var(--color-text)]">
                {flag}
              </span>
              <span className="text-[var(--color-text-muted)]">{meaning}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Getting Here */}
      <SectionBlock variant="grey">
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
              Vado Speedway Park, Vado, NM 88072
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
      <SectionBlock variant="white">
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
              { label: 'Season Pass', price: 'Contact Office' },
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

      {/* Suites */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Suites &amp; Group Packages
        </h2>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">
          Host your next corporate outing, birthday party, or private event in one of
          our track-side suites. Packages include reserved seating, catering options,
          and pit access for your group. Contact the track office for availability and
          pricing.
        </p>
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock variant="white">
        <h2
          className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl">
          <AccordionGroup items={faqItems} />
        </div>
      </SectionBlock>

      <CTABanner
        title="Ready for Race Night?"
        description="Check the schedule and grab your tickets."
        primaryAction={{ label: 'View Schedule', href: '/events' }}
        variant="red"
      />
    </>
  );
}
