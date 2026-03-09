'use client';

import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  AccordionGroup,
  CTABanner,
} from '@/components/ui';

const rulesByClass = [
  {
    title: 'USRA Modifieds',
    content: (
      <div className="space-y-2 text-sm">
        <p>Full USRA Modified rules apply. All competitors must hold a valid USRA license.</p>
        <p>Refer to the official USRA rulebook for complete specifications on engine, chassis, tires, and safety equipment.</p>
      </div>
    ),
  },
  {
    title: 'USRA Stock Cars',
    content: (
      <div className="space-y-2 text-sm">
        <p>Full USRA Stock Car rules apply. Competitors must hold a valid USRA license.</p>
        <p>See the official USRA rulebook for complete technical specifications.</p>
      </div>
    ),
  },
  {
    title: 'USRA Hobby Stocks',
    content: (
      <div className="space-y-2 text-sm">
        <p>Full USRA Hobby Stock rules apply. Competitors must hold a valid USRA license.</p>
        <p>See the official USRA rulebook for complete technical specifications.</p>
      </div>
    ),
  },
  {
    title: 'Sport Mods',
    content: (
      <div className="space-y-2 text-sm">
        <p>Sport Mod rules follow VSP-specific guidelines. Contact the competition director for the latest rulebook.</p>
      </div>
    ),
  },
  {
    title: 'Mini Stocks',
    content: (
      <div className="space-y-2 text-sm">
        <p>Mini Stock rules follow VSP-specific guidelines. Contact the competition director for details.</p>
      </div>
    ),
  },
];

const classes = [
  {
    name: 'USRA Modifieds',
    description: 'Open wheel, purpose-built race cars. The premier division at Vado Speedway Park.',
  },
  {
    name: 'USRA Stock Cars',
    description: 'Full-bodied stock cars with spec engine packages. Competitive and affordable racing.',
  },
  {
    name: 'USRA Hobby Stocks',
    description: 'Entry-level full-body division. A great starting point for new competitors.',
  },
  {
    name: 'Sport Mods',
    description: 'Modified-style open wheel cars with cost-control measures for competitive fields.',
  },
  {
    name: 'Mini Stocks',
    description: 'Four-cylinder economy class. Lowest cost of entry for grassroots dirt track racing.',
  },
];

export default function DriversPage() {
  return (
    <>
      <PageHero
        title="Drivers"
        subtitle="Rules, registration, and everything you need to compete"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Drivers' },
        ]}
      />

      {/* Classes & Divisions */}
      <SectionBlock variant="white">
        <h2
          className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Classes &amp; Divisions
        </h2>
        <div className="grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls.name}
              className="rounded-lg border border-[var(--color-border)] p-5"
            >
              <h3
                className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {cls.name}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                {cls.description}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Rules */}
      <SectionBlock variant="grey">
        <h2
          className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Rules by Class
        </h2>
        <div className="max-w-3xl">
          <AccordionGroup items={rulesByClass} />
        </div>
      </SectionBlock>

      {/* Registration */}
      <SectionBlock variant="white">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Registration
        </h2>
        <div className="max-w-3xl space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            All drivers must complete registration before their first event.
            Registration is handled at the pit gate on race day or can be completed
            in advance by contacting the track office.
          </p>
          <div className="rounded-lg border border-[var(--color-border)] p-5">
            <h3
              className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Requirements
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                Valid driver&apos;s license
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                Signed liability waiver
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                USRA license (for USRA-sanctioned divisions)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                Approved safety equipment (helmet, suit, gloves, HANS device)
              </li>
            </ul>
          </div>
        </div>
      </SectionBlock>

      {/* Entry Forms */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Entry Forms
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-[var(--color-text-muted)]">
          Download and complete the appropriate entry form before arriving at the track.
          Forms can be submitted at the pit gate on race day.
        </p>
        <div className="flex flex-wrap gap-3">
          {['Weekly Entry Form', 'Special Event Entry Form', 'Minor Waiver'].map(
            (form) => (
              <a
                key={form}
                href="#"
                className="rounded border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] transition-colors hover:border-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {form}
              </a>
            )
          )}
        </div>
      </SectionBlock>

      {/* Payouts */}
      <SectionBlock variant="white">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Payouts
        </h2>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">
          Weekly purse amounts vary by division and car count. Special events carry
          enhanced payouts. Contact the track office or check individual event listings
          for specific payout information.
        </p>
      </SectionBlock>

      <CTABanner
        title="Ready to Race?"
        description="Check the schedule and register for the next event."
        primaryAction={{ label: 'View Schedule', href: '/events' }}
        variant="dark"
      />
    </>
  );
}
