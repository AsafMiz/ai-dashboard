-- ============================================
-- V2 Migration: Dashboard-centric architecture
-- ============================================

-- 1. Create dashboards table (top-level entity, keyed by human-readable string)
create table public.dashboards (
  key text primary key,
  title text not null,
  subtitle text,
  icon text not null default 'LayoutDashboard',
  created_at timestamptz default now()
);

alter table public.dashboards enable row level security;

create policy "Dashboards are viewable by everyone"
  on public.dashboards for select
  using (true);

create policy "Anyone can insert dashboards"
  on public.dashboards for insert
  with check (true);

-- 2. Add dashboard_key, report_key, and type to reports
alter table public.reports
  add column dashboard_key text references public.dashboards(key) on delete cascade,
  add column report_key text,
  add column type text;

-- 3. Unique constraint: report_key must be unique within a dashboard
alter table public.reports
  add constraint reports_dashboard_report_key_unique unique (dashboard_key, report_key);

-- 4. Allow public inserts on reports and widgets for the create-dashboard API
create policy "Anyone can insert reports"
  on public.reports for insert
  with check (true);

create policy "Anyone can insert widgets"
  on public.widgets for insert
  with check (true);

-- 5. Allow public deletes on widgets for re-seeding
create policy "Anyone can delete widgets"
  on public.widgets for delete
  using (true);

-- 6. Enable realtime on dashboards
alter publication supabase_realtime add table public.dashboards;
