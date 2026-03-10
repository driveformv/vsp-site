'use client';

export default function EmailSignup() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className="mb-3 text-2xl font-bold uppercase tracking-tight text-[var(--color-accent)] md:text-3xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Don&apos;t Miss Out
      </h2>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Sign up for email updates here
      </p>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Your name"
          className="flex-1 rounded border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text)]"
        />
        <input
          type="email"
          placeholder="Your email address"
          className="flex-1 rounded border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text)]"
        />
        <button
          type="submit"
          className="rounded bg-[var(--color-surface-dark)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
