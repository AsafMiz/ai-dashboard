'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DataRow, WidgetConfig } from '@/lib/types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RadarChartWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

/* Custom angle-axis tick: dimension name + score value */
function CustomAngleTick({
  payload,
  x,
  y,
  cx,
  cy,
  color,
  chartData,
}: {
  payload: { value: string };
  x: number;
  y: number;
  cx: number;
  cy: number;
  color: string;
  chartData: { label: string; value: number }[];
}) {
  const item = chartData.find((d) => d.label === payload.value);
  const score = item?.value ?? 0;

  // push label slightly outward from center
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const push = 14;
  const nx = x + (dx / dist) * push;
  const ny = y + (dy / dist) * push;

  return (
    <g>
      <text
        x={nx}
        y={ny - 6}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        className="fill-gray-600 dark:fill-gray-400"
      >
        {payload.value}
      </text>
      <text
        x={nx}
        y={ny + 10}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill={color}
      >
        {score}
      </text>
    </g>
  );
}

/* Custom tooltip */
function CustomTooltip({
  active,
  payload,
  maxValue,
  color,
}: {
  active?: boolean;
  payload?: { payload: { label: string; value: number } }[];
  maxValue: number;
  color: string;
}) {
  if (!active || !payload?.[0]) return null;
  const { label, value } = payload[0].payload;
  const pct = Math.round((value / maxValue) * 100);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-lg text-right">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">{label}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold" style={{ color }}>{value}</span>
        <span className="text-gray-400">/ {maxValue}</span>
        <span className="text-gray-500 dark:text-gray-400">({pct}%)</span>
      </div>
    </div>
  );
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

  // Summary stats
  const values = chartData.map((d) => d.value);
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const highest = chartData.reduce((a, b) => (b.value > a.value ? b : a), chartData[0]);
  const lowest = chartData.reduce((a, b) => (b.value < a.value ? b : a), chartData[0]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" className="dark:stroke-gray-800" />
          <PolarAngleAxis
            dataKey="label"
            tick={(props: Record<string, unknown>) => (
              <CustomAngleTick
                {...(props as { payload: { value: string }; x: number; y: number; cx: number; cy: number })}
                color={color}
                chartData={chartData}
              />
            )}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, maxValue]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={800}
            dot={{
              r: 4,
              fill: color,
              stroke: '#fff',
              strokeWidth: 2,
              className: 'dark:stroke-gray-950',
            }}
          />
          <Tooltip
            content={({ active, payload }) => (
              <CustomTooltip active={active} payload={payload as { payload: { label: string; value: number } }[]} maxValue={maxValue} color={color} />
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      {chartData.length > 0 && (
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">ממוצע</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {avg}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {highest?.label}
            </span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400">
              {highest?.value}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {lowest?.label}
            </span>
            <span className="text-xs font-bold text-red-500 dark:text-red-400">
              {lowest?.value}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
