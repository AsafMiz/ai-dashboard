'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2, Copy, Check, BookOpen, Terminal } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { CandlestickWidget } from '@/components/charts/CandlestickWidget';
import { DataTableWidget } from '@/components/charts/DataTableWidget';
import { RadarChartWidget } from '@/components/charts/RadarChartWidget';
import { ScorecardWidget } from '@/components/charts/ScorecardWidget';
import { DonutChartWidget } from '@/components/charts/DonutChartWidget';
import { StackedBarWidget } from '@/components/charts/StackedBarWidget';
import { RecommendationsWidget } from '@/components/charts/RecommendationsWidget';
import { HighlightWidget } from '@/components/charts/HighlightWidget';
import { FeedWidget } from '@/components/charts/FeedWidget';
import { TitleWidget } from '@/components/charts/TitleWidget';
import { DataRow } from '@/lib/types';
import Link from 'next/link';

/* ───── sample data for widget previews ───── */
const salesData: DataRow[] = [
  { month: 'Jan', revenue: 145000, orders: 320 },
  { month: 'Feb', revenue: 152000, orders: 385 },
  { month: 'Mar', revenue: 168000, orders: 410 },
  { month: 'Apr', revenue: 155000, orders: 372 },
  { month: 'May', revenue: 178000, orders: 445 },
  { month: 'Jun', revenue: 192000, orders: 480 },
  { month: 'Jul', revenue: 185000, orders: 462 },
  { month: 'Aug', revenue: 198000, orders: 495 },
  { month: 'Sep', revenue: 210000, orders: 528 },
  { month: 'Oct', revenue: 225000, orders: 560 },
];

const ohlcData: DataRow[] = [
  { date: '2024-01-02', open: 185.50, high: 188.44, low: 183.89, close: 187.68 },
  { date: '2024-01-03', open: 187.68, high: 189.25, low: 185.83, close: 186.12 },
  { date: '2024-01-04', open: 186.12, high: 187.05, low: 183.42, close: 184.25 },
  { date: '2024-01-05', open: 184.25, high: 186.40, low: 183.16, close: 185.56 },
  { date: '2024-01-08', open: 185.56, high: 188.88, low: 185.04, close: 188.63 },
  { date: '2024-01-09', open: 188.63, high: 190.95, low: 187.44, close: 190.54 },
  { date: '2024-01-10', open: 190.54, high: 191.91, low: 188.82, close: 189.72 },
  { date: '2024-01-11', open: 189.72, high: 192.38, low: 189.42, close: 191.56 },
  { date: '2024-01-12', open: 191.56, high: 193.45, low: 190.67, close: 192.88 },
  { date: '2024-01-16', open: 192.88, high: 194.76, low: 191.55, close: 193.89 },
];

const radarData: DataRow[] = [
  { dimension: 'צפיפות', score: 72 },
  { dimension: 'פיזור', score: 45 },
  { dimension: 'עקביות', score: 68 },
  { dimension: 'אירועים אישיים', score: 55 },
  { dimension: 'מעורבות', score: 80 },
];

const scorecardData: DataRow[] = [{ score: 76, trend: 4.2 }];

const donutData: DataRow[] = [
  { label: 'פעילים', value: 328 },
  { label: 'לא פעילים', value: 72 },
];

const stackedBarData: DataRow[] = [
  { month: "ינו׳", givers: 85, receivers: 120 },
  { month: "פבר׳", givers: 95, receivers: 130 },
  { month: 'מרץ', givers: 110, receivers: 140 },
  { month: "אפר׳", givers: 125, receivers: 150 },
];

const recommendationsData: DataRow[] = [
  { title: 'פיזור', percent: 38, icon: 'Shuffle', items: ['טיפול בפער ההוקרה במחלקות הנדסה ותפעול', 'הטמעת תוכנית הוקרה בין-מחלקתית לאיזון הפיזור', 'קביעת מינימום 3 הוקרות למנהל בשבוע בכל הצוותים'] },
  { title: 'אירועים אישיים', percent: 45, icon: 'Calendar', items: ['אוטומציה של התראות ימי הולדת ויום שנה לעבודה למנהלים', 'הכנסת תגמולי אבני דרך מותאמים אישית ב-1, 3, 5 ו-10 שנים', 'יצירת לוח שיתוף הישגים אישיים (opt-in)'] },
];

