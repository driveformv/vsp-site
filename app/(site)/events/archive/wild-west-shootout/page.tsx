import Link from 'next/link';
import { PageHero, SectionBlock, BreadcrumbBar } from '@/components/ui';

export default function WildWestShootoutPage() {
  return (
    <>
      <PageHero
        title="Wild West Shootout"
        subtitle="Historical Archive -- Vado Speedway Park Era"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Schedule', href: '/events' },
          { label: 'Archive' },
          { label: 'Wild West Shootout' },
        ]}
      />

      {/* Overview */}
      <SectionBlock variant="white">
        <div className="max-w-3xl">
          <h2
            className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            About the Wild West Shootout
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            <p>
              The Wild West Shootout was a premier winter racing event held annually at
              Vado Speedway Park. The multi-day series attracted top-level Modified and
              Super Late Model competitors from across the country, along with thousands
              of fans, to the 3/8-mile clay oval in southern New Mexico each January.
            </p>
            <p>
              For years, the Wild West Shootout served as one of the first major dirt
              track events on the national calendar, giving drivers and teams a chance to
              shake off the off-season rust and compete for significant purses under the
              desert sky.
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* Relocation Notice */}
      <SectionBlock variant="grey">
        <div className="max-w-3xl">
          <h2
            className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            2026 and Beyond
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            <p>
              Beginning in 2026, the Wild West Shootout relocated to Central Arizona
              Raceway. This archive preserves the event's history during its years at
              Vado Speedway Park.
            </p>
            <p>
              Vado Speedway Park continues to host a full schedule of weekly racing and
              special events throughout the season.
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* Historical Results Link */}
      <SectionBlock variant="white">
        <div className="max-w-3xl">
          <h2
            className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Historical Results
          </h2>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Browse past Wild West Shootout results from events held at Vado Speedway Park.
          </p>
          <Link
            href="/results"
            className="inline-block rounded bg-[var(--color-surface-dark)] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            View Results Archive
          </Link>
        </div>
      </SectionBlock>
    </>
  );
}
