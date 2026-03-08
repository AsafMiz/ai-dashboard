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

export type WidgetType = 'area' | 'bar' | 'candlestick' | 'table' | 'radar' | 'scorecard' | 'donut' | 'stacked-bar' | 'recommendations' | 'highlight' | 'feed';

export interface Widget {
  id: string;
  report_id: string;
  type: WidgetType | string;
  title: string;
  order: number;
  config: WidgetConfig;
  created_at: string;
}

export interface WidgetConfig {
  datasetKey?: string;
  color?: string;
  colors?: string[];
  xKey?: string;
  yKey?: string;
  yKeys?: string[];
  columns?: string[];
  columnLabels?: Record<string, string>;
  valueFormatter?: 'currency' | 'percent' | 'number' | 'compact';
  openKey?: string;
  highKey?: string;
  lowKey?: string;
  closeKey?: string;
  /* radar */
  labelKey?: string;
  valueKey?: string;
  maxValue?: number;
  /* scorecard */
  trendKey?: string;
  trendLabel?: string;
  subtitle?: string;
  /* donut */
  centerLabel?: string;
  totalLabel?: string;
  /* stacked-bar */
  labels?: Record<string, string>;
  /* recommendations */
  titleKey?: string;
  percentKey?: string;
  itemsKey?: string;
  iconKey?: string;
  /* highlight */
  nameKey?: string;
  imageKey?: string;
  /* feed */
  badgeKey?: string;
  authorKey?: string;
  excerptKey?: string;
  metricsKeys?: string[];
  [key: string]: unknown;
}

/* ── Generic data types ── */

export type DataRow = Record<string, unknown>;

export interface DatasetColumn {
  key: string;
  label?: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export interface Dataset {
  key: string;
  label: string | null;
  columns: DatasetColumn[];
  rows: DataRow[];
  dashboard_key: string | null;
  created_at: string;
}
