'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Widget, MarketData } from '@/lib/types';
import { AreaChartWidget } from './charts/AreaChartWidget';
import { BarChartWidget } from './charts/BarChartWidget';
import { CandlestickWidget } from './charts/CandlestickWidget';
import { DataTableWidget } from './charts/DataTableWidget';
import { Loader2 } from 'lucide-react';

interface WidgetRendererProps {
  widget: Widget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  const symbol = (widget.config.symbol as string) ?? 'AAPL';

  useEffect(() => {
    async function fetchData() {
      const { data: marketData, error } = await supabase
        .from('market_data')
        .select('*')
        .eq('symbol', symbol)
        .order('date', { ascending: true });

      if (!error && marketData) {
        setData(marketData as MarketData[]);
      }
      setLoading(false);
    }

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`market_data_${widget.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_data',
          filter: `symbol=eq.${symbol}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [symbol, widget.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        אין נתונים זמינים. לחץ על &quot;עדכן נתונים&quot; לטעינת נתוני דוגמה.
      </div>
    );
  }

  switch (widget.type) {
    case 'area':
      return <AreaChartWidget data={data} config={widget.config as { color?: string; dataKey?: string }} />;
    case 'bar':
      return <BarChartWidget data={data} config={widget.config as { color?: string; dataKey?: string }} />;
    case 'candlestick':
      return <CandlestickWidget data={data} />;
    case 'table':
      return <DataTableWidget data={data} config={widget.config as { columns?: string[] }} />;
    default:
      return <div className="text-gray-400 text-sm">סוג ווידג׳ט לא מוכר: {widget.type}</div>;
  }
}
