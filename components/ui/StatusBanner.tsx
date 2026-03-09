'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StatusBannerProps {
  message: string;
  type: 'event' | 'rainout' | 'info';
  href?: string;
}

const typeStyles: Record<string, string> = {
  event: 'bg-[var(--color-accent-secondary)] text-black',
  rainout: 'bg-[var(--color-accent)] text-white',
  info: 'bg-[var(--color-surface-alt)] text-[var(--color-text)]',
};

export function StatusBanner({ message, type, href }: StatusBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const content = (
    <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
      {message}
    </span>
  );

  return (
    <div className={`sticky top-0 z-40 ${typeStyles[type]}`}>
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-2.5">
        {href ? (
          <Link href={href} className="underline-offset-2 hover:underline">
            {content}
          </Link>
        ) : (
          content
        )}

        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 p-1 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
