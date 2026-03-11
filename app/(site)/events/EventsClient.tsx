'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/ui';
import type { EventType, EventStatus } from '@/types/sanity';

interface MappedEvent {
  title: string;
  date: string;
  classes: string[];
  gateTime?: string;
  raceTime?: string;
  ticketLink?: string;
  image?: string;
  slug: string;
  eventType?: EventType;
  status?: EventStatus;
  recapNote?: string;
}

interface EventsClientProps {
  upcomingEvents: MappedEvent[];
  pastEvents: MappedEvent[];
}

const PAST_PAGE_SIZE = 20;

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

function collectMonths(events: MappedEvent[]): string[] {
  const set = new Set<string>();
  for (const e of events) {
    set.add(getMonthKey(e.date));
  }
  return Array.from(set).sort();
}

export function EventsClient({ upcomingEvents, pastEvents }: EventsClientProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'weekly' | 'special'>('all');
  const [pastVisible, setPastVisible] = useState(PAST_PAGE_SIZE);

  const allEvents = useMemo(() => [...upcomingEvents, ...pastEvents], [upcomingEvents, pastEvents]);
  const months = useMemo(() => collectMonths(allEvents), [allEvents]);

  function filterEvents(events: MappedEvent[]): MappedEvent[] {
    return events.filter((e) => {
      if (selectedMonth && getMonthKey(e.date) !== selectedMonth) return false;
      if (selectedType !== 'all' && (e.eventType || 'weekly') !== selectedType) return false;
      return true;
    });
  }

  const filteredUpcoming = useMemo(() => filterEvents(upcomingEvents), [upcomingEvents, selectedMonth, selectedType]);
  const filteredPast = useMemo(() => filterEvents(pastEvents), [pastEvents, selectedMonth, selectedType]);
  const visiblePast = filteredPast.slice(0, pastVisible);
  const hasMorePast = filteredPast.length > pastVisible;

  const typeFilters: { key: 'all' | 'weekly' | 'special'; label: string }[] = [
    { key: 'all', label: 'All Events' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'special', label: 'Special' },
  ];

  return (
    <>
      {/* Filter Bar — dark themed */}
      <section className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1280px] px-6 py-5">
          <div className="flex items-center gap-6">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => { setSelectedType(f.key); setPastVisible(PAST_PAGE_SIZE); }}
                className={`border-b-2 pb-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedType === f.key
                    ? 'border-[var(--color-accent)] text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {months.length > 0 && (
            <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto">
              <button
                onClick={() => { setSelectedMonth(null); setPastVisible(PAST_PAGE_SIZE); }}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  selectedMonth === null
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                All
              </button>
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMonth(m); setPastVisible(PAST_PAGE_SIZE); }}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    selectedMonth === m
                      ? 'bg-white/10 text-white'
                      : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {getMonthLabel(m)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events — dark background, single-column list */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2
              className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Upcoming Events
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/30">
              {filteredUpcoming.length} {filteredUpcoming.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {/* Red accent line */}
          <div className="mb-6 h-px bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/40 to-transparent" />

          {filteredUpcoming.length > 0 ? (
            <div>
              {filteredUpcoming.map((event) => (
                <EventCard key={event.slug} {...event} variant="default" />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p
                className="text-lg font-bold uppercase tracking-tight text-white/30"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                No upcoming events match your filters
              </p>
              <p className="mt-2 text-sm text-white/20">
                Try adjusting the month or event type filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events — light background for contrast */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              className="section-title-accent text-lg font-bold uppercase tracking-tight text-[var(--color-text)] md:text-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Past Events
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {filteredPast.length} {filteredPast.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {visiblePast.length > 0 ? (
            <>
              <div>
                {visiblePast.map((event) => (
                  <div key={event.slug} className="relative">
                    <EventCard {...event} variant="compact" />
                    {event.recapNote && (
                      <span className="absolute right-10 top-1/2 hidden -translate-y-1/2 text-[10px] italic text-[var(--color-text-muted)] md:inline">
                        {event.recapNote}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {hasMorePast && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setPastVisible((prev) => prev + PAST_PAGE_SIZE)}
                    className="inline-flex items-center rounded border border-[var(--color-border)] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-alt)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Load More
                    <span className="ml-2 text-[var(--color-text-muted)]">
                      ({filteredPast.length - pastVisible} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p
                className="text-lg font-bold uppercase tracking-tight text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                No past events match your filters
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
