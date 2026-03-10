import { sanityFetch } from '@/sanity/lib/fetch';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import {
  PageHero,
  SectionBlock,
  BreadcrumbBar,
  CTABanner,
} from '@/components/ui';
import ContactForm from './ContactForm';
import ShoutOutForm from './ShoutOutForm';

interface SiteSettings {
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] });

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
              <p className="whitespace-pre-line text-sm text-[var(--color-text-muted)]">
                {settings?.address || 'Vado Speedway Park\nVado, NM 88072'}
              </p>
            </div>
            {(settings?.phone || settings?.email) && (
              <div>
                <h3
                  className="mb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Get in Touch
                </h3>
                {settings?.phone && (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <a href={`tel:${settings.phone}`} className="transition-colors hover:text-[var(--color-text)]">
                      {settings.phone}
                    </a>
                  </p>
                )}
                {settings?.email && (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <a href={`mailto:${settings.email}`} className="transition-colors hover:text-[var(--color-text)]">
                      {settings.email}
                    </a>
                  </p>
                )}
              </div>
            )}
            {settings?.socialLinks && (
              <div>
                <h3
                  className="mb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Social
                </h3>
                <div className="flex gap-3 text-sm text-[var(--color-text-muted)]">
                  {settings.socialLinks.facebook && (
                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-text)]">Facebook</a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-text)]">Instagram</a>
                  )}
                  {settings.socialLinks.youtube && (
                    <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-text)]">YouTube</a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3
              className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Send a Message
            </h3>
            <ContactForm />
          </div>
        </div>
      </SectionBlock>

      {/* Shout Outs */}
      <SectionBlock variant="grey">
        <h2
          className="mb-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shout Outs
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          Send a shout out to a driver, crew member, or fellow fan. Your message will be
          shared at the next event.
        </p>
        <div className="max-w-2xl">
          <ShoutOutForm />
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