const highlightData: DataRow[] = [
  { name: 'שואב אבק רובוטי', percent: 42, trend: 8 },
  { name: 'אוזניות אלחוטיות', percent: 28 },
  { name: 'כרטיס מתנה', percent: 18 },
  { name: 'שובר בילוי', percent: 12 },
];

const titleData: DataRow[] = [
  { title: 'דשבורד לכידות ניהולית', subtitle: 'דוח לכידות תקופתי', dateRange: 'ינואר 2026 – מרץ 2026', badge: 'TOP 25% בארגון', logoUrl: '/communi-logo.webp' },
];

const feedData: DataRow[] = [
  { title: 'סיכום גיבוש רבעוני Q4', badge: 'אירוע', author: 'שרה מ.', excerpt: 'השתתפות מרשימה של 94% מכלל המחלקות ברבעון האחרון...', comments: 23, likes: 89, views: 342 },
  { title: 'מסגרת הוקרה חדשה', badge: 'הכרה', author: 'יעקב כ.', excerpt: 'מציגים את מערכת ההוקרה העמיתית המעודכנת שנועדה להגביר נראות...', comments: 18, likes: 64, views: 278 },
  { title: 'יוזמה בין-מחלקתית', badge: 'דוח', author: 'מריה ל.', excerpt: 'תוצאות תוכנית הפיילוט מראות עלייה של 35% בשיתוף הפעולה...', comments: 14, likes: 52, views: 215 },
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
    path: '/api/dashboards',
    summary: 'Create a dashboard',
    description:
      'Creates a new dashboard with metadata only. Returns 409 if a dashboard with the same key already exists.',
    params: [
      { name: 'key', type: 'string', required: true, description: 'Unique dashboard identifier' },
      { name: 'title', type: 'string', required: true, description: 'Display name' },
      { name: 'subtitle', type: 'string', required: false, description: 'Optional subtitle' },
      { name: 'icon', type: 'string', required: false, description: 'Lucide icon name (defaults to LayoutDashboard)' },
      { name: 'logo_url', type: 'string', required: false, description: 'Logo image URL (falls back to COMMUNi logo if missing or broken)' },
    ],
    responses: [
      { status: 201, label: 'Created', body: '{\n  "message": "Dashboard created successfully",\n  "key": "my-dashboard",\n  "url": "/dashboard/my-dashboard"\n}' },
      { status: 400, label: 'Validation Error', body: '{\n  "error": "Missing required field: key (string)"\n}' },
      { status: 409, label: 'Conflict', body: '{\n  "error": "Dashboard with key \'my-dashboard\' already exists"\n}' },
      { status: 500, label: 'Server Error', body: '{\n  "error": "error message"\n}' },
    ],
    exampleBody: JSON.stringify(
      {
        key: 'my-dashboard',
        title: 'My Dashboard',
        subtitle: 'A test dashboard',
        icon: 'BarChart3',
        logo_url: 'https://example.com/logo.png',
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/dashboards/{key}',
    summary: 'Get dashboard metadata + reports',
    description:
      'Returns dashboard metadata and a list of reports with their URLs. Replace {key} with the dashboard key.',
    params: [
      { name: 'key', type: 'string (path)', required: true, description: 'Dashboard key (URL path parameter)' },
    ],
    responses: [
      { status: 200, label: 'Success', body: '{\n  "dashboard": { "key": "example", "title": "..." },\n  "reports": [\n    {\n      "report_key": "sales-overview",\n      "title": "Sales Overview",\n      "url": "/dashboard/example/sales-overview"\n    }\n  ]\n}' },
      { status: 404, label: 'Not Found', body: '{\n  "error": "Dashboard \'my-dashboard\' not found"\n}' },
    ],
    exampleBody: '',
  },
  {
    method: 'DELETE',
    path: '/api/dashboards/{key}',
    summary: 'Delete dashboard (cascades)',
    description:
      'Deletes a dashboard and all its reports, widgets, and datasets (via FK cascade). Replace {key} with the dashboard key.',
    params: [
      { name: 'key', type: 'string (path)', required: true, description: 'Dashboard key (URL path parameter)' },
    ],
    responses: [
      { status: 200, label: 'Success', body: '{\n  "message": "Dashboard \'example\' deleted successfully",\n  "key": "example"\n}' },
      { status: 404, label: 'Not Found', body: '{\n  "error": "Dashboard \'example\' not found"\n}' },
    ],
    exampleBody: '',
  },
  {
    method: 'POST',
    path: '/api/reports',
    summary: 'Create a report with inline data',
    description:
      'Creates a report with widgets and inline data. Each widget contains its own data array. The API auto-generates datasets and assigns order by array position. Returns 404 if dashboard doesn\'t exist, 409 if report already exists.',
    params: [
      { name: 'dashboard_key', type: 'string', required: true, description: 'Parent dashboard key (must exist)' },
      { name: 'report_key', type: 'string', required: true, description: 'Unique within the dashboard' },
      { name: 'title', type: 'string', required: true, description: 'Report display name' },
      { name: 'description', type: 'string', required: false, description: 'Optional description' },
      { name: 'type', type: 'string', required: false, description: 'Display label badge (e.g. סקירה, ניתוח)' },
      { name: 'logo_url', type: 'string', required: false, description: 'Logo image URL (falls back to COMMUNi logo if missing or broken)' },
      {
        name: 'widgets',
        type: 'array',
        required: true,
        description: 'Widget definitions. Each: { type, title, config, data }. Order is determined by array position. Types: area, bar, candlestick, table, radar, scorecard, donut, stacked-bar, recommendations, highlight, feed, title',
      },
    ],
    responses: [
      {
        status: 201,
        label: 'Created',
        body: '{\n  "message": "Report created successfully",\n  "dashboard_key": "my-dashboard",\n  "report_key": "overview",\n  "url": "/dashboard/my-dashboard/overview"\n}',
      },
      { status: 400, label: 'Validation Error', body: '{\n  "error": "Missing required field: dashboard_key (string)"\n}' },
      { status: 404, label: 'Dashboard Not Found', body: '{\n  "error": "Dashboard \'my-dashboard\' not found"\n}' },
      { status: 409, label: 'Conflict', body: '{\n  "error": "Report \'overview\' already exists in dashboard \'my-dashboard\'"\n}' },
      { status: 500, label: 'Server Error', body: '{\n  "error": "error message"\n}' },
    ],
    exampleBody: JSON.stringify(
      {
        dashboard_key: 'my-dashboard',
        report_key: 'overview',
        title: 'Sales Overview',
        description: 'Monthly revenue and order trends',
        type: 'סקירה',
        logo_url: 'https://example.com/logo.png',
        widgets: [
          { type: 'area', title: 'Revenue Trend', config: { xKey: 'month', yKey: 'revenue', color: '#2563eb', valueFormatter: 'compact' }, data: [{ month: 'Jan', revenue: 145000 }, { month: 'Feb', revenue: 152000 }] },
          { type: 'bar', title: 'Orders per Month', config: { xKey: 'month', yKey: 'orders', color: '#10b981' }, data: [{ month: 'Jan', orders: 320 }, { month: 'Feb', orders: 385 }] },
        ],
      },
      null,
      2
    ),
  },
  {
    method: 'DELETE',
    path: '/api/reports/{dashboardKey}/{reportKey}',
    summary: 'Delete a report',
    description:
      'Deletes a report, its widgets, and associated datasets. Replace {dashboardKey} and {reportKey} with actual values.',
    params: [
      { name: 'dashboardKey', type: 'string (path)', required: true, description: 'Dashboard key (URL path parameter)' },
      { name: 'reportKey', type: 'string (path)', required: true, description: 'Report key (URL path parameter)' },
    ],
    responses: [
      { status: 200, label: 'Success', body: '{\n  "message": "Report \'overview\' deleted successfully",\n  "dashboard_key": "my-dashboard",\n  "report_key": "overview"\n}' },
      { status: 404, label: 'Not Found', body: '{\n  "error": "Report \'overview\' not found in dashboard \'my-dashboard\'"\n}' },
    ],
    exampleBody: '',
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

  const [curlCopied, setCurlCopied] = useState(false);
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PUT';

  function generateCurl() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = `${origin}${endpoint.path}`;
    if (hasBody) {
      return `curl -X ${endpoint.method} ${url} \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
    }
    if (endpoint.method === 'GET') {
      return `curl ${url}`;
    }
    return `curl -X ${endpoint.method} ${url}`;
  }

  function handleCopyCurl() {
    navigator.clipboard.writeText(generateCurl());
    setCurlCopied(true);
    setTimeout(() => setCurlCopied(false), 1500);
  }

  async function handleTry() {
    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    try {
      const fetchOptions: RequestInit = { method: endpoint.method };
      if (hasBody) {
        fetchOptions.headers = { 'Content-Type': 'application/json' };
        fetchOptions.body = body;
      }
      const res = await fetch(endpoint.path, fetchOptions);
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
              {hasBody && <CopyButton text={body} />}
            </div>
            {hasBody ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={Math.min(body.split('\n').length + 1, 20)}
                className="w-full font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
                spellCheck={false}
              />
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1" dir="ltr">
                Replace path parameters with actual values (e.g. <code className="text-blue-600 dark:text-blue-400">/api/dashboards/example</code>).
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleTry}
                disabled={loading || (!hasBody && endpoint.path.includes('{'))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Request</span>
              </button>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium transition-colors"
              >
                {curlCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Terminal className="w-3.5 h-3.5" />}
                <span>{curlCopied ? 'Copied!' : 'Copy cURL'}</span>
              </button>
            </div>

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

  const widgetJson = JSON.stringify({ type, title: `Example ${type} widget`, config, data: '[ ... ]' }, null, 2);

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
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/communi-logo.webp" alt="COMMUNi" className="w-6 h-6 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
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
            COMMUNi Dashboard REST API — create, read, and delete dashboards and reports programmatically.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600" dir="ltr">
            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Base URL</span>
            <code className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' ? window.location.origin : ''}</code>
          </div>
        </div>

        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <EndpointCard key={`${ep.method}-${ep.path}-${i}`} endpoint={ep} />
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
            description="Smooth area chart — ideal for trends over time."
            config={{ xKey: 'month', yKey: 'revenue', color: '#2563eb', valueFormatter: 'compact' }}
            chart={<AreaChartWidget data={salesData} config={{ xKey: 'month', yKey: 'revenue', color: '#2563eb', valueFormatter: 'compact' }} />}
          />
          <WidgetPreview
            type="bar"
            description="Vertical bar chart — commonly used for comparisons and counts."
            config={{ xKey: 'month', yKey: 'orders', color: '#10b981' }}
            chart={<BarChartWidget data={salesData} config={{ xKey: 'month', yKey: 'orders', color: '#10b981' }} />}
          />
          <WidgetPreview
            type="candlestick"
            description="OHLC candlestick chart — for data with open, high, low, close values."
            config={{ xKey: 'date', openKey: 'open', highKey: 'high', lowKey: 'low', closeKey: 'close' }}
            chart={<CandlestickWidget data={ohlcData} config={{ xKey: 'date', openKey: 'open', highKey: 'high', lowKey: 'low', closeKey: 'close' }} />}
          />
          <WidgetPreview
            type="table"
            description="Scrollable data table with configurable columns and labels."
            config={{ columns: ['month', 'revenue', 'orders'], columnLabels: { month: 'Month', revenue: 'Revenue', orders: 'Orders' } }}
            chart={<DataTableWidget data={salesData} config={{ columns: ['month', 'revenue', 'orders'], columnLabels: { month: 'Month', revenue: 'Revenue ($)', orders: 'Orders' } }} />}
          />
          <WidgetPreview
            type="radar"
            description="Spider/radar chart — ideal for multi-dimensional comparisons."
            config={{ labelKey: 'dimension', valueKey: 'score', color: '#10b981', maxValue: 100 }}
            chart={<RadarChartWidget data={radarData} config={{ labelKey: 'dimension', valueKey: 'score', color: '#10b981', maxValue: 100 }} />}
          />
          <WidgetPreview
            type="scorecard"
            description="KPI big number with optional trend indicator."
            config={{ valueKey: 'score', maxValue: 100, trendKey: 'trend', trendLabel: 'מהרבעון הקודם', subtitle: 'מדד לכידות כללי', color: '#10b981' }}
            chart={<ScorecardWidget data={scorecardData} config={{ valueKey: 'score', maxValue: 100, trendKey: 'trend', trendLabel: 'מהרבעון הקודם', subtitle: 'מדד לכידות כללי', color: '#10b981' }} />}
          />
          <WidgetPreview
            type="donut"
            description="Donut/ring chart — great for proportions and status."
            config={{ valueKey: 'value', labelKey: 'label', colors: ['#10b981', '#e5e7eb'], centerLabel: 'משתמשים פעילים', totalLabel: 'חברים' }}
            chart={<DonutChartWidget data={donutData} config={{ valueKey: 'value', labelKey: 'label', colors: ['#10b981', '#e5e7eb'], centerLabel: 'משתמשים פעילים', totalLabel: 'חברים' }} />}
          />
          <WidgetPreview
            type="stacked-bar"
            description="Stacked bar chart — for comparing multiple series per category."
            config={{ xKey: 'month', yKeys: ['givers', 'receivers'], colors: ['#10b981', '#d1d5db'], labels: { givers: 'מוקירים', receivers: 'מקבלים' } }}
            chart={<StackedBarWidget data={stackedBarData} config={{ xKey: 'month', yKeys: ['givers', 'receivers'], colors: ['#10b981', '#d1d5db'], labels: { givers: 'מוקירים', receivers: 'מקבלים' } }} />}
          />
          <WidgetPreview
            type="recommendations"
            description="Expandable action items with icons and bullet lists."
            config={{ titleKey: 'title', percentKey: 'percent', itemsKey: 'items', iconKey: 'icon', color: '#10b981' }}
            chart={<RecommendationsWidget data={recommendationsData} config={{ titleKey: 'title', percentKey: 'percent', itemsKey: 'items', iconKey: 'icon', color: '#10b981' }} />}
          />
          <WidgetPreview
            type="highlight"
            description="Featured item card with trend and horizontal bar breakdown."
            config={{ nameKey: 'name', valueKey: 'percent', trendKey: 'trend', trendLabel: 'מול הרבעון הקודם', subtitle: 'הפריט הכי נמכר', color: '#10b981' }}
            chart={<HighlightWidget data={highlightData} config={{ nameKey: 'name', valueKey: 'percent', trendKey: 'trend', trendLabel: 'מול הרבעון הקודם', subtitle: 'הפריט הכי נמכר', color: '#10b981' }} />}
          />
          <WidgetPreview
            type="feed"
            description="Content feed with badges, authors, and engagement metrics."
            config={{ titleKey: 'title', badgeKey: 'badge', authorKey: 'author', excerptKey: 'excerpt', metricsKeys: ['comments', 'likes', 'views'], color: '#10b981' }}
            chart={<FeedWidget data={feedData} config={{ titleKey: 'title', badgeKey: 'badge', authorKey: 'author', excerptKey: 'excerpt', metricsKeys: ['comments', 'likes', 'views'], color: '#10b981' }} />}
          />
          <WidgetPreview
            type="title"
            description="Hero title banner with logo, subtitle, date range, and badge."
            config={{ titleKey: 'title', subtitleKey: 'subtitle', dateRangeKey: 'dateRange', badgeKey: 'badge', logoKey: 'logoUrl', color: '#10b981' }}
            chart={<TitleWidget data={titleData} config={{ titleKey: 'title', subtitleKey: 'subtitle', dateRangeKey: 'dateRange', badgeKey: 'badge', logoKey: 'logoUrl', color: '#10b981' }} />}
          />
        </div>

        {/* ── Widget with Inline Data ── */}
        <div className="mt-10 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white" dir="ltr">Widget with inline data</h3>
            <CopyButton text={JSON.stringify({
              type: 'area',
              title: 'Revenue Trend',
              config: { xKey: 'month', yKey: 'revenue', color: '#2563eb', valueFormatter: 'compact' },
              data: [
                { month: 'Jan', revenue: 145000 },
                { month: 'Feb', revenue: 152000 },
                { month: 'Mar', revenue: 168000 },
              ],
            }, null, 2)} />
          </div>
          <pre className="p-4 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 overflow-x-auto" dir="ltr">
{JSON.stringify(
  {
    type: 'area',
    title: 'Revenue Trend',
    config: { xKey: 'month', yKey: 'revenue', color: '#2563eb', valueFormatter: 'compact' },
    data: [
      { month: 'Jan', revenue: 145000 },
      { month: 'Feb', revenue: 152000 },
      { month: 'Mar', revenue: 168000 },
    ],
  },
  null,
  2
)}
          </pre>
          <div className="px-4 sm:px-5 py-2.5 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800/50">
            <p className="text-[11px] text-gray-500 dark:text-gray-400" dir="ltr">
              <strong>Widget fields:</strong> type (string) · title (string) · config (object) · data (array of row objects). Order is determined by array position. The API auto-generates datasets internally.
            </p>
          </div>
        </div>

        {/* ── Widget Config Reference ── */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">Widget Config Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" dir="ltr">
              <thead>
                <tr className="border-b border-blue-200 dark:border-blue-900">
                  <th className="text-left py-1.5 px-2 text-blue-700 dark:text-blue-400 font-medium">Field</th>
                  <th className="text-left py-1.5 px-2 text-blue-700 dark:text-blue-400 font-medium">Type</th>
                  <th className="text-left py-1.5 px-2 text-blue-700 dark:text-blue-400 font-medium">Used by</th>
                  <th className="text-left py-1.5 px-2 text-blue-700 dark:text-blue-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">datasetKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">all (auto)</td><td className="py-1.5 px-2">Auto-generated by the API — do not set manually</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">xKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">area, bar, candlestick</td><td className="py-1.5 px-2">Field for x-axis / time axis</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">yKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">area, bar</td><td className="py-1.5 px-2">Field for y-axis value</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">color</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">area, bar</td><td className="py-1.5 px-2">Chart color (hex)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">valueFormatter</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">all</td><td className="py-1.5 px-2">&quot;currency&quot; | &quot;percent&quot; | &quot;compact&quot; | &quot;number&quot;</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">columns</td><td className="py-1.5 px-2">string[]</td><td className="py-1.5 px-2">table</td><td className="py-1.5 px-2">Which fields to show as columns</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">columnLabels</td><td className="py-1.5 px-2">object</td><td className="py-1.5 px-2">table</td><td className="py-1.5 px-2">Custom header labels: {'{'}field: label{'}'}</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">openKey, highKey, lowKey, closeKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">candlestick</td><td className="py-1.5 px-2">OHLC field names (defaults: open/high/low/close)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">labelKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">radar, donut</td><td className="py-1.5 px-2">Field for labels (axis labels / segment names)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">valueKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">radar, scorecard, donut</td><td className="py-1.5 px-2">Field for the main value</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">maxValue</td><td className="py-1.5 px-2">number</td><td className="py-1.5 px-2">radar, scorecard</td><td className="py-1.5 px-2">Scale max (radar) or denominator (scorecard)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">trendKey, trendLabel</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">scorecard</td><td className="py-1.5 px-2">Field for % change and label text</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">subtitle</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">scorecard</td><td className="py-1.5 px-2">Small text above the number</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">centerLabel, totalLabel</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">donut</td><td className="py-1.5 px-2">Text inside ring / unit label</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">yKeys</td><td className="py-1.5 px-2">string[]</td><td className="py-1.5 px-2">stacked-bar</td><td className="py-1.5 px-2">Fields to stack as series</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">colors</td><td className="py-1.5 px-2">string[]</td><td className="py-1.5 px-2">donut, stacked-bar</td><td className="py-1.5 px-2">Array of colors per segment/series</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">labels</td><td className="py-1.5 px-2">object</td><td className="py-1.5 px-2">stacked-bar</td><td className="py-1.5 px-2">Legend labels: {'{'}field: display{'}'}</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">titleKey, percentKey, itemsKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">recommendations</td><td className="py-1.5 px-2">Fields for section title, %, and bullet array</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">iconKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">recommendations</td><td className="py-1.5 px-2">Field for Lucide icon name per section</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">nameKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">highlight</td><td className="py-1.5 px-2">Field for item name</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">imageKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">highlight</td><td className="py-1.5 px-2">Field for image URL (optional)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">badgeKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">feed</td><td className="py-1.5 px-2">Field for badge/tag text</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">authorKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">feed</td><td className="py-1.5 px-2">Field for author name</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">excerptKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">feed</td><td className="py-1.5 px-2">Field for description/excerpt text</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">metricsKeys</td><td className="py-1.5 px-2">string[]</td><td className="py-1.5 px-2">feed</td><td className="py-1.5 px-2">Fields for engagement stats (e.g. comments, likes, views)</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">subtitleKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">title</td><td className="py-1.5 px-2">Field for subtitle text</td></tr>
                <tr className="border-b border-blue-100 dark:border-blue-900/50"><td className="py-1.5 px-2 font-mono">dateRangeKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">title</td><td className="py-1.5 px-2">Field for date range text</td></tr>
                <tr><td className="py-1.5 px-2 font-mono">logoKey</td><td className="py-1.5 px-2">string</td><td className="py-1.5 px-2">title</td><td className="py-1.5 px-2">Field for logo image URL (falls back to COMMUNi logo)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
