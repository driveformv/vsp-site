'use client';

import { FormEvent } from 'react';
import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  CTABanner,
  FormBlock,
} from '@/components/ui';

function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // Will be connected to Resend / Supabase
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Vado Speedway Park"
        subtitle="Southern New Mexico's home for dirt track racing"
      />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      {/* Track Info */}
      <SectionBlock variant="white">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Track
        </h2>
        <div className="grid max-w-4xl gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              Vado Speedway Park is a 3/8-mile clay semi-banked oval located in Vado,
              New Mexico, approximately 20 minutes south of Las Cruces along Interstate
              10. The facility hosts weekly dirt track racing from early spring through
              late fall.
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              The track features a modern lighting system, expanded grandstand seating,
              full concession facilities, and a professional pit area with concrete pads,
              drainage, and electrical service for competitors.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-5">
            <h3
              className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Track Specifications
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Surface</dt>
                <dd className="font-medium text-[var(--color-text)]">Clay</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Length</dt>
                <dd className="font-medium text-[var(--color-text)]">3/8 Mile</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Shape</dt>
                <dd className="font-medium text-[var(--color-text)]">Semi-Banked Oval</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Location</dt>
                <dd className="font-medium text-[var(--color-text)]">Vado, NM 88072</dd>
              </div>
            </dl>
          </div>
        </div>
      </SectionBlock>

      {/* History */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          History
        </h2>
        <div className="max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Vado Speedway Park has been a fixture of southern New Mexico motorsports
            for decades, bringing weekly dirt track competition to the Mesilla Valley
            and beyond. The facility has undergone significant improvements in recent
            years, including track surface enhancements, expanded seating, upgraded
            lighting, and modernized pit facilities.
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            The track has hosted some of the biggest names in dirt track racing and
            continues to serve as a proving ground for both seasoned veterans and
            up-and-coming talent across multiple racing divisions.
          </p>
        </div>
      </SectionBlock>

      {/* Contact */}
      <SectionBlock variant="white">
        <h2
          className="mb-6 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Contact
        </h2>
        <div className="grid max-w-4xl gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3
                className="mb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Address
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Vado Speedway Park<br />
                Vado, NM 88072
              </p>
            </div>
            <div>
              <h3
                className="mb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Email
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                info@vadospeedwaypark.com
              </p>
            </div>
            <div>
              <h3
                className="mb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Social
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Follow us on Facebook for the latest updates
              </p>
            </div>
          </div>

          <div>
            <h3
              className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Send a Message
            </h3>
            <FormBlock onSubmit={handleContactSubmit} submitLabel="Send Message">
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="email@example.com" required />
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="How can we help?" />
              </div>
            </FormBlock>
          </div>
        </div>
      </SectionBlock>

      {/* Facility Rental */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Facility Rental
        </h2>
        <div className="max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Vado Speedway Park is available for private rentals, including test and tune
            sessions, corporate events, driving experiences, and film/media productions.
            The facility can accommodate a wide range of event types with full support
            from the track operations team.
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            Contact the track office to discuss your event requirements and receive a
            custom quote.
          </p>
        </div>
      </SectionBlock>

      <CTABanner
        title="Come See Us Race"
        description="Check the schedule for upcoming events at Vado Speedway Park."
        primaryAction={{ label: 'View Schedule', href: '/events' }}
        secondaryAction={{ label: 'Plan Your Visit', href: '/plan-your-visit' }}
        variant="red"
      />
    </>
  );
}
