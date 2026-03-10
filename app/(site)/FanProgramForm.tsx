'use client';

import { FormEvent, useState } from 'react';
import { FormBlock } from '@/components/ui';

export default function FanProgramForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      interests: (form.elements.namedItem('interests') as HTMLTextAreaElement).value,
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
      <div className="rounded-lg border border-[var(--color-border)] p-6 text-center">
        <p className="text-sm font-semibold text-[var(--color-text)]">You are signed up.</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Expect exclusive updates, promotions, and early access to special event tickets.
        </p>
      </div>
    );
  }

  return (
    <>
      {status === 'error' && (
        <p className="mb-4 text-sm text-[var(--color-accent)]">
          Something went wrong. Please try again.
        </p>
      )}
      <FormBlock
        onSubmit={handleSubmit}
        submitLabel={status === 'loading' ? 'Joining...' : 'Join Fan Program'}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fanName">Name</label>
            <input id="fanName" name="name" type="text" placeholder="Your name" required />
          </div>
          <div>
            <label htmlFor="fanEmail">Email</label>
            <input id="fanEmail" name="email" type="email" placeholder="email@example.com" required />
          </div>
        </div>
        <div>
          <label htmlFor="fanPhone">Phone (optional)</label>
          <input id="fanPhone" name="phone" type="tel" placeholder="(555) 555-5555" />
        </div>
        <div>
          <label htmlFor="interests">What interests you? (optional)</label>
          <textarea id="interests" name="interests" rows={3} placeholder="Special events, behind-the-scenes access, driver meetups..." />
        </div>
      </FormBlock>
    </>
  );
}
