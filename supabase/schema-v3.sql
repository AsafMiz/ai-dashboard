-- ============================================
-- V3 Migration: Generic data model
-- Replace market_data with flexible datasets
-- ============================================

-- 1. Create generic datasets table
create table if not exists public.datasets (
  key text primary key,
  label text,
  columns jsonb not null default '[]',
  rows jsonb not null default '[]',
  dashboard_key text references public.dashboards(key) on delete cascade,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table public.datasets enable row level security;

create policy "Datasets are viewable by everyone"
  on public.datasets for select
  using (true);

create policy "Anyone can insert datasets"
  on public.datasets for insert
  with check (true);

create policy "Anyone can update datasets"
  on public.datasets for update
  using (true);

create policy "Anyone can delete datasets"
  on public.datasets for delete
  using (true);

-- 3. Enable realtime
alter publication supabase_realtime add table public.datasets;

-- 4. Remove widget type check constraint (allow new types like line, pie, radar, etc.)
alter table public.widgets drop constraint if exists widgets_type_check;
