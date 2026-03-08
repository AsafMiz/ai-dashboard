'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2, Copy, Check, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { CandlestickWidget } from '@/components/charts/CandlestickWidget';
import { DataTableWidget } from '@/components/charts/DataTableWidget';
import { MarketData } from '@/lib/types';
import Link from 'next/link';

/* ───── sample data for widget previews ───── */
const sampleData: MarketData[] = [
  { id: '1', symbol: 'AAPL', date: '2024-01-02', open: 185.50, high: 188.44, low: 183.89, close: 187.68, volume: 58414460, created_at: '' },
  { id: '2', symbol: 'AAPL', date: '2024-01-03', open: 187.68, high: 189.25, low: 185.83, close: 186.12, volume: 49802750, created_at: '' },
  { id: '3', symbol: 'AAPL', date: '2024-01-04', open: 186.12, high: 187.05, low: 183.42, close: 184.25, volume: 43820600, created_at: '' },
  { id: '4', symbol: 'AAPL', date: '2024-01-05', open: 184.25, high: 186.40, low: 183.16, close: 185.56, volume: 47471800, created_at: '' },
  { id: '5', symbol: 'AAPL', date: '2024-01-08', open: 185.56, high: 188.88, low: 185.04, close: 188.63, volume: 52348900, created_at: '' },
  { id: '6', symbol: 'AAPL', date: '2024-01-09', open: 188.63, high: 190.95, low: 187.44, close: 190.54, volume: 46230100, created_at: '' },
  { id: '7', symbol: 'AAPL', date: '2024-01-10', open: 190.54, high: 191.91, low: 188.82, close: 189.72, volume: 40730500, created_at: '' },
  { id: '8', symbol: 'AAPL', date: '2024-01-11', open: 189.72, high: 192.38, low: 189.42, close: 191.56, volume: 53652700, created_at: '' },
  { id: '9', symbol: 'AAPL', date: '2024-01-12', open: 191.56, high: 193.45, low: 190.67, close: 192.88, volume: 48320400, created_at: '' },
  { id: '10', symbol: 'AAPL', date: '2024-01-16', open: 192.88, high: 194.76, low: 191.55, close: 193.89, volume: 55168300, created_at: '' },
];

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseExample {
  status: number;
  label: string;
  body: string;
}

