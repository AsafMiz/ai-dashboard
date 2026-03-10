'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
        />
        <Legend
          formatter={(value: string) => labels[value] ?? value}
          wrapperStyle={{ fontSize: 12 }}
        />
        {yKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="stack"
            fill={colors[index % colors.length]}
            name={key}
            radius={index === yKeys.length - 1 ? [4, 4, 0, 0] : undefined}
            animationDuration={800}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
