import { sanityFetch } from '@/sanity/lib/fetch';
import { sponsorsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, BreadcrumbBar, CTABanner } from '@/components/ui';
import SponsorInquiryForm from './SponsorInquiryForm';

interface SanitySponsor {
  _id: string;
  name: string;
  logo: { asset: { _ref: string } };
  tier?: string;
  websiteUrl?: string;
  description?: string;
}

const tierOrder = ['title', 'gold', 'silver', 'bronze'];
const tierLabels: Record<string, string> = {
  title: 'Title Partners',
  gold: 'Gold Partners',
  silver: 'Silver Partners',
  bronze: 'Bronze Partners',
};
const tierSizes: Record<string, string> = {
  title: 'h-16 max-w-[200px] md:h-20 md:max-w-[240px]',
  gold: 'h-12 max-w-[160px] md:h-16 md:max-w-[200px]',
  silver: 'h-10 max-w-[140px] md:h-12 md:max-w-[160px]',
  bronze: 'h-8 max-w-[120px] md:h-10 md:max-w-[140px]',
};

export default async function SponsorsPage() {
  const sponsors = await sanityFetch<SanitySponsor[]>({ query: sponsorsQuery, tags: ['sponsor'] });

  const grouped: Record<string, SanitySponsor[]> = {};
  for (const s of sponsors || []) {
    const tier = s.tier || 'bronze';
    if (!grouped[tier]) grouped[tier] = [];
    grouped[tier].push(s);
  }

  const orderedTiers = tierOrder.filter((t) => grouped[t]?.length);

  return (
    <>
      <PageHero
        title="Our Partners"
        subtitle="The businesses that make dirt track racing possible"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Sponsors' },
        ]}
      />

      {orderedTiers.length > 0 ? (
        orderedTiers.map((tier, idx) => (
          <SectionBlock key={tier} variant={idx % 2 === 0 ? 'white' : 'grey'}>
            <h2
              className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tierLabels[tier] || tier}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {grouped[tier].map((sponsor) => {
                const logoUrl = sponsor.logo
                  ? urlFor(sponsor.logo).width(320).height(160).url()
                  : null;
                const content = logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={sponsor.name}
                    className={`shrink-0 object-contain grayscale transition-all duration-300 hover:grayscale-0 ${tierSizes[tier] || 'h-10 max-w-[140px]'}`}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center rounded border border-[var(--color-border)] bg-white px-4 py-3 ${tierSizes[tier] || ''}`}
                  >
                    <span
                      className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {sponsor.name}
                    </span>
                  </div>
                );

                return sponsor.websiteUrl ? (
                  <a
                    key={sponsor._id}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center"
                    title={sponsor.name}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={sponsor._id} className="flex shrink-0 items-center" title={sponsor.name}>
                    {content}
                  </div>
                );
              })}
            </div>
          </SectionBlock>
        ))
      ) : (
        <SectionBlock variant="white">
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Sponsor information coming soon.
          </p>
        </SectionBlock>
      )}

      <CTABanner
        title="Become a Sponsor"
        description="Put your brand in front of thousands of fans every race night."
        primaryAction={{ label: 'Contact Us', href: '#sponsor-form' }}
        variant="dark"
      />

      <SectionBlock variant="white">
        <div id="sponsor-form" className="mx-auto max-w-lg">
          <h2
            className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sponsorship Inquiry
          </h2>
          <SponsorInquiryForm />
        </div>
      </SectionBlock>
    </>
  );
}
