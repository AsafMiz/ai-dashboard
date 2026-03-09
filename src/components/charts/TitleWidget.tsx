'use client';

import { Calendar, FileText } from 'lucide-react';
import { DataRow, WidgetConfig } from '@/lib/types';
import { LogoImage } from '@/components/layout/LogoImage';

interface TitleWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function TitleWidget({ data, config }: TitleWidgetProps) {
  const color = config.color ?? '#10b981';
  const titleKey = config.titleKey ?? 'title';
  const subtitleKey = (config.subtitleKey as string) ?? 'subtitle';
  const dateRangeKey = (config.dateRangeKey as string) ?? 'dateRange';
  const badgeKey = config.badgeKey ?? 'badge';
  const logoKey = (config.logoKey as string) ?? '';

  const row = data[0];
  if (!row) return null;

  const title = String(row[titleKey] ?? '');
  const subtitle = row[subtitleKey] ? String(row[subtitleKey]) : '';
  const dateRange = row[dateRangeKey] ? String(row[dateRangeKey]) : '';
  const badge = row[badgeKey] ? String(row[badgeKey]) : '';
  const logoUrl = logoKey && row[logoKey] ? String(row[logoKey]) : null;

  return (
    <div className="flex items-stretch gap-4 py-2">
      {logoKey && (
        <LogoImage
          src={logoUrl}
          className="w-16 h-auto object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700 shrink-0 self-stretch"
        />
      )}
      <div className="flex flex-col justify-center gap-3 min-w-0">
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {subtitle && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <FileText className="w-4 h-4 shrink-0" />
              <span>{subtitle}</span>
            </div>
          )}
          {dateRange && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{dateRange}</span>
            </div>
          )}
          {badge && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${color}15`,
                color,
              }}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
