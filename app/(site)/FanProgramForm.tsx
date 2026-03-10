'use client';

import { FormEvent, useState } from 'react';

export default function FanProgramForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: '',
      interests: '',
    };

    try {
      const res = await fetch('/api/fan-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm font-semibold text-white">
        You are signed up. Expect exclusive updates soon.
      </p>
    );
  }

  return (
    <>
      {status === 'error' && (
        <p className="mb-3 text-sm text-[var(--color-accent)]">
          Something went wrong. Please try again.
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="w-full rounded border border-white/30 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/50 focus:border-white/60"
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          required
          className="w-full rounded border border-white/30 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/50 focus:border-white/60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {status === 'loading' ? 'Joining...' : 'Sign Up'}
        </button>
      </form>
    </>
  );
}
