'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface StickyNavProps {
  transparent?: boolean;
  links?: NavLink[];
  ticketUrl?: string;
  streamUrl?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Schedule', href: '/events' },
  { label: 'Results', href: '/results' },
  { label: 'Points', href: '/points' },
  { label: 'News', href: '/news' },
  { label: 'Plan Your Visit', href: '/plan-your-visit' },
  { label: 'Drivers', href: '/drivers' },
  { label: 'Sponsors', href: '/sponsors' },
];

export default function StickyNav({
  transparent = false,
  links,
  ticketUrl = '/events',
  streamUrl = '#',
}: StickyNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = links && links.length > 0 ? links : DEFAULT_LINKS;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isTransparent = transparent && !scrolled;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          backgroundColor: isTransparent ? 'transparent' : 'var(--color-surface)',
          borderBottom: isTransparent ? '1px solid transparent' : '1px solid var(--color-border)',
        }}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-3" style={{ maxWidth: 1280 }}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span
              className="text-lg font-bold tracking-wider uppercase"
              style={{
                fontFamily: 'var(--font-display, Orbitron, sans-serif)',
                color: isTransparent ? '#FFF' : 'var(--color-text)',
                letterSpacing: '0.08em',
              }}
            >
              Vado Speedway Park
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    color: isTransparent ? '#FFF' : 'var(--color-text)',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    color: isTransparent ? '#FFF' : 'var(--color-text)',
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={ticketUrl}
              target={ticketUrl.startsWith('http') ? '_blank' : undefined}
              rel={ticketUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-5 py-2 text-sm font-semibold rounded transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backgroundColor: 'var(--color-accent)',
                color: '#FFF',
              }}
            >
              Buy Tickets
            </a>
            <a
              href={streamUrl}
              target={streamUrl.startsWith('http') ? '_blank' : undefined}
              rel={streamUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-5 py-2 text-sm font-semibold rounded transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backgroundColor: 'var(--color-surface-dark)',
                color: '#FFF',
              }}
            >
              Watch Live
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isTransparent ? '#FFF' : 'var(--color-text)'}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[201] w-[300px] transition-transform duration-300 overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-surface)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-10 h-10"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col px-6 pb-8">
          {navLinks.map((link) =>
            link.isExternal ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-medium border-b"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-medium border-b"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Mobile CTAs */}
          <div className="flex flex-col gap-3 mt-8">
            <a
              href={ticketUrl}
              target={ticketUrl.startsWith('http') ? '_blank' : undefined}
              rel={ticketUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={() => setMobileOpen(false)}
              className="px-5 py-3 text-center text-sm font-semibold rounded transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backgroundColor: 'var(--color-accent)',
                color: '#FFF',
              }}
            >
              Buy Tickets
            </a>
            <a
              href={streamUrl}
              target={streamUrl.startsWith('http') ? '_blank' : undefined}
              rel={streamUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={() => setMobileOpen(false)}
              className="px-5 py-3 text-center text-sm font-semibold rounded transition-opacity duration-200 hover:opacity-90"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backgroundColor: 'var(--color-surface-dark)',
                color: '#FFF',
              }}
            >
              Watch Live
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
