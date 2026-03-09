'use client';

import { useState } from 'react';
import { SectionBlock, FilterBar, ResultsTable, BreadcrumbBar } from '@/components/ui';

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
    key: 'class',
    label: 'Class',
    options: [
      { value: 'modifieds', label: 'Modifieds' },
      { value: 'stock-cars', label: 'Stock Cars' },
      { value: 'hobby-stocks', label: 'Hobby Stocks' },
      { value: 'sport-mods', label: 'Sport Mods' },
      { value: 'mini-stocks', label: 'Mini Stocks' },
    ],
  },
];

const columns = [
  { key: 'pos', label: 'Pos' },
  { key: 'car', label: 'Car' },
  { key: 'driver', label: 'Driver' },
  { key: 'points', label: 'Points' },
  { key: 'starts', label: 'Starts' },
  { key: 'wins', label: 'Wins' },
];

const placeholderData = [
  { pos: '1', car: '21', driver: 'Driver A', points: '450', starts: '5', wins: '2' },
  { pos: '2', car: '7', driver: 'Driver B', points: '442', starts: '5', wins: '1' },
  { pos: '3', car: '14', driver: 'Driver C', points: '435', starts: '5', wins: '1' },
  { pos: '4', car: '99', driver: 'Driver D', points: '410', starts: '5', wins: '0' },
  { pos: '5', car: '33', driver: 'Driver E', points: '398', starts: '4', wins: '1' },
];

// NOTE: This page will be replaced with ported code from the existing points app

export default function PointsStandingsPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  function handleFilterChange(key: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Points Standings' },
        ]}
      />

      <SectionBlock variant="white">
        <h1
          className="mb-8 text-3xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Points Standings
        </h1>

        <div className="mb-8">
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>

        <ResultsTable columns={columns} data={placeholderData} />

        <p className="mt-6 text-xs text-[var(--color-text-muted)]">
          Points are updated after each event. Official standings are confirmed by the
          competition director.
        </p>
      </SectionBlock>
    </>
  );
}
