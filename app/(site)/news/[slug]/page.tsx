import Link from 'next/link';
import { SectionBlock, BreadcrumbBar, NewsCard } from '@/components/ui';

// Placeholder static data -- will be replaced with Sanity fetch
const article = {
  title: '2026 Season Opener Sets New Attendance Record',
  category: 'Announcement',
  date: 'March 1, 2026',
  body: [
    'Vado Speedway Park kicked off the 2026 season with a record crowd as fans packed the grandstands for an unforgettable night of dirt track racing under the desert sky.',
    'The evening featured three full divisions of racing on a perfectly prepared 3/8-mile clay surface. Feature events in the Modified, Stock Car, and Hobby Stock divisions delivered close competition and dramatic finishes throughout the night.',
    'Track management credited increased community engagement and expanded marketing efforts for the strong turnout. Season ticket sales are up 40% compared to the same point last year.',
    '"We put a lot of work into the off-season improvements and the fans noticed," said track general manager. "The atmosphere was electric and we expect that momentum to carry through the entire 2026 campaign."',
  ],
};

const relatedArticles = [
  {
    title: 'Modified Division Points Battle Tightens',
    category: 'Results',
    date: '2026-02-22',
    excerpt:
      'Three drivers are separated by just 15 points heading into March.',
    slug: 'modified-points-battle',
  },
  {
    title: 'New Pit Facility Upgrades Complete',
    category: 'Feature',
    date: '2026-02-15',
    excerpt:
      'Expanded pit area with improved drainage and upgraded electrical service.',
    slug: 'pit-facility-upgrades',
  },
];

export default function NewsArticlePage() {
  return (
    <>
      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: article.title },
        ]}
      />

      <SectionBlock variant="white">
        <article className="mx-auto max-w-3xl">
          {/* Category + Date */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded bg-[var(--color-surface-dark)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {article.category}
            </span>
            <time className="text-xs text-[var(--color-text-muted)]">{article.date}</time>
          </div>

          {/* Title */}
          <h1
            className="mb-8 text-3xl font-bold leading-tight text-[var(--color-text)] md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {article.title}
          </h1>

          {/* Featured Image Placeholder */}
          <div className="mb-10 aspect-[16/9] rounded-lg bg-[var(--color-surface-alt)]">
            <div className="flex h-full items-center justify-center">
              <span
                className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Featured Image
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-5">
            {article.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base leading-relaxed text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </SectionBlock>

      {/* Related Articles */}
      <SectionBlock variant="grey">
        <h2
          className="mb-8 text-xl font-bold uppercase tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Related Stories
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((a) => (
            <NewsCard key={a.slug} {...a} />
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
