'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { DataRow, WidgetConfig } from '@/lib/types';

interface RadarChartWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function RadarChartWidget({ data, config }: RadarChartWidgetProps) {
  const color = config.color ?? '#10b981';
  const labelKey = config.labelKey ?? config.xKey ?? Object.keys(data[0] ?? {})[0] ?? 'label';
  const valueKey = config.valueKey ?? config.yKey ?? Object.keys(data[0] ?? {})[1] ?? 'value';
  const maxValue = (config.maxValue as number) ?? 100;

  const chartData = data.map((d) => ({
    label: String(d[labelKey] ?? ''),
    value: Number(d[valueKey] ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          className="dark:[&_text]:fill-gray-400"
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxValue]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickCount={5}
        />
        <Radar
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
