'use client';

import { FormEvent, ReactNode } from 'react';

interface FormBlockProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel?: string;
  loading?: boolean;
}

export function FormBlock({
  onSubmit,
  children,
  submitLabel = 'Submit',
  loading = false,
}: FormBlockProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-[var(--color-border)] [&_input]:bg-white [&_input]:px-4 [&_input]:py-3 [&_input]:text-base [&_input]:text-[var(--color-text)] [&_input]:outline-none [&_input]:transition-colors [&_input]:placeholder:text-[var(--color-text-muted)] [&_input]:focus:border-[var(--color-text)] [&_label]:mb-1.5 [&_label]:block [&_label]:text-xs [&_label]:font-semibold [&_label]:uppercase [&_label]:tracking-wider [&_label]:text-[var(--color-text)] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded [&_select]:border [&_select]:border-[var(--color-border)] [&_select]:bg-white [&_select]:px-4 [&_select]:py-3 [&_select]:text-base [&_select]:text-[var(--color-text)] [&_select]:outline-none [&_select]:transition-colors [&_select]:focus:border-[var(--color-text)] [&_textarea]:w-full [&_textarea]:rounded [&_textarea]:border [&_textarea]:border-[var(--color-border)] [&_textarea]:bg-white [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:text-[var(--color-text)] [&_textarea]:outline-none [&_textarea]:transition-colors [&_textarea]:placeholder:text-[var(--color-text-muted)] [&_textarea]:focus:border-[var(--color-text)]"
    >

      {children}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
