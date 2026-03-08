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
    <div className="flex items-center justify-center h-[300px] gap-6">
      {/* Text side */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-4xl font-bold" style={{ color: colors[0] }}>
          {percent}%
        </span>
        {centerLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {centerLabel}
          </span>
        )}
        {totalLabel && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {primary} מתוך {total} {totalLabel}
          </span>
        )}
      </div>

      {/* Donut */}
      <div className="w-[160px] h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="95%"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
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
      </div>
    </div>
  );
}
