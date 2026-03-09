'use client';

import { useState } from 'react';
import {
  PageHero,
  SectionBlock,
  EventCard,
  BreadcrumbBar,
  FilterBar,
} from '@/components/ui';

const upcomingEvents = [
  {
    title: 'Saturday Night Thunder',
    date: '2026-03-14',
    classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks'],
    gateTime: '5:00 PM',
    raceTime: '7:00 PM',
    ticketLink: '#',
    slug: 'saturday-night-thunder-03-14',
  },
  {
    title: 'Sprint Car Showdown',
    date: '2026-03-21',
    classes: ['Sprint Cars', 'Modifieds', 'Sport Mods'],
    gateTime: '4:30 PM',
    raceTime: '6:30 PM',
    ticketLink: '#',
    slug: 'sprint-car-showdown-03-21',
  },
  {
    title: 'Easter Classic',
    date: '2026-04-04',
    classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks', 'Mini Stocks'],
    gateTime: '4:00 PM',
    raceTime: '6:00 PM',
    ticketLink: '#',
    slug: 'easter-classic-04-04',
  },
  {
    title: 'Memorial Day Special',
    date: '2026-05-25',
    classes: ['Modifieds', 'Stock Cars', 'Sport Mods'],
    gateTime: '4:00 PM',
    raceTime: '6:00 PM',
    ticketLink: '#',
    slug: 'memorial-day-special-05-25',
  },
];

const pastEvents = [
  {
    title: '2026 Season Opener',
    date: '2026-02-28',
    classes: ['Modifieds', 'Stock Cars', 'Hobby Stocks'],
    slug: 'season-opener-02-28',
  },
  {
    title: 'Winter Warmup',
    date: '2026-02-14',
    classes: ['Modifieds', 'Sport Mods'],
    slug: 'winter-warmup-02-14',
  },
];

const filters = [
  {
    key: 'year',
    label: 'Year',
    options: [
      { value: '2026', label: '2026' },
      { value: '2025', label: '2025' },
      { value: '2024', label: '2024' },
    ],
  },
  {
    key: 'type',
    label: 'Event Type',
    options: [
      { value: 'weekly', label: 'Weekly Racing' },
      { value: 'special', label: 'Special Events' },
      { value: 'series', label: 'Touring Series' },
    ],
  },
];

export default function EventsPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  function handleFilterChange(key: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <PageHero title="Schedule" subtitle="All upcoming and past events at Vado Speedway Park" />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Schedule' },
        ]}
      />

      <SectionBlock variant="white">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      </SectionBlock>

      {/* Upcoming Events */}
      <SectionBlock variant="grey">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Upcoming Events
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
      </SectionBlock>

      {/* Past Events */}
      <SectionBlock variant="white">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Past Events
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
