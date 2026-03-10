'use client';

interface Sponsor {
  name: string;
  logo: string;
  tier?: string;
  url?: string;
}

interface SponsorStripProps {
  sponsors: Sponsor[];
  showTierLabels?: boolean;
}

function groupByTier(sponsors: Sponsor[]): Record<string, Sponsor[]> {
  const tierOrder = ['Title', 'Gold', 'Silver', 'Bronze', 'Partner'];
  const grouped: Record<string, Sponsor[]> = {};
  sponsors.forEach((s) => {
    const tier = s.tier || 'Partner';
    if (!grouped[tier]) grouped[tier] = [];
    grouped[tier].push(s);
  });
  // Sort by tier order
  const sorted: Record<string, Sponsor[]> = {};
  tierOrder.forEach((t) => { if (grouped[t]) sorted[t] = grouped[t]; });
  // Add any remaining tiers
  Object.keys(grouped).forEach((t) => { if (!sorted[t]) sorted[t] = grouped[t]; });
  return sorted;
}

export function SponsorStrip({ sponsors, showTierLabels = true }: SponsorStripProps) {
  const uniqueTiers = new Set(sponsors.map((s) => s.tier || 'Partner'));
  const hasMeaningfulTiers = uniqueTiers.size > 1;
  const grouped = hasMeaningfulTiers && showTierLabels ? groupByTier(sponsors) : { '': sponsors };

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([tier, tierSponsors]) => (
        <div key={tier}>
          {tier && hasMeaningfulTiers && showTierLabels && (
            <h4
              className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tier}
            </h4>
          )}

          <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {tierSponsors.map((sponsor) => {
              const LogoContent = (
                <div className="flex h-20 items-center justify-center rounded border border-[var(--color-border)] bg-white p-3 transition-shadow hover:shadow-md">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              );

              return sponsor.url ? (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={sponsor.name}
                >
                  {LogoContent}
                </a>
              ) : (
                <div key={sponsor.name} title={sponsor.name}>
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
