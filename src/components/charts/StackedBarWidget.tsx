'use client';

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DataRow, WidgetConfig } from '@/lib/types';

interface StackedBarWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function StackedBarWidget({ data, config }: StackedBarWidgetProps) {
  const xKey = config.xKey ?? Object.keys(data[0] ?? {})[0] ?? 'label';
  const yKeys = config.yKeys ?? Object.keys(data[0] ?? {}).filter((k) => k !== xKey);
  const defaultColors = ['#10b981', '#d1d5db', '#2563eb', '#f59e0b', '#e11d48'];
  const colors = config.colors ?? defaultColors;
  const labels = (config.labels as Record<string, string>) ?? {};

  const chartData = data.map((d) => {
    const row: Record<string, unknown> = { label: String(d[xKey] ?? '') };
    yKeys.forEach((k) => {
      row[k] = Number(d[k] ?? 0);
    });
    return row;
  });

  return (
    <div>
      {/* Custom legend — top-right with colored dots */}
      <div className="flex justify-start gap-4 mb-2">
        {yKeys.map((key, index) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {labels[key] ?? key}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={0}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: 12,
            }}
          />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              name={labels[key] ?? key}
              radius={[10, 10, 0, 0]}
              animationDuration={800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
