# COMMUNi Dashboard - Technical Guide

## Overview

COMMUNi Dashboard is a generic data-driven dashboard platform built with Next.js, Supabase, and Tailwind CSS. Dashboards are identified by a human-readable **key** (e.g. `example`) and contain multiple **reports**, each with its own set of **widgets** that visualize data from **datasets**.

The system is data-agnostic — you can feed in any structured data (sales, surveys, project metrics, financial data, etc.) and render it with a variety of chart types.

### URL Structure

| Route | Description |
|---|---|
| `/` | Landing page - enter a dashboard key or create an example |
| `/dashboard/[key]` | Dashboard overview - lists all reports |
| `/dashboard/[key]/[reportKey]` | Report detail - renders widgets |
| `/api-docs` | Interactive API documentation |

---

## Database Structure

All tables live in the `public` schema with Row Level Security (RLS) enabled.

### `dashboards`

Top-level entity. Identified by a human-readable string key.

| Column | Type | Description |
|---|---|---|
| `key` | `text` (PK) | Unique dashboard identifier (e.g. `example`) |
| `title` | `text` | Display name |
| `subtitle` | `text` | Optional description |
| `icon` | `text` | Lucide icon name (e.g. `LayoutDashboard`) |
| `created_at` | `timestamptz` | Auto-generated |

### `datasets`

Generic data storage. Each dataset holds a table of rows as JSONB.

| Column | Type | Description |
|---|---|---|
| `key` | `text` (PK) | Unique dataset identifier (e.g. `sales-north`) |
| `label` | `text` | Human-readable name |
| `columns` | `jsonb` | Column definitions: `[{key, label, type}]` |
| `rows` | `jsonb` | Data rows: `[{col1: val1, col2: val2, ...}]` |
| `dashboard_key` | `text` (FK) | References `dashboards.key`, cascade on delete |
| `created_at` | `timestamptz` | Auto-generated |

### `reports`

Reports belong to a dashboard. Identified by the composite `(dashboard_key, report_key)`.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated UUID |
| `title` | `text` | Report display name |
| `description` | `text` | Optional description |
| `type` | `text` | Display label badge (e.g. `סקירה`, `ניתוח`) |
| `dashboard_key` | `text` (FK) | References `dashboards.key` |
| `report_key` | `text` | Unique within dashboard |
| `user_id` | `uuid` | Optional, references `auth.users` |
| `created_at` | `timestamptz` | Auto-generated |
| `updated_at` | `timestamptz` | Auto-generated |

**Unique constraint:** `(dashboard_key, report_key)`

### `widgets`

Widgets belong to a report. Each widget defines a chart or table visualization.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated UUID |
| `report_id` | `uuid` (FK) | References `reports.id` |
| `type` | `text` | Widget type: `area`, `bar`, `candlestick`, `table`, `radar`, `scorecard`, `donut`, `stacked-bar`, `recommendations`, `highlight`, `feed` (extensible) |
| `title` | `text` | Widget display name |
| `order` | `int` | Display order within report |
| `config` | `jsonb` | Widget-specific configuration |
| `created_at` | `timestamptz` | Auto-generated |

#### Widget `config` reference

| Field | Type | Used by | Description |
|---|---|---|---|
| `datasetKey` | `string` | all | References a dataset by key |
| `xKey` | `string` | area, bar, candlestick | Field name for x-axis |
| `yKey` | `string` | area, bar | Field name for y-axis value |
| `color` | `string` | area, bar | Chart color (hex) |
| `valueFormatter` | `string` | all | `"currency"`, `"percent"`, `"compact"`, or `"number"` |
| `columns` | `string[]` | table | Which fields to show as columns |
| `columnLabels` | `object` | table | Custom header labels: `{field: label}` |
| `openKey`, `highKey`, `lowKey`, `closeKey` | `string` | candlestick | OHLC field names (defaults: open/high/low/close) |
| `labelKey` | `string` | radar, donut | Field for axis labels / segment names |
| `valueKey` | `string` | radar, scorecard, donut | Field for the main value |
| `maxValue` | `number` | radar, scorecard | Scale max (radar) or denominator (scorecard, e.g. 100) |
| `trendKey` | `string` | scorecard | Field holding the % change value |
| `trendLabel` | `string` | scorecard | Text after the trend (e.g. "מהרבעון הקודם") |
| `subtitle` | `string` | scorecard | Small text above the number |
| `centerLabel` | `string` | donut | Text inside the ring (e.g. "משתמשים פעילים") |
| `totalLabel` | `string` | donut | Unit label (e.g. "חברים") |
| `yKeys` | `string[]` | stacked-bar | Array of fields to stack as series |
| `colors` | `string[]` | donut, stacked-bar | Array of colors per segment/series |
| `labels` | `object` | stacked-bar | Legend labels: `{field: display}` |
| `titleKey` | `string` | recommendations | Field for section title |
| `percentKey` | `string` | recommendations | Field for percentage value |
| `itemsKey` | `string` | recommendations | Field containing array of bullet-point strings |
| `iconKey` | `string` | recommendations | Field for Lucide icon name |
| `nameKey` | `string` | highlight | Field for item name |
| `imageKey` | `string` | highlight | Field for image URL (optional) |
| `badgeKey` | `string` | feed | Field for badge/tag text |
| `authorKey` | `string` | feed | Field for author name |
| `excerptKey` | `string` | feed | Field for description/excerpt text |
| `metricsKeys` | `string[]` | feed | Fields for engagement stats (e.g. comments, likes, views) |

