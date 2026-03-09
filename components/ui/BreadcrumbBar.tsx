import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbBar({ items }: BreadcrumbBarProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <svg
                    className="h-3 w-3 text-[var(--color-text-muted)]/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {isLast || !item.href ? (
                  <span className="font-medium text-[var(--color-text)]">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--color-text)]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
