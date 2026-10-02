import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string; // applied to header and cells, e.g. 'whitespace-nowrap' for IDs
}

interface TableProps<T> { columns: Column<T>[]; rows: T[]; getRowKey: (row: T) => string; }

export const Table = <T,>({ columns, rows, getRowKey }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-warm-50">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`border-b border-warm-200 px-4 py-3 text-xs font-semibold text-charcoal-muted ${c.className ?? ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="transition-colors hover:bg-warm-50">
              {columns.map((c) => (
                <td key={c.key} className={`border-b border-warm-200 px-4 py-4 align-middle ${c.className ?? ''}`}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
