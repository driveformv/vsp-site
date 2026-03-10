import Link from 'next/link';

interface NewsListItemProps {
  title: string;
  date: string;
  image?: string;
  slug: string;
  category?: string;
  excerpt?: string;
}

export function NewsListItem({ title, date, image, slug, category, excerpt }: NewsListItemProps) {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : '';

  return (
    <Link
      href={`/news/${slug}`}
      className="group flex gap-5 py-5 transition-colors hover:bg-[var(--color-surface-alt)]"
    >
      {/* Thumbnail */}
      {image && (
        <div className="h-24 w-36 shrink-0 overflow-hidden rounded bg-[var(--color-surface-alt)]">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors md:text-lg"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <time>{formattedDate}</time>
          {category && (
            <>
              <span>|</span>
              <span>{category}</span>
            </>
          )}
        </div>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-muted)]">
            {excerpt}
          </p>
        )}
        <span className="mt-2 inline-block text-xs font-semibold text-[var(--color-accent)]">
          read more
        </span>
      </div>
    </Link>
  );
}
