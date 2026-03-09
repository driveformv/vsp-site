'use client';

import { useState } from 'react';
import {
  PageHero,
  SectionBlock,
  NewsCard,
  BreadcrumbBar,
  FilterBar,
} from '@/components/ui';

const featuredStory = {
  title: '2026 Season Opener Sets New Attendance Record',
  category: 'Announcement',
  date: '2026-03-01',
  excerpt:
    'Vado Speedway Park kicked off the 2026 season with a record crowd as fans packed the grandstands for an unforgettable night of dirt track racing under the desert sky.',
  slug: '2026-season-opener-record',
};

const articles = [
  {
    title: 'Modified Division Points Battle Tightens',
    category: 'Results',
    date: '2026-02-22',
    excerpt:
      'Three drivers are separated by just 15 points heading into March, setting up one of the closest championship races in recent memory.',
    slug: 'modified-points-battle',
  },
  {
    title: 'New Pit Facility Upgrades Complete',
    category: 'Feature',
    date: '2026-02-15',
    excerpt:
      'Expanded pit area with improved drainage, new concrete pads, and upgraded electrical service now available for all competitors.',
    slug: 'pit-facility-upgrades',
  },
  {
    title: 'Youth Racing Program Launches in April',
    category: 'Announcement',
    date: '2026-02-10',
    excerpt:
      'A new junior racing development program will give aspiring drivers ages 8-15 hands-on track experience with professional coaching.',
    slug: 'youth-racing-program',
  },
  {
    title: 'Stock Car Feature Recap: February 14',
    category: 'Results',
    date: '2026-02-14',
    excerpt:
      'A late-race restart shook up the field and produced a dramatic finish in the Stock Car A-Main last Saturday night.',
    slug: 'stock-car-recap-02-14',
  },
  {
    title: 'Track Prep: Behind the Scenes',
    category: 'Feature',
    date: '2026-02-05',
    excerpt:
      'How the crew transforms the racing surface before every event to deliver the best dirt track experience in the Southwest.',
    slug: 'track-prep-behind-scenes',
  },
];

const filters = [
  {
    key: 'category',
    label: 'Category',
    options: [
      { value: 'announcement', label: 'Announcements' },
      { value: 'results', label: 'Results' },
      { value: 'feature', label: 'Features' },
    ],
  },
];

export default function NewsPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  function handleFilterChange(key: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <PageHero title="News" subtitle="Stories, results, and updates from the track" />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'News' },
        ]}
      />

      <SectionBlock variant="white">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      </SectionBlock>

      {/* Featured Story */}
      <SectionBlock variant="grey">
        <h2
          className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Featured
        </h2>
        <div className="mx-auto max-w-2xl">
          <NewsCard {...featuredStory} />
        </div>
      </SectionBlock>

      {/* All Articles */}
      <SectionBlock variant="white">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          All Stories
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} {...article} />
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
