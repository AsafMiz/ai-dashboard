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
import { MarketData } from '@/lib/types';

interface BarChartWidgetProps {
  data: MarketData[];
  config: {
    color?: string;
    dataKey?: string;
  };
}

function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

export function BarChartWidget({ data, config }: BarChartWidgetProps) {
  const color = config.color ?? '#10b981';
  const dataKey = (config.dataKey ?? 'volume') as keyof MarketData;

  const chartData = data.map((d) => ({
    date: d.date,
    value: Number(d[dataKey]),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatVolume}
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
          labelFormatter={(label) => `תאריך: ${label}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [formatVolume(Number(value)), 'נפח']}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
