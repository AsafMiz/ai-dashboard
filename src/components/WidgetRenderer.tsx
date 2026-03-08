'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Widget, DataRow, WidgetConfig } from '@/lib/types';
import { AreaChartWidget } from './charts/AreaChartWidget';
import { BarChartWidget } from './charts/BarChartWidget';
import { CandlestickWidget } from './charts/CandlestickWidget';
import { DataTableWidget } from './charts/DataTableWidget';
import { RadarChartWidget } from './charts/RadarChartWidget';
import { ScorecardWidget } from './charts/ScorecardWidget';
import { DonutChartWidget } from './charts/DonutChartWidget';
import { StackedBarWidget } from './charts/StackedBarWidget';
import { RecommendationsWidget } from './charts/RecommendationsWidget';
import { HighlightWidget } from './charts/HighlightWidget';
import { FeedWidget } from './charts/FeedWidget';
import { TitleWidget } from './charts/TitleWidget';
import { Loader2 } from 'lucide-react';

interface WidgetRendererProps {
  widget: Widget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);

  const config = widget.config as WidgetConfig;
  const datasetKey = config.datasetKey ?? '';

  useEffect(() => {
    if (!datasetKey) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      const { data: dataset, error } = await supabase
        .from('datasets')
        .select('rows')
        .eq('key', datasetKey)
        .single();

      if (!error && dataset) {
        setData((dataset.rows as DataRow[]) ?? []);
      }
      setLoading(false);
    }

    fetchData();

    const channel = supabase
      .channel(`datasets_${widget.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'datasets',
          filter: `key=eq.${datasetKey}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [datasetKey, widget.id]);

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
        אין נתונים זמינים.
      </div>
    );
  }

  switch (widget.type) {
    case 'area':
      return <AreaChartWidget data={data} config={config} />;
    case 'bar':
      return <BarChartWidget data={data} config={config} />;
    case 'candlestick':
      return <CandlestickWidget data={data} config={config} />;
    case 'table':
      return <DataTableWidget data={data} config={config} />;
    case 'radar':
      return <RadarChartWidget data={data} config={config} />;
    case 'scorecard':
      return <ScorecardWidget data={data} config={config} />;
    case 'donut':
      return <DonutChartWidget data={data} config={config} />;
    case 'stacked-bar':
      return <StackedBarWidget data={data} config={config} />;
    case 'recommendations':
      return <RecommendationsWidget data={data} config={config} />;
    case 'highlight':
      return <HighlightWidget data={data} config={config} />;
    case 'feed':
      return <FeedWidget data={data} config={config} />;
    case 'title':
      return <TitleWidget data={data} config={config} />;
    default:
      return <div className="text-gray-400 text-sm">סוג ווידג׳ט לא מוכר: {widget.type}</div>;
  }
}
