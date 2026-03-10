import { notFound } from 'next/navigation';
import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetch';
import { newsPostBySlugQuery, newsPostSlugsQuery, newsPostsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { SectionBlock, BreadcrumbBar, NewsCard } from '@/components/ui';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface SanityNewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  body?: PortableTextBlock[];
  featuredImage?: { asset: { _ref: string } };
  publishDate?: string;
  excerpt?: string;
  relatedEvent?: { title: string; slug: { current: string }; date: string };
}

interface SanityNewsPostListing {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  featuredImage?: { asset: { _ref: string } };
  publishDate?: string;
  excerpt?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await sanityFetch<SanityNewsPost | null>({
    query: newsPostBySlugQuery,
    params: { slug },
    tags: ['newsPost'],
  });

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt || `${article.title} - Vado Speedway Park`,
    openGraph: {
      title: article.title,
      description: article.excerpt || `${article.title} - Vado Speedway Park`,
      type: 'article',
      ...(article.publishDate && { publishedTime: article.publishDate }),
      ...(article.featuredImage && {
        images: [{ url: urlFor(article.featuredImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: newsPostSlugsQuery, tags: ['newsPost'] });
  // Pre-render only recent 20 posts; rest generated on-demand via ISR
  return (slugs || []).slice(0, 20).map((slug) => ({ slug }));
}

export const dynamicParams = true;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allPosts] = await Promise.all([
    sanityFetch<SanityNewsPost | null>({
      query: newsPostBySlugQuery,
      params: { slug },
      tags: ['newsPost'],
    }),
    sanityFetch<SanityNewsPostListing[]>({ query: newsPostsQuery, tags: ['newsPost'] }),
  ]);

  if (!article) notFound();

  const formattedDate = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const heroImage = article.featuredImage
    ? urlFor(article.featuredImage).width(1280).height(720).url()
    : null;

  const relatedArticles = (allPosts || [])
    .filter((p) => p.slug.current !== slug)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      category: p.category || 'News',
      date: p.publishDate || '',
      excerpt: p.excerpt || '',
      image: p.featuredImage ? urlFor(p.featuredImage).width(640).height(400).url() : undefined,
      slug: p.slug.current,
    }));

  return (
    <>
      {article.publishDate && (
        <ArticleJsonLd
          headline={article.title}
          datePublished={article.publishDate}
          description={article.excerpt}
          url={`https://vadospeedwaypark.com/news/${slug}`}
          image={heroImage || undefined}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://vadospeedwaypark.com' },
          { name: 'News', url: 'https://vadospeedwaypark.com/news' },
          { name: article.title },
        ]}
      />

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
            {article.category && (
              <span className="rounded bg-[var(--color-surface-dark)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {article.category}
              </span>
            )}
            {formattedDate && (
              <time className="text-xs text-[var(--color-text-muted)]">{formattedDate}</time>
            )}
          </div>

          <h1
            className="mb-8 text-3xl font-bold leading-tight text-[var(--color-text)] md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {article.title}
          </h1>

          {/* Featured Image */}
          {heroImage ? (
            <div className="mb-10 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--color-surface-alt)]">
              <img
                src={heroImage}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-10 aspect-[16/9] rounded-lg bg-[var(--color-surface-alt)]">
              <div className="flex h-full items-center justify-center">
                <span
                  className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  VSP
                </span>
              </div>
            </div>
          )}

          {/* Body */}
          {article.body ? (
            <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
              <PortableText value={article.body} />
            </div>
          ) : (
            <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
              Article content coming soon.
            </p>
          )}
        </article>
      </SectionBlock>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
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
      )}
    </>
  );
}
