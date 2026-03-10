import StickyNav from '@/components/layout/StickyNav';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import Footer from '@/components/layout/Footer';
import { sanityFetch } from '@/sanity/lib/fetch';
import { navigationQuery, siteSettingsQuery } from '@/sanity/lib/queries';

interface NavItem {
  _id: string;
  label: string;
  url: string;
  parent?: { _id: string; label: string; url: string };
  sortOrder?: number;
  isExternal?: boolean;
}

interface SiteSettings {
  siteName?: string;
  ticketUrl?: string;
  streamUrl?: string;
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

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navItems, settings] = await Promise.all([
    sanityFetch<NavItem[]>({ query: navigationQuery, tags: ['navigation'], revalidate: 300 }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'], revalidate: 300 }),
  ]);

  // Build nav links from Sanity or fallback to defaults
  const topLevelLinks = (navItems || [])
    .filter((item) => !item.parent)
    .map((item) => ({
      label: item.label,
      href: item.url,
      isExternal: item.isExternal,
    }));

  const navLinks = topLevelLinks.length > 0
    ? topLevelLinks
    : [
        { label: 'Schedule', href: '/events' },
        { label: 'Results', href: '/results' },
        { label: 'Points', href: '/points' },
        { label: 'News', href: '/news' },
        { label: 'Plan Your Visit', href: '/plan-your-visit' },
        { label: 'Drivers', href: '/drivers' },
        { label: 'Sponsors', href: '/sponsors' },
      ];

  const ticketUrl = settings?.ticketUrl || '/events';
  const streamUrl = settings?.streamUrl || '#';

  return (
    <>
      <StickyNav
        links={navLinks}
        ticketUrl={ticketUrl}
        streamUrl={streamUrl}
      />
      <main className="min-h-screen pt-[88px] pb-16 md:pb-0">
        {children}
      </main>
      <Footer
        phone={settings?.phone}
        email={settings?.email}
        address={settings?.address}
        socialLinks={settings?.socialLinks}
        navLinks={navLinks}
      />
      <MobileBottomBar ticketUrl={ticketUrl} />
    </>
  );
}
