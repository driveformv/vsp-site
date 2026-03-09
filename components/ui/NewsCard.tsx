import Link from 'next/link';

interface NewsCardProps {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image?: string;
  slug: string;
}

const categoryColors: Record<string, string> = {
  Results: 'bg-[var(--color-accent)] text-white',
  Announcement: 'bg-[var(--color-surface-dark)] text-white',
  Feature: 'bg-[var(--color-accent-secondary)] text-black',
  Default: 'bg-[var(--color-surface-alt)] text-[var(--color-text)]',
};

function getCategoryStyle(category: string) {
  return categoryColors[category] || categoryColors.Default;
}

export function NewsCard({
  title,
  category,
  date,
  excerpt,
  image,
  slug,
}: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-lg">
      <Link href={`/news/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-alt)]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VSP
              </span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute left-4 top-4">
            <span
              className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getCategoryStyle(category)}`}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {excerpt}
          </p>

          <time className="mt-3 block text-xs text-[var(--color-text-muted)]">
            {formattedDate}
          </time>
        </div>
      </Link>
    </article>
  );
}
