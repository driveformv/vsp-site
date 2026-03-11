import Link from 'next/link';
import { vspLogoDataUrl } from '@/lib/logo';

interface FooterProps {
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  navLinks?: { label: string; href: string }[];
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer({
  phone,
  socialLinks,
}: FooterProps) {
  const facebookUrl = socialLinks?.facebook || 'https://facebook.com/vadospeedwaypark';
  const instagramUrl = socialLinks?.instagram || 'https://instagram.com/vadospeedwaypark';
  const youtubeUrl = socialLinks?.youtube || 'https://youtube.com/@vadospeedwaypark';
  const twitterUrl = socialLinks?.twitter || 'https://x.com/vadospeedway';

  return (
    <footer className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: 'url(https://cdn.sanity.io/images/jsftjck0/production/864b66113de79812ec33b19ea4e81a6de9c8e0ee-1440x960.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo */}
          <div className="text-center md:text-left">
            <Link href="/">
              <img
                src={vspLogoDataUrl}
                alt="Vado Speedway Park"
                width={160}
                height={160}
                className="h-16 w-auto mx-auto md:mx-0"
              />
            </Link>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-center gap-1 text-sm text-white/70 md:items-start">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Call</span>
            <a href={`tel:${phone || '5755247913'}`} className="font-semibold text-white transition-colors hover:text-[var(--color-accent)]">
              {phone || '(575) 524-7913'}
            </a>
            <span className="mt-3 text-xs font-bold uppercase tracking-widest text-white/50">Location</span>
            <span className="text-white/80">15900 Stern Dr, Vado, NM 88072</span>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-3 text-sm md:items-start">
            <Link href="/sponsors" className="font-semibold uppercase tracking-wider text-white transition-colors hover:text-[var(--color-accent)]">
              Become a Sponsor
            </Link>
            <a
              href="https://maps.google.com/?q=Vado+Speedway+Park"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold uppercase tracking-wider text-white transition-colors hover:text-[var(--color-accent)]"
            >
              Get Directions
            </a>
            <Link href="/events" className="font-semibold uppercase tracking-wider text-white transition-colors hover:text-[var(--color-accent)]">
              Buy Tickets
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-white transition-opacity hover:opacity-70" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white transition-opacity hover:opacity-70" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-white transition-opacity hover:opacity-70" aria-label="X">
              <XIcon />
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white transition-opacity hover:opacity-70" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-6 py-4 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Vado Speedway Park. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
