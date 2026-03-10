'use client';

import { FormEvent, useState } from 'react';
import { FormBlock } from '@/components/ui';

export default function ShoutOutForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      recipientName: (form.elements.namedItem('recipientName') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/shout-out', {
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
        <p className="text-sm font-semibold text-[var(--color-text)]">Shout out submitted.</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Your message will be shared at the next event.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
        >
          Send another shout out
        </button>
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
        submitLabel={status === 'loading' ? 'Sending...' : 'Send Shout Out'}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name">Your Name</label>
            <input id="name" name="name" type="text" placeholder="Your name" required />
          </div>
          <div>
            <label htmlFor="email">Your Email</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required />
          </div>
        </div>
        <div>
          <label htmlFor="recipientName">Shout Out For</label>
          <input id="recipientName" name="recipientName" type="text" placeholder="Who is this shout out for?" required />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} placeholder="Your shout out message" required />
        </div>
      </FormBlock>
    </>
  );
}
