'use client';

import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { DataRow, WidgetConfig } from '@/lib/types';

interface HighlightWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function HighlightWidget({ data, config }: HighlightWidgetProps) {
  const color = config.color ?? '#10b981';
  const nameKey = config.nameKey ?? 'name';
  const valueKey = config.valueKey ?? config.yKey ?? 'value';
  const imageKey = config.imageKey as string | undefined;
  const trendKey = config.trendKey as string | undefined;
  const trendLabel = config.trendLabel as string | undefined;
  const subtitle = config.subtitle as string | undefined;

  const featured = data[0];
  if (!featured) return null;

  const featuredName = String(featured[nameKey] ?? '');
  const featuredValue = Number(featured[valueKey] ?? 0);
  const featuredImage = imageKey ? String(featured[imageKey] ?? '') : '';
  const trend = trendKey ? Number(featured[trendKey] ?? 0) : undefined;
  const isPositive = trend !== undefined && trend >= 0;

  const maxVal = Math.max(...data.map((d) => Number(d[valueKey] ?? 0)), 1);

  return (
    <div className="space-y-4">
      {/* Featured item */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        {featuredImage && (
          <div className="flex justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImage}
              alt={featuredName}
              className="w-28 h-28 object-contain rounded-lg"
            />
          </div>
        )}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {featuredName}
          </span>
          <CheckCircle className="w-4 h-4" style={{ color }} />
        </div>
        {subtitle && (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-2">
          {trend !== undefined && (
            <div className="flex items-center gap-1 text-sm" style={{ color }}>
              {isPositive ? '+' : ''}{trend}%
              {trendLabel && <span className="text-xs">{trendLabel}</span>}
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
            </div>
          )}
          <span className="text-2xl font-bold" style={{ color }}>
            {featuredValue}%
          </span>
        </div>
      </div>

      {/* Horizontal bar breakdown */}
      <div className="space-y-2.5">
        {data.map((row, index) => {
          const name = String(row[nameKey] ?? '');
          const value = Number(row[valueKey] ?? 0);
          const widthPct = (value / maxVal) * 100;

          return (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 shrink-0 tabular-nums">
                {value}%
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {name}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: index === 0 ? color : '#d1d5db',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
