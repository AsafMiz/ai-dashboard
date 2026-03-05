export interface Dashboard {
  key: string;
  title: string;
  subtitle: string | null;
  icon: string;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  user_id: string | null;
  dashboard_key: string | null;
  report_key: string | null;
  created_at: string;
  updated_at: string;
}

export type WidgetType = 'area' | 'bar' | 'candlestick' | 'table';

export interface Widget {
  id: string;
  report_id: string;
  type: WidgetType;
  title: string;
  order: number;
  config: Record<string, unknown>;
  created_at: string;
}

export interface MarketData {
  id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  created_at: string;
}
