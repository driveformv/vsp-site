import { ReactNode } from 'react';

interface SectionBlockProps {
  variant?: 'white' | 'grey' | 'dark';
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  white: 'bg-white text-[var(--color-text)]',
  grey: 'bg-[var(--color-surface-alt)] text-[var(--color-text)]',
  dark: 'bg-[var(--color-surface-dark)] text-white',
};

export function SectionBlock({
  variant = 'white',
  children,
  className = '',
}: SectionBlockProps) {
  return (
    <section className={`${variantStyles[variant]} ${className}`}>
      <div className="mx-auto max-w-[1280px] px-6 py-16">{children}</div>
    </section>
  );
}
