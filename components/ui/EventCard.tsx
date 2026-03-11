import Link from 'next/link';

import type { EventStatus, EventType } from '@/types/sanity';

interface EventCardProps {
  title: string;
  date: string;
  classes: string[];
  gateTime?: string;
  raceTime?: string;
  ticketLink?: string;
  image?: string;
  slug: string;
  variant?: 'featured' | 'default' | 'compact' | 'card';
  eventType?: EventType;
  status?: EventStatus;
  isFeatured?: boolean;
  recapNote?: string;
  fullWidth?: boolean;
}

function StatusBadge({ status }: { status?: EventStatus }) {
  if (!status || status === 'scheduled' || status === 'completed') return null;
  const config = {
    cancelled: { label: 'CANCELLED', bg: 'bg-[var(--color-accent)]', text: 'text-white' },
    postponed: { label: 'POSTPONED', bg: 'bg-[var(--color-accent-secondary)]', text: 'text-black' },
    soldOut: { label: 'SOLD OUT', bg: 'bg-white/20', text: 'text-white/70' },
  }[status];
  if (!config) return null;
  return (
    <span
      className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {config.label}
    </span>
  );
}

function EventTypeBadge({ eventType }: { eventType?: EventType }) {
  if (!eventType || eventType === 'weekly') return null;
  if (eventType === 'special') {
    return (
      <span
        className="rounded border border-[var(--color-accent)]/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-accent)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Special Event
      </span>
    );
  }
  return null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const weekday = d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return { weekday, month, day, year };
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ── Featured Card ── large hero-style for the next upcoming event */
function FeaturedEventCard({
  title,
  date,
  classes,
  gateTime,
  raceTime,
  ticketLink,
  image,
  slug,
}: EventCardProps) {
  const { weekday, month, day, year } = formatDate(date);
  const timeDisplay = raceTime || gateTime;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[var(--color-surface-dark)]">
      <div className="grid md:grid-cols-2">
        <Link href={`/events/${slug}`} className="relative block aspect-[16/10] md:aspect-auto">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[280px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-surface-dark)] to-black">
              <span
                className="text-5xl font-bold uppercase tracking-[0.25em] text-white/5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VSP
              </span>
            </div>
          )}
        </Link>

        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="inline-block rounded bg-[var(--color-accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Next Event
              </span>
            </div>

            <p
              className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {weekday} / {month} {day}, {year}
            </p>

            <Link href={`/events/${slug}`}>
              <h3
                className="mb-4 text-2xl font-bold uppercase leading-tight tracking-tight text-white transition-colors hover:text-[var(--color-accent)] md:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h3>
            </Link>

            {timeDisplay && (
              <div className="mb-4 flex items-baseline gap-4 text-sm text-white/50">
                {gateTime && (
                  <span>
                    Gates: <span className="font-semibold text-white/80">{gateTime}</span>
                  </span>
                )}
                {raceTime && (
                  <span>
                    Racing: <span className="font-semibold text-white/80">{raceTime}</span>
                  </span>
                )}
              </div>
            )}

            {classes.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-1.5">
                {classes.slice(0, 5).map((cls) => (
                  <span
                    key={cls}
                    className="rounded bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white/50"
                  >
                    {cls}
                  </span>
                ))}
                {classes.length > 5 && (
                  <span className="rounded bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/40">
                    +{classes.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {ticketLink && (
              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded bg-[var(--color-accent)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(224,43,32,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Buy Tickets
              </a>
            )}
            <Link
              href={`/events/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 transition-colors hover:text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Event Details
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Default Card ── dark-themed premium row for upcoming events list */
function DefaultEventCard({
  title,
  date,
  classes,
  gateTime,
  raceTime,
  ticketLink,
  slug,
  eventType,
  status,
}: EventCardProps) {
  const { weekday, month, day } = formatDate(date);
  const timeDisplay = raceTime || gateTime;
  const isCancelled = status === 'cancelled';

  return (
    <Link
      href={`/events/${slug}`}
      className={`group flex items-center gap-4 border-b border-white/5 py-5 transition-all hover:bg-white/[0.03] md:gap-6 md:px-4 md:py-6 ${isCancelled ? 'opacity-40' : ''}`}
    >
      {/* Date badge */}
      <div
        className="flex w-14 flex-shrink-0 flex-col items-center rounded bg-white/5 py-2.5 md:w-16"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {month}
        </span>
        <span className="text-2xl font-bold leading-none text-white md:text-3xl">
          {day}
        </span>
        <span className="text-[8px] font-medium uppercase tracking-wider text-white/30">
          {weekday}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-sm font-bold uppercase leading-snug tracking-tight transition-colors group-hover:text-[var(--color-accent)] md:text-base ${isCancelled ? 'line-through text-white/30' : 'text-white'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>
          <EventTypeBadge eventType={eventType} />
          <StatusBadge status={status} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
          {timeDisplay && (
            <span>
              {raceTime ? 'Racing' : 'Gates'}: <span className="text-white/60">{timeDisplay}</span>
            </span>
          )}
          {classes.length > 0 && (
            <span>
              {classes.length} {classes.length === 1 ? 'class' : 'classes'}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {ticketLink && status !== 'soldOut' && status !== 'cancelled' && (
          <span
            className="rounded bg-[var(--color-accent)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all group-hover:shadow-[0_0_15px_rgba(224,43,32,0.3)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tickets
          </span>
        )}
        <span className="text-white/20 transition-colors group-hover:text-[var(--color-accent)]">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

/* ── Compact Card ── minimal row for past events */
function CompactEventCard({ title, date, classes, slug, recapNote, status }: EventCardProps) {
  const { month, day, year } = formatDate(date);
  const isCancelled = status === 'cancelled';

  return (
    <Link
      href={`/events/${slug}`}
      className={`group flex items-center justify-between border-b border-[var(--color-border)] py-3 transition-colors hover:bg-[var(--color-surface-alt)] md:px-4 ${isCancelled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span
          className="w-24 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {month} {day}, {year}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`truncate text-sm font-semibold transition-colors group-hover:text-[var(--color-accent)] ${isCancelled ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}
            >
              {title}
            </span>
            <StatusBadge status={status} />
          </div>
          {recapNote && (
            <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
              {recapNote}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3 pl-3">
        {classes.length > 0 && (
          <span className="hidden text-xs text-[var(--color-text-muted)] sm:inline">
            {classes.length} {classes.length === 1 ? 'class' : 'classes'}
          </span>
        )}
        <span className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

/* ── Card ── visual card for homepage carousel */
function CardEventCard({
  title,
  date,
  gateTime,
  raceTime,
  ticketLink,
  image,
  slug,
  classes,
  eventType,
  status,
  isFeatured,
  fullWidth,
}: EventCardProps) {
  const { weekday, month, day } = formatDate(date);
  const timeDisplay = raceTime || gateTime || '';
  const isCancelled = status === 'cancelled';

  return (
    <div
      className={`group flex-shrink-0 ${fullWidth ? 'w-full' : 'w-[280px] md:w-[300px]'} ${isCancelled ? 'opacity-60' : ''}`}
    >
      <Link href={`/events/${slug}`} className="block">
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
                className="text-3xl font-bold uppercase tracking-widest text-white/10"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VSP
              </span>
            </div>
          )}
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {/* Date badge */}
          <div className="absolute bottom-3 left-3 flex flex-col items-center rounded bg-black/80 px-2.5 py-1.5 backdrop-blur-sm">
            <span
              className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {month}
            </span>
            <span
              className="text-lg font-bold leading-none text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {day}
            </span>
            <span className="text-[8px] font-medium uppercase tracking-wider text-white/40">
              {weekday}
            </span>
          </div>
          {/* Top-right badges */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
            {isFeatured && (
              <span
                className="rounded bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Featured
              </span>
            )}
            {status === 'soldOut' ? (
              <span
                className="rounded bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Sold Out
              </span>
            ) : ticketLink && !isCancelled ? (
              <span
                className="rounded bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tickets
              </span>
            ) : null}
            <StatusBadge status={status} />
          </div>
        </div>
      </Link>

      {/* Title */}
      <div className="mt-3 flex items-center gap-2">
        <Link href={`/events/${slug}`}>
          <h3
            className={`text-sm font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-[var(--color-accent)] md:text-base ${isCancelled ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>
        </Link>
        <EventTypeBadge eventType={eventType} />
      </div>

      {/* Meta */}
      <div className="mt-1.5 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        {timeDisplay && <span>{raceTime ? 'Racing' : 'Gates'}: {timeDisplay}</span>}
        {classes.length > 0 && (
          <>
            {timeDisplay && <span className="text-[var(--color-border)]">|</span>}
            <span>{classes.length} classes</span>
          </>
        )}
      </div>

      {/* Buy Tickets */}
      {ticketLink && !isCancelled && status !== 'soldOut' && (
        <a
          href={ticketLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center rounded bg-[var(--color-accent)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Buy Tickets
        </a>
      )}
    </div>
  );
}

export function EventCard(props: EventCardProps) {
  const { variant = 'card' } = props;
  if (variant === 'featured') return <FeaturedEventCard {...props} />;
  if (variant === 'compact') return <CompactEventCard {...props} />;
  if (variant === 'default') return <DefaultEventCard {...props} />;
  return <CardEventCard {...props} />;
}
