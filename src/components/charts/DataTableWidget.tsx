'use client';

import { DataRow, WidgetConfig } from '@/lib/types';

interface DataTableWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

function formatCell(value: unknown, formatter?: string): string {
  if (value == null) return '';
  const num = Number(value);
  if (!isNaN(num) && typeof value !== 'boolean' && value !== '') {
    if (formatter === 'currency') return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (formatter === 'percent') return `${num.toFixed(1)}%`;
    if (formatter === 'compact') {
      if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
      if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    }
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
}

export function DataTableWidget({ data, config }: DataTableWidgetProps) {
  const columns = config.columns ?? Object.keys(data[0] ?? {});
  const labels = config.columnLabels ?? {};

  return (
    <div className="-mx-3 sm:-mx-4 overflow-x-auto">
      <div className="min-w-[560px] max-h-[350px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr className="bg-gray-50 dark:bg-gray-900">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 sm:px-4 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 whitespace-nowrap"
                >
                  {labels[col] ?? col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 tabular-nums whitespace-nowrap"
                  >
                    {formatCell(row[col], config.valueFormatter)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
