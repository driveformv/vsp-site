import Link from 'next/link';

interface CTAAction {
  label: string;
  href: string;
}

interface CTABannerProps {
  title: string;
  description?: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  variant?: 'red' | 'dark' | 'yellow';
}

const variantStyles: Record<string, { bg: string; text: string; primary: string; secondary: string }> = {
  red: {
    bg: 'bg-[var(--color-accent)]',
    text: 'text-white',
    primary: 'bg-white text-[var(--color-accent)] hover:bg-white/90',
    secondary: 'border-white/40 text-white hover:bg-white/10',
  },
  dark: {
    bg: 'bg-[var(--color-surface-dark)]',
    text: 'text-white',
    primary: 'bg-[var(--color-accent)] text-white hover:bg-red-700',
    secondary: 'border-white/30 text-white hover:bg-white/10',
  },
  yellow: {
    bg: 'bg-[var(--color-accent-secondary)]',
    text: 'text-black',
    primary: 'bg-black text-white hover:bg-black/80',
    secondary: 'border-black/30 text-black hover:bg-black/5',
  },
};

export function CTABanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'red',
}: CTABannerProps) {
  const styles = variantStyles[variant];

  return (
    <section className={`${styles.bg} ${styles.text}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-6 py-16 text-center md:py-20">
        <h2
          className="text-2xl font-bold uppercase tracking-tight md:text-3xl lg:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>

        {description && (
          <p className="mt-3 w-full max-w-xl text-base opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryAction.href}
            className={`rounded px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${styles.primary}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {primaryAction.label}
          </Link>

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={`rounded border px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${styles.secondary}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
