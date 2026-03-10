import { sanityFetch } from '@/sanity/lib/fetch';
import { raceClassesQuery } from '@/sanity/lib/queries';
import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  CTABanner,
} from '@/components/ui';
import DriversRulesAccordion from './DriversRulesAccordion';
import DriverRegistrationForm from './DriverRegistrationForm';
import EntryForm from './EntryForm';

interface RaceClass {
  _id: string;
  className: string;
  sponsorName?: string;
  division?: string;
  rulesPdf?: { asset: { url: string } };
}

export default async function DriversPage() {
  const raceClasses = await sanityFetch<RaceClass[]>({ query: raceClassesQuery, tags: ['raceClass'] });
  const classes = raceClasses || [];

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
        {classes.length > 0 ? (
          <div className="grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="rounded-lg border border-[var(--color-border)] p-5"
              >
                <h3
                  className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cls.sponsorName ? `${cls.sponsorName} ${cls.className}` : cls.className}
                </h3>
                {cls.division && (
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Division: {cls.division}
                  </p>
                )}
                {cls.rulesPdf?.asset?.url && (
                  <a
                    href={cls.rulesPdf.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Download Rules PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['USRA Modifieds', 'USRA Stock Cars', 'USRA Hobby Stocks', 'Sport Mods', 'Mini Stocks'].map((name) => (
              <div key={name} className="rounded-lg border border-[var(--color-border)] p-5">
                <h3
                  className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name}
                </h3>
              </div>
            ))}
          </div>
        )}
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
          <DriversRulesAccordion classes={classes} />
        </div>
      </SectionBlock>

      {/* Registration */}
      <SectionBlock variant="white">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Driver Registration
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-[var(--color-text-muted)]">
          All drivers must complete registration before their first event. Submit online below
          or register at the pit gate on race day.
        </p>
        <div className="mb-6 rounded-lg border border-[var(--color-border)] p-5">
          <h3
            className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Requirements
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            {[
              'Valid driver\'s license',
              'Signed liability waiver',
              'USRA license (for USRA-sanctioned divisions)',
              'Approved safety equipment (helmet, suit, gloves, HANS device)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-2xl">
          <DriverRegistrationForm />
        </div>
      </SectionBlock>

      {/* Entry Forms */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Event Entry Form
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-[var(--color-text-muted)]">
          Submit your entry for an upcoming event. Entry forms can also be completed
          at the pit gate on race day.
        </p>
        <div className="max-w-2xl">
          <EntryForm />
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
