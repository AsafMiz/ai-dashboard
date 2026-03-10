'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DataRow, WidgetConfig } from '@/lib/types';

interface BarChartWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

function formatValue(value: number, formatter?: string): string {
  if (formatter === 'currency') return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (formatter === 'percent') return `${value.toFixed(1)}%`;
  if (formatter === 'compact') return formatCompact(value);
  return value.toLocaleString();
}

export function BarChartWidget({ data, config }: BarChartWidgetProps) {
  const color = config.color ?? '#10b981';
  const xKey = config.xKey ?? Object.keys(data[0] ?? {})[0] ?? 'label';
  const yKey = config.yKey ?? Object.keys(data[0] ?? {})[1] ?? 'value';
  const useCompact = config.valueFormatter === 'compact';

  const chartData = data.map((d) => ({
    label: String(d[xKey] ?? ''),
    value: Number(d[yKey] ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={useCompact ? formatCompact : undefined}
          orientation="left"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: 'none',
            borderRadius: '8px',
            color: '#f9fafb',
            fontSize: 12,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [formatValue(Number(value), config.valueFormatter), yKey]}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
