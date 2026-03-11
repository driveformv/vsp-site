'use client';

import { useRef } from 'react';
import { EventCard } from '@/components/ui';

interface CarouselEvent {
  title: string;
  date: string;
  classes: string[];
  gateTime?: string;
  raceTime?: string;
  ticketLink?: string;
  image?: string;
  slug: string;
  eventType?: 'weekly' | 'special' | 'practice' | 'external';
  status?: 'scheduled' | 'postponed' | 'cancelled' | 'completed' | 'soldOut';
  isFeatured?: boolean;
}

export default function EventsCarousel({ events }: { events: CarouselEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {events.map((event) => (
          <EventCard key={event.slug} {...event} />
        ))}
      </div>
      {events.length > 3 && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
          className="absolute right-0 top-0 flex h-[75%] w-16 cursor-pointer items-center justify-end border-none bg-gradient-to-l from-[var(--color-surface-alt)] via-[var(--color-surface-alt)]/80 to-transparent"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
