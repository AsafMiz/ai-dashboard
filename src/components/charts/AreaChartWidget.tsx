'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MarketData } from '@/lib/types';

interface AreaChartWidgetProps {
  data: MarketData[];
  config: {
    color?: string;
    dataKey?: string;
  };
}

export function AreaChartWidget({ data, config }: AreaChartWidgetProps) {
  const color = config.color ?? '#2563eb';
  const dataKey = (config.dataKey ?? 'close') as keyof MarketData;

  const chartData = data.map((d) => ({
    date: d.date,
    value: Number(d[dataKey]),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
          domain={['dataMin - 2', 'dataMax + 2']}
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
          formatter={(value: any) => [`₪${Number(value).toFixed(2)}`, 'מחיר']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
