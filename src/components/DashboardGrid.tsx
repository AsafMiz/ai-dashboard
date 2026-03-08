'use client';

import { Widget } from '@/lib/types';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  widgets: Widget[];
}

export function DashboardGrid({ widgets }: DashboardGridProps) {
  const sorted = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 p-4 sm:p-6">
      {sorted.map((widget) => {
        const isFullWidth =
          widget.type === 'table' ||
          widget.type === 'candlestick' ||
          widget.type === 'recommendations' ||
          widget.type === 'feed' ||
          widget.type === 'title';
        const isTitle = widget.type === 'title';

        return (
          <div
            key={widget.id}
            className={`${
              isTitle
                ? 'lg:col-span-2'
                : `bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm ${
                    isFullWidth ? 'lg:col-span-2' : ''
                  }`
            }`}
          >
            {!isTitle && (
              <div className="px-4 sm:px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {widget.title}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide mr-2 shrink-0">
                  {widget.type}
                </span>
              </div>
            )}
            <div className={isTitle ? '' : 'p-3 sm:p-4'}>
              <WidgetRenderer widget={widget} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
