'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

function calculateTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
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

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft> | undefined>(undefined);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Render nothing on server / first client paint to avoid hydration mismatch
  if (timeLeft === undefined) {
    return (
      <span
        className="text-lg font-bold tracking-wider text-white/40 md:text-2xl"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        --d --h --m --s
      </span>
    );
  }

  if (!timeLeft) {
    return (
      <span
        className="text-lg font-bold uppercase tracking-widest text-[var(--color-accent)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        RACE NIGHT
      </span>
    );
  }

  return (
    <span
      className="text-lg font-bold tracking-wider text-white md:text-2xl"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
    </span>
  );
}
