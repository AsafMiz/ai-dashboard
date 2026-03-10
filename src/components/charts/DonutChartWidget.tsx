'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DataRow, WidgetConfig } from '@/lib/types';

interface DonutChartWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function DonutChartWidget({ data, config }: DonutChartWidgetProps) {
  const valueKey = config.valueKey ?? config.yKey ?? Object.keys(data[0] ?? {})[1] ?? 'value';
  const labelKey = config.labelKey ?? config.xKey ?? Object.keys(data[0] ?? {})[0] ?? 'label';
  const defaultColors = ['#10b981', '#e5e7eb'];
  const colors = config.colors ?? defaultColors;
  const centerLabel = config.centerLabel as string | undefined;
  const totalLabel = config.totalLabel as string | undefined;

  const chartData = data.map((d) => ({
    name: String(d[labelKey] ?? ''),
    value: Number(d[valueKey] ?? 0),
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const primary = chartData[0]?.value ?? 0;
  const percent = total > 0 ? Math.round((primary / total) * 100) : 0;

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Text side (first in HTML = right in RTL) */}
      <div className="flex flex-col gap-1">
        {centerLabel && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {centerLabel}
          </span>
        )}
        <div className="flex items-baseline gap-0.5" dir="ltr">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {primary.toLocaleString()}
          </span>
          <span className="text-lg text-gray-400 dark:text-gray-500">
            /{total.toLocaleString()}
          </span>
        </div>
        {totalLabel && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {totalLabel}
          </span>
        )}
      </div>

      {/* Donut with percentage overlay (second in HTML = left in RTL) */}
      <div className="relative w-[100px] h-[100px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
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
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color: colors[0] }}>
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