interface Endpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  params: Param[];
  responses: ResponseExample[];
  exampleBody: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/create-dashboard',
    summary: 'Create or recreate a dashboard',
    description:
      'Deletes any existing dashboard with the same key (including its reports and widgets), optionally seeds market data, and creates a new dashboard entry.',
    params: [
      { name: 'key', type: 'string', required: true, description: 'Unique dashboard identifier' },
      { name: 'title', type: 'string', required: true, description: 'Display name' },
      { name: 'subtitle', type: 'string', required: false, description: 'Optional subtitle' },
      { name: 'icon', type: 'string', required: false, description: 'Lucide icon name (defaults to LayoutDashboard)' },
      {
        name: 'market_data',
        type: 'array',
        required: false,
        description: 'OHLCV records to upsert. Each object: { symbol, date, open, high, low, close, volume }',
      },
    ],
    responses: [
      { status: 200, label: 'Success', body: '{\n  "message": "Dashboard created successfully",\n  "key": "example"\n}' },
      { status: 400, label: 'Validation Error', body: '{\n  "error": "Missing required field: key (string)"\n}' },
      { status: 500, label: 'Server Error', body: '{\n  "error": "error message"\n}' },
    ],
    exampleBody: JSON.stringify(
      {
        key: 'my-dashboard',
        title: 'My Dashboard',
        subtitle: 'A test dashboard',
        icon: 'TrendingUp',
        market_data: [
          { symbol: 'AAPL', date: '2024-01-02', open: 185.5, high: 188.44, low: 183.89, close: 187.68, volume: 58414460 },
        ],
      },
      null,
      2
    ),
  },
  {
    method: 'POST',
    path: '/api/create-report',
    summary: 'Create a report with widgets',
    description:
      'Creates a report under an existing dashboard. If a report with the same (dashboard_key, report_key) already exists, it and its widgets are deleted first.',
    params: [
      { name: 'dashboard_key', type: 'string', required: true, description: 'Parent dashboard key' },
      { name: 'report_key', type: 'string', required: true, description: 'Unique within the dashboard' },
      { name: 'title', type: 'string', required: true, description: 'Report display name' },
      { name: 'description', type: 'string', required: false, description: 'Optional description' },
      { name: 'type', type: 'string', required: false, description: 'Display label badge (e.g. סקירה, ניתוח)' },
      {
        name: 'widgets',
        type: 'array',
        required: false,
        description: 'Widget definitions. Each: { type, title, order, config }. Types: area, bar, candlestick, table',
      },
    ],
    responses: [
      {
        status: 200,
        label: 'Success',
        body: '{\n  "message": "Report created successfully",\n  "dashboard_key": "my-dashboard",\n  "report_key": "overview"\n}',
      },
      { status: 400, label: 'Validation Error', body: '{\n  "error": "Missing required field: dashboard_key (string)"\n}' },
      { status: 500, label: 'Server Error', body: '{\n  "error": "error message"\n}' },
    ],
    exampleBody: JSON.stringify(
      {
        dashboard_key: 'my-dashboard',
        report_key: 'overview',
        title: 'Market Overview',
        description: 'Price trends and volume',
        type: 'סקירה',
        widgets: [
          { type: 'area', title: 'Price - AAPL', order: 0, config: { symbol: 'AAPL', color: '#2563eb', dataKey: 'close' } },
          { type: 'bar', title: 'Volume - AAPL', order: 1, config: { symbol: 'AAPL', color: '#10b981', dataKey: 'volume' } },
        ],
      },
      null,
      2
    ),
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide ${colors[method] ?? 'bg-gray-100 text-gray-700'}`}>
      {method}
    </span>
  );
}

function StatusBadge({ status }: { status: number }) {
  const color =
    status < 300
      ? 'text-green-600 dark:text-green-400'
      : status < 500
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';
  return <span className={`font-mono text-xs font-bold ${color}`}>{status}</span>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
    </button>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(endpoint.exampleBody);
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTry() {
    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    try {
      const res = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      setResponseStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseStatus(0);
      setResponse(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
      >
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-semibold text-gray-900 dark:text-white flex-1 text-left" dir="ltr">
          {endpoint.path}
        </code>
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{endpoint.summary}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4 sm:p-5 space-y-5">
          <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.description}</p>

          {/* Parameters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="ltr">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-1.5 px-2 text-gray-500 dark:text-gray-400 font-medium text-xs">Name</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 dark:text-gray-400 font-medium text-xs">Type</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 dark:text-gray-400 font-medium text-xs">Required</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 dark:text-gray-400 font-medium text-xs">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.params.map((p) => (
                    <tr key={p.name} className="border-b border-gray-100 dark:border-gray-800/50">
                      <td className="py-1.5 px-2 font-mono text-xs text-gray-900 dark:text-white">{p.name}</td>
                      <td className="py-1.5 px-2 text-xs text-blue-600 dark:text-blue-400">{p.type}</td>
                      <td className="py-1.5 px-2">
                        {p.required ? (
                          <span className="text-xs text-red-500 font-medium">required</span>
                        ) : (
                          <span className="text-xs text-gray-400">optional</span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-xs text-gray-600 dark:text-gray-400">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Responses</h4>
            <div className="space-y-2">
              {endpoint.responses.map((r) => (
                <div key={r.status} className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-100 dark:border-gray-800/50">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
                  </div>
                  <pre className="p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto" dir="ltr">
                    {r.body}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Try it */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Try it</h4>
              <CopyButton text={body} />
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={Math.min(body.split('\n').length + 1, 20)}
              className="w-full font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
              spellCheck={false}
            />
            <button
              onClick={handleTry}
              disabled={loading}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Request</span>
            </button>

            {response !== null && (
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Response</span>
                  {responseStatus !== null && <StatusBadge status={responseStatus} />}
                  <div className="flex-1" />
                  <CopyButton text={response} />
                </div>
                <pre className="p-3 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 overflow-x-auto" dir="ltr">
                  {response}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WidgetPreview({
  type,
  description,
  config,
  chart,
}: {
  type: string;
  description: string;
  config: Record<string, unknown>;
  chart: React.ReactNode;
}) {
  const [showConfig, setShowConfig] = useState(false);

  const widgetJson = JSON.stringify({ type, title: `Example ${type} widget`, order: 0, config }, null, 2);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* header */}
      <div className="px-4 sm:px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
        <code className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
          {type}
        </code>
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{description}</span>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium shrink-0"
        >
          {showConfig ? 'Hide config' : 'Show config'}
        </button>
      </div>

      {/* live chart */}
      <div className="bg-white dark:bg-gray-950 p-3 sm:p-4">
        {chart}
      </div>

      {/* config json */}
      {showConfig && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800/50">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Widget definition (JSON)</span>
            <CopyButton text={widgetJson} />
          </div>
          <pre className="p-4 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto" dir="ltr">
            {widgetJson}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors">
            COMMUNi Dashboard
          </Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">API Docs</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1" dir="ltr">
            API Reference
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            COMMUNi Dashboard REST API — create dashboards and reports programmatically.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600" dir="ltr">
            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Base URL</span>
            <code className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' ? window.location.origin : ''}</code>
          </div>
        </div>

        <div className="space-y-3">
          {endpoints.map((ep) => (
            <EndpointCard key={ep.path} endpoint={ep} />
          ))}
        </div>

        {/* ── Widget Gallery ── */}
        <div className="mt-10 mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1" dir="ltr">
            Widget Gallery
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Live previews of each widget type with example configuration and data format.
          </p>
        </div>

        <div className="space-y-6">
          <WidgetPreview
            type="area"
            description="Smooth area chart — ideal for price trends over time."
            config={{ symbol: 'AAPL', color: '#2563eb', dataKey: 'close' }}
            chart={<AreaChartWidget data={sampleData} config={{ color: '#2563eb', dataKey: 'close' }} />}
          />
          <WidgetPreview
            type="bar"
            description="Vertical bar chart — commonly used for trading volume."
            config={{ symbol: 'AAPL', color: '#10b981', dataKey: 'volume' }}
            chart={<BarChartWidget data={sampleData} config={{ color: '#10b981', dataKey: 'volume' }} />}
          />
          <WidgetPreview
            type="candlestick"
            description="OHLC candlestick chart powered by TradingView's lightweight-charts."
            config={{ symbol: 'AAPL' }}
            chart={<CandlestickWidget data={sampleData} />}
          />
          <WidgetPreview
            type="table"
            description="Scrollable data table with Hebrew column headers and formatted values."
            config={{ symbol: 'AAPL', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] }}
            chart={<DataTableWidget data={sampleData} config={{ columns: ['date', 'open', 'high', 'low', 'close', 'volume'] }} />}
          />
        </div>

        {/* ── Sample Dataset ── */}
        <div className="mt-10 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white" dir="ltr">Sample market_data record</h3>
            <CopyButton text={JSON.stringify(sampleData[0], null, 2)} />
          </div>
          <pre className="p-4 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 overflow-x-auto" dir="ltr">
{JSON.stringify(
  { symbol: 'AAPL', date: '2024-01-02', open: 185.50, high: 188.44, low: 183.89, close: 187.68, volume: 58414460 },
  null,
  2
)}
          </pre>
          <div className="px-4 sm:px-5 py-2.5 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800/50">
            <p className="text-[11px] text-gray-500 dark:text-gray-400" dir="ltr">
              <strong>Fields:</strong> symbol (string) · date (YYYY-MM-DD) · open / high / low / close (number) · volume (integer)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
