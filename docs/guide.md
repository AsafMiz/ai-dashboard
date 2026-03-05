# COMMUNi Dashboard - Technical Guide

## Overview

COMMUNi Dashboard is a data-driven dashboard platform built with Next.js, Supabase, and Tailwind CSS. Dashboards are identified by a human-readable **key** (e.g. `example`) and contain multiple **reports**, each with its own set of **widgets** that visualize market data.

### URL Structure

| Route | Description |
|---|---|
| `/` | Landing page - enter a dashboard key or create an example |
| `/dashboard/[key]` | Dashboard overview - lists all reports |
| `/dashboard/[key]/[reportKey]` | Report detail - renders widgets |

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
| `icon` | `text` | Lucide icon name (e.g. `TrendingUp`) |
| `created_at` | `timestamptz` | Auto-generated |

### `reports`

Reports belong to a dashboard. Identified by the composite `(dashboard_key, report_key)`.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated UUID |
| `title` | `text` | Report display name |
| `description` | `text` | Optional description |
| `type` | `text` | Display label (e.g. `סקירה`, `ניתוח`, `מניה`) |
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
| `type` | `text` | One of: `area`, `bar`, `candlestick`, `table` |
| `title` | `text` | Widget display name |
| `order` | `int` | Display order within report |
| `config` | `jsonb` | Widget-specific configuration |
| `created_at` | `timestamptz` | Auto-generated |

#### Widget `config` by type

| Type | Config Fields |
|---|---|
| `area` | `{ symbol, color, dataKey }` - `dataKey` is typically `"close"` |
| `bar` | `{ symbol, color, dataKey }` - `dataKey` is typically `"volume"` |
| `candlestick` | `{ symbol }` |
| `table` | `{ symbol, columns }` - `columns` is an array like `["date","open","high","low","close","volume"]` |

### `market_data`

Time-series financial data used by all widgets.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated UUID |
| `symbol` | `text` | Stock ticker (e.g. `AAPL`) |
| `date` | `date` | Trading date |
| `open` | `numeric` | Opening price |
| `high` | `numeric` | Day high |
| `low` | `numeric` | Day low |
| `close` | `numeric` | Closing price |
| `volume` | `bigint` | Trading volume |
| `created_at` | `timestamptz` | Auto-generated |

**Unique constraint:** `(symbol, date)`

### Entity Relationship

```
dashboards (1) ──> (N) reports (1) ──> (N) widgets
                                               │
                                               │ reads via config.symbol
                                               v
                                          market_data
```

---

## API Endpoints

### `POST /api/create-dashboard`

Creates (or recreates) a dashboard and optionally seeds market data.

**Request:**
```json
{
  "key": "my-dashboard",
  "title": "סקירת שוק יומית",
  "subtitle": "לוח מחוונים מקיף לניתוח שוק ההון",
  "icon": "TrendingUp",
  "market_data": [
    { "symbol": "AAPL", "date": "2024-01-02", "open": 185.50, "high": 188.44, "low": 183.89, "close": 187.68, "volume": 58414460 }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | Unique dashboard identifier |
| `title` | `string` | Yes | Display name |
| `subtitle` | `string` | No | Optional description |
| `icon` | `string` | No | Lucide icon name (defaults to `LayoutDashboard`) |
| `market_data` | `array` | No | OHLCV records to upsert into `market_data` table |

**Behavior:**
1. Deletes all existing widgets, reports, and dashboard for the given key
2. Seeds `market_data` if `market_data` array is provided
3. Creates the dashboard entry

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
  "report_key": "market-overview",
  "title": "סקירת שוק כללית",
  "description": "תצוגה כללית של מגמות השוק",
  "type": "סקירה",
  "widgets": [
    { "type": "area", "title": "מגמת מחיר - AAPL", "order": 0, "config": { "symbol": "AAPL", "color": "#2563eb", "dataKey": "close" } },
    { "type": "bar", "title": "נפח מסחר - AAPL", "order": 1, "config": { "symbol": "AAPL", "color": "#2563eb", "dataKey": "volume" } }
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

Each widget object:

| Field | Type | Description |
|---|---|---|
| `type` | `string` | `area`, `bar`, `candlestick`, or `table` |
| `title` | `string` | Widget display name |
| `order` | `number` | Display order (0-based) |
| `config` | `object` | Widget-specific config (see widget config table above) |

**Behavior:**
1. Deletes existing report + widgets if `(dashboard_key, report_key)` already exists
2. Creates the report
3. Creates all widgets

**Response (200):**
```json
{
  "message": "Report created successfully",
  "dashboard_key": "my-dashboard",
  "report_key": "market-overview"
}
```

---

## JSON File Structure

Example data is stored in `public/data/example/` as JSON files that map directly to the API endpoints.

```
public/data/example/
├── dashboard.json              → payload for POST /api/create-dashboard
└── reports/
    ├── market-overview.json    → payload for POST /api/create-report
    ├── technical-analysis.json
    ├── nvidia-deep-dive.json
    ├── tesla-analysis.json
    ├── google-analysis.json
    └── volume-comparison.json
