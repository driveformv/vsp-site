'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

function calculateTimeLeft(target: string) {
  const targetTime = new Date(target).getTime();
  if (isNaN(targetTime)) return null;
  const diff = targetTime - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded bg-white/5 md:h-24 md:w-24">
        <span
          className="text-4xl font-bold leading-none text-white md:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </span>
      </div>
      <span
        className="mt-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40 md:text-[10px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft> | undefined>(undefined);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft === undefined) {
    return (
      <div className="flex items-start gap-2 md:gap-4">
        <TimeBlock value="--" label="DAYS" />
        <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
        <TimeBlock value="--" label="HRS" />
        <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
        <TimeBlock value="--" label="MIN" />
        <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
        <TimeBlock value="--" label="SEC" />
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--color-accent)]/30" />
        <span
          className="text-3xl font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] md:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          RACE NIGHT
        </span>
        <div className="h-px flex-1 bg-[var(--color-accent)]/30" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 md:gap-4">
      <TimeBlock value={String(timeLeft.days)} label="DAYS" />
      <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
      <TimeBlock value={pad(timeLeft.hours)} label="HRS" />
      <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
      <TimeBlock value={pad(timeLeft.minutes)} label="MIN" />
      <span className="mt-4 text-2xl font-bold text-white/20 md:mt-6 md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>:</span>
      <TimeBlock value={pad(timeLeft.seconds)} label="SEC" />
    </div>
  );
}
