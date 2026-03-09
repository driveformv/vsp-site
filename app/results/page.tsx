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
  { key: 'pos', label: 'Finish' },
  { key: 'car', label: 'Car' },
  { key: 'driver', label: 'Driver' },
  { key: 'hometown', label: 'Hometown' },
];

const placeholderData = [
  { pos: '1', car: '21', driver: 'Driver A', hometown: 'Las Cruces, NM' },
  { pos: '2', car: '7', driver: 'Driver B', hometown: 'El Paso, TX' },
  { pos: '3', car: '14', driver: 'Driver C', hometown: 'Albuquerque, NM' },
  { pos: '4', car: '99', driver: 'Driver D', hometown: 'Deming, NM' },
  { pos: '5', car: '33', driver: 'Driver E', hometown: 'Anthony, NM' },
];

// NOTE: This page will be replaced with ported code from the existing results app

export default function ResultsPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  function handleFilterChange(key: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'Results' },
        ]}
      />

      <SectionBlock variant="white">
        <h1
          className="mb-8 text-3xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Results
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
          Results are posted after each event and confirmed by the competition director.
        </p>
      </SectionBlock>
    </>
  );
}
