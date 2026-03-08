'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { DataRow, WidgetConfig } from '@/lib/types';

interface ScorecardWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function ScorecardWidget({ data, config }: ScorecardWidgetProps) {
  const color = config.color ?? '#10b981';
  const valueKey = config.valueKey ?? config.yKey ?? Object.keys(data[0] ?? {})[0] ?? 'value';
  const trendKey = config.trendKey as string | undefined;
  const trendLabel = config.trendLabel as string | undefined;
  const subtitle = config.subtitle as string | undefined;
  const maxValue = config.maxValue as number | undefined;

  const row = data[0] ?? {};
  const value = Number(row[valueKey] ?? 0);
  const trend = trendKey ? Number(row[trendKey] ?? 0) : undefined;
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="flex flex-col items-center justify-center h-[300px] gap-3">
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}

      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-bold text-gray-900 dark:text-white">
          {Math.round(value)}
        </span>
        {maxValue !== undefined && (
          <span className="text-2xl text-gray-400 dark:text-gray-500">
            / {maxValue}
          </span>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5" style={{ color }}>
          <span className="text-base font-semibold">
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className="text-sm">{trendLabel}</span>
          )}
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
        </div>
      )}
    </div>
  );
}
