import Link from 'next/link';

interface NewsListItemProps {
  title: string;
  date: string;
  image?: string;
  slug: string;
}

export function NewsListItem({ title, date, image, slug }: NewsListItemProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/news/${slug}`}
      className="group flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-4 transition-colors hover:bg-[var(--color-surface-alt)]"
    >
      <div className="flex-1 min-w-0">
        <h3
          className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {title}
        </h3>
        <time className="mt-1 block text-xs text-[var(--color-text-muted)]">
          {formattedDate}
        </time>
      </div>
      {image && (
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-[var(--color-surface-alt)]">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
    </Link>
  );
}
