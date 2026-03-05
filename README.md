# ai-dashboard

Financial dashboard with a TradingView aesthetic — RTL Hebrew interface, dynamic metadata-driven widgets, dark mode, and real-time Supabase data.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React
- **Charts:** Recharts (area, bar) + TradingView lightweight-charts (candlestick)
- **Backend/DB:** Supabase (Auth + PostgreSQL)
- **Deployment:** Vercel (frontend), Supabase (database)

## Pre-Deploy Checklist

### 1. Supabase Setup

- [x] Create a Supabase project at [supabase.com](https://supabase.com)
- [x] Run `supabase/schema.sql` in the SQL Editor to create tables, RLS policies, and seed data
- [x] Enable Realtime on the `market_data` table (the SQL does this, but verify under Database → Replication)
- [x] Copy the project URL and anon key from Settings → API

### 2. Environment Variables

- [x] Copy `.env.example` to `.env.local` for local development
- [x] Set `NEXT_PUBLIC_SUPABASE_URL` to your Supabase project URL
- [x] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your Supabase anon/public key
- [x] Set `SUPABASE_SERVICE_ROLE_KEY` to your Supabase service role key (used by `/api/collect-data`)
- [x] Add all three environment variables to Vercel (Settings → Environment Variables)

### 3. Authentication (Optional) — Skipped

- [ ] Configure Supabase Auth providers if you want user-scoped reports
- [ ] Update RLS policies to enforce `auth.uid()` checks (currently reports are publicly readable)

### 4. Vercel Deployment

- [x] Connect the GitHub repo to Vercel
- [x] Verify the framework is detected as Next.js
- [x] Ensure environment variables are set for Production, Preview, and Development
- [x] Deploy and verify the build succeeds

### 5. Data & Content

- [ ] Replace mock data in `data.json` with real data or connect a live data source
- [ ] Update the seed report/widgets in `schema.sql` to match your actual dashboards
- [ ] Review all Hebrew labels in UI components for accuracy

### 6. Security

- [ ] Verify RLS policies are enabled on all tables (`reports`, `widgets`, `market_data`)
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed to the client (only used in API routes)
- [ ] Remove or protect the `/api/collect-data` endpoint (add auth check before production)
- [ ] Run `npm audit` and resolve any vulnerabilities

### 7. Performance

- [ ] Add appropriate `revalidate` times to server components (currently set to `0` / no cache)
- [ ] Consider adding ISR or caching for report pages that don't change frequently
- [ ] Optimize images and static assets if added

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, then click "עדכן נתונים" to load mock data into Supabase.

## Project Structure

```
src/
├── app/
│   ├── api/collect-data/   # POST: upsert mock data to Supabase
│   ├── report/[id]/        # Dynamic dashboard route
│   ├── layout.tsx           # RTL root layout
│   └── page.tsx             # Home: report listing
├── components/
│   ├── charts/              # Area, Bar, Candlestick, DataTable
│   ├── layout/              # Sidebar, Header, ThemeProvider
│   ├── DashboardGrid.tsx    # Widget grid layout
│   └── WidgetRenderer.tsx   # Dynamic widget switch + realtime
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # TypeScript interfaces
supabase/
└── schema.sql               # DB schema, RLS, seed data
```
