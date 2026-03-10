'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { CandlestickData, Time } from 'lightweight-charts';
import { DataRow, WidgetConfig } from '@/lib/types';
import { useTheme } from 'next-themes';

interface CandlestickWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

export function CandlestickWidget({ data, config }: CandlestickWidgetProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const timeKey = config.xKey ?? 'date';
  const openKey = config.openKey ?? 'open';
  const highKey = config.highKey ?? 'high';
  const lowKey = config.lowKey ?? 'low';
  const closeKey = config.closeKey ?? 'close';

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const isDark = theme === 'dark';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#9ca3af' : '#6b7280',
        fontFamily: 'inherit',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
        horzLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      rightPriceScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
      timeScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
        timeVisible: false,
      },
      crosshair: {
        vertLine: { color: isDark ? '#4b5563' : '#d1d5db' },
        horzLine: { color: isDark ? '#4b5563' : '#d1d5db' },
      },
    });

    const upColor = config.color ?? '#10b981';
    const downColor = '#ef4444';

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor,
      downColor,
      borderDownColor: downColor,
      borderUpColor: upColor,
      wickDownColor: downColor,
      wickUpColor: upColor,
    });

    const candleData: CandlestickData<Time>[] = data.map((d) => ({
      time: String(d[timeKey]) as Time,
      open: Number(d[openKey]),
      high: Number(d[highKey]),
      low: Number(d[lowKey]),
      close: Number(d[closeKey]),
    }));

    candlestickSeries.setData(candleData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, theme, timeKey, openKey, highKey, lowKey, closeKey]);

  return <div ref={chartContainerRef} className="w-full" />;
}
