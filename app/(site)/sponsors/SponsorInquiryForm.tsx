'use client';

import { FormEvent, useState } from 'react';
import { FormBlock } from '@/components/ui';

export default function SponsorInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      contact: (form.elements.namedItem('contact') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/sponsor-inquiry', {
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
        <p className="text-sm font-semibold text-[var(--color-text)]">Inquiry sent.</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Our sponsorship team will be in touch.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
        >
          Send another inquiry
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
        submitLabel={status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      >
        <div>
          <label htmlFor="company">Company Name</label>
          <input id="company" name="company" type="text" placeholder="Your company" required />
        </div>
        <div>
          <label htmlFor="contact">Contact Name</label>
          <input id="contact" name="contact" type="text" placeholder="Full name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="email@company.com" required />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} placeholder="Tell us about your sponsorship interest" />
        </div>
      </FormBlock>
    </>
  );
}
