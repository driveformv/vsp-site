'use client';

interface Sponsor {
  name: string;
  logo: string;
  tier?: string;
  url?: string;
}

interface SponsorStripProps {
  sponsors: Sponsor[];
}

function groupByTier(sponsors: Sponsor[]): Record<string, Sponsor[]> {
  const grouped: Record<string, Sponsor[]> = {};
  sponsors.forEach((s) => {
    const tier = s.tier || 'Partner';
    if (!grouped[tier]) grouped[tier] = [];
    grouped[tier].push(s);
  });
  return grouped;
}

export function SponsorStrip({ sponsors }: SponsorStripProps) {
  const hasTiers = sponsors.some((s) => s.tier);
  const grouped = hasTiers ? groupByTier(sponsors) : { '': sponsors };

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([tier, tierSponsors]) => (
        <div key={tier}>
          {tier && (
            <h4
              className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tier}
            </h4>
          )}

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="flex gap-8 overflow-x-auto px-4 py-2 md:flex-wrap md:items-center md:justify-center md:overflow-visible md:px-0">
            {tierSponsors.map((sponsor) => {
              const LogoContent = (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-10 max-w-[140px] shrink-0 object-contain grayscale transition-all duration-300 hover:grayscale-0 md:h-12 md:max-w-[160px]"
                />
              );

              return sponsor.url ? (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center"
                  title={sponsor.name}
                >
                  {LogoContent}
                </a>
              ) : (
                <div
                  key={sponsor.name}
                  className="flex shrink-0 items-center"
                  title={sponsor.name}
                >
                  {LogoContent}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
