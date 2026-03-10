import Link from 'next/link';

interface EventCardProps {
  title: string;
  date: string;
  classes: string[];
  gateTime?: string;
  raceTime?: string;
  ticketLink?: string;
  image?: string;
  slug: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  return { month, day, year, time };
}

export function EventCard({
  title,
  date,
  gateTime,
  slug,
  image,
}: EventCardProps) {
  const { month, day, year } = formatDate(date);

  return (
    <Link href={`/events/${slug}`} className="group block flex-shrink-0 w-[300px] md:w-[320px]">
      {/* Poster image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[var(--color-surface-dark)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <span
              className="text-2xl font-bold uppercase tracking-widest text-white/30"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VSP
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="text-lg font-bold uppercase leading-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Info bar below card */}
      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-semibold text-[var(--color-text)]">{month} {day}, {year}</span>
        </div>
        {gateTime && (
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-semibold text-[var(--color-text)]">{gateTime}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
