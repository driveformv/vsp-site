'use client';

import Link from 'next/link';

export default function MobileBottomBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch">
        {/* Tickets - Primary CTA */}
        <Link
          href="/tickets"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-opacity duration-200 hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#FFF',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide">Tickets</span>
        </Link>

        {/* Schedule */}
        <Link
          href="/schedule"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide">Schedule</span>
        </Link>

        {/* Results */}
        <Link
          href="/results"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M7 4h10l-1 9H8Z" />
            <path d="M7 4V2" />
            <path d="M17 4V2" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide">Results</span>
        </Link>
      </div>
    </div>
  );
}
