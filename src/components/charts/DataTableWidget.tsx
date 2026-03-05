'use client';

import { MarketData } from '@/lib/types';

interface DataTableWidgetProps {
  data: MarketData[];
  config: {
    columns?: string[];
  };
}

const columnLabels: Record<string, string> = {
  date: 'תאריך',
  open: 'פתיחה',
  high: 'גבוה',
  low: 'נמוך',
  close: 'סגירה',
  volume: 'נפח',
  symbol: 'סימול',
};

function formatValue(key: string, value: unknown): string {
  if (key === 'volume') return Number(value).toLocaleString('he-IL');
  if (['open', 'high', 'low', 'close'].includes(key))
    return `₪${Number(value).toFixed(2)}`;
  return String(value);
}

export function DataTableWidget({ data, config }: DataTableWidgetProps) {
  const columns = config.columns ?? ['date', 'open', 'high', 'low', 'close', 'volume'];

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
                  {columnLabels[col] ?? col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id ?? i}
                className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 tabular-nums whitespace-nowrap"
                  >
                    {formatValue(col, row[col as keyof MarketData])}
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
