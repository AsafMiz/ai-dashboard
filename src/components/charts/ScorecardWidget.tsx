'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

  const percent = maxValue ? Math.round((value / maxValue) * 100) : Math.round(value);
  const donutData = [
    { name: 'value', value: percent },
    { name: 'remainder', value: 100 - percent },
  ];
  const ringColors = [color, '#e5e7eb'];

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Text side (first in HTML = right in RTL) */}
      <div className="flex flex-col gap-2">
        {subtitle && (
          <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
            {subtitle}
          </span>
        )}

        {trend !== undefined && (
          <span className="inline-flex items-center gap-1 w-fit rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-3 py-0.5 text-sm font-medium">
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
            {trendLabel && <span>{trendLabel}</span>}
          </span>
        )}
      </div>

      {/* Donut ring (second in HTML = left in RTL) */}
      <div className="relative w-[100px] h-[100px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="95%"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              cornerRadius={10}
              animationDuration={800}
            >
              {donutData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={ringColors[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