### Entity Relationship

```
dashboards (1) ──> (N) datasets
dashboards (1) ──> (N) reports (1) ──> (N) widgets
                                             │
                                             │ reads via config.datasetKey
                                             v
                                          datasets
```

---

## API Endpoints

### `POST /api/create-dashboard`

Creates (or recreates) a dashboard and optionally seeds datasets.

**Request:**
```json
{
  "key": "my-dashboard",
  "title": "My Dashboard",
  "subtitle": "Company operations overview",
  "icon": "LayoutDashboard",
  "datasets": [
    {
      "key": "monthly-sales",
      "label": "Monthly Sales",
      "columns": [
        { "key": "month", "label": "Month", "type": "string" },
        { "key": "revenue", "label": "Revenue", "type": "number" }
      ],
      "rows": [
        { "month": "Jan", "revenue": 145000 },
        { "month": "Feb", "revenue": 152000 }
      ]
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | Unique dashboard identifier |
| `title` | `string` | Yes | Display name |
| `subtitle` | `string` | No | Optional description |
| `icon` | `string` | No | Lucide icon name (defaults to `LayoutDashboard`) |
| `datasets` | `array` | No | Array of dataset objects to seed |

**Behavior:**
1. Deletes all existing widgets, reports, datasets, and dashboard for the given key
2. Creates the dashboard entry
3. Seeds datasets if `datasets` array is provided

**Response (200):**
```json
{
  "message": "Dashboard created successfully",
  "key": "my-dashboard"
}
```

---

### `POST /api/create-report`

Creates a report with widgets under an existing dashboard.

**Request:**
```json
{
  "dashboard_key": "my-dashboard",
  "report_key": "sales-overview",
  "title": "Sales Overview",
  "description": "Monthly revenue and order trends",
  "type": "סקירה",
  "widgets": [
    {
      "type": "area",
      "title": "Revenue Trend",
      "order": 0,
      "config": { "datasetKey": "monthly-sales", "xKey": "month", "yKey": "revenue", "color": "#2563eb", "valueFormatter": "compact" }
    },
    {
      "type": "table",
      "title": "Sales Data",
      "order": 1,
      "config": { "datasetKey": "monthly-sales", "columns": ["month", "revenue"], "columnLabels": { "month": "Month", "revenue": "Revenue" } }
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `dashboard_key` | `string` | Yes | Parent dashboard key |
| `report_key` | `string` | Yes | Unique within the dashboard |
| `title` | `string` | Yes | Report display name |
| `description` | `string` | No | Optional description |
| `type` | `string` | No | Display label badge |
| `widgets` | `array` | No | Array of widget definitions |

**Behavior:**
1. Deletes existing report + widgets if `(dashboard_key, report_key)` already exists
2. Creates the report
3. Creates all widgets

**Response (200):**
```json
{
  "message": "Report created successfully",
  "dashboard_key": "my-dashboard",
  "report_key": "sales-overview"
}
```

---

## JSON File Structure

Example data is stored in `public/data/example/` as JSON files that map directly to the API endpoints.

```
public/data/example/
├── dashboard.json              → payload for POST /api/create-dashboard
└── reports/
    ├── sales-overview.json     → payload for POST /api/create-report
    ├── project-metrics.json
    ├── team-survey.json
    ├── budget-analysis.json
    ├── quarterly-performance.json
    └── regional-comparison.json
```

### `dashboard.json`

Contains the dashboard definition, a `reports` array listing report keys (used by the client to know which report files to load), and a `datasets` array with data to seed.

```json
{
  "key": "example",
  "title": "...",
  "subtitle": "...",
  "icon": "LayoutDashboard",
  "reports": ["sales-overview", "project-metrics", "..."],
  "datasets": [
    {
      "key": "sales-north",
      "label": "North Region Sales",
      "columns": [{ "key": "month", "label": "Month", "type": "string" }, "..."],
      "rows": [{ "month": "Jan", "revenue": 145000, "orders": 320 }, "..."]
    }
  ]
}
```

> The `reports` field is only used client-side to discover report files. It is not sent to the API.

### Report JSON files

Each file is a self-contained payload for `POST /api/create-report`:

```json
{
  "dashboard_key": "example",
  "report_key": "sales-overview",
  "title": "...",
  "description": "...",
  "type": "סקירה",
  "widgets": [
    { "type": "area", "title": "...", "order": 0, "config": { "datasetKey": "sales-north", "xKey": "month", "yKey": "revenue", "color": "#2563eb" } }
  ]
}
```

---

## Example Flow

When the user clicks **"צור דשבורד לדוגמה"** on the home page, the following happens:

1. **Fetch** `GET /data/example/dashboard.json`
2. **POST** `/api/create-dashboard` with dashboard data + datasets (6 datasets covering sales, sprints, surveys, budget, and stock data)
3. **For each report key** in `dashboard.json → reports[]`:
   - **Fetch** `GET /data/example/reports/{report_key}.json`
   - **POST** `/api/create-report` with report data + widgets
4. **Navigate** to `/dashboard/example`

This populates all 4 database tables end-to-end:
- `dashboards` → 1 row
- `datasets` → 6 rows
- `reports` → 6 rows
- `widgets` → 27 rows

---

## Quick Start Guide

### 1. Prerequisites

- Node.js 18+
- A Supabase project
- Environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Set Up the Database

Run these SQL files in your Supabase SQL Editor **in order**:

1. `supabase/schema.sql` - Creates base tables (`reports`, `widgets`)
2. `supabase/schema-v2.sql` - Adds `dashboards` table and key-based columns
3. `supabase/schema-v3.sql` - Adds `datasets` table (generic data model)

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Create an Example Dashboard

Either:
- Click the **"צור דשבורד לדוגמה"** button on the home page
- Or call the APIs directly:

```bash
# 1. Create dashboard with datasets
curl -X POST http://localhost:3000/api/create-dashboard \
  -H "Content-Type: application/json" \
  -d '{"key":"test","title":"Test Dashboard","datasets":[{"key":"demo","label":"Demo","columns":[{"key":"x","label":"X"},{"key":"y","label":"Y"}],"rows":[{"x":"A","y":10},{"x":"B","y":20}]}]}'

# 2. Create a report
curl -X POST http://localhost:3000/api/create-report \
  -H "Content-Type: application/json" \
  -d '{"dashboard_key":"test","report_key":"overview","title":"Overview","widgets":[{"type":"bar","title":"Demo","order":0,"config":{"datasetKey":"demo","xKey":"x","yKey":"y"}}]}'
```

### 5. View the Dashboard

Navigate to `http://localhost:3000/dashboard/test` or type `test` in the key input field.

---

## Example Datasets

The example dashboard includes 13 datasets demonstrating diverse data types:

| Dataset Key | Description | Fields |
|---|---|---|
| `sales-north` | North region sales | month, revenue, orders, returns |
| `sales-south` | South region sales | month, revenue, orders, returns |
| `project-sprints` | Sprint metrics | sprint, completed, bugs, velocity |
| `team-satisfaction` | Employee survey | department, satisfaction, engagement, headcount |
| `budget-2024` | Budget vs actual | category, planned, actual, variance |
| `stock-price` | Stock price OHLC | date, open, high, low, close |
| `cohesion-dimensions` | Team cohesion dimensions | dimension, score |
| `cohesion-score` | Overall cohesion score | score, trend |
| `activity-status` | Active vs inactive users | label, value |
| `givers-receivers` | Givers vs receivers ratio | month, givers, receivers |
| `action-recommendations` | Action recommendations | title, percent, icon, items |
| `top-products` | Top selling products | name, percent, trend |
| `featured-posts` | Featured posts feed | title, badge, author, excerpt, comments, likes, views |

## Example Dashboard Reports

The example dashboard creates 7 reports:

| Report Key | Title | Widgets |
|---|---|---|
| `sales-overview` | Sales Overview | 2 area charts + 2 bar charts + 2 tables |
| `project-metrics` | Project Metrics | 1 area + 2 bar + 1 table |
| `team-survey` | Team Survey | 3 bar charts + 1 table |
| `budget-analysis` | Budget Analysis | 3 bar charts + 1 table |
| `quarterly-performance` | Quarterly Performance | 1 candlestick + 1 area + 1 table |
| `regional-comparison` | Regional Comparison | 4 bar charts + 2 area charts |
| `team-cohesion` | Team Cohesion | 1 radar + 1 scorecard + 1 donut + 1 stacked-bar + 1 recommendations + 1 highlight + 1 feed |

## Adding New Widget Types

The system is designed for easy extensibility. To add a new widget type:

1. Create `src/components/charts/NewWidget.tsx` accepting `DataRow[]` and `WidgetConfig`
2. Add a `case` to the switch in `src/components/WidgetRenderer.tsx`
3. No database changes needed — the `config` column is flexible JSONB
