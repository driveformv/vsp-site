'use client';

import { FormEvent, useState } from 'react';
import { FormBlock } from '@/components/ui';

export default function EntryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      driverName: (form.elements.namedItem('driverName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      carNumber: (form.elements.namedItem('carNumber') as HTMLInputElement).value,
      division: (form.elements.namedItem('division') as HTMLSelectElement).value,
      eventName: (form.elements.namedItem('eventName') as HTMLInputElement).value,
      hometown: (form.elements.namedItem('hometown') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/entry-form', {
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
        <p className="text-sm font-semibold text-[var(--color-text)]">Entry form submitted.</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
        >
          Submit another entry
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
        submitLabel={status === 'loading' ? 'Submitting...' : 'Submit Entry'}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="driverName">Driver Name</label>
            <input id="driverName" name="driverName" type="text" placeholder="Full name" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" />
          </div>
          <div>
            <label htmlFor="hometown">Hometown</label>
            <input id="hometown" name="hometown" type="text" placeholder="City, State" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="carNumber">Car Number</label>
            <input id="carNumber" name="carNumber" type="text" placeholder="Car #" required />
          </div>
          <div>
            <label htmlFor="division">Division</label>
            <select id="division" name="division" required defaultValue="">
              <option value="" disabled>Select division</option>
              <option value="USRA Modifieds">USRA Modifieds</option>
              <option value="USRA Stock Cars">USRA Stock Cars</option>
              <option value="USRA Hobby Stocks">USRA Hobby Stocks</option>
              <option value="Sport Mods">Sport Mods</option>
              <option value="Mini Stocks">Mini Stocks</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="eventName">Event Name (optional)</label>
          <input id="eventName" name="eventName" type="text" placeholder="e.g., Saturday Night Racing" />
        </div>
      </FormBlock>
    </>
  );
}
