'use client';

import { FormEvent } from 'react';
import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  CTABanner,
  FormBlock,
} from '@/components/ui';

const sponsorTiers = [
  {
    tier: 'Title',
    sponsors: [
      { name: 'Title Sponsor A', logo: '/sponsors/placeholder.svg' },
      { name: 'Title Sponsor B', logo: '/sponsors/placeholder.svg' },
    ],
  },
  {
    tier: 'Gold',
    sponsors: [
      { name: 'Gold Sponsor A', logo: '/sponsors/placeholder.svg' },
      { name: 'Gold Sponsor B', logo: '/sponsors/placeholder.svg' },
      { name: 'Gold Sponsor C', logo: '/sponsors/placeholder.svg' },
    ],
  },
  {
    tier: 'Silver',
    sponsors: [
      { name: 'Silver Sponsor A', logo: '/sponsors/placeholder.svg' },
      { name: 'Silver Sponsor B', logo: '/sponsors/placeholder.svg' },
      { name: 'Silver Sponsor C', logo: '/sponsors/placeholder.svg' },
      { name: 'Silver Sponsor D', logo: '/sponsors/placeholder.svg' },
    ],
  },
  {
    tier: 'Bronze',
    sponsors: [
      { name: 'Bronze Sponsor A', logo: '/sponsors/placeholder.svg' },
      { name: 'Bronze Sponsor B', logo: '/sponsors/placeholder.svg' },
      { name: 'Bronze Sponsor C', logo: '/sponsors/placeholder.svg' },
      { name: 'Bronze Sponsor D', logo: '/sponsors/placeholder.svg' },
      { name: 'Bronze Sponsor E', logo: '/sponsors/placeholder.svg' },
    ],
  },
];

const tierSizes: Record<string, string> = {
  Title: 'h-16 max-w-[200px] md:h-20 md:max-w-[240px]',
  Gold: 'h-12 max-w-[160px] md:h-16 md:max-w-[200px]',
  Silver: 'h-10 max-w-[140px] md:h-12 md:max-w-[160px]',
  Bronze: 'h-8 max-w-[120px] md:h-10 md:max-w-[140px]',
};

function handleSponsorInquiry(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // Will be connected to Resend / Supabase
}

export default function SponsorsPage() {
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

      {/* Sponsor Grid by Tier */}
      {sponsorTiers.map((group, idx) => (
        <SectionBlock key={group.tier} variant={idx % 2 === 0 ? 'white' : 'grey'}>
          <h2
            className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {group.tier} Partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {group.sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className={`flex shrink-0 items-center justify-center ${tierSizes[group.tier] || ''}`}
              >
                <div className="flex h-full w-full items-center justify-center rounded border border-[var(--color-border)] bg-white px-4 py-3">
                  <span
                    className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {sponsor.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      ))}

      {/* Become a Sponsor CTA + Form */}
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
          <FormBlock onSubmit={handleSponsorInquiry} submitLabel="Send Inquiry">
            <div>
              <label htmlFor="company">Company Name</label>
              <input id="company" name="company" type="text" placeholder="Your company" required />
            </div>
            <div>
              <label htmlFor="contact">Contact Name</label>
              <input id="contact" name="contact" type="text" placeholder="Full name" required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="email@company.com" required />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell us about your sponsorship interest" />
            </div>
          </FormBlock>
        </div>
      </SectionBlock>
    </>
  );
}
