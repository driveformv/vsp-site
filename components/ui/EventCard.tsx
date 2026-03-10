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

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return { month, day, year, formatted: `${month} ${day}, ${year}` };
}

export function EventCard({
  title,
  date,
  gateTime,
  raceTime,
  slug,
  image,
}: EventCardProps) {
  const { formatted } = formatDate(date);
  const timeDisplay = raceTime || gateTime || '';

  return (
    <Link href={`/events/${slug}`} className="group block flex-shrink-0 w-[280px] md:w-[300px]">
      {/* Event image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-surface-dark)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <span
              className="text-3xl font-bold uppercase tracking-widest text-white/20"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VSP
            </span>
          </div>
        )}
      </div>

      {/* Title below card */}
      <h3
        className="mt-3 text-center text-sm font-bold uppercase leading-tight text-[var(--color-text)] md:text-base"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>

      {/* DATE | TIME | LOCATION row */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1">
          <CalendarIcon />
          <div>
            <div className="text-[9px] tracking-widest">Date</div>
            <div className="text-[var(--color-text)]">{formatted}</div>
          </div>
        </div>
        {timeDisplay && (
          <div className="flex items-center gap-1">
            <ClockIcon />
            <div>
              <div className="text-[9px] tracking-widest">Time</div>
              <div className="text-[var(--color-text)]">{timeDisplay}</div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <LocationIcon />
          <div>
            <div className="text-[9px] tracking-widest">Location</div>
            <div className="text-[var(--color-text)]">Vado Speedway Park</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
