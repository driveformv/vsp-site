'use client';

import { ReactNode, useState } from 'react';

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionGroupProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function AccordionGroup({ items, allowMultiple = false }: AccordionGroupProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpenIndexes((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
      {items.map((item, idx) => {
        const isOpen = openIndexes.has(idx);
        return (
          <div key={idx}>
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface-alt)]"
              aria-expanded={isOpen}
            >
              <span
                className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.title}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