```

### `dashboard.json`

Contains the dashboard definition, a `reports` array listing report keys (used by the client to know which report files to load), and a `market_data` array with OHLCV records.

```json
{
  "key": "example",
  "title": "...",
  "subtitle": "...",
  "icon": "TrendingUp",
  "reports": ["market-overview", "technical-analysis", "..."],
  "market_data": [{ "symbol": "AAPL", "date": "2024-01-02", "...": "..." }]
}
```

> The `reports` field is only used client-side to discover report files. It is not sent to the API.

### Report JSON files

Each file is a self-contained payload for `POST /api/create-report`:

```json
{
  "dashboard_key": "example",
  "report_key": "market-overview",
  "title": "...",
  "description": "...",
  "type": "סקירה",
  "widgets": [{ "type": "area", "title": "...", "order": 0, "config": { "..." } }]
}
```

---

## Example Flow

When the user clicks **"צור דשבורד לדוגמה"** on the home page, the following happens:

1. **Fetch** `GET /data/example/dashboard.json`
2. **POST** `/api/create-dashboard` with dashboard data + market_data (150 records, 5 symbols)
3. **For each report key** in `dashboard.json → reports[]`:
   - **Fetch** `GET /data/example/reports/{report_key}.json`
   - **POST** `/api/create-report` with report data + widgets
4. **Navigate** to `/dashboard/example`

This populates all 4 database tables end-to-end:
- `dashboards` → 1 row
- `reports` → 6 rows
- `widgets` → 27 rows
- `market_data` → 150 rows (upserted)

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

1. `supabase/schema.sql` - Creates base tables (`reports`, `widgets`, `market_data`)
2. `supabase/schema-v2.sql` - Adds `dashboards` table and key-based columns

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
# 1. Create dashboard
curl -X POST http://localhost:3000/api/create-dashboard \
  -H "Content-Type: application/json" \
  -d '{"key":"example","title":"My Dashboard","icon":"TrendingUp","market_data":[...]}'

# 2. Create a report
curl -X POST http://localhost:3000/api/create-report \
  -H "Content-Type: application/json" \
  -d '{"dashboard_key":"example","report_key":"overview","title":"Overview","widgets":[...]}'
```

### 5. View the Dashboard

Navigate to `http://localhost:3000/dashboard/example` or type `example` in the key input field.

---

## Mock Data

The example includes 150 OHLCV records for 5 symbols (30 trading days each, Jan-Feb 2024):

| Symbol | Company | Color |
|---|---|---|
| `AAPL` | Apple | `#2563eb` (blue) |
| `MSFT` | Microsoft | `#7c3aed` (purple) |
| `GOOGL` | Alphabet | `#059669` (green) |
| `TSLA` | Tesla | `#e11d48` (red) |
| `NVDA` | NVIDIA | `#76b900` (lime) |

## Example Dashboard Reports

The example dashboard creates 6 reports:

| Report Key | Title | Widgets |
|---|---|---|
| `market-overview` | Market Overview | 4 area charts + 2 bar charts |
| `technical-analysis` | Technical Analysis (AAPL & MSFT) | 2 candlestick + 2 tables |
| `nvidia-deep-dive` | NVDA Deep Dive | candlestick + area + bar + table |
| `tesla-analysis` | TSLA Analysis | candlestick + area + bar + table |
| `google-analysis` | GOOGL Analysis | candlestick + area + bar + table |
| `volume-comparison` | Volume Comparison | 5 bar charts |
