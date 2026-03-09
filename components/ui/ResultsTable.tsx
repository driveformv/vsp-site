interface Column {
  key: string;
  label: string;
}

interface ResultsTableProps {
  columns: Column[];
  data: Record<string, any>[];
  className?: string;
}

export function ResultsTable({ columns, data, className = '' }: ResultsTableProps) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-[var(--color-border)] ${className}`}>
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="sticky top-0 z-10 bg-[var(--color-surface-dark)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-alt)] ${
                idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-alt)]'
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {row[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]"
              >
                No results available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
