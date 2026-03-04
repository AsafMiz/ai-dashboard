'use client';

import { Widget } from '@/lib/types';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  widgets: Widget[];
}

export function DashboardGrid({ widgets }: DashboardGridProps) {
  const sorted = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-6">
      {sorted.map((widget) => (
        <div
          key={widget.id}
          className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm ${
            widget.type === 'table' || widget.type === 'candlestick'
              ? 'lg:col-span-2'
              : ''
          }`}
        >
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {widget.title}
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">
              {widget.type}
            </span>
          </div>
          <div className="p-4">
            <WidgetRenderer widget={widget} />
          </div>
        </div>
      ))}
    </div>
  );
}
