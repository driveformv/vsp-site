'use client';

interface StickyMobileCTAProps {
  ticketLink: string;
}

export function StickyMobileCTA({ ticketLink }: StickyMobileCTAProps) {
  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white px-4 py-3 md:hidden"
    >
      <a
        href={ticketLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded bg-[var(--color-accent)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Buy Tickets
      </a>
    </div>
  );
}
