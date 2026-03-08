'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DataRow, WidgetConfig } from '@/lib/types';

interface RecommendationsWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

function getIcon(name: string) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[name] ?? null;
}

export function RecommendationsWidget({ data, config }: RecommendationsWidgetProps) {
  const color = config.color ?? '#10b981';
  const titleKey = config.titleKey ?? 'title';
  const percentKey = config.percentKey ?? 'percent';
  const itemsKey = config.itemsKey ?? 'items';
  const iconKey = config.iconKey ?? 'icon';

  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set(data.map((_, i) => i)));

  function toggleSection(index: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {data.map((row, index) => {
        const title = String(row[titleKey] ?? '');
        const percent = Number(row[percentKey] ?? 0);
        const items = (row[itemsKey] as string[]) ?? [];
        const iconName = String(row[iconKey] ?? '');
        const IconComponent = iconName ? getIcon(iconName) : null;
        const isOpen = openSections.has(index);

        return (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {title}
                </span>
                <span className="text-sm font-bold" style={{ color }}>
                  ({percent}%)
                </span>
              </div>
              {IconComponent && (
                <IconComponent className="w-5 h-5 shrink-0" />
              )}
            </button>

            {isOpen && items.length > 0 && (
              <div className="px-4 pb-4 pt-1">
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
