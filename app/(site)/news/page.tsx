import { sanityFetch } from '@/sanity/lib/fetch';
import { newsPostsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PageHero, SectionBlock, NewsCard, BreadcrumbBar } from '@/components/ui';

interface SanityNewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  featuredImage?: { asset: { _ref: string } };
  publishDate?: string;
  excerpt?: string;
}

function mapPost(p: SanityNewsPost) {
  return {
    title: p.title,
    category: p.category || 'News',
    date: p.publishDate || '',
    excerpt: p.excerpt || '',
    image: p.featuredImage ? urlFor(p.featuredImage).width(640).height(400).url() : undefined,
    slug: p.slug.current,
  };
}

export default async function NewsPage() {
  const posts = await sanityFetch<SanityNewsPost[]>({ query: newsPostsQuery, tags: ['newsPost'] });
  const articles = (posts || []).map(mapPost);
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <PageHero title="News" subtitle="Stories, results, and updates from the track" />

      <BreadcrumbBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'News' },
        ]}
      />

      {/* Featured Story */}
      {featured && (
        <SectionBlock variant="grey">
          <h2
            className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Featured
          </h2>
          <div className="mx-auto max-w-2xl">
            <NewsCard {...featured} />
          </div>
        </SectionBlock>
      )}

      {/* All Articles */}
      <SectionBlock variant="white">
        <h2
          className="mb-8 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)] md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          All Stories
        </h2>
        {rest.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <NewsCard key={article.slug} {...article} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            No news posts yet. Check back soon.
          </p>
        )}
      </SectionBlock>
    </>
  );
}
