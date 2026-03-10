'use client';

import { FormEvent, useState } from 'react';
import { FormBlock } from '@/components/ui';

export default function DriverRegistrationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      city: (form.elements.namedItem('city') as HTMLInputElement).value,
      state: (form.elements.namedItem('state') as HTMLInputElement).value,
      zip: (form.elements.namedItem('zip') as HTMLInputElement).value,
      carNumber: (form.elements.namedItem('carNumber') as HTMLInputElement).value,
      division: (form.elements.namedItem('division') as HTMLSelectElement).value,
      experience: (form.elements.namedItem('experience') as HTMLSelectElement).value,
      emergencyContact: (form.elements.namedItem('emergencyContact') as HTMLInputElement).value,
      emergencyPhone: (form.elements.namedItem('emergencyPhone') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/driver-registration', {
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
        <p className="text-sm font-semibold text-[var(--color-text)]">Registration submitted.</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Bring a copy of this confirmation and required documentation to the pit gate on race day.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
        >
          Submit another registration
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
        submitLabel={status === 'loading' ? 'Submitting...' : 'Submit Registration'}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" placeholder="First name" required />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" placeholder="Last name" required />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" />
          </div>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" placeholder="Street address" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="city">City</label>
            <input id="city" name="city" type="text" placeholder="City" />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input id="state" name="state" type="text" placeholder="NM" />
          </div>
          <div>
            <label htmlFor="zip">ZIP</label>
            <input id="zip" name="zip" type="text" placeholder="88072" />
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
          <label htmlFor="experience">Racing Experience</label>
          <select id="experience" name="experience" defaultValue="">
            <option value="" disabled>Select experience level</option>
            <option value="none">No prior experience</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input id="emergencyContact" name="emergencyContact" type="text" placeholder="Contact name" />
          </div>
          <div>
            <label htmlFor="emergencyPhone">Emergency Phone</label>
            <input id="emergencyPhone" name="emergencyPhone" type="tel" placeholder="(555) 555-5555" />
          </div>
        </div>
      </FormBlock>
    </>
  );
}
