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
  return { month, day };
}

export function EventCard({
  title,
  date,
  classes,
  gateTime,
  raceTime,
  ticketLink,
  image,
  slug,
}: EventCardProps) {
  const { month, day } = formatDate(date);

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-lg">
      <Link href={`/events/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-alt)]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VSP
              </span>
            </div>
          )}

          {/* Date badge */}
          <div className="absolute left-4 top-4 flex flex-col items-center rounded bg-black/90 px-3 py-2 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider">{month}</span>
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {day}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-lg font-bold uppercase leading-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>

          {/* Times */}
          {(gateTime || raceTime) && (
            <div className="mt-3 flex gap-4 text-sm text-[var(--color-text-muted)]">
              {gateTime && (
                <span>
                  Gates: <strong className="text-[var(--color-text)]">{gateTime}</strong>
                </span>
              )}
              {raceTime && (
                <span>
                  Racing: <strong className="text-[var(--color-text)]">{raceTime}</strong>
                </span>
              )}
            </div>
          )}

          {/* Class tags */}
          {classes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {classes.map((cls) => (
                <span
                  key={cls}
                  className="rounded bg-[var(--color-surface-alt)] px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]"
                >
                  {cls}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Ticket CTA */}
      {ticketLink && (
        <div className="border-t border-[var(--color-border)] px-5 py-4">
          <a
            href={ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
            style={{ fontFamily: 'var(--font-display)' }}
            onClick={(e) => e.stopPropagation()}
          >
            Buy Tickets
          </a>
        </div>
      )}
    </article>
  );
}
