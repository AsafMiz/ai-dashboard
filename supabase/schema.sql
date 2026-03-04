-- ============================================
-- Financial Dashboard - Supabase Schema
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Reports table
-- Each report is a dashboard with a unique URL
-- ============================================
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reports enable row level security;

create policy "Reports are viewable by everyone"
  on public.reports for select
  using (true);

create policy "Users can create their own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reports"
  on public.reports for update
  using (auth.uid() = user_id);

-- ============================================
-- Widgets table
-- Metadata-driven widget definitions per report
-- ============================================
create table public.widgets (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid references public.reports(id) on delete cascade not null,
  type text not null check (type in ('area', 'bar', 'candlestick', 'table')),
  title text not null,
  "order" int not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.widgets enable row level security;

create policy "Widgets are viewable by everyone"
  on public.widgets for select
  using (true);

create policy "Users can manage widgets on their reports"
  on public.widgets for all
  using (
    exists (
      select 1 from public.reports
      where reports.id = widgets.report_id
        and reports.user_id = auth.uid()
    )
  );

-- ============================================
-- Market data table
-- Stores financial time-series data
-- ============================================
create table public.market_data (
  id uuid primary key default uuid_generate_v4(),
  symbol text not null,
  date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume bigint,
  created_at timestamptz default now(),
  unique(symbol, date)
);

alter table public.market_data enable row level security;

create policy "Market data is viewable by everyone"
  on public.market_data for select
  using (true);

create policy "Authenticated users can insert market data"
  on public.market_data for insert
  with check (auth.role() = 'authenticated');

-- ============================================
-- Enable Realtime on market_data
-- ============================================
alter publication supabase_realtime add table public.market_data;

-- ============================================
-- Seed data: demo report with widgets
-- ============================================
insert into public.reports (id, title, description)
values (
  '00000000-0000-0000-0000-000000000001',
  'סקירת שוק יומית',
  'לוח מחוונים ראשי לניתוח שוק ההון'
);

insert into public.widgets (report_id, type, title, "order", config)
values
  ('00000000-0000-0000-0000-000000000001', 'area', 'מגמת מחיר - AAPL', 0, '{"symbol": "AAPL", "color": "#2563eb", "dataKey": "close"}'),
  ('00000000-0000-0000-0000-000000000001', 'bar', 'נפח מסחר יומי', 1, '{"symbol": "AAPL", "color": "#10b981", "dataKey": "volume"}'),
  ('00000000-0000-0000-0000-000000000001', 'candlestick', 'גרף נרות - AAPL', 2, '{"symbol": "AAPL"}'),
  ('00000000-0000-0000-0000-000000000001', 'table', 'נתוני מסחר אחרונים', 3, '{"symbol": "AAPL", "columns": ["date", "open", "high", "low", "close", "volume"]}');
