'use client';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: Filter[];
  onChange: (key: string, value: string) => void;
  activeFilters: Record<string, string>;
}

export function FilterBar({ filters, onChange, activeFilters }: FilterBarProps) {
  const hasActive = Object.values(activeFilters).some((v) => v !== '' && v !== undefined);

  function clearAll() {
    filters.forEach((f) => onChange(f.key, ''));
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border)] pb-4">
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <select
            value={activeFilters[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className={`appearance-none rounded border px-3 py-2 pr-8 text-xs font-semibold uppercase tracking-wider outline-none transition-colors ${
              activeFilters[filter.key]
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-text-muted)]'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Dropdown chevron */}
          <svg
            className={`pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
              activeFilters[filter.key] ? 'text-white' : 'text-[var(--color-text-muted)]'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ))}

      {hasActive && (
        <button
          onClick={clearAll}
          className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] underline-offset-2 transition-colors hover:text-[var(--color-text)] hover:underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
